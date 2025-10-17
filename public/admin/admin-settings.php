<?php
// Admin settings page
?>
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Settings — Coffee St.</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="antialiased bg-gray-50 text-slate-800">
  <?php include_once __DIR__ . "/../../src/includes/admin-navbar.php"; ?>

  <div class="main-content min-h-screen p-6 ml-64 transition-all duration-300 ease-in-out">
    <div class="max-w-screen-2xl mx-auto">
      <!-- Header -->
      <div
        class="admin-header bg-[#30442B] text-white rounded-2xl p-8 mb-8 transition-all duration-300 ease-in-out lg:mr-4">
        <h1 class="text-3xl md:text-4xl font-extrabold">Settings</h1>
        <p class="text-sm text-white/80 mt-2">Configure system settings and preferences</p>
      </div>

      <!-- Settings Sections -->
      <div class="grid grid-cols-1 gap-8">
        <!-- General Settings -->
        <div class="content-card bg-white rounded-xl shadow-lg p-8 transition-all duration-300 ease-in-out lg:mr-4">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">General Settings</h2>
          <form class="space-y-6">
            <!-- Add your settings form fields here -->
            <div class="flex justify-end">
              <button type="submit"
                class="px-6 py-2 bg-[#30442B] text-white rounded-lg hover:bg-[#22301e] transition-colors duration-300">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</body>

</html>