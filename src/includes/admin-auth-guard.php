<?php
// src/includes/admin-auth-guard.php
// Redirect to admin-login if not authenticated
use function App\Helpers\is_admin_authenticated;
// ensure helpers loaded when guard is included standalone
if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 2));
}
require_once BASE_PATH . '/src/helpers/common.php';
if (!is_admin_authenticated()) {
  header('Location: /COFFEE_ST/public/admin/admin-login.php');
  exit;
}
