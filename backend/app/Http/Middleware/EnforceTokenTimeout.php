<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class EnforceTokenTimeout
{
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next): Response
  {
    $user = $request->user();
    $token = $request->user()->currentAccessToken();

    if (!$token) {
      return response()->json([
        'message' => 'Unauthenticated.',
        'reason' => 'token_invalid',
        'action' => 'relogin',
      ], 401);
    }

    // Determine if this is an admin or user request
    $isAdmin = $request->is('api/admin/*');
    $policy = $isAdmin ? config('auth_timeouts.admin') : config('auth_timeouts.user');

    $now = Carbon::now();

    // Check idle timeout
    $idleTimeoutMinutes = $policy['idle_timeout_minutes'];
    if ($idleTimeoutMinutes) {
      $lastUsedAt = $token->last_used_at ?? $token->created_at;
      $idleMinutes = $now->diffInMinutes($lastUsedAt);

      if ($idleMinutes >= $idleTimeoutMinutes) {
        // Token has been idle too long
        Log::info('Token idle timeout', [
          'user_id' => $user->id,
          'is_admin' => $isAdmin,
          'idle_minutes' => $idleMinutes,
          'threshold' => $idleTimeoutMinutes,
        ]);

        $token->delete();

        return response()->json([
          'message' => 'Session expired due to inactivity.',
          'reason' => 'idle_timeout',
          'action' => 'relogin',
        ], 401);
      }
    }

    // Check maximum lifetime (if configured)
    $maxLifetimeMinutes = $policy['max_lifetime_minutes'];
    if ($maxLifetimeMinutes) {
      $lifetimeMinutes = $now->diffInMinutes($token->created_at);

      if ($lifetimeMinutes >= $maxLifetimeMinutes) {
        // Token has exceeded maximum lifetime
        Log::info('Token max lifetime exceeded', [
          'user_id' => $user->id,
          'is_admin' => $isAdmin,
          'lifetime_minutes' => $lifetimeMinutes,
          'threshold' => $maxLifetimeMinutes,
        ]);

        $token->delete();

        return response()->json([
          'message' => 'Session expired. Please log in again.',
          'reason' => 'max_lifetime',
          'action' => 'relogin',
        ], 401);
      }
    }

    return $next($request);
  }
}
