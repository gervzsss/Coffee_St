<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserProfileController extends Controller
{
  public function recentOrders(Request $request): JsonResponse
  {
    $orders = Order::where('user_id', $request->user()->id)
      ->with(['items.product', 'items.variant'])
      ->orderBy('created_at', 'desc')
      ->take(4)
      ->get();

    $formattedOrders = $orders->map(function ($order) {
      return [
        'id' => $order->id,
        'order_number' => '#' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
        'items_summary' => $this->formatItemsSummary($order->items),
        'status' => $order->status,
        'total' => $order->total_amount,
        'created_at' => $order->created_at->diffForHumans(),
        'created_at_full' => $order->created_at->toDateTimeString(),
      ];
    });

    return response()->json($formattedOrders);
  }

  public function updateProfile(Request $request): JsonResponse
  {
    $validated = $request->validate([
      'first_name' => 'required|string|max:120',
      'last_name' => 'required|string|max:120',
      'phone' => 'nullable|string|max:50',
    ]);

    $user = $request->user();
    $user->update($validated);

    return response()->json([
      'message' => 'Profile updated successfully',
      'user' => $user->fresh(),
    ]);
  }

  public function updatePassword(Request $request): JsonResponse
  {
    $validated = $request->validate([
      'current_password' => 'required|string',
      'new_password' => 'required|string|min:6|confirmed',
    ]);

    $user = $request->user();

    if (!Hash::check($validated['current_password'], $user->password)) {
      throw ValidationException::withMessages([
        'current_password' => ['The current password is incorrect.'],
      ]);
    }

    $user->update([
      'password' => Hash::make($validated['new_password']),
    ]);

    $currentTokenId = $request->user()->currentAccessToken()->id;
    $user->tokens()->where('id', '!=', $currentTokenId)->delete();

    return response()->json([
      'message' => 'Password updated successfully',
    ]);
  }

  public function updateLanguage(Request $request): JsonResponse
  {
    $validated = $request->validate([
      'language' => 'required|string|in:en',
    ]);

    $user = $request->user();
    $user->update(['language_preference' => $validated['language']]);

    return response()->json([
      'message' => 'Language preference updated',
      'language' => $validated['language'],
    ]);
  }

  public function softDelete(Request $request): JsonResponse
  {
    $validated = $request->validate([
      'confirmation' => 'required|string|in:DELETE',
    ]);

    $user = $request->user();

    $user->tokens()->delete();

    $user->delete();

    return response()->json([
      'message' => 'Account deleted successfully. You can contact support within 30 days for restoration.',
    ]);
  }

  private function formatItemsSummary($items): string
  {
    if ($items->isEmpty()) {
      return 'No items';
    }

    $summary = [];
    foreach ($items->take(2) as $item) {
      $summary[] = $item->quantity . 'x ' . $item->product->name;
    }

    if ($items->count() > 2) {
      $remaining = $items->count() - 2;
      $summary[] = "+ {$remaining} more";
    }

    return implode(', ', $summary);
  }
}
