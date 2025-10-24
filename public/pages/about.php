<?php
require_once __DIR__ . '/../../src/config/bootstrap.php';
$title = 'About - Coffee St.';
$year = date('Y');
?>

<?php include __DIR__ . "/../../src/includes/head.php"; ?>

<body class="min-h-screen bg-neutral-50 font-poppins text-neutral-900">

  <?php require_once __DIR__ . '/../../src/includes/header.php'; ?>

  <main class="flex flex-col pt-20 md:pt-24">

    <?php include __DIR__ . '/../../src/views/about-info.php'; ?>

  </main>

  <?php require_once __DIR__ . '/../../src/includes/footer.php'; ?>

  <?php include __DIR__ . '/../../src/components/modals/auth-modals.php'; ?>

  <?php include __DIR__ . '/../../src/includes/user-scripts.php'; ?>

</body>

</html>