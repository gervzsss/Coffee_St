<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
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
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json(['orders' => $orders]);
    }

    /**
     * Get a single order
     */
    public function show($id)
    {
        $user = Auth::user();
        
        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->with('items.product')
            ->first();
        
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        
        return response()->json(['order' => $order]);
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
            ->with(['items.product', 'items.variant'])
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
                $lineTotal = ($cartItem->unit_price + $cartItem->price_delta) * $cartItem->quantity;
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'variant_id' => $cartItem->variant_id,
                    'variant_name' => $cartItem->variant_name,
                    'price_delta' => $cartItem->price_delta,
                    'product_name' => $cartItem->product->name,
                    'unit_price' => $cartItem->unit_price,
                    'quantity' => $cartItem->quantity,
                    'line_total' => $lineTotal,
                ]);
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
