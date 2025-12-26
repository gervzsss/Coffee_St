<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Product;
use App\Models\InquiryThread;
use Illuminate\Support\Collection;

class NotificationService
{
  /**
   * Create a low stock notification.
   */
  public function createLowStockNotification(Product $product): Notification
  {
    // Check if a recent low stock notification already exists
    $existingNotification = Notification::where('product_id', $product->id)
      ->where('type', 'low_stock')
      ->where('is_read', false)
      ->first();

    if ($existingNotification) {
      return $existingNotification;
    }

    // Mark any existing sold_out notifications as read since stock is now available
    Notification::where('product_id', $product->id)
      ->where('type', 'sold_out')
      ->where('is_read', false)
      ->update(['is_read' => true, 'read_at' => now()]);

    return Notification::create([
      'product_id' => $product->id,
      'type' => 'low_stock',
      'title' => 'Low Stock Alert',
      'message' => sprintf(
        'Product "%s" is running low on stock. Current quantity: %d (Threshold: %d)',
        $product->name,
        $product->stock_quantity,
        $product->low_stock_threshold
      ),
      'data' => [
        'product_name' => $product->name,
        'current_stock' => $product->stock_quantity,
        'threshold' => $product->low_stock_threshold,
      ],
    ]);
  }

  /**
   * Create a sold out notification.
   */
  public function createSoldOutNotification(Product $product): Notification
  {
    // Check if a recent sold out notification already exists
    $existingNotification = Notification::where('product_id', $product->id)
      ->where('type', 'sold_out')
      ->where('is_read', false)
      ->first();

    if ($existingNotification) {
      return $existingNotification;
    }

    // Mark any existing low_stock notifications as read since product is now sold out
    Notification::where('product_id', $product->id)
      ->where('type', 'low_stock')
      ->where('is_read', false)
      ->update(['is_read' => true, 'read_at' => now()]);

    return Notification::create([
      'product_id' => $product->id,
      'type' => 'sold_out',
      'title' => 'Product Sold Out',
      'message' => sprintf(
        'Product "%s" is now sold out. Please restock soon.',
        $product->name
      ),
      'data' => [
        'product_name' => $product->name,
      ],
    ]);
  }

  /**
   * Create a stock restored notification.
   */
  public function createStockRestoredNotification(Product $product, int $previousStock): ?Notification
  {
    // Only create if product was previously sold out or low
    if ($previousStock > $product->low_stock_threshold) {
      return null;
    }

    return Notification::create([
      'product_id' => $product->id,
      'type' => 'stock_restored',
      'title' => 'Stock Restored',
      'message' => sprintf(
        'Product "%s" has been restocked. Current quantity: %d',
        $product->name,
        $product->stock_quantity
      ),
      'data' => [
        'product_name' => $product->name,
        'current_stock' => $product->stock_quantity,
        'previous_stock' => $previousStock,
      ],
    ]);
  }

  /**
   * Create a new inquiry notification.
   */
  public function createNewInquiryNotification(InquiryThread $thread): Notification
  {
    // Check if a notification for this thread already exists and is unread
    $existingNotification = Notification::where('inquiry_thread_id', $thread->id)
      ->where('type', 'new_inquiry')
      ->where('is_read', false)
      ->first();

    if ($existingNotification) {
      return $existingNotification;
    }

    // Determine the sender name
    $senderName = $thread->user
      ? ($thread->user->first_name . ' ' . $thread->user->last_name)
      : ($thread->guest_name ?? 'Guest');

    return Notification::create([
      'inquiry_thread_id' => $thread->id,
      'type' => 'new_inquiry',
      'title' => 'New Inquiry',
      'message' => sprintf(
        'New inquiry received from %s: "%s"',
        $senderName,
        $thread->subject
      ),
      'data' => [
        'thread_id' => $thread->id,
        'subject' => $thread->subject,
        'user_name' => $senderName,
      ],
    ]);
  }

  /**
   * Get all unread notifications.
   */
  public function getUnreadNotifications(): Collection
  {
    return Notification::with(['product', 'inquiryThread'])
      ->unread()
      ->orderBy('created_at', 'desc')
      ->get();
  }

  /**
   * Get all notifications (read and unread).
   */
  public function getAllNotifications(int $limit = 50): Collection
  {
    return Notification::with(['product', 'inquiryThread'])
      ->orderBy('created_at', 'desc')
      ->limit($limit)
      ->get();
  }

  /**
   * Get unread notification count.
   */
  public function getUnreadCount(): int
  {
    return Notification::unread()->count();
  }

  /**
   * Mark a notification as read.
   */
  public function markAsRead(int $notificationId): bool
  {
    $notification = Notification::find($notificationId);

    if (!$notification) {
      return false;
    }

    $notification->markAsRead();
    return true;
  }

  /**
   * Mark all notifications as read.
   */
  public function markAllAsRead(): int
  {
    return Notification::unread()->update([
      'is_read' => true,
      'read_at' => now(),
    ]);
  }

  /**
   * Delete old read notifications.
   */
  public function deleteOldNotifications(int $daysOld = 30): int
  {
    return Notification::read()
      ->where('created_at', '<', now()->subDays($daysOld))
      ->delete();
  }

  /**
   * Delete a specific notification.
   */
  public function deleteNotification(int $notificationId): bool
  {
    $notification = Notification::find($notificationId);

    if (!$notification) {
      return false;
    }

    return $notification->delete();
  }
}
