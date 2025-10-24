<?php

require_once __DIR__ . '/../../src/includes/admin-auth-guard.php';
include_once __DIR__ . "/../../src/views/admin/admin-account-info.php"; ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Accounts Management — Coffee St.</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css" />
</head>

<body class="antialiased bg-gray-50/50 text-slate-800">

    <?php include_once __DIR__ . "/../../src/includes/admin-navbar.php"; ?>

    <?php renderAdminContent(); ?>

    <?php include_once __DIR__ . '/../../src/includes/admin-scripts.php'; ?>

</body>

</html>