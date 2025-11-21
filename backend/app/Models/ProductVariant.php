<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'group_name',
        'name',
        'price_delta',
        'is_active',
    ];

    protected $casts = [
        'price_delta' => 'float',
        'is_active' => 'boolean',
    ];

    /**
     * Get the product that owns the variant.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the variant group that owns the variant.
     */
    public function variantGroup()
    {
        return $this->belongsTo(ProductVariantGroup::class, 'variant_group_id');
    }

    /**
     * Get the cart items using this variant.
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'variant_id');
    }

    /**
     * Get the order items using this variant.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'variant_id');
    }
}
