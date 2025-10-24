<?php require_once __DIR__ . '/../../src/includes/admin-auth-guard.php'; ?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Orders - Coffee Street</title>
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css" />
</head>

<body class="antialiased bg-gray-50 text-slate-800">

  <?php include "../../src/includes/admin-navbar.php"; ?>

  <?php include "../../src/views/admin/admin-order-info.php";

  renderAdminHeader();

  // Sample order data
  $orders = [
    [
      "id" => "ORD-1234",
      "status" => "Pending",
      "urgent" => true,
      "customer_name" => "John Doe",
      "time_ago" => "920756 min ago",
      "address" => "123 Main St, Apt 4B, New York, NY 10001",
      "total" => 12.0,
      "item_count" => 2,
      "note" => "Extra hot, no foam",
    ],
    [
      "id" => "ORD-1235",
      "status" => "Processing",
      "customer_name" => "Bob Johnson",
      "time_ago" => "15 min ago",
      "address" => "456 Oak Ave, Brooklyn, NY 11201",
      "total" => 18.0,
      "item_count" => 3,
      "note" => "Extra caramel drizzle on all drinks",
    ],
  ];

  foreach ($orders as $order) {
    renderOrderCard($order);
  }
  ?>

  </div>
  </div>
  </div>
  </div>

  <?php renderOrderModal(); ?>

  <?php include_once __DIR__ . '/../../src/includes/admin-scripts.php'; ?>

</body>

</html>