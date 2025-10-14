<?php
$title = 'Contact - Coffee St.';
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

  <main class="mx-auto max-w-5xl px-4 py-28">
    <h1 class="text-3xl font-semibold text-[#30442B]">Contact (placeholder)</h1>
    <p class="mt-4 text-neutral-700">This is the contact page placeholder. Replace with contact form (POST via PHP) when
      ready.</p>
  </main>

  <?php include __DIR__ . '/../../src/includes/footer.php'; ?>

  <?php include __DIR__ . '/../../src/components/modals/auth-modals.php'; ?>

  <script src="/COFFEE_ST/src/resources/jquery-3.7.1.min.js"></script>
  <script src="/COFFEE_ST/src/resources/js/app.js"></script>
  <script src="/COFFEE_ST/src/resources/js/login-validation.js"></script>
</body>

</html>