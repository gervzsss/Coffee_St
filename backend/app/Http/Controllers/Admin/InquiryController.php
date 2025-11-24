<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InquiryThread;
use App\Models\ThreadMessage;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
  public function index(Request $request)
  {
    $query = InquiryThread::with('user')->withCount('messages');

    if ($request->has('status') && $request->status !== 'all') {
      $query->where('status', $request->status);
    }

    $threads = $query->latest('last_message_at')->get()->map(function ($thread) {
      // Get the first message to display as the initial inquiry
      $firstMessage = $thread->messages()->oldest()->first();

      return [
        'id' => $thread->id,
        'subject' => $thread->subject,
        'user_name' => $thread->user ? ($thread->user->first_name . ' ' . $thread->user->last_name) : $thread->guest_name,
        'user_email' => $thread->user ? $thread->user->email : $thread->guest_email,
        'guest_name' => $thread->guest_name,
        'guest_email' => $thread->guest_email,
        'status' => $thread->status,
        'messages_count' => $thread->messages_count,
        'message' => $firstMessage ? $firstMessage->message : null,
        'latest_message' => $firstMessage ? $firstMessage->message : null,
        'created_at' => $thread->created_at,
        'updated_at' => $thread->updated_at,
        'last_message_at' => $thread->last_message_at,
      ];
    });

    return response()->json($threads);
  }

  public function show($id)
  {
    $thread = InquiryThread::with([
      'user',
      'messages' => function ($query) {
        $query->orderBy('created_at', 'asc');
      }
    ])->findOrFail($id);

    return response()->json([
      'id' => $thread->id,
      'subject' => $thread->subject,
      'status' => $thread->status,
      'user_name' => $thread->user ? ($thread->user->first_name . ' ' . $thread->user->last_name) : $thread->guest_name,
      'user_email' => $thread->user ? $thread->user->email : $thread->guest_email,
      'guest_name' => $thread->guest_name,
      'guest_email' => $thread->guest_email,
      'created_at' => $thread->created_at,
      'messages' => $thread->messages->map(function ($message) {
        return [
          'id' => $message->id,
          'message' => $message->message,
          'sender_type' => $message->sender_type,
          'sender_name' => $message->sender_name,
          'sender_email' => $message->sender_email,
          'created_at' => $message->created_at,
          'is_admin' => $message->sender_type === 'admin',
        ];
      }),
    ]);
  }

  public function sendMessage(Request $request, $id)
  {
    $request->validate([
      'message' => 'required|string|max:5000',
    ]);

    $thread = InquiryThread::findOrFail($id);
    $admin = auth()->user();

    $message = ThreadMessage::create([
      'thread_id' => $thread->id,
      'sender_type' => 'admin',
      'sender_id' => $admin->id,
      'sender_name' => $admin->first_name . ' ' . $admin->last_name,
      'sender_email' => $admin->email,
      'message' => $request->message,
      'created_at' => now(),
    ]);

    // Update thread's last message timestamp and status
    $thread->update([
      'last_message_at' => now(),
      'status' => 'responded',
      'admin_last_viewed_at' => now(),
    ]);

    return response()->json([
      'message' => 'Reply sent successfully',
      'data' => [
        'id' => $message->id,
        'message' => $message->message,
        'sender_type' => $message->sender_type,
        'sender_name' => $message->sender_name,
        'created_at' => $message->created_at,
        'is_admin' => true,
      ],
    ], 201);
  }

  public function updateStatus(Request $request, $id)
  {
    $request->validate([
      'status' => 'required|in:pending,responded,done,closed,archived',
    ]);

    $thread = InquiryThread::findOrFail($id);
    $thread->update(['status' => $request->status]);

    return response()->json([
      'message' => 'Thread status updated successfully',
      'thread' => $thread,
    ]);
  }
}
