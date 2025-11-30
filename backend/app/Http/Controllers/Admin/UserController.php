<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get customer metrics for the dashboard
     */
    public function metrics()
    {
        $totalCustomers = User::where('is_admin', false)->count();
        $activeUsers = User::where('is_admin', false)->where('status', 'active')->count();
        $bannedUsers = User::where('is_admin', false)->where('status', 'restricted')->count();

        return response()->json([
            'total_customers' => $totalCustomers,
            'active_users' => $activeUsers,
            'banned_users' => $bannedUsers,
        ]);
    }

    /**
     * Get list of customers with search and filter
     */
    public function index(Request $request)
    {
        $query = User::where('is_admin', false)
            ->withCount('orders')
            ->withSum('orders', 'total');

        // Search by name, email, or phone
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', '%' . $search . '%')
                  ->orWhere('last_name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('phone', 'like', '%' . $search . '%');
            });
        }

        // Filter by status
        if ($request->has('status') && !empty($request->status) && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $users = $query->orderBy('created_at', 'desc')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name) ?: 'N/A',
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => $user->status ?? 'active',
                'orders_count' => $user->orders_count,
                'total_spent' => $user->orders_sum_total ?? 0,
                'failed_orders_count' => $user->failed_orders_count ?? 0,
                'created_at' => $user->created_at,
            ];
        });

        return response()->json($users);
    }

    /**
     * Get detailed user information
     */
    public function show($id)
    {
        $user = User::with(['orders' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }])->withCount('orders')->withSum('orders', 'total')->findOrFail($id);

        // Calculate warnings based on failed/cancelled orders
        $failedOrders = $user->orders->where('status', 'cancelled')->count();
        $warningText = $failedOrders > 0 ? "{$failedOrders} Failed Orders" : 'None';

        return response()->json([
            'id' => $user->id,
            'name' => trim($user->first_name . ' ' . $user->last_name) ?: 'N/A',
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'phone' => $user->phone,
            'status' => $user->status ?? 'active',
            'orders_count' => $user->orders_count,
            'total_spent' => $user->orders_sum_total ?? 0,
            'failed_orders_count' => $user->failed_orders_count ?? 0,
            'warnings' => $warningText,
            'has_warnings' => $failedOrders > 0,
            'created_at' => $user->created_at,
            'status_changed_at' => $user->status_changed_at,
        ]);
    }

    /**
     * Update user status (block/unblock)
     */
    public function updateStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($user->is_admin) {
            return response()->json([
                'message' => 'Cannot change status of admin users'
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:active,restricted',
        ]);

        $user->update([
            'status' => $validated['status'],
            'status_changed_at' => now(),
        ]);

        // Revoke all tokens when user is blocked to force logout
        if ($validated['status'] === 'restricted') {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => 'User status updated successfully',
            'user' => [
                'id' => $user->id,
                'status' => $user->status,
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:120',
            'last_name' => 'sometimes|string|max:120',
            'email' => 'sometimes|email|unique:users,email,' . $id,
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->is_admin) {
            return response()->json([
                'message' => 'Cannot delete admin users'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
}
