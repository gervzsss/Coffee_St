<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'subtotal',
        'delivery_fee',
        'tax_rate',
        'tax_amount',
        'tax',
        'total',
        'delivery_address',
        'delivery_contact',
        'delivery_instructions',
        'payment_method',
        'confirmed_at',
        'preparing_at',
        'out_for_delivery_at',
        'delivered_at',
        'failed_at',
        'failure_reason',
        'delivery_proof_url',
        'notes',
    ];

    protected $casts = [
        'status' => 'string',
        'subtotal' => 'float',
        'delivery_fee' => 'float',
        'tax_rate' => 'float',
        'tax_amount' => 'float',
        'tax' => 'float',
        'total' => 'float',
        'confirmed_at' => 'datetime',
        'preparing_at' => 'datetime',
        'out_for_delivery_at' => 'datetime',
        'delivered_at' => 'datetime',
        'failed_at' => 'datetime',
    ];

    // Order status constants
    const STATUS_PENDING = 'pending';

    const STATUS_CONFIRMED = 'confirmed';

    const STATUS_PREPARING = 'preparing';

    const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';

    const STATUS_DELIVERED = 'delivered';

    const STATUS_FAILED = 'failed';

    const STATUS_CANCELLED = 'cancelled';

    // Valid status transitions
    public static function getValidTransitions($currentStatus)
    {
        $transitions = [
            self::STATUS_PENDING => [self::STATUS_CONFIRMED, self::STATUS_CANCELLED],
            self::STATUS_CONFIRMED => [self::STATUS_PREPARING, self::STATUS_CANCELLED],
            self::STATUS_PREPARING => [self::STATUS_OUT_FOR_DELIVERY, self::STATUS_CANCELLED],
            self::STATUS_OUT_FOR_DELIVERY => [self::STATUS_DELIVERED, self::STATUS_FAILED],
            self::STATUS_DELIVERED => [],
            self::STATUS_FAILED => [],
            self::STATUS_CANCELLED => [],
        ];

        return $transitions[$currentStatus] ?? [];
    }

    /**
     * Check if a status transition is valid
     */
    public function canTransitionTo($newStatus)
    {
        return in_array($newStatus, self::getValidTransitions($this->status));
    }

    /**
     * Get the user that owns the order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the order.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the status logs for the order.
     */
    public function statusLogs()
    {
        return $this->hasMany(OrderStatusLog::class)->orderBy('created_at', 'desc');
    }

    /**
     * Calculate order totals based on items.
     */
    public function calculateTotals(): void
    {
        $subtotal = $this->items->sum('line_total');
        $taxAmount = $subtotal * $this->tax_rate;
        $total = $subtotal + $taxAmount + $this->delivery_fee;

        $this->subtotal = $subtotal;
        $this->tax_amount = $taxAmount;
        $this->tax = $taxAmount; // Duplicate field for compatibility
        $this->total = $total;
    }

    /**
     * Generate a unique order number.
     * Format: CS-YYYY-NNNNN
     */
    public static function generateOrderNumber(): string
    {
        $year = now()->year;
        $prefix = "CS-{$year}-";

        // Get the last order number for this year
        $lastOrder = self::where('order_number', 'LIKE', "{$prefix}%")
            ->orderBy('order_number', 'desc')
            ->first();

        if ($lastOrder) {
            // Extract the sequence number and increment it
            $lastSequence = intval(substr($lastOrder->order_number, -5));
            $newSequence = $lastSequence + 1;
        } else {
            // First order of the year
            $newSequence = 1;
        }

        // Format with leading zeros (5 digits)
        return $prefix.str_pad($newSequence, 5, '0', STR_PAD_LEFT);
    }

    /**
     * Get human-readable status label
     */
    public function getStatusLabelAttribute()
    {
        $labels = [
            self::STATUS_PENDING => 'Pending',
            self::STATUS_CONFIRMED => 'Confirmed',
            self::STATUS_PREPARING => 'Preparing',
            self::STATUS_OUT_FOR_DELIVERY => 'Out for Delivery',
            self::STATUS_DELIVERED => 'Delivered',
            self::STATUS_FAILED => 'Failed',
            self::STATUS_CANCELLED => 'Cancelled',
        ];

        return $labels[$this->status] ?? ucfirst($this->status);
    }
}
