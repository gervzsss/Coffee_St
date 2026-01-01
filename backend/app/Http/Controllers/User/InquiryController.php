<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\InquiryThread;
use App\Models\ThreadMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InquiryController extends Controller
{
    /**
     * Get all inquiry threads for the authenticated user
     */
    public function index()
    {
        $user = Auth::user();

        // Get threads where user is authenticated OR threads created as guest with user's email
        $threads = InquiryThread::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->orWhere('guest_email', $user->email);
        })
            ->withCount('messages')
            ->latest('last_message_at')
            ->get();

        $threads = $threads->map(function ($thread) {
            $latestMessage = $thread->messages()->latest('created_at')->first();

            return [
                'id' => $thread->id,
                'subject' => $thread->subject,
                'status' => $thread->status,
                'messages_count' => $thread->messages_count,
                'latest_message' => $latestMessage ? $latestMessage->message : null,
                'latest_message_at' => $latestMessage ? $latestMessage->created_at : $thread->created_at,
                'created_at' => $thread->created_at,
                'updated_at' => $thread->updated_at,
            ];
        });

        return response()->json($threads);
    }

    /**
     * Get a single thread with all messages
     */
    public function show($id)
    {
        $user = Auth::user();

        // Allow access to threads owned by user OR created as guest with user's email
        $thread = InquiryThread::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->orWhere('guest_email', $user->email);
        })
            ->where('id', $id)
            ->with([
                'messages' => function ($query) {
                    $query->orderBy('created_at', 'asc');
                },
            ])
            ->firstOrFail();

        return response()->json([
            'id' => $thread->id,
            'subject' => $thread->subject,
            'status' => $thread->status,
            'created_at' => $thread->created_at,
            'messages' => $thread->messages->map(function ($message) {
                return [
                    'id' => $message->id,
                    'message' => $message->message,
                    'sender_type' => $message->sender_type,
                    'sender_name' => $message->sender_name,
                    'created_at' => $message->created_at,
                    'is_admin' => $message->sender_type === 'admin',
                ];
            }),
        ]);
    }

    /**
     * Send a reply message in a thread
     */
    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $user = Auth::user();

        // Allow replies to threads owned by user OR created as guest with user's email
        $thread = InquiryThread::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->orWhere('guest_email', $user->email);
        })
            ->where('id', $id)
            ->firstOrFail();

        // Create the message
        $message = ThreadMessage::create([
            'thread_id' => $thread->id,
            'sender_type' => 'user',
            'sender_id' => $user->id,
            'sender_name' => $user->first_name.' '.$user->last_name,
            'sender_email' => $user->email,
            'message' => $request->message,
            'created_at' => now(),
        ]);

        // Update thread's last message timestamp and link to user if it was a guest thread
        $thread->update([
            'user_id' => $user->id, // Link guest thread to user account
            'last_message_at' => now(),
            'status' => 'responded', // User responded, waiting for admin
        ]);

        return response()->json([
            'message' => 'Reply sent successfully',
            'data' => [
                'id' => $message->id,
                'message' => $message->message,
                'sender_type' => $message->sender_type,
                'sender_name' => $message->sender_name,
                'created_at' => $message->created_at,
                'is_admin' => false,
            ],
        ], 201);
    }
}
