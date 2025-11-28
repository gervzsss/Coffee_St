<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Get all orders for the authenticated user
     */
    public function index()
    {
        $user = Auth::user();

        $orders = Order::where('user_id', $user->id)
            ->with(['items.product', 'user'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return $this->formatOrderResponse($order);
            });

        return response()->json(['orders' => $orders]);
    }

    /**
     * Get a single order with full details
     */
    public function show($id)
    {
        $user = Auth::user();

        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->with(['items.product', 'items.selectedVariants.variant', 'user', 'statusLogs.changedBy'])
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json(['order' => $this->formatOrderResponse($order, true)]);
    }

    /**
     * Format order response with timeline
     */
    private function formatOrderResponse($order, $includeTimeline = false)
    {
        $response = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'subtotal' => (float) $order->subtotal,
            'delivery_fee' => (float) $order->delivery_fee,
            'tax_rate' => (float) $order->tax_rate,
            'tax_amount' => (float) $order->tax_amount,
            'total' => (float) $order->total,
            'delivery_address' => $order->delivery_address,
            'delivery_contact' => $order->delivery_contact,
            'delivery_instructions' => $order->delivery_instructions,
            'payment_method' => $order->payment_method,
            'notes' => $order->notes,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'items' => $order->items,
        ];

        // Add timeline data for tracking
        if ($includeTimeline) {
            $response['timeline'] = $this->buildTimeline($order);
            $response['status_logs'] = $order->statusLogs ?? [];
        }

        // Add status timestamps
        $response['confirmed_at'] = $order->confirmed_at;
        $response['preparing_at'] = $order->preparing_at;
        $response['out_for_delivery_at'] = $order->out_for_delivery_at;
        $response['delivered_at'] = $order->delivered_at;
        $response['failed_at'] = $order->failed_at;
        $response['failure_reason'] = $order->failure_reason;
        $response['delivery_proof_url'] = $order->delivery_proof_url;

        return $response;
    }

    /**
     * Build timeline array for order tracking
     */
    private function buildTimeline($order)
    {
        $timeline = [];

        // Order placed
        $timeline[] = [
            'status' => 'pending',
            'label' => 'Order Placed',
            'description' => 'Your order has been received',
            'time' => $order->created_at,
            'completed' => true,
        ];

        // Confirmed
        if ($order->confirmed_at) {
            $timeline[] = [
                'status' => 'confirmed',
                'label' => 'Order Confirmed',
                'description' => 'Your order has been confirmed by the store',
                'time' => $order->confirmed_at,
                'completed' => true,
            ];
        } elseif (!in_array($order->status, ['pending', 'cancelled', 'failed'])) {
            $timeline[] = [
                'status' => 'confirmed',
                'label' => 'Order Confirmed',
                'description' => 'Waiting for confirmation',
                'time' => null,
                'completed' => false,
            ];
        }

        // Preparing
        if ($order->preparing_at) {
            $timeline[] = [
                'status' => 'preparing',
                'label' => 'Preparing Order',
                'description' => 'Your order is being prepared',
                'time' => $order->preparing_at,
                'completed' => true,
            ];
        } elseif (!in_array($order->status, ['pending', 'confirmed', 'cancelled', 'failed'])) {
            $timeline[] = [
                'status' => 'preparing',
                'label' => 'Preparing Order',
                'description' => 'Your order will be prepared soon',
                'time' => null,
                'completed' => false,
            ];
        }

        // Out for delivery
        if ($order->out_for_delivery_at) {
            $timeline[] = [
                'status' => 'out_for_delivery',
                'label' => 'Out for Delivery',
                'description' => 'Your order is on its way',
                'time' => $order->out_for_delivery_at,
                'completed' => true,
            ];
        } elseif (!in_array($order->status, ['pending', 'confirmed', 'preparing', 'cancelled', 'failed'])) {
            $timeline[] = [
                'status' => 'out_for_delivery',
                'label' => 'Out for Delivery',
                'description' => 'Your order will be delivered soon',
                'time' => null,
                'completed' => false,
            ];
        }

        // Delivered
        if ($order->delivered_at) {
            $timeline[] = [
                'status' => 'delivered',
                'label' => 'Delivered',
                'description' => 'Your order has been delivered',
                'time' => $order->delivered_at,
                'completed' => true,
            ];
        }

        // Failed
        if ($order->failed_at) {
            $timeline[] = [
                'status' => 'failed',
                'label' => 'Delivery Failed',
                'description' => $order->failure_reason ?? 'Delivery was unsuccessful',
                'time' => $order->failed_at,
                'completed' => true,
            ];
        }

        return $timeline;
    }

    /**
     * Create an order from the user's active cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'selected_items' => 'required|array|min:1',
            'selected_items.*' => 'required|integer|exists:cart_items,id',
            'delivery_address' => 'required|string|max:1000',
            'delivery_contact' => 'required|string|max:20',
            'delivery_instructions' => 'nullable|string|max:500',
            'payment_method' => 'required|in:cash,gcash',
            'delivery_fee' => 'nullable|numeric|min:0',
            'tax_rate' => 'nullable|numeric|min:0|max:1',
        ]);

        $user = Auth::user();

        // Get active cart with items
        $cart = Cart::where('user_id', $user->id)
            ->where('status', 'active')
            ->with(['items.product', 'items.variant', 'items.selectedVariants'])
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        // Filter only selected items
        $selectedItemIds = $request->selected_items;
        $selectedCartItems = $cart->items->whereIn('id', $selectedItemIds);

        if ($selectedCartItems->isEmpty()) {
            return response()->json(['message' => 'No valid items selected'], 400);
        }

        DB::beginTransaction();
        try {
            // Generate unique order number
            $orderNumber = Order::generateOrderNumber();

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => $orderNumber,
                'status' => 'pending',
                'subtotal' => 0,
                'delivery_fee' => $request->delivery_fee ?? 50.00,
                'tax_rate' => $request->tax_rate ?? 0.1200,
                'tax_amount' => 0,
                'tax' => 0,
                'total' => 0,
                'delivery_address' => $request->delivery_address,
                'delivery_contact' => $request->delivery_contact,
                'delivery_instructions' => $request->delivery_instructions,
                'payment_method' => $request->payment_method,
            ]);

            // Create order items from selected cart items
            foreach ($selectedCartItems as $cartItem) {
                // Load the selected variants for this cart item
                $cartItem->load('selectedVariants');

                // Calculate price delta from all selected variants
                $totalPriceDelta = $cartItem->selectedVariants->sum('price_delta');

                // Use the stored price_delta if no selectedVariants (legacy)
                if ($cartItem->selectedVariants->isEmpty()) {
                    $totalPriceDelta = $cartItem->price_delta ?? 0;
                }

                $lineTotal = ($cartItem->unit_price + $totalPriceDelta) * $cartItem->quantity;

                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'variant_id' => $cartItem->variant_id,
                    'variant_name' => $cartItem->variant_name,
                    'price_delta' => $totalPriceDelta,
                    'product_name' => $cartItem->product->name,
                    'unit_price' => $cartItem->unit_price,
                    'quantity' => $cartItem->quantity,
                    'line_total' => $lineTotal,
                ]);

                // Copy all selected variants from cart item to order item
                foreach ($cartItem->selectedVariants as $cartVariant) {
                    OrderItemVariant::create([
                        'order_item_id' => $orderItem->id,
                        'variant_id' => $cartVariant->variant_id,
                        'variant_group_name' => $cartVariant->variant_group_name,
                        'variant_name' => $cartVariant->variant_name,
                        'price_delta' => $cartVariant->price_delta,
                    ]);
                }
            }

            // Calculate totals
            $order->load('items');
            $order->calculateTotals();
            $order->save();

            // Remove selected items from cart
            foreach ($selectedCartItems as $cartItem) {
                $cartItem->delete();
            }

            // If cart is now empty, mark as converted
            if ($cart->items()->count() === 0) {
                $cart->status = 'converted';
                $cart->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->load('items.product'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update order status (for admin or payment processing)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,paid,cancelled',
        ]);

        $user = Auth::user();

        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->status = $request->status;
        $order->save();

        return response()->json([
            'message' => 'Order status updated',
            'order' => $order,
        ]);
    }
}
