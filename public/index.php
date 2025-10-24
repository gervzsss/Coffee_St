<?php
require_once __DIR__ . "/../src/config/bootstrap.php";
$title = "Coffee St. - Your Premium Coffee Destination";
$year = date("Y");
?>

<?php include __DIR__ . "/../src/includes/head.php"; ?>

<link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
<script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>

<body class="min-h-screen bg-neutral-50 text-neutral-900 font-sans">

  <?php require_once __DIR__ . "/../src/includes/header.php"; ?>

  <main class="pt-20 md:pt-24">

    <?php include __DIR__ . "/../src/includes/hero.php"; ?>

    <?php include __DIR__ . "/../src/views/featured-products.php"; ?>

    <?php include __DIR__ . "/../src/views/split-screen.php"; ?>

    <?php include __DIR__ . "/../src/views/benefits-grid.php"; ?>

  </main>

  <?php require_once __DIR__ . "/../src/includes/footer.php"; ?>

  <?php include __DIR__ . "/../src/components/modals/auth-modals.php"; ?>

  <script src="/COFFEE_ST/src/resources/js/home.js" defer></script>

  <script src="/COFFEE_ST/src/resources/js/cart.js" defer></script>

  <?php include __DIR__ . "/../src/includes/user-scripts.php"; ?>

</body>

</html>