<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'subtotal',
        'delivery_fee',
        'tax_rate',
        'tax_amount',
        'tax',
        'total',
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
}
