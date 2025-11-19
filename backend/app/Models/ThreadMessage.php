<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThreadMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'thread_id',
        'sender_type',
        'sender_id',
        'sender_name',
        'sender_email',
        'message',
    ];

    protected $casts = [
        'sender_type' => 'string',
        'created_at' => 'datetime',
    ];

    public $timestamps = false; // Only has created_at

    /**
     * Get the thread that owns the message.
     */
    public function thread()
    {
        return $this->belongsTo(InquiryThread::class, 'thread_id');
    }

    /**
     * Get the user who sent the message (if applicable).
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Check if the sender is an admin.
     */
    public function isFromAdmin(): bool
    {
        return $this->sender_type === 'admin';
    }

    /**
     * Check if the sender is a user.
     */
    public function isFromUser(): bool
    {
        return $this->sender_type === 'user';
    }

    /**
     * Check if the sender is a guest.
     */
    public function isFromGuest(): bool
    {
        return $this->sender_type === 'guest';
    }
}
