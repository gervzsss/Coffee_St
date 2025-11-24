<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\InquiryThread;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'completed')->sum('total_amount');
        $totalProducts = Product::count();
        $totalUsers = User::where('is_admin', false)->count();

        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->user->first_name . ' ' . $order->user->last_name,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                ];
            });

        $pendingInquiries = InquiryThread::with('user')
            ->whereIn('status', ['pending', 'open'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($inquiry) {
                return [
                    'id' => $inquiry->id,
                    'subject' => $inquiry->subject,
                    'user_name' => $inquiry->user->first_name . ' ' . $inquiry->user->last_name,
                    'status' => $inquiry->status,
                ];
            });

        return response()->json([
            'totalOrders' => $totalOrders,
            'totalRevenue' => number_format($totalRevenue, 2, '.', ''),
            'totalProducts' => $totalProducts,
            'totalUsers' => $totalUsers,
            'recentOrders' => $recentOrders,
            'pendingInquiries' => $pendingInquiries,
        ]);
    }
}
