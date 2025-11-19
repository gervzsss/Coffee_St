<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Get cart count
     */
    public function count()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();
        
        if (!$cart) {
            return response()->json(['count' => 0]);
        }
        
        $count = CartItem::where('cart_id', $cart->id)->sum('quantity');
        
        return response()->json(['count' => $count]);
    }

    /**
     * Get cart items
     */
    public function index()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();
        
        if (!$cart) {
            return response()->json(['items' => []]);
        }
        
        $items = CartItem::where('cart_id', $cart->id)
            ->with(['product', 'variant'])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'variant_id' => $item->variant_id,
                    'variant_name' => $item->variant_name,
                    'name' => $item->product->name ?? 'Unknown Product',
                    'description' => $item->product->description ?? '',
                    'image_url' => $item->product->image_url ?? null,
                    'unit_price' => $item->unit_price,
                    'price_delta' => $item->price_delta,
                    'quantity' => $item->quantity,
                    'line_total' => $item->line_total,
                ];
            });
        
        return response()->json(['items' => $items]);
    }

    /**
     * Add item to cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'variant_id' => 'nullable|exists:product_variants,id',
        ]);

        $user = Auth::user();
        
        // Get product to ensure it exists and get its price
        $product = \App\Models\Product::findOrFail($request->product_id);
        
        // Get or create active cart
        $cart = Cart::firstOrCreate(
            [
                'user_id' => $user->id,
                'status' => 'active',
            ],
            [
                'user_id' => $user->id,
                'status' => 'active',
            ]
        );
        
        // Get variant if provided
        $variant = null;
        $priceDelta = 0;
        $variantName = null;
        
        if ($request->variant_id) {
            $variant = \App\Models\ProductVariant::findOrFail($request->variant_id);
            $priceDelta = $variant->price_delta;
            $variantName = $variant->group_name . ': ' . $variant->name;
        }
        
        // Check if item already exists
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->where('variant_id', $request->variant_id)
            ->first();
        
        if ($cartItem) {
            // Update quantity
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            // Create new cart item with product price and variant delta
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'variant_id' => $request->variant_id,
                'variant_name' => $variantName,
                'quantity' => $request->quantity,
                'unit_price' => $product->price,
                'price_delta' => $priceDelta,
            ]);
        }
        
        return response()->json([
            'message' => 'Item added to cart',
            'item' => $cartItem,
        ], 201);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();
        
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }
        
        $cartItem = CartItem::where('id', $id)
            ->where('cart_id', $cart->id)
            ->first();
        
        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }
        
        $cartItem->quantity = $request->quantity;
        $cartItem->save();
        
        return response()->json([
            'message' => 'Cart item updated',
            'item' => $cartItem,
        ]);
    }

    /**
     * Remove item from cart
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();
        
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }
        
        $cartItem = CartItem::where('id', $id)
            ->where('cart_id', $cart->id)
            ->first();
        
        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }
        
        $cartItem->delete();
        
        return response()->json(['message' => 'Item removed from cart']);
    }

    /**
     * Clear cart
     */
    public function clear()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();
        
        if ($cart) {
            CartItem::where('cart_id', $cart->id)->delete();
        }
        
        return response()->json(['message' => 'Cart cleared']);
    }
}
