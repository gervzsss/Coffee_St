<?php
$title = 'Cart - Coffee St.';
$year = date('Y');
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?php echo htmlspecialchars($title); ?></title>
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css" />
</head>

<body class="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
  <?php include __DIR__ . '/../../src/includes/header.php'; ?>

  <main class="mx-auto max-w-5xl px-4 py-28">
    <h1 class="text-3xl md:text-4xl font-bold text-[#30442B]">Your Cart</h1>
    <p class="mt-4 text-neutral-700">This is a placeholder for the shopping cart. Hook this up to PHP sessions or a
      database later.</p>

    <section class="mt-8 grid gap-6">
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <p class="text-neutral-600">No items in your cart yet.</p>
      </div>
      <div class="flex items-center gap-4">
        <a href="/COFFEE_ST/public/pages/products.php"
          class="inline-flex items-center px-5 py-2.5 border border-[#30442B] text-[#30442B] rounded-full font-medium hover:text-white hover:bg-[#30442B] transition">
          Continue Shopping
        </a>
        <button disabled
          class="inline-flex items-center px-5 py-2.5 bg-gray-300 text-gray-600 rounded-full font-medium cursor-not-allowed">
          Checkout (coming soon)
        </button>
      </div>
    </section>
  </main>

  <?php include __DIR__ . '/../../src/includes/footer.php'; ?>

  <?php include __DIR__ . '/../src/components/modals/auth-modals.php'; ?>

  <script src="/COFFEE_ST/src/resources/jquery-3.7.1.min.js"></script>
  <script src="/COFFEE_ST/src/resources/js/app.js"></script>
  <script src="/COFFEE_ST/src/resources/js/login-validation.js"></script>
</body>

</html>