<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InquiryThread extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'guest_email',
        'guest_name',
        'subject',
        'status',
        'last_message_at',
        'admin_last_viewed_at',
    ];

    protected $casts = [
        'status' => 'string',
        'last_message_at' => 'datetime',
        'admin_last_viewed_at' => 'datetime',
    ];

    /**
     * Get the user that owns the thread (if authenticated).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the messages for the thread.
     */
    public function messages()
    {
        return $this->hasMany(ThreadMessage::class, 'thread_id');
    }

    /**
     * Check if the thread is from a guest.
     */
    public function isGuest(): bool
    {
        return $this->user_id === null;
    }

    /**
     * Get the display name for the thread creator.
     */
    public function getCreatorNameAttribute(): string
    {
        if ($this->user) {
            return $this->user->first_name . ' ' . $this->user->last_name;
        }
        return $this->guest_name ?? 'Guest';
    }

    /**
     * Get the email for the thread creator.
     */
    public function getCreatorEmailAttribute(): string
    {
        return $this->user?->email ?? $this->guest_email ?? '';
    }
}
