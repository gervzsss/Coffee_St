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

        $threads = $query->latest()->get()->map(function ($thread) {
            return [
                'id' => $thread->id,
                'subject' => $thread->subject,
                'user_name' => $thread->user->first_name . ' ' . $thread->user->last_name,
                'user_email' => $thread->user->email,
                'status' => $thread->status,
                'messages_count' => $thread->messages_count,
                'created_at' => $thread->created_at,
            ];
        });

        return response()->json($threads);
    }

    public function show($id)
    {
        $thread = InquiryThread::with(['user', 'messages'])->findOrFail($id);
        return response()->json($thread);
    }

    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $thread = InquiryThread::findOrFail($id);

        $message = ThreadMessage::create([
            'inquiry_thread_id' => $thread->id,
            'user_id' => auth()->id(),
            'message' => $request->message,
            'is_admin' => true,
        ]);

        return response()->json($message, 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:open,pending,resolved,closed',
        ]);

        $thread = InquiryThread::findOrFail($id);
        $thread->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Thread status updated successfully',
            'thread' => $thread,
        ]);
    }
}
