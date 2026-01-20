<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosShift extends Model
{
    use HasFactory;

    protected $table = 'pos_shifts';

    protected $fillable = [
        'status',
        'opened_at',
        'closed_at',
        'opened_by',
        'closed_by',
        'opening_cash_float',
        'actual_cash_count',
        'expected_cash',
        'variance',
        'cash_sales_total',
        'ewallet_sales_total',
        'gross_sales_total',
        'notes',
    ];

    protected $casts = [
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
        'opening_cash_float' => 'float',
        'actual_cash_count' => 'float',
        'expected_cash' => 'float',
        'variance' => 'float',
        'cash_sales_total' => 'float',
        'ewallet_sales_total' => 'float',
        'gross_sales_total' => 'float',
    ];

    // Status constants
    const STATUS_ACTIVE = 'active';

    const STATUS_CLOSED = 'closed';

    // Variance threshold for discrepancy flagging (in PHP currency)
    const VARIANCE_THRESHOLD = 1.00;

    /**
     * Get the user who opened this shift.
     */
    public function openedByUser()
    {
        return $this->belongsTo(User::class, 'opened_by');
    }

    /**
     * Get the user who closed this shift.
     */
    public function closedByUser()
    {
        return $this->belongsTo(User::class, 'closed_by');
    }

    /**
     * Get all orders linked to this shift.
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'pos_shift_id');
    }

    /**
     * Get only delivered orders for this shift.
     */
    public function deliveredOrders()
    {
        return $this->orders()->where('status', Order::STATUS_DELIVERED);
    }

    /**
     * Check if this shift is active.
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Check if this shift is closed.
     */
    public function isClosed(): bool
    {
        return $this->status === self::STATUS_CLOSED;
    }

    /**
     * Check if variance is above threshold (discrepancy).
     */
    public function isDiscrepant(): bool
    {
        if ($this->variance === null) {
            return false;
        }

        return abs($this->variance) >= self::VARIANCE_THRESHOLD;
    }

    /**
     * Get the currently active shift (if any).
     */
    public static function getActiveShift(): ?self
    {
        return self::where('status', self::STATUS_ACTIVE)->first();
    }

    /**
     * Check if there's an active shift.
     */
    public static function hasActiveShift(): bool
    {
        return self::where('status', self::STATUS_ACTIVE)->exists();
    }

    /**
     * Calculate totals from linked orders.
     * Returns array with cash_sales, ewallet_sales, gross_sales
     */
    public function calculateTotals(): array
    {
        $deliveredOrders = $this->orders()
            ->where('status', Order::STATUS_DELIVERED)
            ->get();

        $cashSales = $deliveredOrders
            ->where('payment_method', 'cash')
            ->sum('total');

        $ewalletSales = $deliveredOrders
            ->where('payment_method', 'gcash')
            ->sum('total');

        $grossSales = $cashSales + $ewalletSales;

        return [
            'cash_sales_total' => round($cashSales, 2),
            'ewallet_sales_total' => round($ewalletSales, 2),
            'gross_sales_total' => round($grossSales, 2),
        ];
    }

    /**
     * Calculate expected cash at close time.
     * Expected = opening float + cash sales
     */
    public function calculateExpectedCash(): float
    {
        $totals = $this->calculateTotals();

        return round($this->opening_cash_float + $totals['cash_sales_total'], 2);
    }

    /**
     * Get count of in-flight orders (confirmed or preparing).
     */
    public function getInFlightOrdersCount(): int
    {
        return $this->orders()
            ->whereIn('status', [Order::STATUS_CONFIRMED, Order::STATUS_PREPARING])
            ->count();
    }

    /**
     * Get in-flight orders (for close validation).
     */
    public function getInFlightOrders()
    {
        return $this->orders()
            ->whereIn('status', [Order::STATUS_CONFIRMED, Order::STATUS_PREPARING])
            ->get();
    }

    /**
     * Check if shift can be closed (no in-flight orders).
     */
    public function canClose(): bool
    {
        return $this->isActive() && $this->getInFlightOrdersCount() === 0;
    }

    /**
     * Scope for active shifts.
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /**
     * Scope for closed shifts.
     */
    public function scopeClosed($query)
    {
        return $query->where('status', self::STATUS_CLOSED);
    }
}
