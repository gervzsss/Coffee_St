<?php
// src/includes/admin-auth-guard.php
// Redirect to admin-login if not authenticated
// Ensure environment, config and sessions are initialized for all admin pages

// Define BASE_PATH for consistent includes
if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 2));
}

// Always bootstrap first so Dotenv and config are loaded before any helper/DB usage
require_once BASE_PATH . '/src/config/bootstrap.php';

use function App\Helpers\is_admin_authenticated;

if (!is_admin_authenticated()) {
  header('Location: /COFFEE_ST/public/admin/admin-login.php');
  exit;
}
