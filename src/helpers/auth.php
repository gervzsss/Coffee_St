<?php
// Helper functions for authentication state management.

declare(strict_types=1);

const AUTH_SESSION_KEY = 'auth_user';

/**
 * Persist minimal user data in the session.
 */
function login_user(array $user): void
{
  if (session_status() === PHP_SESSION_ACTIVE) {
    session_regenerate_id(true);
  }
  $_SESSION[AUTH_SESSION_KEY] = [
    'id' => $user['id'] ?? null,
    'first_name' => $user['first_name'] ?? '',
    'last_name' => $user['last_name'] ?? '',
    'email' => $user['email'] ?? '',
  ];
}

/**
 * Remove any stored authentication data from the session.
 */
function logout_user(): void
{
  if (session_status() === PHP_SESSION_ACTIVE) {
    session_regenerate_id(true);
  }
  unset($_SESSION[AUTH_SESSION_KEY]);
}

/**
 * Determine if a visitor is authenticated.
 */
function is_authenticated(): bool
{
  return isset($_SESSION[AUTH_SESSION_KEY]['id']);
}

/**
 * Retrieve the current authenticated user payload.
 */
function current_user(): ?array
{
  return $_SESSION[AUTH_SESSION_KEY] ?? null;
}
