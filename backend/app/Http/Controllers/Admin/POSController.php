<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemVariant;
use App\Models\OrderStatusLog;
use App\Models\PosShift;
use App\Models\Product;
use App\Models\User;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class POSController extends Controller
{
    protected $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * Get available products for POS
     */
    public function products(Request $request)
    {
        $query = Product::where('is_active', true)
            ->where('is_available', true)
            ->whereNull('archived_at');

        // Search by name
        if ($request->has('search') && ! empty($request->search)) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        // Filter by category
        if ($request->has('category') && ! empty($request->category)) {
            $query->where('category', $request->category);
        }

        $products = $query->orderBy('category')
            ->orderBy('name')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category,
                    'price' => (float) $product->price,
                    'image_url' => $product->image_url,
                    'track_stock' => $product->track_stock,
                    'stock_quantity' => $product->stock_quantity,
                    'is_available' => $product->isAvailableForPurchase(),
                ];
            });

        return response()->json($products);
    }

    /**
     * Get variant groups for a product
     */
    public function productVariants($productId)
    {
        $product = Product::with(['variantGroups' => function ($query) {
            $query->where('is_active', true)
                ->orderBy('display_order')
                ->with(['variants' => function ($q) {
                    $q->where('is_active', true);
                }]);
        }])->findOrFail($productId);

        $variantGroups = $product->variantGroups->map(function ($group) {
            return [
                'id' => $group->id,
                'name' => $group->name,
                'selection_type' => $group->selection_type,
                'is_required' => $group->is_required,
                'variants' => $group->variants->map(function ($variant) {
                    return [
                        'id' => $variant->id,
                        'name' => $variant->name,
                        'price_delta' => (float) $variant->price_delta,
                        'is_default' => $variant->is_default,
                    ];
                }),
            ];
        });

        return response()->json($variantGroups);
    }

    /**
     * Create a new POS order
     * POS orders start at 'confirmed' status and skip delivery steps
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.variants' => 'nullable|array',
            'items.*.variants.*.variant_id' => 'required|integer|exists:product_variants,id',
            'items.*.variants.*.variant_group_name' => 'required|string',
            'items.*.variants.*.variant_name' => 'required|string',
            'items.*.variants.*.price_delta' => 'required|numeric',
            'payment_method' => 'required|in:cash,gcash',
            'customer_name' => 'nullable|string|max:120',
            'customer_phone' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:500',
            'tax_rate' => 'nullable|numeric|min:0|max:1',
        ]);

        // Get the walk-in user
        $walkInUser = User::where('email', 'walkin@coffeest.local')->first();

        if (! $walkInUser) {
            return response()->json([
                'message' => 'Walk-in user not found. Please run the WalkInUserSeeder.',
            ], 500);
        }

        // SHIFT ENFORCEMENT: Require active shift to create POS orders
        $activeShift = PosShift::getActiveShift();
        if (! $activeShift) {
            return response()->json([
                'message' => 'No active shift. Open a shift to begin selling.',
                'error_code' => 'NO_ACTIVE_SHIFT',
            ], 409);
        }

        DB::beginTransaction();
        try {
            // Validate stock availability for all items
            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->find($item['product_id']);

                if (! $product) {
                    throw new \Exception("Product not found: {$item['product_id']}");
                }

                if (! $product->isAvailableForPurchase()) {
                    throw new \Exception("Product '{$product->name}' is not available for purchase");
                }

                if ($product->track_stock && ! $product->hasStock($item['quantity'])) {
                    $available = $product->stock_quantity ?? 0;
                    throw new \Exception("Insufficient stock for '{$product->name}'. Available: {$available}, Requested: {$item['quantity']}");
                }
            }

            // Generate unique order number
            $orderNumber = Order::generateOrderNumber();

            // Create order - POS orders start at 'confirmed' status
            $order = Order::create([
                'user_id' => $walkInUser->id,
                'order_number' => $orderNumber,
                'order_source' => Order::SOURCE_POS,
                'pos_shift_id' => $activeShift->id,
                'status' => Order::STATUS_CONFIRMED,
                'subtotal' => 0,
                'delivery_fee' => 0, // No delivery fee for POS
                'tax_rate' => $validated['tax_rate'] ?? 0.12,
                'tax_amount' => 0,
                'tax' => 0,
                'total' => 0,
                'delivery_address' => null,
                'delivery_contact' => null,
                'delivery_instructions' => null,
                'pos_customer_name' => $validated['customer_name'] ?? null,
                'pos_customer_phone' => $validated['customer_phone'] ?? null,
                'payment_method' => $validated['payment_method'],
                'notes' => $validated['notes'] ?? null,
                'confirmed_at' => now(), // Auto-confirmed
            ]);

            // Create order items
            foreach ($validated['items'] as $itemData) {
                $product = Product::find($itemData['product_id']);
                $variants = $itemData['variants'] ?? [];

                // Calculate price delta from variants
                $totalPriceDelta = collect($variants)->sum('price_delta');

                $lineTotal = ($product->price + $totalPriceDelta) * $itemData['quantity'];

                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'variant_id' => null,
                    'variant_name' => null,
                    'price_delta' => $totalPriceDelta,
                    'product_name' => $product->name,
                    'unit_price' => $product->price,
                    'quantity' => $itemData['quantity'],
                    'line_total' => $lineTotal,
                ]);

                // Create order item variants
                foreach ($variants as $variantData) {
                    OrderItemVariant::create([
                        'order_item_id' => $orderItem->id,
                        'variant_id' => $variantData['variant_id'],
                        'variant_group_name' => $variantData['variant_group_name'],
                        'variant_name' => $variantData['variant_name'],
                        'price_delta' => $variantData['price_delta'],
                    ]);
                }

                // Deduct stock
                if ($product->track_stock) {
                    $this->stockService->decreaseStock($product, $itemData['quantity'], $order);
                }
            }

            // Calculate totals
            $order->load('items');
            $order->calculateTotals();
            $order->save();

            // Create initial status log
            OrderStatusLog::create([
                'order_id' => $order->id,
                'changed_by' => Auth::id(),
                'from_status' => null,
                'to_status' => Order::STATUS_CONFIRMED,
                'notes' => 'POS order created and confirmed',
            ]);

            DB::commit();

            // Load relationships for response
            $order->load(['items.selectedVariants']);

            return response()->json([
                'message' => 'POS order created successfully',
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'order_source' => $order->order_source,
                    'status' => $order->status,
                    'status_label' => $order->status_label,
                    'customer_name' => $order->pos_customer_name,
                    'customer_phone' => $order->pos_customer_phone,
                    'subtotal' => $order->subtotal,
                    'tax' => $order->tax,
                    'total' => $order->total,
                    'payment_method' => $order->payment_method,
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_name' => $item->product_name,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price,
                            'line_total' => $item->line_total,
                            'variants' => $item->selectedVariants->map(function ($v) {
                                return [
                                    'group_name' => $v->variant_group_name,
                                    'name' => $v->variant_name,
                                    'price_delta' => $v->price_delta,
                                ];
                            }),
                        ];
                    }),
                    'created_at' => $order->created_at,
                    'valid_transitions' => Order::getValidTransitions($order->status, $order->order_source),
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create POS order: '.$e->getMessage());

            return response()->json([
                'message' => 'Failed to create POS order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get POS orders (recent orders for POS view)
     */
    public function orders(Request $request)
    {
        $query = Order::with(['items.selectedVariants'])
            ->where('order_source', Order::SOURCE_POS)
            ->notArchived();

        $includeAllShifts = $request->boolean('include_all_shifts', false);
        $shiftId = $request->get('shift_id');

        if ($shiftId) {
            $query->where('pos_shift_id', $shiftId);
        } elseif (! $includeAllShifts) {
            $activeShift = PosShift::getActiveShift();
            if ($activeShift) {
                $query->where('pos_shift_id', $activeShift->id);
            } else {
                $query->whereRaw('1=0');
            }
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search by order number or customer name
        if ($request->has('search') && ! empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', '%'.$search.'%')
                    ->orWhere('pos_customer_name', 'like', '%'.$search.'%')
                    ->orWhere('pos_customer_phone', 'like', '%'.$search.'%');
            });
        }

        // Limit to recent orders by default
        $limit = $request->get('limit', 50);

        $orders = $query->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($order) {
                $itemsCount = $order->items->sum('quantity');

                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'order_source' => $order->order_source,
                    'status' => $order->status,
                    'status_label' => $order->status_label,
                    'customer_name' => $order->pos_customer_name ?? 'Walk-in',
                    'customer_phone' => $order->pos_customer_phone,
                    'subtotal' => $order->subtotal,
                    'tax' => $order->tax,
                    'total' => $order->total,
                    'items_count' => $itemsCount,
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_name' => $item->product_name,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price,
                            'line_total' => $item->line_total,
                            'variants' => $item->selectedVariants->map(function ($v) {
                                return [
                                    'group_name' => $v->variant_group_name,
                                    'name' => $v->variant_name,
                                    'price_delta' => $v->price_delta,
                                ];
                            }),
                        ];
                    }),
                    'payment_method' => $order->payment_method,
                    'created_at' => $order->created_at,
                    'time_ago' => $order->created_at->diffForHumans(),
                    'valid_transitions' => Order::getValidTransitions($order->status, $order->order_source),
                ];
            });

        return response()->json($orders);
    }

    /**
     * Get a single POS order
     */
    public function show($id)
    {
        $order = Order::with([
            'items.product',
            'items.selectedVariants',
            'statusLogs.changedByUser',
        ])
            ->where('order_source', Order::SOURCE_POS)
            ->findOrFail($id);

        return response()->json([
            'id' => $order->id,
            'order_number' => $order->order_number,
            'order_source' => $order->order_source,
            'status' => $order->status,
            'status_label' => $order->status_label,
            'customer_name' => $order->pos_customer_name ?? 'Walk-in',
            'customer_phone' => $order->pos_customer_phone,
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'line_total' => $item->line_total,
                    'variants' => $item->selectedVariants->map(function ($v) {
                        return [
                            'group_name' => $v->variant_group_name,
                            'name' => $v->variant_name,
                            'price_delta' => $v->price_delta,
                        ];
                    }),
                ];
            }),
            'subtotal' => $order->subtotal,
            'tax_rate' => $order->tax_rate,
            'tax' => $order->tax,
            'total' => $order->total,
            'payment_method' => $order->payment_method,
            'notes' => $order->notes,
            'confirmed_at' => $order->confirmed_at,
            'preparing_at' => $order->preparing_at,
            'delivered_at' => $order->delivered_at,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'status_logs' => $order->statusLogs->map(function ($log) {
                return [
                    'id' => $log->id,
                    'from_status' => $log->from_status,
                    'to_status' => $log->to_status,
                    'notes' => $log->notes,
                    'changed_by' => $log->changedByUser ? $log->changedByUser->first_name.' '.$log->changedByUser->last_name : 'System',
                    'created_at' => $log->created_at,
                ];
            }),
            'valid_transitions' => Order::getValidTransitions($order->status, $order->order_source),
        ]);
    }

    /**
     * Update POS order status
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::where('order_source', Order::SOURCE_POS)->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:confirmed,preparing,delivered,cancelled',
            'notes' => 'nullable|string|max:500',
        ]);

        $newStatus = $validated['status'];
        $oldStatus = $order->status;

        // Validate the status transition for POS orders
        if (! $order->canTransitionTo($newStatus)) {
            return response()->json([
                'message' => "Cannot transition from '{$oldStatus}' to '{$newStatus}' for POS orders",
                'valid_transitions' => Order::getValidTransitions($oldStatus, Order::SOURCE_POS),
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Update timestamp based on new status
            $timestampField = match ($newStatus) {
                'confirmed' => 'confirmed_at',
                'preparing' => 'preparing_at',
                'delivered' => 'delivered_at',
                default => null,
            };

            $updateData = ['status' => $newStatus];

            if ($timestampField) {
                $updateData[$timestampField] = now();
            }

            if (isset($validated['notes'])) {
                $updateData['notes'] = $validated['notes'];
            }

            // Return stock if cancelled (before delivered)
            if ($newStatus === 'cancelled' && ! in_array($oldStatus, ['delivered', 'cancelled'])) {
                $order->load('items.product');
                foreach ($order->items as $orderItem) {
                    $product = $orderItem->product;
                    if ($product && $product->track_stock) {
                        $this->stockService->increaseStock($product, $orderItem->quantity, $order, 'order_cancelled');
                    }
                }
            }

            $order->update($updateData);

            // Create status log
            OrderStatusLog::create([
                'order_id' => $order->id,
                'changed_by' => Auth::id(),
                'from_status' => $oldStatus,
                'to_status' => $newStatus,
                'notes' => $validated['notes'] ?? null,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'POS order status updated successfully',
                'order' => [
                    'id' => $order->id,
                    'status' => $order->status,
                    'status_label' => $order->status_label,
                    'updated_at' => $order->updated_at,
                    'valid_transitions' => Order::getValidTransitions($order->status, $order->order_source),
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update POS order status: '.$e->getMessage());

            return response()->json(['message' => 'Failed to update order status'], 500);
        }
    }

    /**
     * Get pending POS orders count for sidebar badge
     * Returns count of all non-completed orders for the active shift
     */
    public function pendingOrdersAlert()
    {
        // Get active shift
        $activeShift = PosShift::getActiveShift();

        if (! $activeShift) {
            return response()->json([
                'success' => true,
                'data' => [
                    'pending_count' => 0,
                ],
            ]);
        }

        // Query for POS orders that are not completed in the active shift
        $pendingCount = Order::where('order_source', Order::SOURCE_POS)
            ->where('pos_shift_id', $activeShift->id)
            ->whereNotIn('status', [Order::STATUS_DELIVERED, Order::STATUS_CANCELLED])
            ->whereNull('archived_at')
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'pending_count' => $pendingCount,
            ],
        ]);
    }
}
