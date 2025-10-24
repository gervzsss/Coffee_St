<?php require_once __DIR__ . '/../../src/includes/admin-auth-guard.php'; ?>

<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Settings — Coffee St.</title>
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css" />
</head>

<body class="bg-gray-50 text-slate-800 antialiased">

  <?php include_once __DIR__ . "/../../src/includes/admin-navbar.php"; ?>

  <main class="main-content ml-64 min-h-screen p-6 transition-all duration-300 ease-in-out">
    <div class="mx-auto max-w-screen-2xl">
      <!-- Header -->
      <div
        class="admin-header mb-8 rounded-2xl bg-[#30442B] p-8 text-white transition-all duration-300 ease-in-out lg:mr-4">
        <h1 class="text-3xl font-extrabold md:text-4xl">Settings</h1>
        <p class="mt-2 text-sm text-white/80">
          Configure system settings and preferences
        </p>
      </div>

      <!-- Settings Sections -->
      <div class="grid grid-cols-1 gap-8">
        <!-- General Settings -->
        <div class="content-card rounded-xl bg-white p-8 shadow-lg transition-all duration-300 ease-in-out lg:mr-4">
          <h2 class="mb-6 text-xl font-semibold text-gray-800">
            General Settings
          </h2>
          <form class="space-y-6">
            <!-- Add your settings form fields here -->
            <div class="flex justify-end">
              <button type="submit"
                class="rounded-lg bg-[#30442B] px-6 py-2 text-white transition-colors duration-300 hover:bg-[#22301e]">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>

</body>

</html>