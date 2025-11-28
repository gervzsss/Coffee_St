<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStatusLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'changed_by',
        'from_status',
        'to_status',
        'notes',
        'proof_url',
    ];

    /**
     * Get the order that this log belongs to.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the user who made the change.
     */
    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    /**
     * Alias for changedBy relationship
     */
    public function changedByUser()
    {
        return $this->changedBy();
    }
}
