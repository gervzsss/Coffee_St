<?php
// Expects: $items, $user, $productRepo, $subtotal, $deliveryFee, $tax, $total
?>

<h1 class="text-3xl md:text-4xl font-bold text-[#30442B] mb-6">Checkout</h1>
<?php if (empty($items)): ?>
  <div class="rounded-lg border bg-white p-6 shadow-sm">
    <p class="text-neutral-700">Your cart is empty. <a href="/COFFEE_ST/public/pages/products.php"
        class="text-[#30442B] underline">Continue shopping</a>.</p>
  </div>
<?php else: ?>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
    <section class="space-y-4 md:col-span-2">
      <div class="rounded-lg border bg-white p-6 sm:p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Order Items</h2>
        <ul class="divide-y">
          <?php foreach ($items as $it):
            $p = $productRepo->findById($it->product_id); ?>
            <li class="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span class="text-neutral-800 text-base sm:text-[15px]">
                <?php echo htmlspecialchars($p?->name ?? ''); ?> × <?php echo (int) ($it->quantity ?? 0); ?>
              </span>
              <span
                class="font-medium text-base sm:text-[15px]">₱<?php echo number_format($it->unit_price * $it->quantity, 2); ?></span>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>
      <div class="rounded-lg border bg-white p-6 sm:p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Delivery Details</h2>
        <div class="space-y-2 text-neutral-700">
          <p class="text-sm">Shipping to: <?php echo htmlspecialchars($user['address'] ?? ''); ?></p>
          <p class="text-sm">Contact: <?php echo htmlspecialchars($user['phone'] ?? ''); ?></p>
        </div>
      </div>
    </section>
    <aside>
      <div class="sticky top-28 rounded-lg border bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Payment Summary</h2>
        <dl class="space-y-2 text-sm">
          <div class="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd>₱<?php echo number_format($subtotal, 2); ?></dd>
          </div>
          <div class="flex items-center justify-between">
            <dt>Delivery Fee</dt>
            <dd>₱<?php echo number_format($deliveryFee, 2); ?></dd>
          </div>
          <div class="flex items-center justify-between">
            <dt>Tax</dt>
            <dd>₱<?php echo number_format($tax, 2); ?></dd>
          </div>
        </dl>
        <div class="mt-3 flex items-center justify-between text-lg font-semibold">
          <span>Total</span><span>₱<?php echo number_format($total, 2); ?></span>
        </div>
        <button id="place-order" class="btn-primary cursor-pointer mt-6 w-full text-center">Place Order</button>
        <p id="place-order-status" class="text-sm text-neutral-600 mt-3 hidden"></p>
      </div>
    </aside>
  </div>
<?php endif; ?>