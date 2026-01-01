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
        'stock_quantity',
        'track_stock',
        'low_stock_threshold',
        'stock_updated_at',
    ];

    protected $casts = [
        'price' => 'float',
        'is_active' => 'boolean',
        'is_available' => 'boolean',
        'archived_at' => 'datetime',
        'track_stock' => 'boolean',
        'stock_quantity' => 'integer',
        'low_stock_threshold' => 'integer',
        'stock_updated_at' => 'datetime',
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

    /**
     * Get the stock logs for the product.
     */
    public function stockLogs()
    {
        return $this->hasMany(StockLog::class);
    }

    /**
     * Get the notifications for the product.
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Check if product has sufficient stock.
     */
    public function hasStock(int $quantity): bool
    {
        if (! $this->track_stock) {
            return true;
        }

        return $this->stock_quantity !== null && $this->stock_quantity >= $quantity;
    }

    /**
     * Check if product is sold out.
     */
    public function isSoldOut(): bool
    {
        return $this->track_stock && $this->stock_quantity === 0;
    }

    /**
     * Check if product has low stock.
     */
    public function isLowStock(): bool
    {
        if (! $this->track_stock || $this->stock_quantity === null) {
            return false;
        }

        return $this->stock_quantity > 0 && $this->stock_quantity <= $this->low_stock_threshold;
    }

    /**
     * Check if product is available for purchase.
     */
    public function isAvailableForPurchase(): bool
    {
        // If not tracking stock, rely on is_available toggle
        if (! $this->track_stock) {
            return $this->is_available;
        }

        // If sold out, not available
        if ($this->stock_quantity === 0) {
            return false;
        }

        // If has stock but manually disabled
        return $this->is_available;
    }
}
