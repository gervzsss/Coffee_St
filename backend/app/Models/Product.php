<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'category',
        'image_url',
        'is_active',
        'is_available',
        'unavailable_reason',
        'archived_at',
    ];

    protected $casts = [
        'price' => 'float',
        'is_active' => 'boolean',
        'is_available' => 'boolean',
        'archived_at' => 'datetime',
    ];

    /**
     * Get the variants for the product.
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Get the active variants for the product.
     */
    public function activeVariants()
    {
        return $this->hasMany(ProductVariant::class)->where('is_active', true);
    }

    /**
     * Get the variant groups for the product.
     */
    public function variantGroups()
    {
        return $this->hasMany(ProductVariantGroup::class);
    }

    /**
     * Get the active variant groups for the product.
     */
    public function activeVariantGroups()
    {
        return $this->hasMany(ProductVariantGroup::class)->where('is_active', true)->orderBy('display_order');
    }

    /**
     * Get the cart items for the product.
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get the order items for the product.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
