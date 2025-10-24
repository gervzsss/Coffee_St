<?php
require_once __DIR__ . "/../../src/config/bootstrap.php";
$title = "Products - Coffee St.";
$year = date("Y");
?>

<?php include __DIR__ . "/../../src/includes/head.php"; ?>

<body class="font-poppins">

  <?php require_once __DIR__ . "/../../src/includes/header.php"; ?>

  <main class="pt-20 md:pt-24 min-h-screen bg-white">

    <?php include __DIR__ . "/../../src/views/products-content.php"; ?>

  </main>

  <?php require_once __DIR__ . "/../../src/includes/footer.php"; ?>

  <?php include __DIR__ . "/../../src/components/modals/auth-modals.php"; ?>

  <?php include __DIR__ . "/../../src/components/modals/add-to-cart-modal.php"; ?>

  <?php include __DIR__ . '/../../src/includes/user-scripts.php'; ?>

  <script src="/COFFEE_ST/src/resources/js/cart.js"></script>

  <script src="/COFFEE_ST/src/resources/js/products.js"></script>

</body>

</html>