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
    ];

    protected $casts = [
        'status' => 'string',
        'subtotal' => 'float',
        'delivery_fee' => 'float',
        'tax_rate' => 'float',
        'tax_amount' => 'float',
        'tax' => 'float',
        'total' => 'float',
    ];

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
     * Format: ORD-YYYY-NNNN
     */
    public static function generateOrderNumber(): string
    {
        $year = now()->year;
        $prefix = "ORD-{$year}-";
        
        // Get the last order number for this year
        $lastOrder = self::where('order_number', 'LIKE', "{$prefix}%")
            ->orderBy('order_number', 'desc')
            ->first();
        
        if ($lastOrder) {
            // Extract the sequence number and increment it
            $lastSequence = intval(substr($lastOrder->order_number, -4));
            $newSequence = $lastSequence + 1;
        } else {
            // First order of the year
            $newSequence = 1;
        }
        
        // Format with leading zeros (4 digits)
        return $prefix . str_pad($newSequence, 4, '0', STR_PAD_LEFT);
    }
}
