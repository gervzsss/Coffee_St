<?php
require_once __DIR__ . '/../../src/config/bootstrap.php';

$title = 'Products - Coffee St.';
$year = date('Y');
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($title); ?></title>
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css">
</head>

<body class="font-poppins">

  <?php require_once __DIR__ . '/../../src/includes/header.php'; ?>

  <main class="pt-24 min-h-screen bg-white">

    <?php include __DIR__ . '/../../src/views/products-content.php'; ?>

  </main>

  <?php require_once __DIR__ . '/../../src/includes/footer.php'; ?>

  <?php include __DIR__ . '/../../src/components/modals/auth-modals.php'; ?>
  <?php include __DIR__ . '/../../src/components/modals/add-to-cart-modal.php'; ?>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"
    integrity="sha256-IZyGUneEXE1GB6LhCE2Pv9umTASEwAF/5HlhLSP7Klw=" crossorigin="anonymous"></script>
  <script src="/COFFEE_ST/src/resources/js/app.js"></script>
  <script src="/COFFEE_ST/src/resources/js/products.js"></script>
  <script src="/COFFEE_ST/src/resources/js/add-to-cart-modal.js"></script>
  <script src="/COFFEE_ST/src/resources/js/login-validation.js"></script>
  <script>
    $(function () {
      // Initialize cart count for logged-in users only
      if (window.IS_AUTH) {
        $.get('/COFFEE_ST/public/api/cart.php?action=get')
          .done(function (resp) { if (resp && resp.success) { $('.cart-count').text(resp.summary.count || 0); } })
          .fail(function () { /* ignore for guests */ });
      }
    });
  </script>
</body>

</html>