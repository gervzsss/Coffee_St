<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\InquiryThread;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'delivered')->sum('total');
        $totalProducts = Product::count();
        $totalUsers = User::where('is_admin', false)->count();

        // Sales Overview (Last 7 Days)
        $salesOverview = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $sales = Order::whereDate('created_at', $date)
                ->whereNotIn('status', ['cancelled', 'failed'])
                ->sum('total');

            $salesOverview->push([
                'date' => Carbon::parse($date)->format('D'), // Mon, Tue, etc.
                'full_date' => $date,
                'total' => (float) $sales
            ]);
        }

        // Top Selling Products
        $topSelling = OrderItem::select('product_name', DB::raw('SUM(quantity) as total_quantity'))
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereNotIn('orders.status', ['cancelled', 'failed'])
            ->groupBy('product_name')
            ->orderByDesc('total_quantity')
            ->take(4)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->product_name,
                    'value' => (int) $item->total_quantity
                ];
            });

        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->user ? ($order->user->first_name . ' ' . $order->user->last_name) : 'Unknown',
                    'total' => $order->total,
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
                    'user_name' => $inquiry->user ? ($inquiry->user->first_name . ' ' . $inquiry->user->last_name) : 'Unknown',
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
            'salesOverview' => $salesOverview,
            'topSelling' => $topSelling,
        ]);
    }
}
