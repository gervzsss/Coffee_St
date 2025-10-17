<?php
require_once '../../src/config/bootstrap.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Orders - Coffee Street</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="antialiased bg-gray-50 text-slate-800">
    <!-- Include Admin Navbar -->
    <?php include '../../src/includes/admin-navbar.php'; ?>

    <?php
    include '../../src/views/admin/admin-order-info.php';
    renderAdminHeader();
                    
                    // Sample order data (In a real application, this would come from a database)
                    $orders = [
                        [
                            'id' => 'ORD-1234',
                            'status' => 'Pending',
                            'urgent' => true,
                            'customer_name' => 'John Doe',
                            'time_ago' => '920756 min ago',
                            'address' => '123 Main St, Apt 4B, New York, NY 10001',
                            'total' => 12.00,
                            'item_count' => 2,
                            'note' => 'Extra hot, no foam'
                        ],
                        [
                            'id' => 'ORD-1235',
                            'status' => 'Processing',
                            'customer_name' => 'Bob Johnson',
                            'time_ago' => '15 min ago',
                            'address' => '456 Oak Ave, Brooklyn, NY 11201',
                            'total' => 18.00,
                            'item_count' => 3,
                            'note' => 'Extra caramel drizzle on all drinks'
                        ]
                    ];

                    // Render each order card
                    foreach ($orders as $order) {
                        renderOrderCard($order);
                    }
                ?>
                </div>
            </div>
        </div>
    </div>

    <?php renderOrderModal(); ?>
    
    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="../../src/resources/js/admin-order.js"></script>
    <script src="../../src/resources/js/admin-navbar.js"></script>
</body>
</html>
