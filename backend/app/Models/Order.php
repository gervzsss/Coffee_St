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
        'order_source',
        'pos_shift_id',
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
        'pos_customer_name',
        'pos_customer_phone',
        'payment_method',
        'confirmed_at',
        'preparing_at',
        'out_for_delivery_at',
        'delivered_at',
        'failed_at',
        'failure_reason',
        'delivery_proof_url',
        'notes',
        'archived_at',
        'archived_by',
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
        'archived_at' => 'datetime',
    ];

    // Order status constants
    const STATUS_PENDING = 'pending';

    const STATUS_CONFIRMED = 'confirmed';

    const STATUS_PREPARING = 'preparing';

    const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';

    const STATUS_DELIVERED = 'delivered';

    const STATUS_FAILED = 'failed';

    const STATUS_CANCELLED = 'cancelled';

    // Order source constants
    const SOURCE_ONLINE = 'online';

    const SOURCE_POS = 'pos';

    // Statuses eligible for archiving (terminal statuses)
    const ARCHIVABLE_STATUSES = [
        self::STATUS_DELIVERED,
        self::STATUS_FAILED,
        self::STATUS_CANCELLED,
    ];

    // Valid status transitions for online orders (with delivery)
    public static function getOnlineTransitions($currentStatus)
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

    // Valid status transitions for POS orders (no delivery step)
    public static function getPosTransitions($currentStatus)
    {
        $transitions = [
            self::STATUS_PENDING => [self::STATUS_CONFIRMED, self::STATUS_CANCELLED],
            self::STATUS_CONFIRMED => [self::STATUS_PREPARING, self::STATUS_CANCELLED],
            self::STATUS_PREPARING => [self::STATUS_DELIVERED, self::STATUS_CANCELLED],
            self::STATUS_DELIVERED => [],
            self::STATUS_CANCELLED => [],
        ];

        return $transitions[$currentStatus] ?? [];
    }

    // Valid status transitions based on order source
    public static function getValidTransitions($currentStatus, $orderSource = null)
    {
        if ($orderSource === self::SOURCE_POS) {
            return self::getPosTransitions($currentStatus);
        }

        return self::getOnlineTransitions($currentStatus);
    }

    /**
     * Check if a status transition is valid
     */
    public function canTransitionTo($newStatus)
    {
        return in_array($newStatus, self::getValidTransitions($this->status, $this->order_source));
    }

    /**
     * Check if this is a POS order
     */
    public function isPosOrder(): bool
    {
        return $this->order_source === self::SOURCE_POS;
    }

    /**
     * Check if this is an online order
     */
    public function isOnlineOrder(): bool
    {
        return $this->order_source === self::SOURCE_ONLINE;
    }

    /**
     * Get the user that owns the order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the POS shift this order belongs to.
     */
    public function posShift()
    {
        return $this->belongsTo(PosShift::class, 'pos_shift_id');
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

    /**
     * Scope to get only non-archived orders
     */
    public function scopeNotArchived($query)
    {
        return $query->whereNull('archived_at');
    }

    /**
     * Scope to get only archived orders
     */
    public function scopeArchived($query)
    {
        return $query->whereNotNull('archived_at');
    }

    /**
     * Check if order can be archived
     */
    public function canBeArchived(): bool
    {
        return in_array($this->status, self::ARCHIVABLE_STATUSES) && is_null($this->archived_at);
    }

    /**
     * Check if order is archived
     */
    public function isArchived(): bool
    {
        return ! is_null($this->archived_at);
    }

    /**
     * Get the user who archived this order
     */
    public function archivedBy()
    {
        return $this->belongsTo(User::class, 'archived_by');
    }
}
