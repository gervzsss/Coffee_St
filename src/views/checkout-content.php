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
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <section class="md:col-span-2 space-y-4">
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Order Items</h2>
        <ul class="divide-y">
          <?php foreach ($items as $it):
            $p = $productRepo->findById($it->product_id); ?>
            <li class="py-3 flex justify-between">
              <span class="text-neutral-800"><?php echo htmlspecialchars($p?->name ?? ''); ?> ×
                <?php echo (int) ($it->quantity ?? 0); ?></span>
              <span class="font-medium">₱<?php echo number_format($it->unit_price * $it->quantity, 2); ?></span>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Delivery Details</h2>
        <p class="text-sm text-neutral-700">Shipping to: <?php echo htmlspecialchars($user['address'] ?? ''); ?></p>
        <p class="text-sm text-neutral-700">Contact: <?php echo htmlspecialchars($user['phone'] ?? ''); ?></p>
      </div>
    </section>
    <aside>
      <div class="rounded-lg border bg-white p-6 shadow-sm sticky top-28">
        <h2 class="text-lg font-semibold mb-4">Payment Summary</h2>
        <dl class="space-y-1 text-sm">
          <div class="flex justify-between">
            <dt>Subtotal</dt>
            <dd>₱<?php echo number_format($subtotal, 2); ?></dd>
          </div>
          <div class="flex justify-between">
            <dt>Delivery Fee</dt>
            <dd>₱<?php echo number_format($deliveryFee, 2); ?></dd>
          </div>
          <div class="flex justify-between">
            <dt>Tax</dt>
            <dd>₱<?php echo number_format($tax, 2); ?></dd>
          </div>
        </dl>
        <div class="flex justify-between items-center mt-3 text-lg font-semibold">
          <span>Total</span><span>₱<?php echo number_format($total, 2); ?></span>
        </div>
        <button id="place-order"
          class="cursor-pointer mt-6 w-full py-3 rounded bg-[#30442B] text-white hover:bg-[#3d5a38] transition">Place
          Order</button>
        <p id="place-order-status" class="text-sm text-neutral-600 mt-3 hidden"></p>
      </div>
    </aside>
  </div>
<?php endif; ?>