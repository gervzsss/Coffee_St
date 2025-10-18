<!-- Featured Products Section -->
<section class="bg-white py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- Section Header -->
    <div class="mb-16 text-center">
      <h2 class="font-playfair mb-4 text-4xl font-bold text-[#30442B]">
        Featured Delights
      </h2>
      <p class="mx-auto max-w-2xl text-lg text-gray-600">
        Discover our handcrafted signature drinks and delectable treats
      </p>
    </div>
    <!-- Products Carousel -->
    <div class="featured-products-carousel relative">
      <div class="swiper-container overflow-hidden">
        <div class="swiper-wrapper">
          <!-- Product Card 1 -->
          <div class="swiper-slide p-4">
            <div
              class="group flex h-[420px] flex-col overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div class="relative shrink-0 bg-[#30442B] pt-4 pb-8">
                <div class="relative mx-auto h-48 w-48">
                  <img src="/COFFEE_ST/public/assets/cafe_late.png" alt="Caramel Latte"
                    class="h-full w-full rounded-lg object-contain transition-transform duration-500 group-hover:scale-105" />
                </div>
              </div>
              <div class="flex grow flex-col border-t border-gray-100 bg-white p-6">
                <h3 class="font-playfair mb-2 text-xl font-bold text-[#30442B]">
                  Caramel Latte
                </h3>
                <p class="mb-4 line-clamp-2 text-gray-600">
                  Rich espresso with steamed milk and caramel drizzle
                </p>
              </div>
            </div>
          </div>
          <!-- Product Card 2 -->
          <div class="swiper-slide p-4">
            <div
              class="group flex h-[420px] flex-col overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div class="relative shrink-0 bg-[#30442B] pt-4 pb-8">
                <div class="relative mx-auto h-48 w-48">
                  <img src="/COFFEE_ST/public/assets/cheesecake.png" alt="Blueberry Cheesecake"
                    class="h-full w-full rounded-lg object-contain transition-transform duration-500 group-hover:scale-105" />
                </div>
              </div>
              <div class="flex grow flex-col border-t border-gray-100 bg-white p-6">
                <h3 class="font-playfair mb-2 text-xl font-bold text-[#30442B]">
                  Blueberry Delight
                </h3>
                <p class="mb-4 line-clamp-2 text-gray-600">
                  Fresh blueberry parfait with vanilla cream
                </p>
              </div>
            </div>
          </div>
          <!-- Product Card 3 -->
          <div class="swiper-slide p-4">
            <div
              class="group flex h-[420px] flex-col overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div class="relative shrink-0 bg-[#30442B] pt-4 pb-8">
                <div class="relative mx-auto h-48 w-48">
                  <img src="/COFFEE_ST/public/assets/white_mocha.png" alt="Artisan Latte"
                    class="h-full w-full rounded-lg object-contain transition-transform duration-500 group-hover:scale-105" />
                </div>
              </div>
              <div class="flex grow flex-col border-t border-gray-100 bg-white p-6">
                <h3 class="font-playfair mb-2 text-xl font-bold text-[#30442B]">
                  Artisan Latte
                </h3>
                <p class="mb-4 line-clamp-2 text-gray-600">
                  Hand-crafted latte with signature leaf art design
                </p>
              </div>
            </div>
          </div>
          <!-- Product Card 4 -->
          <div class="swiper-slide p-4">
            <div
              class="group flex h-[420px] flex-col overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div class="relative shrink-0 bg-[#30442B] pt-4 pb-8">
                <div class="relative mx-auto h-48 w-48">
                  <img src="/COFFEE_ST/public/assets/cinammon.png" alt="Artisan Pastries"
                    class="h-full w-full rounded-lg object-contain transition-transform duration-500 group-hover:scale-105" />
                </div>
              </div>
              <div class="flex grow flex-col border-t border-gray-100 bg-white p-6">
                <h3 class="font-playfair mb-2 text-xl font-bold text-[#30442B]">
                  Almond Chocolate Croissant
                </h3>
                <p class="mb-4 line-clamp-2 text-gray-600">
                  Buttery croissant filled with chocolate and almonds
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Navigation Buttons -->
        <div class="absolute top-1/2 -left-4 z-10 -translate-y-1/2 transform">
          <button
            class="swiper-button-prev flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#30442B] shadow-lg transition-all duration-300 hover:bg-[#30442B] hover:text-white">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
        </div>
        <div class="absolute top-1/2 -right-4 z-10 -translate-y-1/2 transform">
          <button
            class="swiper-button-next flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#30442B] shadow-lg transition-all duration-300 hover:bg-[#30442B] hover:text-white">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Initialize Swiper -->
<script>
  $(function () {
    new Swiper(".swiper-container", {
      slidesPerView: 1,
      spaceBetween: 32,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  });
</script>