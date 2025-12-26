<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
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
  public function getStockHistory($id)
  {
    $product = Product::findOrFail($id);

    $stockLogs = $product->stockLogs()
      ->with(['adminUser:id,name,email', 'order:id'])
      ->orderBy('created_at', 'desc')
      ->paginate(20);

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
}
