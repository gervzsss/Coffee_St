<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\CartItemVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
            ->with(['product', 'variant', 'selectedVariants.variant'])
            ->get()
            ->map(function ($item) {
                // Build variants array from new system
                $selectedVariants = $item->selectedVariants->map(function ($sv) {
                    return [
                        'id' => $sv->variant_id,
                        'group_name' => $sv->variant_group_name,
                        'name' => $sv->variant_name,
                        'price_delta' => $sv->price_delta,
                    ];
                });

                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'variant_id' => $item->variant_id, // Legacy field
                    'variant_name' => $item->variant_name, // Legacy field
                    'name' => $item->product->name ?? 'Unknown Product',
                    'description' => $item->product->description ?? '',
                    'image_url' => $item->product->image_url ?? null,
                    'unit_price' => $item->unit_price,
                    'price_delta' => $item->price_delta, // Legacy field
                    'quantity' => $item->quantity,
                    'line_total' => $item->line_total,
                    'selected_variants' => $selectedVariants,
                    'customization_summary' => $item->customization_summary,
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
            'variant_id' => 'nullable|exists:product_variants,id', // Legacy support
            'variants' => 'nullable|array', // New multi-variant system
            'variants.*.id' => 'required_with:variants|exists:product_variants,id',
            'variants.*.group_name' => 'required_with:variants|string',
            'variants.*.name' => 'required_with:variants|string',
            'variants.*.price_delta' => 'required_with:variants|numeric',
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

        DB::beginTransaction();
        try {
            // Handle legacy single variant system
            $variant = null;
            $priceDelta = 0;
            $variantName = null;
            
            if ($request->variant_id) {
                $variant = \App\Models\ProductVariant::findOrFail($request->variant_id);
                $priceDelta = $variant->price_delta;
                $variantName = $variant->group_name . ': ' . $variant->name;
            }
            
            // Create customization summary
            $customizationSummary = null;
            if ($request->has('variants') && count($request->variants) > 0) {
                $summaryParts = [];
                foreach ($request->variants as $v) {
                    $summaryParts[] = $v['group_name'] . ': ' . $v['name'];
                }
                $customizationSummary = implode(' | ', $summaryParts);
            } elseif ($variantName) {
                $customizationSummary = $variantName;
            }
            
            $cartItem = null;
            
            // For multi-variant system, always create new items (don't merge)
            // This allows same product with different variant combinations
            if (!$request->has('variants') || count($request->variants) === 0) {
                // Only check for existing items in legacy single-variant system
                $cartItem = CartItem::where('cart_id', $cart->id)
                    ->where('product_id', $request->product_id)
                    ->where('variant_id', $request->variant_id)
                    ->first();
            }
            
            if ($cartItem) {
                // Update quantity for legacy system
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
                    'customization_summary' => $customizationSummary,
                ]);
                
                // Save selected variants in the new system
                if ($request->has('variants') && count($request->variants) > 0) {
                    foreach ($request->variants as $variantData) {
                        CartItemVariant::create([
                            'cart_item_id' => $cartItem->id,
                            'variant_id' => $variantData['id'],
                            'variant_group_name' => $variantData['group_name'],
                            'variant_name' => $variantData['name'],
                            'price_delta' => $variantData['price_delta'],
                        ]);
                    }
                }
            }
            
            DB::commit();
            
            return response()->json([
                'message' => 'Item added to cart',
                'item' => $cartItem->load('selectedVariants'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to add item to cart',
                'error' => $e->getMessage(),
            ], 500);
        }
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
        
        // Return updated item with recalculated line_total
        $cartItem->load('selectedVariants');
        
        return response()->json([
            'message' => 'Cart item updated',
            'item' => [
                'id' => $cartItem->id,
                'quantity' => $cartItem->quantity,
                'line_total' => $cartItem->line_total,
                'unit_price' => $cartItem->unit_price,
                'price_delta' => $cartItem->price_delta,
            ],
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
