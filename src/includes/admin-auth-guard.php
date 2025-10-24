<?php
if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 2));
}

require_once BASE_PATH . '/src/config/bootstrap.php';

use function App\Helpers\is_admin_authenticated;

if (!is_admin_authenticated()) {
  header('Location: /COFFEE_ST/public/admin/admin-login.php');
  exit;
}
