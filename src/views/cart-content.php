<h1 class="text-4xl font-extrabold text-[#30442B] mb-2">YOUR CART</h1>
<p class="text-neutral-600">Review your order and proceed to checkout</p>

<?php if (!$isAuthenticated): ?>
  <div class="mt-8 rounded-lg border bg-white p-6 shadow-sm">
    <p class="text-neutral-700">Please <a href="#login-modal" data-open-login="login"
        class="text-[#30442B] underline">login</a> to view your cart.</p>
  </div>
<?php else: ?>
  <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
    <!-- Items -->
    <section class="lg:col-span-2 space-y-4">
      <div class="rounded-lg border bg-white p-4 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <input type="checkbox" id="select-all" class="h-5 w-5 text-[#30442B]" checked />
          <span class="text-sm text-neutral-700">Select All Items
            (<?php echo array_sum(array_map(fn($i) => (int) ($i->quantity ?? 0), $items)); ?>)</span>
        </div>
        <button id="cart-remove-selected"
          class="inline-flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
          disabled>
          <span>🗑</span>
          Remove Selected
        </button>
      </div>

      <?php if (empty($items)): ?>
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <p class="text-neutral-600">No items in your cart yet.</p>
        </div>
      <?php else: ?>
        <?php foreach ($items as $it): ?>
          <?php $pid = (int) ($it['product_id'] ?? $it->product_id ?? 0);
          $p = isset($products[$pid]) ? (object) $products[$pid] : null; ?>
          <div class="rounded-lg border bg-white p-4 shadow-sm cart-item"
            data-product-id="<?php echo (int) ($it['product_id'] ?? $it->product_id ?? 0); ?>"
            data-unit-price="<?php echo (float) ($it['unit_price'] ?? $it->unit_price ?? 0); ?>"
            data-price-delta="<?php echo (float) ($it['price_delta'] ?? $it->price_delta ?? 0); ?>">
            <div class="flex items-center gap-3">
              <input type="checkbox" class="h-5 w-5 text-[#30442B] item-select" checked />
              <?php if (!empty($p?->image_url)): ?>
                <img src="<?php echo htmlspecialchars($p->image_url); ?>" alt="<?php echo htmlspecialchars($p?->name ?? ''); ?>"
                  class="h-20 w-20 object-cover rounded" />
              <?php else: ?>
                <div class="h-20 w-20 rounded bg-gray-200"></div>
              <?php endif; ?>
              <div class="flex-1">
                <div class="flex justify-between">
                  <h3 class="font-semibold text-lg"><?php echo htmlspecialchars($p?->name ?? ''); ?></h3>
                  <span
                    class="line-total font-semibold">₱<?php echo number_format(((float) ($it['unit_price'] ?? $it->unit_price ?? 0) + (float) ($it['price_delta'] ?? $it->price_delta ?? 0)) * (int) ($it['quantity'] ?? $it->quantity ?? 0), 2); ?></span>
                </div>
                <div class="mt-3 flex items-center gap-3"
                  data-product-id="<?php echo (int) ($it['product_id'] ?? $it->product_id ?? 0); ?>">
                  <button class="decrease-qty h-8 w-8 rounded-full border flex items-center justify-center"
                    aria-label="Decrease">−</button>
                  <input type="text" class="qty-input w-12 text-center border rounded"
                    value="<?php echo (int) ($it['quantity'] ?? $it->quantity ?? 0); ?>" />
                  <button class="increase-qty h-8 w-8 rounded-full border flex items-center justify-center"
                    aria-label="Increase">+</button>
                  <button class="remove-item text-red-600 text-sm flex items-center gap-1"><span>🗑</span>Remove</button>
                </div>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>
      <div class="flex items-center gap-4 pt-2">
        <a href="/COFFEE_ST/public/pages/products.php"
          class="inline-flex items-center px-5 py-2.5 border border-[#30442B] text-[#30442B] rounded-full font-medium hover:text-white hover:bg-[#30442B] transition">Continue
          Shopping</a>
      </div>
    </section>

    <!-- Summary -->
    <aside class="lg:col-span-1">
      <div class="rounded-lg border bg-white p-6 shadow-sm sticky top-28">
        <h2 class="text-lg font-semibold mb-4">Order Summary</h2>
        <dl class="space-y-2 text-sm">
          <div class="flex justify-between py-2 border-b">
            <dt>Subtotal</dt>
            <dd>₱<span id="summary-subtotal"><?php echo number_format($subtotal, 2); ?></span></dd>
          </div>
          <div class="flex justify-between py-2 border-b">
            <dt>Delivery Fee</dt>
            <dd>₱<span id="summary-delivery"><?php echo number_format($deliveryFee, 2); ?></span></dd>
          </div>
          <div class="flex justify-between py-2 border-b">
            <dt>Tax 8%</dt>
            <dd>₱<span id="summary-tax"><?php echo number_format($tax, 2); ?></span></dd>
          </div>
        </dl>
        <div class="flex justify-between items-center mt-4 text-lg font-semibold">
          <span>Total</span>
          <span>₱<span id="summary-total"><?php echo number_format($total, 2); ?></span></span>
        </div>
        <button id="proceed-checkout"
          class="cursor-pointer mt-6 w-full py-3 rounded bg-[#30442B] text-white hover:bg-[#3d5a38] transition">Proceed
          to Checkout</button>
        <p class="text-xs text-neutral-500 mt-3">Estimated delivery: 25-35 minutes</p>
      </div>
    </aside>
  </div>
<?php endif; ?>