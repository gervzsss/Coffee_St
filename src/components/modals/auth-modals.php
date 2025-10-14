<?php
// Authentication modals shared across pages.
?>
<div id="modal-overlay"
  class="fixed inset-0 z-50 hidden items-center justify-center bg-neutral-950/70 px-4 py-10 sm:py-16 backdrop-blur-sm">
  <!-- Login Modal -->
  <div id="login-modal"
    class="modal-panel relative hidden w-full max-w-md overflow-hidden rounded-3xl bg-white text-neutral-900 shadow-[0_30px_80px_-35px_rgba(15,68,43,0.45)] ring-1 ring-neutral-200/70 transition duration-200">
    <div
      class="shadow-top pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white via-white/80 to-transparent opacity-0 transition-opacity duration-200">
    </div>
    <div
      class="shadow-bottom pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent opacity-0 transition-opacity duration-200">
    </div>
    <button id="close-login" type="button"
      class="cursor-pointer absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition duration-200 hover:bg-neutral-200 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#30442B]/50"
      aria-label="Close login modal">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M6 18L18 6" />
      </svg>
    </button>
    <div class="relative max-h-[85vh] overflow-y-auto px-6 py-10 sm:px-10">
      <div class="flex flex-col gap-8">
        <div class="space-y-3 text-center">
          <span
            class="mx-auto inline-flex items-center rounded-full bg-[#30442B]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#30442B]">
            Welcome back
          </span>
          <h2 class="font-outfit text-2xl font-semibold text-neutral-900 sm:text-3xl">Log in to Coffee St.</h2>
          <p class="text-sm text-neutral-500 sm:text-base">Access your saved drinks, track orders, and enjoy a
            personalized
            experience.</p>
        </div>
        <form id="login-form" class="space-y-6" autocomplete="off" novalidate>
          <div class="space-y-2">
            <label for="login-email" class="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Email address
            </label>
            <div class="relative">
              <input id="login-email" type="email" name="email" autocomplete="email"
                class="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                placeholder="name@example.com" />
            </div>
            <p data-error-for="login-email" class="hidden text-sm font-medium text-red-500"></p>
          </div>

          <div class="space-y-2">
            <label for="login-password" class="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Password
            </label>
            <div class="relative">
              <input id="login-password" type="password" name="password" autocomplete="current-password"
                class="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 pr-12 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                placeholder="Enter your password" />
              <button type="button"
                class="cursor-pointer password-toggle absolute inset-y-0 right-3 flex items-center justify-center rounded-full p-2 text-neutral-400 transition duration-200 hover:bg-neutral-100 hover:text-[#30442B] focus:outline-none focus:ring-2 focus:ring-[#30442B]/40"
                data-target="#login-password" aria-label="Toggle password visibility">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p data-error-for="login-password" class="hidden text-sm font-medium text-red-500"></p>
          </div>

          <div class="space-y-4">
            <button type="submit"
              class="cursor-pointer group inline-flex w-full items-center justify-center rounded-2xl bg-[#30442B] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#3d5a38] focus:outline-none focus:ring-4 focus:ring-[#30442B]/30">
              Log in
            </button>
            <button id="switch-to-signup" type="button"
              class="cursor-pointer w-full text-sm font-semibold uppercase tracking-[0.2em] text-[#30442B] transition hover:text-[#3d5a38]">
              No account yet? Create one
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Signup Modal (placeholder structure) -->
  <div id="signup-modal"
    class="modal-panel relative hidden w-full max-w-2xl overflow-hidden rounded-3xl bg-white text-neutral-900 shadow-[0_30px_80px_-35px_rgba(15,68,43,0.45)] ring-1 ring-neutral-200/70 transition duration-200">
    <div
      class="shadow-top pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white via-white/80 to-transparent opacity-0 transition-opacity duration-200">
    </div>
    <div
      class="shadow-bottom pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent opacity-0 transition-opacity duration-200">
    </div>
    <button id="close-signup" type="button"
      class="cursor-pointer absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition duration-200 hover:bg-neutral-200 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#30442B]/50"
      aria-label="Close signup modal">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M6 18L18 6" />
      </svg>
    </button>
    <div class="relative max-h-[85vh] overflow-y-auto px-6 py-10 sm:px-10">
      <div class="flex flex-col gap-8">
        <div class="space-y-3 text-center">
          <span
            class="mx-auto inline-flex items-center rounded-full bg-[#30442B]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#30442B]">
            Join the community
          </span>
          <h2 class="font-outfit text-2xl font-semibold text-neutral-900 sm:text-3xl">Create your Coffee St. account
          </h2>
          <p class="text-sm text-neutral-500 sm:text-base">Fill out the form to save your favourites and unlock
            exclusive
            offers.</p>
        </div>
        <form id="signup-form" class="space-y-6" autocomplete="off" novalidate>
          <div class="grid gap-5 sm:grid-cols-2">
            <div class="space-y-2">
              <label for="reg-first"
                class="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">First name</label>
              <input id="reg-first" type="text" name="first-name" autocomplete="given-name"
                class="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                placeholder="Jane" />
              <p data-error-for="reg-first" class="hidden text-sm font-medium text-red-500"></p>
            </div>
            <div class="space-y-2">
              <label for="reg-last" class="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Last
                name</label>
              <input id="reg-last" type="text" name="last-name" autocomplete="family-name"
                class="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                placeholder="Doe" />
              <p data-error-for="reg-last" class="hidden text-sm font-medium text-red-500"></p>
            </div>
          </div>

          <div class="space-y-2">
            <label for="reg-address"
              class="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Address</label>
            <input id="reg-address" type="text" name="address" autocomplete="street-address"
              class="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
              placeholder="123 Coffee Lane, City" />
            <p data-error-for="reg-address" class="hidden text-sm font-medium text-red-500"></p>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div class="space-y-2">
              <label for="reg-email"
                class="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Email address</label>
              <input id="reg-email" type="email" name="email" autocomplete="email"
                class="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                placeholder="name@example.com" />
              <p data-error-for="reg-email" class="hidden text-sm font-medium text-red-500"></p>
            </div>
            <div class="space-y-2">
              <label for="reg-phone"
                class="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Contact number</label>
              <input id="reg-phone" type="tel" name="phone" autocomplete="tel"
                class="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                placeholder="+63 900 000 0000" />
              <p data-error-for="reg-phone" class="hidden text-sm font-medium text-red-500"></p>
            </div>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div class="space-y-2">
              <label for="reg-pass"
                class="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Password</label>
              <input id="reg-pass" type="password" name="password" autocomplete="new-password"
                class="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                placeholder="Create a password" />
              <p data-error-for="reg-pass" class="hidden text-sm font-medium text-red-500"></p>
            </div>
            <div class="space-y-2">
              <label for="reg-pass-confirm"
                class="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Confirm password</label>
              <input id="reg-pass-confirm" type="password" name="password_confirmation" autocomplete="new-password"
                class="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                placeholder="Repeat password" />
              <p data-error-for="reg-pass-confirm" class="hidden text-sm font-medium text-red-500"></p>
            </div>
          </div>

          <div class="space-y-4">
            <button type="submit"
              class="cursor-pointer inline-flex w-full items-center justify-center rounded-2xl bg-[#30442B] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#3d5a38] focus:outline-none focus:ring-4 focus:ring-[#30442B]/30">
              Create account
            </button>
            <button id="switch-to-login" type="button"
              class="cursor-pointer w-full text-sm font-semibold uppercase tracking-[0.2em] text-[#30442B] transition hover:text-[#3d5a38]">
              Already registered? Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>