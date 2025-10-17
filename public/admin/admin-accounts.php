<?php
// Admin accounts management page
include_once __DIR__ . "/../../src/views/admin/admin-account-info.php"; ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Accounts Management — Coffee St.</title>
    <?php require_once __DIR__ . '/../../src/includes/admin-auth-guard.php'; ?>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
</head>

<body class="antialiased bg-gray-50/50 text-slate-800">
    <?php include_once __DIR__ . "/../../src/includes/admin-navbar.php"; ?>
    <?php renderAdminContent(); ?>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="../../src/resources/js/admin-account.js"></script>
</body>

</html>