<?php
// public/admin/admin-logout.php
require_once __DIR__ . '/../../src/helpers/admin-auth.php';
admin_logout();
header('Location: admin-login.php');
exit;
