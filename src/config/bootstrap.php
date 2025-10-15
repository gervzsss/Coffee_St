<?php
// Global bootstrap: loads Composer autoload, environment variables, and starts the session.

declare(strict_types=1);

if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 2));
}

$autoloadPath = BASE_PATH . '/vendor/autoload.php';
if (file_exists($autoloadPath)) {
  require_once $autoloadPath;
}

if (class_exists('Dotenv\\Dotenv')) {
  $dotenv = Dotenv\Dotenv::createImmutable(BASE_PATH);
  $dotenv->safeLoad();
}

// Default timezone (adjust as needed)
if (!ini_get('date.timezone')) {
  date_default_timezone_set($_ENV['APP_TIMEZONE'] ?? 'UTC');
}

// Harden PHP sessions for authentication flows.
if (session_status() === PHP_SESSION_NONE) {
  $cookieParams = session_get_cookie_params();
  $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_ENV['SESSION_SECURE_COOKIE'] ?? '0') === '1';

  session_set_cookie_params([
    'lifetime' => (int) ($_ENV['SESSION_LIFETIME'] ?? $cookieParams['lifetime'] ?? 0),
    'path' => $cookieParams['path'] ?? '/',
    'domain' => $cookieParams['domain'] ?? '',
    'secure' => $secure,
    'httponly' => true,
    'samesite' => $_ENV['SESSION_SAMESITE'] ?? 'Lax',
  ]);

  session_start();
}

require_once BASE_PATH . '/src/helpers/auth.php';
