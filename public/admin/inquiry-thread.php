<?php
require_once __DIR__ . "/../../src/config/bootstrap.php";
require_once __DIR__ . "/../../src/includes/admin-auth-guard.php";
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Inquiry Thread — Coffee St.</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css" />
</head>

<body class="antialiased bg-gray-50/50 text-slate-800">
  <?php include_once __DIR__ . "/../../src/includes/admin-navbar.php"; ?>
  <main class="max-w-4xl mx-auto my-12 bg-white rounded-2xl shadow-sm border border-gray-100">
    <?php include __DIR__ . "/../../src/views/admin/inquiry-thread.php"; ?>
  </main>
  <script src="/COFFEE_ST/src/resources/jquery-3.7.1.min.js"></script>
</body>

</html>