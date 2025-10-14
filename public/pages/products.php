<?php
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

  <?php include __DIR__ . '/../../src/includes/header.php'; ?>

  <main class="pt-24 min-h-screen bg-white">

    <?php include __DIR__ . '/../../src/views/products-content.php'; ?>

  </main>

  <?php include __DIR__ . '/../../src/includes/footer.php'; ?>

  <script src="/COFFEE_ST/src/resources/jquery-3.7.1.min.js"></script>
  <script src="/COFFEE_ST/src/resources/js/app.js"></script>
  <script src="/COFFEE_ST/src/resources/js/products.js"></script>
</body>

</html>