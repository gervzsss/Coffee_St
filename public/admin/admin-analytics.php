<?php require_once __DIR__ . '/../../src/includes/admin-auth-guard.php'; ?>

<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Analytics — Coffee St.</title>
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css" />
</head>

<body class="antialiased bg-gray-50 text-slate-800">

  <?php include_once __DIR__ . "/../../src/includes/admin-navbar.php"; ?>

  <div class="main-content min-h-screen p-6 ml-64 transition-all duration-300 ease-in-out">
    <div class="max-w-screen-2xl mx-auto">
      <!-- Header -->
      <div
        class="admin-header bg-[#30442B] text-white rounded-2xl p-8 mb-8 transition-all duration-300 ease-in-out lg:mr-4">
        <h1 class="text-3xl md:text-4xl font-extrabold">Analytics</h1>
        <p class="text-sm text-white/80 mt-2">View detailed business insights and reports</p>
      </div>

      <!-- Analytics Dashboard -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Sales Overview -->
        <div class="content-card bg-white rounded-xl shadow-lg p-8 transition-all duration-300 ease-in-out lg:mr-4">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">Sales Overview</h2>
          <!-- Add your analytics charts here -->
        </div>

        <!-- Customer Insights -->
        <div class="content-card bg-white rounded-xl shadow-lg p-8 transition-all duration-300 ease-in-out lg:mr-4">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">Customer Insights</h2>
          <!-- Add your customer analytics here -->
        </div>
      </div>
    </div>
  </div>

</body>

</html>