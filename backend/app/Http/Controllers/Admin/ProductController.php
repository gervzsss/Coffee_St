<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductVariantGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Get catalog metrics
     */
    public function metrics()
    {
        $totalProducts = Product::whereNull('archived_at')->count();
        $archivedProducts = Product::whereNotNull('archived_at')->count();
        $availableProducts = Product::whereNull('archived_at')->where('is_available', true)->count();
        $notAvailableProducts = Product::whereNull('archived_at')->where('is_available', false)->count();

        return response()->json([
            'total_products' => $totalProducts,
            'archived_products' => $archivedProducts,
            'available_products' => $availableProducts,
            'not_available_products' => $notAvailableProducts,
        ]);
    }

    /**
     * Get all products with filters
     */
    public function index(Request $request)
    {
        $query = Product::with(['variantGroups.variants']);

        // Filter by archived status
        if ($request->has('archived') && $request->archived === 'true') {
            $query->whereNotNull('archived_at');
        } else {
            $query->whereNull('archived_at');
        }

        // Filter by category
        if ($request->has('category') && $request->category !== 'all' && ! empty($request->category)) {
            $query->where('category', $request->category);
        }

        // Filter by availability
        if ($request->has('availability')) {
            if ($request->availability === 'available') {
                $query->where('is_available', true);
            } elseif ($request->availability === 'not-available') {
                $query->where('is_available', false);
            }
        }

        // Filter by stock status
        if ($request->has('stock_filter')) {
            if ($request->stock_filter === 'sold_out') {
                $query->where('track_stock', true)->where('stock_quantity', 0);
            } elseif ($request->stock_filter === 'low_stock') {
                $query->where('track_stock', true)
                    ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
                    ->where('stock_quantity', '>', 0);
            }
        }

        // Search by name
        if ($request->has('search') && ! empty($request->search)) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        $products = $query->orderBy('created_at', 'desc')->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'price' => $product->price,
                'description' => $product->description,
                'image_url' => $product->image_url,
                'is_active' => $product->is_active,
                'is_available' => $product->is_available ?? true,
                'unavailable_reason' => $product->unavailable_reason,
                'archived_at' => $product->archived_at,
                'created_at' => $product->created_at,
                'has_orders' => $product->orderItems()->exists(),
                'stock_quantity' => $product->stock_quantity,
                'track_stock' => $product->track_stock,
                'low_stock_threshold' => $product->low_stock_threshold,
                'stock_updated_at' => $product->stock_updated_at,
                'is_sold_out' => $product->isSoldOut(),
                'is_low_stock' => $product->isLowStock(),
                'variant_groups' => $product->variantGroups->map(function ($group) {
                    return [
                        'id' => $group->id,
                        'name' => $group->name,
                        'selection_type' => $group->selection_type,
                        'is_required' => $group->is_required,
                        'variants' => $group->variants->map(function ($variant) {
                            return [
                                'id' => $variant->id,
                                'name' => $variant->name,
                                'price_delta' => $variant->price_delta,
                                'is_active' => $variant->is_active,
                            ];
                        }),
                    ];
                }),
            ];
        });

        return response()->json($products);
    }

    /**
     * Get single product with details and history
     */
    public function show($id)
    {
        $product = Product::with(['variantGroups.variants', 'orderItems.order'])->findOrFail($id);

        // Calculate revenue and order stats
        $orderItems = $product->orderItems;
        $totalOrders = $orderItems->count();
        $totalRevenue = $orderItems->sum('line_total');
        $totalQuantitySold = $orderItems->sum('quantity');

        // Get recent order history
        $recentOrders = $orderItems->take(10)->map(function ($item) {
            return [
                'order_id' => $item->order_id,
                'order_number' => $item->order->order_number ?? null,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'line_total' => $item->line_total,
                'created_at' => $item->created_at,
            ];
        });

        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'category' => $product->category,
            'price' => $product->price,
            'description' => $product->description,
            'image_url' => $product->image_url,
            'is_active' => $product->is_active,
            'is_available' => $product->is_available ?? true,
            'unavailable_reason' => $product->unavailable_reason,
            'archived_at' => $product->archived_at,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
            'stock_quantity' => $product->stock_quantity,
            'track_stock' => $product->track_stock,
            'low_stock_threshold' => $product->low_stock_threshold,
            'stock_updated_at' => $product->stock_updated_at,
            'is_sold_out' => $product->isSoldOut(),
            'is_low_stock' => $product->isLowStock(),
            'variant_groups' => $product->variantGroups->map(function ($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'description' => $group->description,
                    'selection_type' => $group->selection_type,
                    'is_required' => $group->is_required,
                    'display_order' => $group->display_order,
                    'variants' => $group->variants->map(function ($variant) {
                        return [
                            'id' => $variant->id,
                            'name' => $variant->name,
                            'price_delta' => $variant->price_delta,
                            'is_active' => $variant->is_active,
                            'is_default' => $variant->is_default ?? false,
                        ];
                    }),
                ];
            }),
            'stats' => [
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
                'total_quantity_sold' => $totalQuantitySold,
            ],
            'recent_orders' => $recentOrders,
        ]);
    }

    /**
     * Create a new product with variants
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:160',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:50',
            'image_url' => 'nullable|string',
            'is_available' => 'boolean',
            'track_stock' => 'boolean',
            'stock_quantity' => 'nullable|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'variant_groups' => 'nullable|array',
            'variant_groups.*.name' => 'required_with:variant_groups|string|max:120',
            'variant_groups.*.selection_type' => 'required_with:variant_groups|in:single,multiple',
            'variant_groups.*.is_required' => 'boolean',
            'variant_groups.*.variants' => 'nullable|array',
            'variant_groups.*.variants.*.name' => 'required|string|max:120',
            'variant_groups.*.variants.*.price_delta' => 'numeric',
        ]);

        DB::beginTransaction();
        try {
            $product = Product::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'category' => $validated['category'],
                'image_url' => $validated['image_url'] ?? null,
                'is_active' => true,
                'is_available' => $validated['is_available'] ?? true,
                'track_stock' => $validated['track_stock'] ?? false,
                'stock_quantity' => $validated['stock_quantity'] ?? null,
                'low_stock_threshold' => $validated['low_stock_threshold'] ?? 5,
                'stock_updated_at' => isset($validated['stock_quantity']) ? now() : null,
            ]);

            // Create variant groups and variants
            if (! empty($validated['variant_groups'])) {
                foreach ($validated['variant_groups'] as $index => $groupData) {
                    $group = ProductVariantGroup::create([
                        'product_id' => $product->id,
                        'name' => $groupData['name'],
                        'selection_type' => $groupData['selection_type'] ?? 'single',
                        'is_required' => $groupData['is_required'] ?? false,
                        'display_order' => $index,
                        'is_active' => true,
                    ]);

                    if (! empty($groupData['variants'])) {
                        foreach ($groupData['variants'] as $variantData) {
                            ProductVariant::create([
                                'product_id' => $product->id,
                                'variant_group_id' => $group->id,
                                'group_name' => $groupData['name'],
                                'name' => $variantData['name'],
                                'price_delta' => $variantData['price_delta'] ?? 0,
                                'is_active' => true,
                            ]);
                        }
                    }
                }
            }

            DB::commit();

            return response()->json($product->load('variantGroups.variants'), 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => 'Failed to create product: '.$e->getMessage()], 500);
        }
    }

    /**
     * Update a product
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:160',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'category' => 'sometimes|string|max:50',
            'image_url' => 'nullable|string',
            'is_available' => 'boolean',
            'track_stock' => 'boolean',
            'stock_quantity' => 'nullable|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'variant_groups' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            $updateData = [];
            if (isset($validated['name'])) {
                $updateData['name'] = $validated['name'];
            }
            if (isset($validated['description'])) {
                $updateData['description'] = $validated['description'];
            }
            if (isset($validated['price'])) {
                $updateData['price'] = $validated['price'];
            }
            if (isset($validated['category'])) {
                $updateData['category'] = $validated['category'];
            }
            if (array_key_exists('image_url', $validated)) {
                $updateData['image_url'] = $validated['image_url'];
            }
            if (isset($validated['is_available'])) {
                $updateData['is_available'] = $validated['is_available'];
                if ($validated['is_available']) {
                    $updateData['unavailable_reason'] = null;
                }
            }
            if (isset($validated['track_stock'])) {
                $updateData['track_stock'] = $validated['track_stock'];
            }
            if (array_key_exists('stock_quantity', $validated)) {
                $updateData['stock_quantity'] = $validated['stock_quantity'];
                $updateData['stock_updated_at'] = now();
            }
            if (isset($validated['low_stock_threshold'])) {
                $updateData['low_stock_threshold'] = $validated['low_stock_threshold'];
            }

            $product->update($updateData);

            // Update variant groups if provided
            if (isset($validated['variant_groups'])) {
                // Remove existing variant groups and variants
                $product->variantGroups()->delete();
                $product->variants()->delete();

                // Create new ones
                foreach ($validated['variant_groups'] as $index => $groupData) {
                    $group = ProductVariantGroup::create([
                        'product_id' => $product->id,
                        'name' => $groupData['name'],
                        'selection_type' => $groupData['selection_type'] ?? 'single',
                        'is_required' => $groupData['is_required'] ?? false,
                        'display_order' => $index,
                        'is_active' => true,
                    ]);

                    if (! empty($groupData['variants'])) {
                        foreach ($groupData['variants'] as $variantData) {
                            ProductVariant::create([
                                'product_id' => $product->id,
                                'variant_group_id' => $group->id,
                                'group_name' => $groupData['name'],
                                'name' => $variantData['name'],
                                'price_delta' => $variantData['price_delta'] ?? 0,
                                'is_active' => true,
                            ]);
                        }
                    }
                }
            }

            DB::commit();

            return response()->json($product->load('variantGroups.variants'));
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => 'Failed to update product: '.$e->getMessage()], 500);
        }
    }

    /**
     * Update product availability
     */
    public function updateAvailability(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'is_available' => 'required|boolean',
            'unavailable_reason' => 'nullable|string|max:255',
        ]);

        $product->update([
            'is_available' => $validated['is_available'],
            'unavailable_reason' => $validated['is_available'] ? null : ($validated['unavailable_reason'] ?? null),
        ]);

        return response()->json([
            'message' => 'Product availability updated successfully',
            'product' => [
                'id' => $product->id,
                'is_available' => $product->is_available,
                'unavailable_reason' => $product->unavailable_reason,
            ],
        ]);
    }

    /**
     * Archive a product
     */
    public function archive($id)
    {
        $product = Product::findOrFail($id);

        $product->update([
            'archived_at' => now(),
            'is_active' => false,
        ]);

        return response()->json([
            'message' => 'Product archived successfully',
            'product' => [
                'id' => $product->id,
                'archived_at' => $product->archived_at,
            ],
        ]);
    }

    /**
     * Restore an archived product
     */
    public function restore($id)
    {
        $product = Product::findOrFail($id);

        $product->update([
            'archived_at' => null,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Product restored successfully',
            'product' => [
                'id' => $product->id,
                'archived_at' => null,
            ],
        ]);
    }

    /**
     * Delete a product permanently
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Check if product has orders
        if ($product->orderItems()->exists()) {
            return response()->json([
                'message' => 'Cannot delete product with existing orders. Consider archiving instead.',
            ], 422);
        }

        // Delete image from Cloudinary if exists
        if ($product->image_url) {
            $this->deleteCloudinaryImage($product->image_url);
        }

        $product->variantGroups()->delete();
        $product->variants()->delete();
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }

    /**
     * Extract Cloudinary public ID from URL and delete the image
     */
    private function deleteCloudinaryImage($imageUrl)
    {
        try {
            // Extract public ID from Cloudinary URL
            // Format: https://res.cloudinary.com/{cloud}/image/upload/{version}/{public_id}.{ext}
            if (preg_match('/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/', $imageUrl, $matches)) {
                $publicId = $matches[1];

                $cloudName = config('cloudinary.cloud_name');
                $apiKey = config('cloudinary.api_key');
                $apiSecret = config('cloudinary.api_secret');

                if (! $cloudName || ! $apiKey || ! $apiSecret) {
                    Log::warning('Cloudinary configuration missing, skipping image deletion');

                    return;
                }

                $timestamp = time();

                // Build string to sign (must be in alphabetical order)
                $stringToSign = "public_id={$publicId}&timestamp={$timestamp}".$apiSecret;
                $signature = sha1($stringToSign);

                Http::withoutVerifying()->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/destroy", [
                    'api_key' => $apiKey,
                    'timestamp' => $timestamp,
                    'signature' => $signature,
                    'public_id' => $publicId,
                ]);

                Log::info("Deleted Cloudinary image: {$publicId}");
            }
        } catch (\Exception $e) {
            Log::error('Failed to delete Cloudinary image: '.$e->getMessage());
        }
    }
}
