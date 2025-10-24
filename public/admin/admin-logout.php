<?php
require_once __DIR__ . '/../../src/config/bootstrap.php';
\App\Helpers\admin_logout();
header('Location: admin-login.php');
exit;
