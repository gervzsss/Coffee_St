<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItemVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_item_id',
        'variant_id',
        'variant_group_name',
        'variant_name',
        'price_delta',
    ];

    protected $casts = [
        'price_delta' => 'float',
    ];

    /**
     * Get the cart item that owns the variant.
     */
    public function cartItem(): BelongsTo
    {
        return $this->belongsTo(CartItem::class);
    }

    /**
     * Get the product variant.
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }
}
