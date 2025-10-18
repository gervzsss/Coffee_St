<?php
// Products Page Main Content Partial

if (!defined("BASE_PATH")) {
  define("BASE_PATH", dirname(__DIR__, 2));
}

require_once BASE_PATH . "/src/repositories/ProductRepository.php";

$productRepository = new ProductRepository(db());
$products = $productRepository->getAllActive();
?>

<!-- Header Section with Search -->
<div class="w-full bg-[#30442B] py-6">
  <div class="container mx-auto px-4">
    <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 class="text-2xl font-bold text-white md:text-3xl">
          Discover Our Menu
        </h1>
        <p class="text-sm text-gray-200 md:text-base">
          Find something that suits your taste
        </p>
      </div>
      <!-- Search Input -->
      <div class="relative w-full md:w-96">
        <input type="text" id="product-search"
          class="w-full rounded-xl border border-white/20 bg-white/10 py-3 pr-4 pl-12 text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-white/50 focus:outline-none"
          placeholder="Search our menu..." />
        <svg class="absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2 transform text-white/70" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  </div>
</div>

<!-- Main Content Area -->
<div class="container mx-auto px-4 py-8">
  <div class="flex flex-col gap-8 lg:flex-row">
    <!-- Category Sidebar -->
    <div class="mb-8 w-full lg:mb-0 lg:w-80 xl:w-96">
      <nav
        class="rounded-xl border border-gray-100 bg-white p-6 shadow-xl lg:sticky lg:top-28 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto">
        <!-- Drinks Section -->
        <div class="mb-12 space-y-8">
          <div class="mb-4">
            <button
              class="category-btn group flex w-full cursor-pointer items-center rounded-xl bg-[#30442B]/5 px-6 py-5 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-[#30442B]/5 hover:text-[#30442B]"
              data-category="all">
              <span class="category-label flex items-center gap-4">
                <span class="category-icon">🌟</span>
                <span class="category-text">All Products</span>
              </span>
            </button>
          </div>
          <h3 class="mb-6 px-2 text-3xl font-bold text-[#30442B]">Drinks</h3>
          <div class="space-y-4">
            <button
              class="category-btn group flex w-full cursor-pointer items-center rounded-xl px-6 py-4 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-[#30442B]/5 hover:text-[#30442B]"
              data-category="hot-coffee">
              <span class="category-label flex items-center gap-4">
                <span class="category-icon">☕</span>
                <span class="category-text">Hot Coffee</span>
              </span>
            </button>
            <button
              class="category-btn group flex w-full cursor-pointer items-center rounded-xl px-6 py-4 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-[#30442B]/5 hover:text-[#30442B]"
              data-category="iced-coffee">
              <span class="category-label flex items-center gap-4">
                <span class="category-icon">🧊</span>
                <span class="category-text">Iced Coffee</span>
              </span>
            </button>
            <button
              class="category-btn group flex w-full cursor-pointer items-center rounded-xl px-6 py-4 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-[#30442B]/5 hover:text-[#30442B]"
              data-category="frappe">
              <span class="category-label flex items-center gap-4">
                <span class="category-icon">🥤</span>
                <span class="category-text">Frappe</span>
              </span>
            </button>
            <button
              class="category-btn group flex w-full cursor-pointer items-center rounded-xl px-6 py-4 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-[#30442B]/5 hover:text-[#30442B]"
              data-category="non-coffee">
              <span class="category-label flex items-center gap-4">
                <span class="category-icon">🍵</span>
                <span class="category-text">Non-Coffee</span>
              </span>
            </button>
          </div>
        </div>

        <!-- Divider -->
        <div class="h-px bg-gray-200"></div>

        <!-- Pastries Section -->
        <div class="space-y-6">
          <h3 class="mb-6 px-2 text-3xl font-bold text-[#30442B]">
            Pastries & Desserts
          </h3>
          <div class="space-y-4">
            <button
              class="category-btn group flex w-full cursor-pointer items-center rounded-xl px-6 py-4 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-[#30442B]/5 hover:text-[#30442B]"
              data-category="pastries">
              <span class="category-label flex items-center gap-4">
                <span class="category-icon">🥐</span>
                <span class="category-text">Pastries</span>
              </span>
            </button>
            <button
              class="category-btn group flex w-full cursor-pointer items-center rounded-xl px-6 py-4 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-[#30442B]/5 hover:text-[#30442B]"
              data-category="cakes">
              <span class="category-label flex items-center gap-4">
                <span class="category-icon">🍰</span>
                <span class="category-text">Cakes</span>
              </span>
            </button>
            <button
              class="category-btn group flex w-full cursor-pointer items-center rounded-xl px-6 py-4 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-[#30442B]/5 hover:text-[#30442B]"
              data-category="buns">
              <span class="category-label flex items-center gap-4">
                <span class="category-icon">🥖</span>
                <span class="category-text">Buns</span>
              </span>
            </button>
          </div>
        </div>

        <!-- Mobile Indicator -->
        <div class="text-center text-sm text-gray-400 lg:hidden">
          <span>Scroll horizontally to see more categories →</span>
        </div>
      </nav>
    </div>

    <!-- Products Grid -->
    <div class="flex-1">
      <div class="products-equal-rows grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3" id="products-grid">
        <?php if (empty($products)): ?>
          <div
            class="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#30442B]/30 bg-white/70 py-20 text-center">
            <p class="text-xl font-semibold text-[#30442B]">
              Products coming soon.
            </p>
            <p class="mt-2 text-sm text-neutral-500">
              Please check back later while we brew something special.
            </p>
          </div>
        <?php else: ?>
          <?php foreach ($products as $product): ?>
            <div
              class="product-card group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              data-category="<?php echo htmlspecialchars(
                $product->category,
              ); ?>" data-id="<?php echo (int) $product->id; ?>">
              <div class="relative h-72 overflow-hidden bg-[#30442B]">
                <div class="absolute inset-0 flex items-center justify-center p-8">
                  <img src="<?php echo htmlspecialchars($product->image); ?>"
                    alt="<?php echo htmlspecialchars($product->name); ?>"
                    class="max-h-48 w-auto transform drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
                    loading="lazy" />
                </div>
                <div
                  class="absolute inset-0 bg-gradient-to-t from-[#30442B]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                </div>
              </div>
              <div class="flex flex-1 flex-col bg-white p-6">
                <div class="mb-2">
                  <h3 class="font-playfair text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-[#30442B]">
                    <?php echo htmlspecialchars($product->name); ?>
                  </h3>
                </div>
                <p class="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
                  <?php echo htmlspecialchars($product->description); ?>
                </p>
                <div class="mt-auto flex items-center justify-between pt-2">
                  <span class="text-xl font-semibold text-[#30442B]">₱<?php echo number_format($product->price, 2); ?></span>
                  <button
                    class="add-to-cart flex cursor-pointer items-center gap-2 rounded-full bg-[#30442B] px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#405939]"
                    data-product-id="<?php echo (int) $product->id; ?>">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>