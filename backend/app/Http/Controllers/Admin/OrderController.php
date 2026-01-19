<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusLog;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    protected $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * Get order metrics/stats
     */
    public function metrics(Request $request)
    {
        // Base query excludes archived orders for operational metrics
        $activeQuery = Order::notArchived();

        $stats = [
            'pending' => (clone $activeQuery)->where('status', 'pending')->count(),
            'confirmed' => (clone $activeQuery)->where('status', 'confirmed')->count(),
            'preparing' => (clone $activeQuery)->where('status', 'preparing')->count(),
            'out_for_delivery' => (clone $activeQuery)->where('status', 'out_for_delivery')->count(),
            'delivered' => (clone $activeQuery)->where('status', 'delivered')->count(),
            'failed' => (clone $activeQuery)->where('status', 'failed')->count(),
            'cancelled' => (clone $activeQuery)->where('status', 'cancelled')->count(),
            'archived' => Order::archived()->count(),
        ];

        // Combined counts for the UI tabs
        $stats['processing'] = $stats['pending'] + $stats['confirmed'] + $stats['preparing'];
        $stats['completed'] = $stats['delivered'];

        return response()->json($stats);
    }

    /**
     * Get all orders with filters
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.selectedVariants']);

        // Handle archived filter (default: exclude archived)
        $archived = $request->get('archived', 'none');
        if ($archived === 'only') {
            $query->archived();
        } elseif ($archived === 'with') {
            // Include both archived and non-archived
        } else {
            // Default: exclude archived
            $query->notArchived();
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $status = $request->status;

            // Handle combined status filters
            if ($status === 'processing') {
                $query->whereIn('status', ['confirmed', 'preparing']);
            } elseif ($status === 'completed') {
                $query->where('status', 'delivered');
            } elseif ($status === 'failed') {
                $query->whereIn('status', ['failed', 'cancelled']);
            } else {
                $query->where('status', $status);
            }
        }

        // Filter by order source (online/pos)
        if ($request->has('order_source') && ! empty($request->order_source)) {
            $query->where('order_source', $request->order_source);
        }

        // Search by order number or customer name
        if ($request->has('search') && ! empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', '%'.$search.'%')
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('first_name', 'like', '%'.$search.'%')
                            ->orWhere('last_name', 'like', '%'.$search.'%')
                            ->orWhere('email', 'like', '%'.$search.'%');
                    });
            });
        }

        $orders = $query->orderBy('created_at', 'desc')->get()->map(function ($order) {
            $itemsCount = $order->items->sum('quantity');
            $isUrgent = $order->status === 'pending' &&
                $order->created_at->diffInMinutes(now()) > 15;

            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'order_source' => $order->order_source ?? 'online',
                'status' => $order->status,
                'status_label' => $order->status_label,
                'customer' => $order->isPosOrder() ? [
                    'id' => $order->user->id,
                    'name' => $order->pos_customer_name ?? 'Walk-in Customer',
                    'email' => null,
                    'phone' => $order->pos_customer_phone,
                ] : [
                    'id' => $order->user->id,
                    'name' => $order->user->first_name.' '.$order->user->last_name,
                    'email' => $order->user->email,
                    'phone' => $order->user->phone,
                ],
                'delivery_address' => $order->delivery_address,
                'delivery_contact' => $order->delivery_contact,
                'delivery_instructions' => $order->delivery_instructions,
                'notes' => $order->notes,
                'subtotal' => $order->subtotal,
                'delivery_fee' => $order->delivery_fee,
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
                'is_urgent' => $isUrgent,
                'created_at' => $order->created_at,
                'time_ago' => $order->created_at->diffForHumans(),
                'archived_at' => $order->archived_at,
                'can_archive' => $order->canBeArchived(),
                'valid_transitions' => Order::getValidTransitions($order->status, $order->order_source ?? 'online'),
            ];
        });

        return response()->json($orders);
    }

    /**
     * Get single order with full details
     */
    public function show($id)
    {
        $order = Order::with([
            'user',
            'items.product',
            'items.selectedVariants',
            'statusLogs.changedByUser',
        ])->findOrFail($id);

        return response()->json([
            'id' => $order->id,
            'order_number' => $order->order_number,
            'order_source' => $order->order_source ?? 'online',
            'status' => $order->status,
            'status_label' => $order->status_label,
            'customer' => $order->isPosOrder() ? [
                'id' => $order->user->id,
                'name' => $order->pos_customer_name ?? 'Walk-in Customer',
                'email' => null,
                'phone' => $order->pos_customer_phone,
                'address' => null,
            ] : [
                'id' => $order->user->id,
                'name' => $order->user->first_name.' '.$order->user->last_name,
                'email' => $order->user->email,
                'phone' => $order->user->phone,
                'address' => $order->user->address,
            ],
            'delivery_address' => $order->delivery_address,
            'delivery_contact' => $order->delivery_contact,
            'delivery_instructions' => $order->delivery_instructions,
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
            'delivery_fee' => $order->delivery_fee,
            'tax_rate' => $order->tax_rate,
            'tax' => $order->tax,
            'total' => $order->total,
            'payment_method' => $order->payment_method,
            'notes' => $order->notes,
            'failure_reason' => $order->failure_reason,
            'delivery_proof_url' => $order->delivery_proof_url,
            'confirmed_at' => $order->confirmed_at,
            'preparing_at' => $order->preparing_at,
            'out_for_delivery_at' => $order->out_for_delivery_at,
            'delivered_at' => $order->delivered_at,
            'failed_at' => $order->failed_at,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'archived_at' => $order->archived_at,
            'can_archive' => $order->canBeArchived(),
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
            'valid_transitions' => Order::getValidTransitions($order->status, $order->order_source ?? 'online'),
        ]);
    }

    /**
     * Update order status with validation and logging
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:pending,confirmed,preparing,out_for_delivery,delivered,failed,cancelled',
            'failure_reason' => 'required_if:status,failed|nullable|string|max:255',
            'notes' => 'nullable|string|max:500',
            'proof_url' => 'nullable|string',
        ]);

        $newStatus = $validated['status'];
        $oldStatus = $order->status;

        // Validate the status transition
        if (! $order->canTransitionTo($newStatus)) {
            return response()->json([
                'message' => "Cannot transition from '{$oldStatus}' to '{$newStatus}'",
                'valid_transitions' => Order::getValidTransitions($oldStatus, $order->order_source ?? 'online'),
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Update timestamp based on new status
            $timestampField = match ($newStatus) {
                'confirmed' => 'confirmed_at',
                'preparing' => 'preparing_at',
                'out_for_delivery' => 'out_for_delivery_at',
                'delivered' => 'delivered_at',
                'failed' => 'failed_at',
                default => null,
            };

            $updateData = ['status' => $newStatus];

            if ($timestampField) {
                $updateData[$timestampField] = now();
            }

            if ($newStatus === 'failed') {
                $updateData['failure_reason'] = $validated['failure_reason'];
            }

            if ($newStatus === 'delivered' && isset($validated['proof_url'])) {
                $updateData['delivery_proof_url'] = $validated['proof_url'];
            }

            if (isset($validated['notes'])) {
                $updateData['notes'] = $validated['notes'];
            }

            $order->update($updateData);

            // Return stock only if order hasn't reached out_for_delivery yet
            // (stock is considered lost once out for delivery)
            if (
                ($newStatus === 'cancelled' || $newStatus === 'failed') &&
                ! in_array($oldStatus, ['out_for_delivery', 'delivered', 'cancelled', 'failed'])
            ) {
                $order->load('items.product');
                foreach ($order->items as $orderItem) {
                    $product = $orderItem->product;
                    if ($product && $product->track_stock) {
                        $reason = $newStatus === 'cancelled' ? 'order_cancelled' : 'order_failed';
                        $this->stockService->increaseStock($product, $orderItem->quantity, $order, $reason);
                    }
                }
            }

            // Increment warnings (failed_orders_count) ONLY for failed deliveries
            // i.e., when transitioning from out_for_delivery to failed
            if ($oldStatus === 'out_for_delivery' && $newStatus === 'failed') {
                $order->user->increment('failed_orders_count');
            }

            // Decrement failed orders count if transitioning FROM failed to another status
            // (only if it was a delivery failure)
            if ($oldStatus === 'failed' && $newStatus !== 'failed') {
                // Check if this was previously a delivery failure by looking at status logs
                $wasDeliveryFailure = OrderStatusLog::where('order_id', $order->id)
                    ->where('from_status', 'out_for_delivery')
                    ->where('to_status', 'failed')
                    ->exists();

                if ($wasDeliveryFailure && $order->user->failed_orders_count > 0) {
                    $order->user->decrement('failed_orders_count');
                }
            }

            // Create status log
            OrderStatusLog::create([
                'order_id' => $order->id,
                'changed_by' => Auth::id(),
                'from_status' => $oldStatus,
                'to_status' => $newStatus,
                'notes' => $validated['notes'] ?? null,
                'proof_url' => $validated['proof_url'] ?? null,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Order status updated successfully',
                'order' => [
                    'id' => $order->id,
                    'status' => $order->status,
                    'status_label' => $order->status_label,
                    'updated_at' => $order->updated_at,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update order status: '.$e->getMessage());

            return response()->json(['message' => 'Failed to update order status'], 500);
        }
    }

    /**
     * Upload delivery proof image
     */
    public function uploadProof(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        try {
            $file = $request->file('image');

            $cloudName = config('cloudinary.cloud_name');
            $apiKey = config('cloudinary.api_key');
            $apiSecret = config('cloudinary.api_secret');

            if (! $cloudName || ! $apiKey || ! $apiSecret) {
                return response()->json(['message' => 'Cloudinary configuration missing'], 500);
            }

            $timestamp = time();
            $folder = 'coffee_st/delivery_proofs';

            $stringToSign = "folder={$folder}&timestamp={$timestamp}".$apiSecret;
            $signature = sha1($stringToSign);

            $response = Http::withoutVerifying()
                ->attach('file', file_get_contents($file->getRealPath()), $file->getClientOriginalName())
                ->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                    'api_key' => $apiKey,
                    'timestamp' => $timestamp,
                    'signature' => $signature,
                    'folder' => $folder,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                return response()->json([
                    'url' => $data['secure_url'],
                    'public_id' => $data['public_id'],
                ]);
            }

            return response()->json(['message' => 'Failed to upload image'], 500);
        } catch (\Exception $e) {
            Log::error('Failed to upload delivery proof: '.$e->getMessage());

            return response()->json(['message' => 'Failed to upload image'], 500);
        }
    }

    /**
     * Get order statistics (legacy endpoint)
     */
    public function stats(Request $request)
    {
        return $this->metrics($request);
    }

    /**
     * Archive an order
     */
    public function archive($id)
    {
        $order = Order::findOrFail($id);

        if ($order->isArchived()) {
            return response()->json([
                'message' => 'Order is already archived',
            ], 409);
        }

        if (! $order->canBeArchived()) {
            return response()->json([
                'message' => 'Only delivered, failed, or cancelled orders can be archived',
                'current_status' => $order->status,
            ], 422);
        }

        $order->update([
            'archived_at' => now(),
            'archived_by' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Order archived successfully',
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'archived_at' => $order->archived_at,
            ],
        ]);
    }

    /**
     * Unarchive (restore) an order
     */
    public function unarchive($id)
    {
        $order = Order::findOrFail($id);

        if (! $order->isArchived()) {
            return response()->json([
                'message' => 'Order is not archived',
            ], 409);
        }

        $order->update([
            'archived_at' => null,
            // Keep archived_by for audit trail (who last archived it)
        ]);

        return response()->json([
            'message' => 'Order restored successfully',
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
            ],
        ]);
    }
}
