<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     * Check if the authenticated user's account is blocked/restricted.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->status === 'restricted') {
            // Revoke the current token
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Your account has been blocked. Please contact support for assistance.',
            ], 403);
        }

        return $next($request);
    }
}
