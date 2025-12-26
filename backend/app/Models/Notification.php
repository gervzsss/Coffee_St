<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
  use HasFactory;

  protected $fillable = [
    'product_id',
    'inquiry_thread_id',
    'type',
    'title',
    'message',
    'data',
    'is_read',
    'read_at',
  ];

  protected $casts = [
    'data' => 'array',
    'is_read' => 'boolean',
    'read_at' => 'datetime',
    'created_at' => 'datetime',
    'updated_at' => 'datetime',
  ];

  /**
   * Get the product associated with the notification.
   */
  public function product(): BelongsTo
  {
    return $this->belongsTo(Product::class);
  }

  /**
   * Get the inquiry thread associated with the notification.
   */
  public function inquiryThread(): BelongsTo
  {
    return $this->belongsTo(InquiryThread::class);
  }

  /**
   * Mark the notification as read.
   */
  public function markAsRead(): void
  {
    if (!$this->is_read) {
      $this->update([
        'is_read' => true,
        'read_at' => now(),
      ]);
    }
  }

  /**
   * Scope to get only unread notifications.
   */
  public function scopeUnread($query)
  {
    return $query->where('is_read', false);
  }

  /**
   * Scope to get only read notifications.
   */
  public function scopeRead($query)
  {
    return $query->where('is_read', true);
  }

  /**
   * Scope to get notifications by type.
   */
  public function scopeOfType($query, string $type)
  {
    return $query->where('type', $type);
  }

  /**
   * Scope to get recent notifications.
   */
  public function scopeRecent($query, int $days = 7)
  {
    return $query->where('created_at', '>=', now()->subDays($days));
  }
}
