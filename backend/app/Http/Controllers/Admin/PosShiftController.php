<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PosShift;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PosShiftController extends Controller
{
    /**
     * Get the currently active shift.
     * GET /admin/pos/shifts/active
     */
    public function active()
    {
        $shift = PosShift::getActiveShift();

        if (! $shift) {
            return response()->json([
                'active_shift' => null,
            ]);
        }

        $shift->load('openedByUser');

        return response()->json([
            'active_shift' => [
                'id' => $shift->id,
                'status' => $shift->status,
                'opened_at' => $shift->opened_at,
                'opened_by' => [
                    'id' => $shift->openedByUser->id,
                    'name' => $shift->openedByUser->first_name.' '.$shift->openedByUser->last_name,
                ],
                'opening_cash_float' => $shift->opening_cash_float,
                // Sales totals hidden for active shifts - only visible after closure
                'cash_sales_total' => null,
                'ewallet_sales_total' => null,
                'gross_sales_total' => null,
                'orders_count' => $shift->orders()->count(),
                'in_flight_orders_count' => $shift->getInFlightOrdersCount(),
            ],
        ]);
    }

    /**
     * Open a new shift.
     * POST /admin/pos/shifts/open
     */
    public function open(Request $request)
    {
        $validated = $request->validate([
            'opening_cash_float' => 'required|numeric|min:0|max:1000000',
        ]);

        // Check if there's already an active shift
        if (PosShift::hasActiveShift()) {
            return response()->json([
                'message' => 'A shift is already active. Close the current shift before opening a new one.',
            ], 409);
        }

        DB::beginTransaction();
        try {
            $shift = PosShift::create([
                'status' => PosShift::STATUS_ACTIVE,
                'opened_at' => now(),
                'opened_by' => Auth::id(),
                'opening_cash_float' => $validated['opening_cash_float'],
            ]);

            DB::commit();

            $shift->load('openedByUser');

            return response()->json([
                'message' => 'Shift opened successfully',
                'shift' => [
                    'id' => $shift->id,
                    'status' => $shift->status,
                    'opened_at' => $shift->opened_at,
                    'opened_by' => [
                        'id' => $shift->openedByUser->id,
                        'name' => $shift->openedByUser->first_name.' '.$shift->openedByUser->last_name,
                    ],
                    'opening_cash_float' => $shift->opening_cash_float,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to open shift: '.$e->getMessage());

            return response()->json([
                'message' => 'Failed to open shift',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Close a shift with blind cash count.
     * POST /admin/pos/shifts/{id}/close
     */
    public function close(Request $request, $id)
    {
        $validated = $request->validate([
            'actual_cash_count' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        $shift = PosShift::findOrFail($id);

        // Validate shift is active
        if (! $shift->isActive()) {
            return response()->json([
                'message' => 'This shift is already closed.',
            ], 422);
        }

        // Check for in-flight orders
        $inFlightCount = $shift->getInFlightOrdersCount();
        if ($inFlightCount > 0) {
            $inFlightOrders = $shift->getInFlightOrders();

            return response()->json([
                'message' => "Cannot close shift with {$inFlightCount} in-flight order(s). Complete or cancel all orders first.",
                'in_flight_orders' => $inFlightOrders->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'status' => $order->status,
                        'total' => $order->total,
                    ];
                }),
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Calculate totals
            $totals = $shift->calculateTotals();
            $expectedCash = $shift->calculateExpectedCash();
            $actualCash = $validated['actual_cash_count'];
            $variance = round($actualCash - $expectedCash, 2);

            // Update shift
            $shift->update([
                'status' => PosShift::STATUS_CLOSED,
                'closed_at' => now(),
                'closed_by' => Auth::id(),
                'actual_cash_count' => $actualCash,
                'expected_cash' => $expectedCash,
                'variance' => $variance,
                'cash_sales_total' => $totals['cash_sales_total'],
                'ewallet_sales_total' => $totals['ewallet_sales_total'],
                'gross_sales_total' => $totals['gross_sales_total'],
                'notes' => $validated['notes'] ?? null,
            ]);

            DB::commit();

            $shift->load(['openedByUser', 'closedByUser']);

            return response()->json([
                'message' => 'Shift closed successfully',
                'shift' => [
                    'id' => $shift->id,
                    'status' => $shift->status,
                    'opened_at' => $shift->opened_at,
                    'closed_at' => $shift->closed_at,
                    'opened_by' => [
                        'id' => $shift->openedByUser->id,
                        'name' => $shift->openedByUser->first_name.' '.$shift->openedByUser->last_name,
                    ],
                    'closed_by' => [
                        'id' => $shift->closedByUser->id,
                        'name' => $shift->closedByUser->first_name.' '.$shift->closedByUser->last_name,
                    ],
                    'opening_cash_float' => $shift->opening_cash_float,
                    'cash_sales_total' => $shift->cash_sales_total,
                    'ewallet_sales_total' => $shift->ewallet_sales_total,
                    'gross_sales_total' => $shift->gross_sales_total,
                    'expected_cash' => $shift->expected_cash,
                    'actual_cash_count' => $shift->actual_cash_count,
                    'variance' => $shift->variance,
                    'is_discrepant' => $shift->isDiscrepant(),
                    'notes' => $shift->notes,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to close shift: '.$e->getMessage());

            return response()->json([
                'message' => 'Failed to close shift',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * List all shifts (paginated).
     * GET /admin/pos/shifts
     */
    public function index(Request $request)
    {
        $query = PosShift::with(['openedByUser', 'closedByUser'])
            ->orderBy('opened_at', 'desc');

        // Filter by status
        if ($request->has('status') && in_array($request->status, ['active', 'closed'])) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('from')) {
            $query->whereDate('opened_at', '>=', $request->from);
        }
        if ($request->has('to')) {
            $query->whereDate('opened_at', '<=', $request->to);
        }

        $perPage = $request->get('per_page', 20);
        $shifts = $query->paginate($perPage);

        return response()->json([
            'shifts' => $shifts->items() ? collect($shifts->items())->map(function ($shift) {
                $isActive = $shift->status === PosShift::STATUS_ACTIVE;

                return [
                    'id' => $shift->id,
                    'status' => $shift->status,
                    'opened_at' => $shift->opened_at,
                    'closed_at' => $shift->closed_at,
                    'opened_by' => [
                        'id' => $shift->openedByUser->id,
                        'name' => $shift->openedByUser->first_name.' '.$shift->openedByUser->last_name,
                    ],
                    'closed_by' => $shift->closedByUser ? [
                        'id' => $shift->closedByUser->id,
                        'name' => $shift->closedByUser->first_name.' '.$shift->closedByUser->last_name,
                    ] : null,
                    'opening_cash_float' => $shift->opening_cash_float,
                    // Hide sales data for active shifts
                    'cash_sales_total' => $isActive ? null : $shift->cash_sales_total,
                    'ewallet_sales_total' => $isActive ? null : $shift->ewallet_sales_total,
                    'gross_sales_total' => $isActive ? null : $shift->gross_sales_total,
                    'expected_cash' => $isActive ? null : $shift->expected_cash,
                    'actual_cash_count' => $isActive ? null : $shift->actual_cash_count,
                    'variance' => $isActive ? null : $shift->variance,
                    'is_discrepant' => $isActive ? false : $shift->isDiscrepant(),
                    'orders_count' => $shift->orders()->count(),
                ];
            }) : [],
            'pagination' => [
                'current_page' => $shifts->currentPage(),
                'last_page' => $shifts->lastPage(),
                'per_page' => $shifts->perPage(),
                'total' => $shifts->total(),
            ],
        ]);
    }

    /**
     * Get shift details.
     * GET /admin/pos/shifts/{id}
     */
    public function show(Request $request, $id)
    {
        $shift = PosShift::with(['openedByUser', 'closedByUser'])->findOrFail($id);

        // Get orders if requested or for detail view
        $includeOrders = $request->boolean('include_orders', true);
        $orders = [];

        if ($includeOrders) {
            $ordersQuery = $shift->orders()
                ->with(['items.selectedVariants'])
                ->orderBy('created_at', 'desc');

            // Filter by payment method
            if ($request->has('payment_method') && in_array($request->payment_method, ['cash', 'gcash'])) {
                $ordersQuery->where('payment_method', $request->payment_method);
            }

            // Filter by status
            if ($request->has('order_status')) {
                $ordersQuery->where('status', $request->order_status);
            }

            $orders = $ordersQuery->get()->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'status_label' => $order->status_label,
                    'payment_method' => $order->payment_method,
                    'subtotal' => $order->subtotal,
                    'total' => $order->total,
                    'customer_name' => $order->pos_customer_name ?? 'Walk-in',
                    'items_count' => $order->items->sum('quantity'),
                    'created_at' => $order->created_at,
                ];
            });
        }

        // Hide sensitive data for active shifts
        $isActive = $shift->isActive();

        return response()->json([
            'shift' => [
                'id' => $shift->id,
                'status' => $shift->status,
                'opened_at' => $shift->opened_at,
                'closed_at' => $shift->closed_at,
                'opened_by' => [
                    'id' => $shift->openedByUser->id,
                    'name' => $shift->openedByUser->first_name.' '.$shift->openedByUser->last_name,
                ],
                'closed_by' => $shift->closedByUser ? [
                    'id' => $shift->closedByUser->id,
                    'name' => $shift->closedByUser->first_name.' '.$shift->closedByUser->last_name,
                ] : null,
                'opening_cash_float' => $shift->opening_cash_float,
                // Sales data hidden for active shifts - only visible after closure
                'cash_sales_total' => $isActive ? null : $shift->cash_sales_total,
                'ewallet_sales_total' => $isActive ? null : $shift->ewallet_sales_total,
                'gross_sales_total' => $isActive ? null : $shift->gross_sales_total,
                'expected_cash' => $isActive ? null : $shift->expected_cash,
                'actual_cash_count' => $isActive ? null : $shift->actual_cash_count,
                'variance' => $isActive ? null : $shift->variance,
                'is_discrepant' => $isActive ? false : $shift->isDiscrepant(),
                'notes' => $shift->notes,
                'orders_count' => $shift->orders()->count(),
                'delivered_orders_count' => $shift->deliveredOrders()->count(),
                'in_flight_orders_count' => $shift->getInFlightOrdersCount(),
            ],
            'orders' => $orders,
        ]);
    }
}
