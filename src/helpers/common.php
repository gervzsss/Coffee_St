<?php
declare(strict_types=1);

namespace App\Helpers;

function db(): \PDO
{
  static $pdo = null;
  if ($pdo === null) {
    $config = require __DIR__ . '/../config/config.php';
    $db = $config['db'] ?? [];
    // Defensive check: ensure credentials are present; helps catch missing bootstrap/.env early
    $username = $db['username'] ?? '';
    $password = $db['password'] ?? '';
    $database = $db['database'] ?? '';
    $host = $db['host'] ?? '127.0.0.1';
    $port = $db['port'] ?? '3306';
    $charset = $db['charset'] ?? 'utf8mb4';
    if ($username === '' || $database === '') {
      throw new \RuntimeException(
        'Database configuration is missing (DB_USERNAME and/or DB_DATABASE). Ensure src/config/bootstrap.php loads Dotenv and .env contains DB_* values.'
      );
    }
    $dsn = sprintf(
      'mysql:host=%s;port=%s;dbname=%s;charset=%s',
      $host,
      $port,
      $database,
      $charset
    );
    $pdo = new \PDO($dsn, $username, $password, $db['options'] ?? []);
  }
  return $pdo;
}

const AUTH_SESSION_KEY = 'auth_user';

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

function logout_user(): void
{
  if (session_status() === PHP_SESSION_ACTIVE) {
    session_regenerate_id(true);
  }
  unset($_SESSION[AUTH_SESSION_KEY]);
}

function is_authenticated(): bool
{
  return isset($_SESSION[AUTH_SESSION_KEY]['id']);
}

function current_user(): ?array
{
  return $_SESSION[AUTH_SESSION_KEY] ?? null;
}

const ADMIN_SESSION_KEY = 'admin_auth';

function admin_login(string $email, string $password): bool
{
  $config = require __DIR__ . '/../config/config.php';
  $admin = $config['admin'] ?? [];
  if ($email === ($admin['email'] ?? '') && password_verify($password, $admin['password_hash'] ?? '')) {
    if (session_status() === PHP_SESSION_ACTIVE) {
      session_regenerate_id(true);
    }
    $_SESSION[ADMIN_SESSION_KEY] = [
      'email' => $admin['email'] ?? $email,
      'logged_in' => true,
    ];
    return true;
  }
  return false;
}

function admin_logout(): void
{
  unset($_SESSION[ADMIN_SESSION_KEY]);
  if (session_status() === PHP_SESSION_ACTIVE) {
    session_regenerate_id(true);
  }
}

function is_admin_authenticated(): bool
{
  return isset($_SESSION[ADMIN_SESSION_KEY]['logged_in']) && $_SESSION[ADMIN_SESSION_KEY]['logged_in'] === true;
}
