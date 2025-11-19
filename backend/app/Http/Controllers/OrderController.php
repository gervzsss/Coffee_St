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

        DB::beginTransaction();
        try {
            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'subtotal' => 0,
                'delivery_fee' => $request->delivery_fee ?? 0.00,
                'tax_rate' => $request->tax_rate ?? 0.0800,
                'tax_amount' => 0,
                'tax' => 0,
                'total' => 0,
            ]);

            // Create order items from cart items
            foreach ($cart->items as $cartItem) {
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

            // Mark cart as converted
            $cart->status = 'converted';
            $cart->save();

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
