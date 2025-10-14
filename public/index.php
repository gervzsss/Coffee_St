<?php
$title = 'Coffee St. - Your Premium Coffee Destination';
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
  <?php include __DIR__ . '/../src/includes/header.php'; ?>

  <main class="mx-auto max-w-5xl px-4 py-28">
    <section id="home" class="mb-12">
      <h2 class="text-4xl md:text-5xl font-bold text-[#30442B]">Welcome to Coffee St.</h2>
      <p class="mt-4 text-neutral-700">Your cozy corner for freshly brewed coffee and pastries.</p>
    </section>

    <section id="menu-section" class="mb-12">
      <h3 class="text-2xl font-semibold">Today’s Picks</h3>
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article class="rounded-lg border bg-white p-6 shadow-sm">
          <h4 class="text-lg font-medium">Espresso</h4>
          <p class="mt-2 text-sm text-neutral-600">Rich and bold, a classic shot.</p>
        </article>
        <article class="rounded-lg border bg-white p-6 shadow-sm">
          <h4 class="text-lg font-medium">Latte</h4>
          <p class="mt-2 text-sm text-neutral-600">Smooth espresso with steamed milk.</p>
        </article>
        <article class="rounded-lg border bg-white p-6 shadow-sm">
          <h4 class="text-lg font-medium">Cappuccino</h4>
          <p class="mt-2 text-sm text-neutral-600">Espresso, milk, and a foamy top.</p>
        </article>
      </div>
    </section>
  </main>

  <?php include __DIR__ . '/../src/includes/footer.php'; ?>

  <script src="/COFFEE_ST/src/resources/jquery-3.7.1.min.js"></script>
  <script src="/COFFEE_ST/src/resources/js/app.js"></script>
</body>

</html>