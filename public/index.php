<?php
require_once __DIR__ . "/../src/config/bootstrap.php";

$title = "Coffee St. - Your Premium Coffee Destination";
$year = date("Y");
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?php echo htmlspecialchars($title); ?></title>
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css" />
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"
    integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
  <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
</head>

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

  <script src="/COFFEE_ST/src/resources/js/app.js"></script>
  <script src="/COFFEE_ST/src/resources/js/home.js"></script>
  <script src="/COFFEE_ST/src/resources/js/add-to-cart-modal.js"></script>
  <script src="/COFFEE_ST/src/resources/js/login-validation.js"></script>

</body>

</html>