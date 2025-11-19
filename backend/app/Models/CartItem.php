<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'product_id',
        'variant_id',
        'variant_name',
        'quantity',
        'unit_price',
        'price_delta',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'float',
        'price_delta' => 'float',
    ];

    /**
     * Get the cart that owns the cart item.
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    /**
     * Get the product associated with the cart item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the variant associated with the cart item.
     */
    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    /**
     * Calculate the total price for this cart item.
     */
    public function getLineTotalAttribute(): float
    {
        return ($this->unit_price + $this->price_delta) * $this->quantity;
    }
}
