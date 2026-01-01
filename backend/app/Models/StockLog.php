<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockLog extends Model
{
    const UPDATED_AT = null; // Only track created_at

    protected $fillable = [
        'product_id',
        'admin_user_id',
        'order_id',
        'quantity_change',
        'quantity_before',
        'quantity_after',
        'reason',
        'notes',
    ];

    protected $casts = [
        'quantity_change' => 'integer',
        'quantity_before' => 'integer',
        'quantity_after' => 'integer',
        'created_at' => 'datetime',
    ];

    /**
     * Get the product that owns the stock log.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the admin user who made the change.
     */
    public function adminUser()
    {
        return $this->belongsTo(User::class, 'admin_user_id');
    }

    /**
     * Get the order associated with the stock change.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
