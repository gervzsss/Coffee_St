<?php
// Products Page Main Content Partial
?>

<!-- Header Section with Search -->
<div class="w-full bg-[#30442B] py-6">
  <div class="container mx-auto px-4">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-white">Discover Our Menu</h1>
        <p class="text-gray-200 text-sm md:text-base">Find something that suits your taste</p>
      </div>
      <!-- Search Input -->
      <div class="relative w-full md:w-96">
        <input type="text" id="product-search"
          class="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
          placeholder="Search our menu..." />
        <svg class="w-6 h-6 text-white/70 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none"
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
  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Category Sidebar -->
    <div class="w-full lg:w-80 xl:w-96 mb-8 lg:mb-0">
      <nav
        class="lg:sticky lg:top-28 bg-white rounded-xl shadow-xl p-6 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto border border-gray-100">
        <!-- Drinks Section -->
        <div class="space-y-8 mb-12">
          <div class="mb-4"> <!-- All Products moved above the Drinks header -->
            <button
              class="cursor-pointer category-btn group w-full flex items-center px-6 py-5 rounded-xl transition-all duration-300 hover:bg-[#30442B]/5 text-gray-700 hover:text-[#30442B] bg-[#30442B]/5"
              data-category="all">
              <span class="flex items-center gap-4 category-label">
                <span class="category-icon">🌟</span>
                <span class="category-text">All Products</span>
              </span>
            </button>
          </div>
          <h3 class="text-[#30442B] font-bold text-3xl px-2 mb-6">Drinks</h3>
          <div class="space-y-4">
            <button
              class="cursor-pointer category-btn group w-full flex items-center px-6 py-4 rounded-xl transition-all duration-300 hover:bg-[#30442B]/5 text-gray-700 hover:text-[#30442B]"
              data-category="hot-coffee">
              <span class="flex items-center gap-4 category-label">
                <span class="category-icon">☕</span>
                <span class="category-text">Hot Coffee</span>
              </span>
            </button>
            <button
              class="cursor-pointer category-btn group w-full flex items-center px-6 py-4 rounded-xl transition-all duration-300 hover:bg-[#30442B]/5 text-gray-700 hover:text-[#30442B]"
              data-category="iced-coffee">
              <span class="flex items-center gap-4 category-label">
                <span class="category-icon">🧊</span>
                <span class="category-text">Iced Coffee</span>
              </span>
            </button>
            <button
              class="cursor-pointer category-btn group w-full flex items-center px-6 py-4 rounded-xl transition-all duration-300 hover:bg-[#30442B]/5 text-gray-700 hover:text-[#30442B]"
              data-category="frappe">
              <span class="flex items-center gap-4 category-label">
                <span class="category-icon">🥤</span>
                <span class="category-text">Frappe</span>
              </span>
            </button>
            <button
              class="cursor-pointer category-btn group w-full flex items-center px-4 py-2 text-sm transition-all duration-300 hover:bg-[#30442B]/5 text-gray-600 hover:text-[#30442B]"
              data-category="non-coffee">
              <span class="flex items-center gap-3 category-label">
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
          <h3 class="text-[#30442B] font-bold text-2xl px-2 mb-6">Pastries & Desserts</h3>
          <div class="space-y-4">
            <button
              class="cursor-pointer category-btn group w-full flex items-center px-6 py-4 rounded-xl transition-all duration-300 hover:bg-[#30442B]/5 text-gray-700 hover:text-[#30442B]"
              data-category="pastries">
              <span class="flex items-center gap-3 category-label">
                <span class="category-icon">🥐</span>
                <span class="category-text">Pastries</span>
              </span>
            </button>
            <button
              class="cursor-pointer category-btn group w-full flex items-center px-4 py-2 text-sm transition-all duration-300 hover:bg-[#30442B]/5 text-gray-600 hover:text-[#30442B]"
              data-category="cakes">
              <span class="flex items-center gap-3 category-label">
                <span class="category-icon">🍰</span>
                <span class="category-text">Cakes</span>
              </span>
            </button>
            <button
              class="cursor-pointer category-btn group w-full flex items-center px-4 py-2 text-sm transition-all duration-300 hover:bg-[#30442B]/5 text-gray-600 hover:text-[#30442B]"
              data-category="buns">
              <span class="flex items-center gap-3 category-label">
                <span class="category-icon">🥖</span>
                <span class="category-text">Buns</span>
              </span>
            </button>
          </div>
        </div>

        <!-- Mobile Indicator -->
        <div class="lg:hidden text-sm text-gray-400 text-center">
          <span>Scroll horizontally to see more categories →</span>
        </div>
      </nav>
    </div>

    <!-- Products Grid -->
    <div class="flex-1">
      <div class="grid products-equal-rows grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" id="products-grid">
        <?php
        $products = [
          // Hot Coffee
          [
            'category' => 'hot-coffee',
            'name' => 'Classic Espresso',
            'description' => 'Rich and smooth espresso shot with perfect crema',
            'price' => 3.99,
            'image' => '/COFFEE_ST/public/assets/americano.png'
          ],
          [
            'category' => 'hot-coffee',
            'name' => 'Cappuccino',
            'description' => 'Rich espresso with steamed milk and silky foam',
            'price' => 4.99,
            'image' => '/COFFEE_ST/public/assets/cafe_late.png'
          ],
          [
            'category' => 'hot-coffee',
            'name' => 'Caramel Macchiato',
            'description' => 'Espresso with vanilla syrup and caramel drizzle',
            'price' => 5.49,
            'image' => '/COFFEE_ST/public/assets/americano.png'
          ],
          // Iced Coffee
          [
            'category' => 'iced-coffee',
            'name' => 'Classic Cold Brew',
            'description' => 'Smooth, slow-steeped cold coffee blend',
            'price' => 4.99,
            'image' => '/COFFEE_ST/public/assets/cafe_late.png'
          ],
          [
            'category' => 'iced-coffee',
            'name' => 'Iced Americano',
            'description' => 'Chilled espresso with cold water and ice',
            'price' => 4.49,
            'image' => '/COFFEE_ST/public/assets/americano.png'
          ],
          // Frappe
          [
            'category' => 'frappe',
            'name' => 'Caramel Frappuccino',
            'description' => 'Blended coffee with caramel and whipped cream',
            'price' => 5.99,
            'image' => '/COFFEE_ST/public/assets/javachip.png'
          ],
          [
            'category' => 'frappe',
            'name' => 'Mocha Frappuccino',
            'description' => 'Rich chocolate and coffee blend with whipped cream',
            'price' => 5.99,
            'image' => '/COFFEE_ST/public/assets/javachip.png'
          ],
          // Non-Coffee
          [
            'category' => 'non-coffee',
            'name' => 'Green Tea Latte',
            'description' => 'Premium matcha green tea with steamed milk',
            'price' => 4.99,
            'image' => '/COFFEE_ST/public/assets/cafe_late.png'
          ],
          [
            'category' => 'non-coffee',
            'name' => 'Hot Chocolate',
            'description' => 'Rich Belgian chocolate with steamed milk',
            'price' => 4.49,
            'image' => '/COFFEE_ST/public/assets/americano.png'
          ],
          // Pastries
          [
            'category' => 'pastries',
            'name' => 'Butter Croissant',
            'description' => 'Flaky, buttery croissant baked fresh daily',
            'price' => 3.49,
            'image' => '/COFFEE_ST/public/assets/cinammon.png'
          ],
          [
            'category' => 'pastries',
            'name' => 'Chocolate Muffin',
            'description' => 'Rich chocolate muffin with chocolate chips',
            'price' => 3.99,
            'image' => '/COFFEE_ST/public/assets/javachip.png'
          ],
          [
            'category' => 'cakes',
            'name' => 'New York Cheesecake',
            'description' => 'Classic creamy cheesecake with graham crust',
            'price' => 6.99,
            'image' => '/COFFEE_ST/public/assets/cafe_late.png'
          ],
          [
            'category' => 'buns',
            'name' => 'Cinnamon Roll',
            'description' => 'Freshly baked with cream cheese frosting',
            'price' => 4.49,
            'image' => '/COFFEE_ST/public/assets/cinammon.png'
          ],
        ];

        foreach ($products as $product) {
          echo '
          <div class="product-card group bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg" data-category="' . $product['category'] . '">
            <div class="relative h-72 bg-[#30442B] overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center p-8">
                <img src="' . $product['image'] . '" alt="' . $product['name'] . '" class="max-h-48 w-auto transition-transform duration-500 transform group-hover:scale-110 drop-shadow-xl" loading="lazy" />
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-[#30442B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-6 bg-white relative">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-gray-800 group-hover:text-[#30442B] transition-colors duration-300">' . $product['name'] . '</h3>
                <span class="text-xl font-bold text-[#30442B]">$' . number_format($product['price'], 2) . '</span>
              </div>
              <p class="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">' . $product['description'] . '</p>
              <button class="cursor-pointer w-full px-6 py-3 bg-[#30442B] text-white text-sm font-medium rounded-xl transition-all duration-300 hover:bg-[#30442B]/90 hover:shadow-md active:transform active:scale-95 group-hover:shadow-lg add-to-cart">
                Add to Cart
              </button>
            </div>
          </div>';
        }
        ?>
      </div>
    </div>
  </div>
</div>