<?php
// Add to Cart Modal — matches admin/auth modal look and feel
?>
<div id="atc-overlay"
  class="fixed inset-0 z-[60] hidden items-center justify-center bg-neutral-950/70 px-4 py-10 sm:py-16 backdrop-blur-sm">
  <div id="atc-modal"
    class="modal-panel relative w-full max-w-lg overflow-hidden rounded-3xl bg-white text-neutral-900 shadow-[0_30px_80px_-35px_rgba(15,68,43,0.45)] ring-1 ring-neutral-200/70 transition duration-200">
    <button type="button"
      class="cursor-pointer absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition duration-200 hover:bg-neutral-200 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#30442B]/50"
      data-atc="close" aria-label="Close add to cart modal">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M6 18L18 6" />
      </svg>
    </button>

    <div class="relative max-h-[80vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 pt-6 sm:px-8">
        <div class="text-xs font-semibold uppercase tracking-[0.2em] text-[#30442B]/80" data-atc="category">&nbsp;</div>
        <h3 class="mt-1 text-2xl font-bold text-neutral-900" data-atc="name">&nbsp;</h3>
        <p class="mt-1 text-sm text-neutral-500 leading-relaxed" data-atc="description">&nbsp;</p>
      </div>

      <!-- Body -->
      <div class="px-6 pb-4 sm:px-8">
        <!-- Price Row -->
        <div class="mt-4 flex items-center gap-4">
          <div class="text-2xl font-extrabold text-[#30442B]" data-atc="price">$0.00</div>
          <div class="text-sm text-neutral-500">Base price • updates with add‑ons</div>
        </div>

        <!-- Image Centered -->
        <div class="mt-5 flex items-center justify-center">
          <img data-atc="image" src="" alt="" class="max-h-40 sm:max-h-44 w-auto object-contain drop-shadow-lg" />
        </div>

        <!-- Variants / Add-ons (optional, dynamic) -->
        <div class="mt-5 space-y-3" data-atc="addons-wrap" hidden>
          <div class="text-sm font-semibold text-neutral-700">Customize your drink</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" data-atc="addons"></div>
        </div>

        <!-- Quantity -->
        <div class="mt-5 space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Quantity</label>
          <div class="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-2 py-1">
            <button type="button"
              class="cursor-pointer h-9 w-9 rounded-xl text-lg font-bold text-neutral-700 hover:bg-neutral-100"
              data-atc="qty-dec" aria-label="Decrease quantity">−</button>
            <input type="text" value="1" class="w-14 text-center font-semibold text-neutral-900 focus:outline-none"
              data-atc="qty" />
            <button type="button"
              class="cursor-pointer h-9 w-9 rounded-xl text-lg font-bold text-neutral-700 hover:bg-neutral-100"
              data-atc="qty-inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="border-t border-neutral-200 bg-white px-6 py-5 sm:px-8">
        <div class="flex items-center justify-end gap-3">
          <button type="button"
            class="cursor-pointer inline-flex items-center justify-center rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-700 transition hover:bg-neutral-100"
            data-atc="cancel">Cancel</button>
          <button type="button"
            class="cursor-pointer inline-flex items-center justify-center rounded-2xl bg-[#30442B] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#3d5a38]"
            data-atc="add">Add to Cart</button>
          <button type="button"
            class="cursor-pointer inline-flex items-center justify-center rounded-2xl bg-[#30442B] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#3d5a38]"
            data-atc="checkout">Direct Checkout</button>
        </div>
      </div>

      <!-- Hidden state holders -->
      <input type="hidden" data-atc="product-id" value="" />
      <input type="hidden" data-atc="base-price" value="0" />
    </div>
  </div>
</div>