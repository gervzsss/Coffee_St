<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockLog;
use App\Models\User;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class StockController extends Controller
{
  protected $stockService;

  public function __construct(StockService $stockService)
  {
    $this->stockService = $stockService;
  }

  /**
   * Update product stock.
   */
  public function updateStock(Request $request, $id)
  {
    $validator = Validator::make($request->all(), [
      'adjustment_type' => 'required|in:add,remove,set',
      'quantity' => 'required|integer|min:0',
      'reason' => 'required|in:restock,adjustment,damaged,expired,returned',
      'notes' => 'nullable|string|max:500',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'message' => 'Validation failed',
        'errors' => $validator->errors()
      ], 422);
    }

    $product = Product::findOrFail($id);

    if (!$product->track_stock) {
      return response()->json([
        'message' => 'Stock tracking is not enabled for this product'
      ], 400);
    }

    try {
      $stockLog = $this->stockService->updateStock(
        product: $product,
        adjustmentType: $request->adjustment_type,
        quantity: $request->quantity,
        reason: $request->reason,
        admin: Auth::user(),
        notes: $request->notes
      );

      $product->refresh();

      return response()->json([
        'message' => 'Stock updated successfully',
        'product' => [
          'id' => $product->id,
          'name' => $product->name,
          'stock_quantity' => $product->stock_quantity,
          'track_stock' => $product->track_stock,
          'low_stock_threshold' => $product->low_stock_threshold,
          'stock_updated_at' => $product->stock_updated_at,
          'is_sold_out' => $product->isSoldOut(),
          'is_low_stock' => $product->isLowStock(),
        ],
        'stock_log' => [
          'id' => $stockLog->id,
          'quantity_change' => $stockLog->quantity_change,
          'quantity_before' => $stockLog->quantity_before,
          'quantity_after' => $stockLog->quantity_after,
          'reason' => $stockLog->reason,
          'created_at' => $stockLog->created_at,
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Failed to update stock',
        'error' => $e->getMessage()
      ], 500);
    }
  }

  /**
   * Get stock history for a product.
   */
  public function getStockHistory(Request $request, $id)
  {
    $product = Product::findOrFail($id);

    $query = $product->stockLogs()
      ->with(['adminUser:id,first_name,last_name,email', 'order:id,order_number']);

    // Filter by reason
    if ($request->has('reason') && $request->reason !== 'all') {
      $query->where('reason', $request->reason);
    }

    // Filter by admin user
    if ($request->has('admin_user_id') && $request->admin_user_id !== 'all') {
      $query->where('admin_user_id', $request->admin_user_id);
    }

    // Filter by date range
    if ($request->has('date_from')) {
      $query->where('created_at', '>=', $request->date_from);
    }
    if ($request->has('date_to')) {
      $query->where('created_at', '<=', $request->date_to . ' 23:59:59');
    }

    $stockLogs = $query
      ->orderBy('created_at', 'desc')
      ->paginate($request->per_page ?? 20);

    return response()->json([
      'product' => [
        'id' => $product->id,
        'name' => $product->name,
        'stock_quantity' => $product->stock_quantity,
        'track_stock' => $product->track_stock,
      ],
      'stock_logs' => $stockLogs
    ]);
  }

  /**
   * Get products needing attention.
   */
  public function getProductsNeedingAttention()
  {
    $products = $this->stockService->getProductsNeedingAttention();

    return response()->json([
      'products' => $products->map(function ($product) {
        return [
          'id' => $product->id,
          'name' => $product->name,
          'stock_quantity' => $product->stock_quantity,
          'low_stock_threshold' => $product->low_stock_threshold,
          'is_sold_out' => $product->isSoldOut(),
          'is_low_stock' => $product->isLowStock(),
          'stock_updated_at' => $product->stock_updated_at,
        ];
      })
    ]);
  }

  /**
   * Get global stock history across all products.
   */
  public function getGlobalStockHistory(Request $request)
  {
    $query = StockLog::with([
      'product:id,name',
      'adminUser:id,first_name,last_name,email',
      'order:id,order_number'
    ]);

    // Filter by product
    if ($request->has('product_id') && $request->product_id !== 'all') {
      $query->where('product_id', $request->product_id);
    }

    // Filter by reason
    if ($request->has('reason') && $request->reason !== 'all') {
      $query->where('reason', $request->reason);
    }

    // Filter by admin user
    if ($request->has('admin_user_id') && $request->admin_user_id !== 'all') {
      $query->where('admin_user_id', $request->admin_user_id);
    }

    // Filter by date range
    if ($request->has('date_from')) {
      $query->where('created_at', '>=', $request->date_from);
    }
    if ($request->has('date_to')) {
      $query->where('created_at', '<=', $request->date_to . ' 23:59:59');
    }

    $stockLogs = $query
      ->orderBy('created_at', 'desc')
      ->paginate($request->per_page ?? 50);

    // Get filter options
    $adminUsers = User::where('is_admin', true)
      ->select('id', 'first_name', 'last_name', 'email')
      ->get();

    return response()->json([
      'stock_logs' => $stockLogs,
      'filter_options' => [
        'admin_users' => $adminUsers,
        'reasons' => [
          'sale',
          'restock',
          'adjustment',
          'damaged',
          'expired',
          'returned',
          'order_cancelled',
          'order_failed'
        ]
      ]
    ]);
  }
}
