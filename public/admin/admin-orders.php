<?php
require_once __DIR__ . '/../../src/includes/admin-auth-guard.php';
include_once __DIR__ . '/../../src/views/admin/admin-order-info.php';
require_once __DIR__ . '/../../src/controllers/AdminOrderController.php';
use App\Controllers\AdminOrderController;

$orders = AdminOrderController::getSampleOrders();
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Orders - Coffee Street</title>
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css" />
</head>

<body class="antialiased bg-gray-50 text-slate-800">

  <?php include __DIR__ . '/../../src/includes/admin-navbar.php'; ?>

  <?php renderAdminOrdersPage($orders); ?>

  <?php renderOrderModal(); ?>

  <?php include_once __DIR__ . '/../../src/includes/admin-scripts.php'; ?>

</body>

</html>