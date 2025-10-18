<?php
require_once __DIR__ . '/../../src/helpers/admin-auth.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = $_POST['email'] ?? '';
  $password = $_POST['password'] ?? '';
  if (admin_login($email, $password)) {
    header('Location: admin-dashboard.php');
    exit;
  } else {
    $error = 'Invalid admin credentials.';
  }
}
?>
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Admin Login — Coffee St.</title>
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css" />
</head>

<body class="antialiased bg-black">
  <main class="relative min-h-screen w-full">
    <!-- Background Image with Overlay -->
    <div
      class="absolute inset-0 bg-[url('/COFFEE_ST/public/assets/admin/AdminLogin.png')] bg-cover bg-center scale-x-[-1]">
      <div class="absolute inset-0 bg-black/60"></div>
    </div>

    <!-- Content Container -->
    <div class="relative min-h-screen flex items-center justify-end">
      <!-- Login Form Container -->
      <div class="w-full max-w-2xl mx-auto lg:mr-24 px-8 py-12 lg:py-0">
        <div class="rounded-3xl p-8 lg:p-12">
          <!-- Logo and Header -->
          <div class="text-center mb-14">
            <h1 class="text-7xl font-black text-white drop-shadow-lg tracking-tight mb-6">COFFEE ST.</h1>
            <p class="text-sm text-white/90 uppercase tracking-[0.25em] leading-relaxed drop-shadow">
              Welcome to the Admin Portal<br />
              — Please log in to continue.
            </p>
          </div>

          <!-- Login Form -->
          <form class="space-y-8" action="" method="POST">
            <?php if ($error): ?>
              <div class="bg-red-100 text-red-700 rounded-lg px-4 py-3 mb-4 text-center">
                <?= htmlspecialchars($error) ?>
              </div>
            <?php endif; ?>
            <!-- Email Field -->
            <div class="space-y-3">
              <label for="email" class="block text-xs text-white/90 font-medium uppercase tracking-widest">
                Email Address
              </label>
              <input type="email" id="email" name="email" placeholder="name@example.com"
                class="w-full px-6 py-4 bg-white/95 rounded-xl placeholder-gray-400 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#30442B]/60 transition-all duration-300"
                required />
            </div>

            <!-- Password Field -->
            <div class="space-y-3">
              <label for="password" class="block text-xs text-white/90 font-medium uppercase tracking-widest">
                Password
              </label>
              <input type="password" id="password" name="password" placeholder="Enter your password"
                class="w-full px-6 py-4 bg-white/95 rounded-xl placeholder-gray-400 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#30442B]/60 transition-all duration-300"
                required />
            </div>

            <!-- Login Button -->
            <button type="submit"
              class="w-full py-4 px-8 bg-[#30442B] hover:bg-[#22301e] rounded-xl text-white font-semibold tracking-widest uppercase text-sm transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#30442B]/30 mt-8 border border-transparent hover:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/60">
              Log In
            </button>

            <!-- Forgot Password Link -->
            <div class="text-center mt-8">
              <a href="#" class="text-sm text-white/70 hover:text-white transition-colors duration-300 tracking-wider">
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</body>

</html>