<?php

require_once __DIR__ . "/../components/nav-active.php";

use function App\Helpers\is_authenticated;
use function App\Helpers\current_user;

$authenticatedUser = current_user();
?>

<nav class="bg-white shadow-sm fixed w-full z-50 border-b border-gray-100">
  <div class="relative flex justify-between items-center h-20 md:h-24 px-4 sm:px-6">
    <div class="md:absolute left-4 sm:left-6 md:left-12 lg:left-24 xl:left-32 flex items-center gap-4 sm:gap-6">
      <!-- Brand -->
      <a href="/COFFEE_ST/public/index.php" class="flex items-center gap-6">
        <img src="/COFFEE_ST/public/assets/stcoffeelogo.png" alt="Coffee St. Logo"
          class="h-12 w-12 md:h-16 md:w-16 object-contain" />
        <span
          class="font-outfit text-3xl sm:text-4xl md:text-[48px] font-bold text-[#30442B] tracking-tight leading-none transition-all duration-300 hover:text-[#30442B] hover:tracking-normal">
          Coffee St.
        </span>
      </a>
    </div>

    <!-- Navigation Links -->
    <div class="hidden md:flex items-center ml-[440px]">
      <div class="flex items-center space-x-14">
        <a href="/COFFEE_ST/public/index.php" class="group relative px-4 py-2.5">
          <span class="relative z-10 text-[22px] font-outfit font-semibold tracking-wide transition-all duration-300 ease-out transform group-hover:-translate-y-0.5 group-hover:tracking-wider <?php echo isActive(
            "index.php",
          )
            ? "text-[#30442B]"
            : "text-gray-800 group-hover:text-[#30442B]"; ?>">Home</span>
          <span class="absolute inset-0 h-full w-full bg-[#30442B]/5 rounded-lg -z-0 transform scale-95 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 <?php echo isActive(
            "index.php",
          )
            ? "opacity-100 scale-100"
            : ""; ?>"></span>
          <span class="absolute left-0 -bottom-1 h-0.5 w-full bg-[#30442B] transform origin-left scale-x-0 transition-all duration-300 ease-out group-hover:scale-x-100 <?php echo isActive(
            "index.php",
          )
            ? "scale-x-100"
            : ""; ?>"></span>
        </a>
        <a href="/COFFEE_ST/public/pages/products.php" class="group relative px-4 py-2.5">
          <span class="relative z-10 text-[24px] font-outfit font-medium transition-all duration-300 ease-in-out <?php echo isActive(
            "products.php",
          )
            ? "text-[#30442B] font-semibold"
            : "text-gray-800 group-hover:text-[#30442B]"; ?>">Menu</span>
          <span class="absolute inset-0 h-full w-full bg-[#30442B]/5 rounded-lg -z-0 transform scale-95 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100 <?php echo isActive(
            "products.php",
          )
            ? "opacity-100 scale-100"
            : ""; ?>"></span>
          <span class="absolute left-0 -bottom-1 h-0.5 w-full bg-[#30442B] transform origin-left scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100 <?php echo isActive(
            "products.php",
          )
            ? "scale-x-100"
            : ""; ?>"></span>
        </a>
        <a href="/COFFEE_ST/public/pages/about.php" class="group relative px-4 py-2.5">
          <span class="relative z-10 text-[24px] font-outfit font-medium transition-all duration-300 ease-in-out <?php echo isActive(
            "about.php",
          )
            ? "text-[#30442B] font-semibold"
            : "text-gray-800 group-hover:text-[#30442B]"; ?>">About</span>
          <span class="absolute inset-0 h-full w-full bg-[#30442B]/5 rounded-lg -z-0 transform scale-95 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100 <?php echo isActive(
            "about.php",
          )
            ? "opacity-100 scale-100"
            : ""; ?>"></span>
          <span class="absolute left-0 -bottom-1 h-0.5 w-full bg-[#30442B] transform origin-left scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100 <?php echo isActive(
            "about.php",
          )
            ? "scale-x-100"
            : ""; ?>"></span>
        </a>
        <a href="/COFFEE_ST/public/pages/contact.php" class="group relative px-4 py-2.5">
          <span class="relative z-10 text-[24px] font-outfit font-medium transition-all duration-300 ease-in-out <?php echo isActive(
            "contact.php",
          )
            ? "text-[#30442B] font-semibold"
            : "text-gray-800 group-hover:text-[#30442B]"; ?>">Contact</span>
          <span class="absolute inset-0 h-full w-full bg-[#30442B]/5 rounded-lg -z-0 transform scale-95 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100 <?php echo isActive(
            "contact.php",
          )
            ? "opacity-100 scale-100"
            : ""; ?>"></span>
          <span class="absolute left-0 -bottom-1 h-0.5 w-full bg-[#30442B] transform origin-left scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100 <?php echo isActive(
            "contact.php",
          )
            ? "scale-x-100"
            : ""; ?>"></span>
        </a>
      </div>
    </div>

    <!-- Right Side Elements -->
    <div class="flex items-center gap-8">
      <!-- Search Box -->
      <div class="hidden md:flex items-center relative group">
        <input type="text" placeholder="Search..."
          class="w-52 h-11 pl-12 pr-4 rounded-full bg-white border-2 border-gray-200/80 text-[#30442B] placeholder-gray-400 font-outfit text-[15px] tracking-wide transition-all duration-300 ease-out focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/10 group-hover:border-[#30442B]" />
        <button
          class="absolute left-4 text-gray-400 transition-all duration-300 ease-out group-hover:text-[#30442B] group-focus-within:text-[#30442B] transform group-hover:scale-110 group-hover:rotate-12"
          aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      <!-- Cart -->
      <a href="/COFFEE_ST/public/pages/cart.php" class="relative flex items-center gap-2 group">
        <div
          class="relative flex items-center gap-2.5 py-2 px-4 rounded-full transition-all duration-300 ease-out bg-transparent hover:bg-[#30442B]/5">
          <svg xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 transition-all duration-300 ease-out text-gray-700 group-hover:text-[#30442B] transform group-hover:scale-110 group-hover:-rotate-6"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span
            class="hidden md:inline font-outfit text-[18px] tracking-wide text-gray-700 group-hover:text-[#30442B] transition-all duration-300 ease-out transform group-hover:translate-x-0.5">Cart</span>
          <span
            class="cart-count absolute -top-2 -right-1 bg-[#30442B] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transition-all duration-300 ease-out group-hover:ring-4 group-hover:ring-[#30442B]/20 group-hover:scale-110 group-hover:-translate-y-0.5">0</span>
        </div>
      </a>

      <!-- Authentication -->
      <?php if ($authenticatedUser): ?>
        <div class="hidden md:flex items-center gap-3">
          <span class="font-outfit text-[18px] font-medium text-[#30442B]">Hi,
            <?php echo htmlspecialchars(
              $authenticatedUser["first_name"] ?? "Guest",
            ); ?>!</span>
          <a href="/COFFEE_ST/public/pages/orders.php" class="font-outfit text-[16px] text-[#30442B] underline">My
            Orders</a>
          <a id="inbox-link" href="/COFFEE_ST/public/pages/inbox.php"
            class="font-outfit text-[16px] text-[#30442B] underline ml-4">Inbox</a>
          <button id="logout-button" type="button"
            class="cursor-pointer inline-flex items-center px-6 py-2.5 font-outfit text-[16px] font-medium tracking-wide border-2 border-[#30442B] text-white bg-[#30442B] rounded-full transition duration-300 hover:bg-[#3d5a38] focus:outline-none focus:ring-4 focus:ring-[#30442B]/30">
            Logout
          </button>
        </div>
      <?php else: ?>
        <a id="open-login" href="#login-modal" data-open-login="login"
          class="hidden md:inline-flex items-center px-8 py-2.5 font-outfit text-[18px] font-medium tracking-wide border-2 border-[#30442B] text-[#30442B] rounded-full overflow-hidden relative transition-all duration-300 ease-out hover:text-white hover:border-[#30442B]/80 hover:shadow-xl group transform hover:-translate-y-0.5">
          <span
            class="relative z-10 transform transition-transform duration-300 ease-out group-hover:translate-x-1">Login</span>
          <div
            class="absolute inset-0 bg-[#30442B] transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100">
          </div>
        </a>
      <?php endif; ?>

      <!-- Mobile Menu Button -->
      <button id="mobile-menu-button" class="md:hidden text-black hover:text-[#30442B] transition-colors duration-200"
        aria-label="Toggle menu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Menu -->
  <div id="mobile-menu" class="hidden md:hidden pb-8 px-6 bg-white border-t border-gray-100">
    <!-- Mobile Search -->
    <div class="pt-6 pb-4">
      <div class="relative group">
        <input type="text" placeholder="Search..."
          class="w-full h-12 pl-12 pr-4 rounded-full bg-white border-2 border-gray-100 text-gray-700 placeholder-gray-400 font-outfit text-base transition-all duration-300 ease-in-out focus:border-[#30442B] focus:outline-none focus:ring-2 focus:ring-[#30442B]/10 group-hover:border-[#30442B]/30" />
        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-300 ease-in-out group-hover:text-[#30442B] group-focus-within:text-[#30442B] transform group-hover:scale-110"
          aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Links -->
    <div class="flex flex-col space-y-6 pt-4">
      <a href="/COFFEE_ST/public/index.php" class="relative text-[24px] font-outfit transition-all duration-300 ease-in-out py-2 group <?php echo isActive(
        "index.php",
      )
        ? "text-[#30442B] font-semibold"
        : "text-black hover:text-[#30442B]"; ?>">
        <span class="relative z-10 transition-all duration-300">Home</span>
        <span class="absolute inset-0 h-full w-full bg-[#30442B]/5 rounded-lg transform scale-95 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 <?php echo isActive(
          "index.php",
        )
          ? "opacity-100 scale-100"
          : ""; ?>"></span>
      </a>
      <a href="/COFFEE_ST/public/pages/products.php" class="relative text-[24px] font-outfit transition-all duration-300 ease-in-out py-2 group <?php echo isActive(
        "products.php",
      )
        ? "text-[#30442B] font-semibold"
        : "text-black hover:text-[#30442B]"; ?>">
        <span class="relative z-10 transition-all duration-300">Menu</span>
        <span class="absolute inset-0 h-full w-full bg-[#30442B]/5 rounded-lg transform scale-95 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 <?php echo isActive(
          "products.php",
        )
          ? "opacity-100 scale-100"
          : ""; ?>"></span>
      </a>
      <a href="/COFFEE_ST/public/pages/about.php" class="relative text-[24px] font-outfit transition-all duration-300 ease-in-out py-2 group <?php echo isActive(
        "about.php",
      )
        ? "text-[#30442B] font-semibold"
        : "text-black hover:text-[#30442B]"; ?>">
        <span class="relative z-10 transition-all duration-300">About</span>
        <span class="absolute inset-0 h-full w-full bg-[#30442B]/5 rounded-lg transform scale-95 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 <?php echo isActive(
          "about.php",
        )
          ? "opacity-100 scale-100"
          : ""; ?>"></span>
      </a>
      <a href="/COFFEE_ST/public/pages/contact.php" class="relative text-[24px] font-outfit transition-all duration-300 ease-in-out py-2 group <?php echo isActive(
        "contact.php",
      )
        ? "text-[#30442B] font-semibold"
        : "text-black hover:text-[#30442B]"; ?>">
        <span class="relative z-10 transition-all duration-300">Contact</span>
        <span class="absolute inset-0 h-full w-full bg-[#30442B]/5 rounded-lg transform scale-95 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 <?php echo isActive(
          "contact.php",
        )
          ? "opacity-100 scale-100"
          : ""; ?>"></span>
      </a>
      <div class="pt-4">
        <?php if ($authenticatedUser): ?>
          <div class="flex flex-col gap-4">
            <span class="font-outfit text-xl text-[#30442B]">Logged in as
              <?php echo htmlspecialchars(
                $authenticatedUser["email"],
              ); ?></span>
            <button id="logout-button-mobile" type="button"
              class="cursor-pointer inline-flex items-center justify-center w-full px-7 py-3 font-outfit text-[20px] font-medium text-white bg-[#30442B] border-2 border-[#30442B] rounded-full transition duration-300 hover:bg-[#3d5a38] focus:outline-none focus:ring-4 focus:ring-[#30442B]/30">
              Logout
            </button>
          </div>
        <?php else: ?>
          <a href="#login-modal" data-open-login="login"
            class="inline-flex items-center justify-center w-full px-7 py-3 font-outfit text-[20px] font-medium border-2 border-[#30442B] text-[#30442B] rounded-full overflow-hidden relative transition-all duration-300 ease-in-out hover:text-white group">
            <span class="relative z-10 transform transition-transform duration-300 group-hover:translate-x-1">Login</span>
            <div
              class="absolute inset-0 bg-[#30442B] transform scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100">
            </div>
          </a>
        <?php endif; ?>
      </div>
    </div>
  </div>
</nav>

<!-- Scroll Progress Bar -->
<div class="fixed top-0 left-0 w-full h-0.5 z-50">
  <div id="scroll-progress" class="h-full bg-[#30442B] w-0 transition-all duration-300 rounded-full"></div>
</div>

<script>
  window.__isAuthenticated = <?php echo json_encode((bool) $authenticatedUser); ?>;

  window.IS_AUTH = window.__isAuthenticated;

  window.__openLoginSelector = '[data-open-login="login"]';

</script>