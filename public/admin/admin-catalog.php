<?php require_once __DIR__ . '/../../src/includes/admin-auth-guard.php'; ?>
<?php
// Admin catalog management page
?>
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Catalog Management — Coffee St.</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="/src/resources/js/admin-catalog.js"></script>
</head>

<body class="antialiased bg-gray-50 text-slate-800">
  <?php include_once __DIR__ . "/../../src/includes/admin-navbar.php"; ?>

  <div class="main-content min-h-screen p-6 ml-64 transition-all duration-300 ease-in-out">
    <div class="max-w-screen-2xl mx-auto">
      <?php include_once __DIR__ .
        "/../../src/views/admin/admin-catalog-info.php"; ?>
    </div>
  </div>

  <?php include_once __DIR__ .
    "/../../src/components/modals/admin-catalog-modal.php"; ?>

</body>

</html>

<script src="../../src/resources/js/admin-catalog.js"></script>