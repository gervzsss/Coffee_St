<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use App\Models\StockLog;
use Illuminate\Support\Facades\DB;

class StockService
{
  protected NotificationService $notificationService;

  public function __construct(NotificationService $notificationService)
  {
    $this->notificationService = $notificationService;
  }
  /**
   * Check if product has sufficient stock.
   */
  public function hasStock(Product $product, int $quantity): bool
  {
    return $product->hasStock($quantity);
  }

  /**
   * Decrease stock (on order placement).
   */
  public function decreaseStock(Product $product, int $quantity, Order $order): void
  {
    if (!$product->track_stock) {
      return;
    }

    $quantityBefore = $product->stock_quantity ?? 0;
    $quantityAfter = max(0, $quantityBefore - $quantity);

    $product->stock_quantity = $quantityAfter;
    $product->stock_updated_at = now();
    $product->save();
    $product->refresh(); // Refresh to get updated values

    $this->logStockChange(
      product: $product,
      quantityChange: -$quantity,
      quantityBefore: $quantityBefore,
      quantityAfter: $quantityAfter,
      reason: 'sale',
      order: $order
    );

    // Check if stock alerts are needed
    $this->checkStockAlerts($product);
  }

  /**
   * Increase stock (on order cancellation/return).
   */
  public function increaseStock(Product $product, int $quantity, ?Order $order = null, string $reason = 'returned'): void
  {
    if (!$product->track_stock) {
      return;
    }

    $quantityBefore = $product->stock_quantity ?? 0;
    $quantityAfter = $quantityBefore + $quantity;

    $product->stock_quantity = $quantityAfter;
    $product->stock_updated_at = now();
    $product->save();
    $product->refresh(); // Refresh to get updated values

    $this->logStockChange(
      product: $product,
      quantityChange: $quantity,
      quantityBefore: $quantityBefore,
      quantityAfter: $quantityAfter,
      reason: $reason,
      order: $order
    );

    // Create stock restored notification if applicable
    if ($quantityBefore <= $product->low_stock_threshold && $quantityAfter > $product->low_stock_threshold) {
      $this->notificationService->createStockRestoredNotification($product, $quantityBefore);
    }
  }

  /**
   * Update stock with specific reason and admin user.
   */
  public function updateStock(
    Product $product,
    string $adjustmentType, // 'add', 'remove', 'set'
    int $quantity,
    string $reason,
    ?User $admin = null,
    ?string $notes = null
  ): StockLog {
    if (!$product->track_stock) {
      throw new \Exception('Stock tracking is not enabled for this product');
    }

    $quantityBefore = $product->stock_quantity ?? 0;
    $quantityAfter = match ($adjustmentType) {
      'add' => $quantityBefore + $quantity,
      'remove' => max(0, $quantityBefore - $quantity),
      'set' => $quantity,
      default => throw new \InvalidArgumentException('Invalid adjustment type')
    };

    $quantityChange = $quantityAfter - $quantityBefore;

    $product->stock_quantity = $quantityAfter;
    $product->stock_updated_at = now();
    $product->save();
    $product->refresh(); // Refresh to get updated values

    $stockLog = $this->logStockChange(
      product: $product,
      quantityChange: $quantityChange,
      quantityBefore: $quantityBefore,
      quantityAfter: $quantityAfter,
      reason: $reason,
      admin: $admin,
      notes: $notes
    );

    // Check if stock alerts are needed
    $this->checkStockAlerts($product);

    // Create stock restored notification if stock was increased from low/sold out
    if ($quantityBefore <= $product->low_stock_threshold && $quantityAfter > $product->low_stock_threshold) {
      $this->notificationService->createStockRestoredNotification($product, $quantityBefore);
    }

    return $stockLog;
  }

  /**
   * Log stock change in stock_logs table.
   */
  protected function logStockChange(
    Product $product,
    int $quantityChange,
    int $quantityBefore,
    int $quantityAfter,
    string $reason,
    ?Order $order = null,
    ?User $admin = null,
    ?string $notes = null
  ): StockLog {
    return StockLog::create([
      'product_id' => $product->id,
      'admin_user_id' => $admin?->id,
      'order_id' => $order?->id,
      'quantity_change' => $quantityChange,
      'quantity_before' => $quantityBefore,
      'quantity_after' => $quantityAfter,
      'reason' => $reason,
      'notes' => $notes,
      'created_at' => now(),
    ]);
  }

  /**
   * Check stock levels and create notifications if needed.
   */
  protected function checkStockAlerts(Product $product): void
  {
    if ($product->isSoldOut()) {
      $this->notificationService->createSoldOutNotification($product);
    } elseif ($product->isLowStock()) {
      $this->notificationService->createLowStockNotification($product);
    }
  }

  /**
   * Get products needing attention (sold out or low stock).
   */
  public function getProductsNeedingAttention()
  {
    return Product::where('track_stock', true)
      ->where(function ($query) {
        $query->where('stock_quantity', 0)
          ->orWhereRaw('stock_quantity <= low_stock_threshold');
      })
      ->orderByRaw('CASE WHEN stock_quantity = 0 THEN 0 ELSE 1 END')
      ->orderBy('stock_quantity', 'asc')
      ->get();
  }

  /**
   * Validate and deduct stock for order items (transaction-safe).
   */
  public function validateAndDeductStockForOrder(Order $order, array $items): void
  {
    DB::transaction(function () use ($order, $items) {
      foreach ($items as $item) {
        $product = Product::lockForUpdate()->find($item['product_id']);

        if (!$product) {
          throw new \Exception("Product not found: {$item['product_id']}");
        }

        if ($product->track_stock && !$product->hasStock($item['quantity'])) {
          throw new \Exception("Insufficient stock for product: {$product->name}");
        }

        if ($product->track_stock) {
          $this->decreaseStock($product, $item['quantity'], $order);
        }
      }
    });
  }
}
