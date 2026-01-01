<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get all notifications (read and unread).
     */
    public function index(Request $request): JsonResponse
    {
        $limit = $request->query('limit', 50);
        $notifications = $this->notificationService->getAllNotifications($limit);

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    /**
     * Get unread notifications.
     */
    public function unread(): JsonResponse
    {
        $notifications = $this->notificationService->getUnreadNotifications();
        $count = $this->notificationService->getUnreadCount();

        return response()->json([
            'success' => true,
            'data' => [
                'notifications' => $notifications,
                'count' => $count,
            ],
        ]);
    }

    /**
     * Get unread notification count.
     */
    public function count(): JsonResponse
    {
        $count = $this->notificationService->getUnreadCount();

        return response()->json([
            'success' => true,
            'data' => [
                'count' => $count,
            ],
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(int $id): JsonResponse
    {
        $success = $this->notificationService->markAsRead($id);

        if (! $success) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(): JsonResponse
    {
        $count = $this->notificationService->markAllAsRead();

        return response()->json([
            'success' => true,
            'message' => "{$count} notifications marked as read",
            'data' => [
                'count' => $count,
            ],
        ]);
    }

    /**
     * Delete a notification.
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->notificationService->deleteNotification($id);

        if (! $success) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Notification deleted',
        ]);
    }

    /**
     * Delete old read notifications.
     */
    public function cleanup(Request $request): JsonResponse
    {
        $daysOld = $request->query('days', 30);
        $count = $this->notificationService->deleteOldNotifications($daysOld);

        return response()->json([
            'success' => true,
            'message' => "{$count} old notifications deleted",
            'data' => [
                'count' => $count,
            ],
        ]);
    }
}
