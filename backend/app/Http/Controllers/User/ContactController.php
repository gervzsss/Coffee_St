<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;

use App\Models\InquiryThread;
use App\Models\ThreadMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Handle contact form submission
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:500',
            'message' => 'required|string|max:5000',
        ]);

        $user = Auth::user();

        // Create inquiry thread
        $thread = InquiryThread::create([
            'user_id' => $user?->id,
            'guest_email' => $user ? null : $validated['email'],
            'guest_name' => $user ? null : $validated['name'],
            'subject' => $validated['subject'],
            'status' => 'pending',
            'last_message_at' => now(),
        ]);

        // Create the initial message
        ThreadMessage::create([
            'thread_id' => $thread->id,
            'sender_type' => $user ? 'user' : 'guest',
            'sender_id' => $user?->id,
            'sender_name' => $validated['name'],
            'sender_email' => $validated['email'],
            'message' => $validated['message'],
            'created_at' => now(),
        ]);

        // Log the contact form submission
        Log::info('Contact form submission', [
            'thread_id' => $thread->id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
        ]);

        return response()->json([
            'message' => 'Thank you for contacting us! We will get back to you within 24 hours.',
            'thread_id' => $thread->id,
        ], 201);
    }
}
