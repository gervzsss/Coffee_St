<?php
// Always include bootstrap for session/config consistency.
// This loads environment, config, session, and helper functions.
require_once __DIR__ . '/../../src/config/bootstrap.php';
\App\Helpers\admin_logout();
header('Location: admin-login.php');
exit;
