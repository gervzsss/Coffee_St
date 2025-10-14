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

  <main class="pt-24">
    <!-- Hero -->
    <section class="relative h-screen">
      <!-- Hero Background overlay -->
      <div class="absolute inset-0 bg-black/40 z-10"></div>
      <div class="absolute inset-0">
        <img src="/COFFEE_ST/public/assets/home_head.png" alt="Coffee Shop" class="w-full h-full object-cover" />
      </div>

      <!-- Hero Content -->
      <div class="relative z-20 h-full flex items-center">
        <div class="max-w-2xl mx-auto ml-4 md:ml-12 lg:ml-24 xl:ml-32">
          <div class="text-left">
            <span
              class="inline-block bg-white/10 backdrop-blur-sm text-white px-6 py-2.5 rounded-full font-poppins text-sm mb-6 border border-white/20 tracking-wide uppercase">
              Welcome to Coffee St.
            </span>
            <h1
              class="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
              Experience the<br />
              <span class="text-[#d4b78f]">Art of Coffee</span>
            </h1>
            <p class="font-poppins text-base sm:text-lg md:text-xl text-white/90 mb-10 max-w-xl leading-relaxed tracking-wide">
              Discover our carefully curated selection of premium coffee beans and artisanal brews, crafted just for you.
            </p>
            <div class="flex flex-col sm:flex-row gap-5">
              <a href="/COFFEE_ST/public/pages/products.php"
                class="inline-flex items-center bg-[#30442B] text-white px-8 py-4 rounded-full hover:bg-[#3a533a] transition-all duration-300 transform hover:scale-105 shadow-lg font-poppins font-medium tracking-wide text-base">
                View Menu
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a href="/COFFEE_ST/public/pages/about.php"
                class="inline-flex items-center bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105 font-poppins font-medium tracking-wide text-base">
                About Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Today’s Picks -->
    <section id="menu-section" class="mx-auto max-w-5xl px-4 py-12">
      <h3 class="text-2xl font-semibold text-[#30442B]">Today’s Picks</h3>
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