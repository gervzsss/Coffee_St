<?php
// public/admin/admin-logout.php
require_once __DIR__ . '/../../src/helpers/common.php';
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}
\App\Helpers\admin_logout();
header('Location: admin-login.php');
exit;
