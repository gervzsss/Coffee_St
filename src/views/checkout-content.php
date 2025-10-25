<h1 class="text-3xl md:text-4xl font-bold text-[#30442B] mb-6">Checkout</h1>
<?php if (empty($data['items'])): ?>
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
          <?php foreach ($data['items'] as $it):
            $p = $data['productRepo']->findById($it->product_id);
            $img = $p?->displayImage();
            $lineUnit = ((float) ($it->unit_price ?? 0)) + ((float) ($it->price_delta ?? 0));
            $lineTotal = $lineUnit * (int) ($it->quantity ?? 0);
            ?>
            <li class="flex items-start gap-3 py-3 sm:items-center">
              <div class="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100 ring-1 ring-black/5">
                <?php if (!empty($img)): ?>
                  <img src="<?php echo htmlspecialchars($img, ENT_QUOTES); ?>"
                    alt="<?php echo htmlspecialchars($p?->name ?? 'Product image'); ?>" class="h-full w-full object-cover" />
                <?php else: ?>
                  <div class="h-full w-full bg-neutral-200"></div>
                <?php endif; ?>
              </div>
              <div class="flex min-w-0 flex-1 items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate text-neutral-900 font-medium text-base sm:text-[15px]">
                    <?php echo htmlspecialchars($p?->name ?? ''); ?>
                  </div>
                  <div class="text-xs text-neutral-500">
                    <?php if (!empty($it->variant_name)): ?>
                      <span><?php echo htmlspecialchars((string) $it->variant_name); ?></span>
                      <span class="mx-1">·</span>
                    <?php endif; ?>
                    <span>Qty: <?php echo (int) ($it->quantity ?? 0); ?></span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-medium text-base sm:text-[15px]">₱<?php echo number_format($lineTotal, 2); ?></div>
                  <?php if (!empty($it->price_delta) && (float) $it->price_delta !== 0.0): ?>
                    <div class="text-[11px] text-neutral-500">(Base
                      ₱<?php echo number_format((float) $it->unit_price, 2); ?><?php echo ((float) $it->price_delta) > 0 ? ' +' : ' '; ?>₱<?php echo number_format(abs((float) $it->price_delta), 2); ?>)
                    </div>
                  <?php endif; ?>
                </div>
              </div>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>
      <div class="rounded-lg border bg-white p-6 sm:p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Delivery Details</h2>
        <div class="space-y-2 text-neutral-700">
          <p class="text-sm">Shipping to: <?php echo htmlspecialchars($data['user']['address'] ?? ''); ?></p>
          <p class="text-sm">Contact: <?php echo htmlspecialchars($data['user']['phone'] ?? ''); ?></p>
        </div>
      </div>
    </section>
    <aside>
      <div id="checkout-summary" class="sticky top-28 rounded-lg border bg-white p-6 shadow-sm"
        data-delivery-fee="<?php echo htmlspecialchars((string) ($data['deliveryFee'] ?? 0), ENT_QUOTES); ?>"
        data-tax-rate="0.08">
        <h2 class="text-lg font-semibold mb-4">Payment Summary</h2>
        <dl class="space-y-2 text-sm">
          <div class="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd>₱<span id="summary-subtotal"><?php echo number_format($data['subtotal'], 2); ?></span></dd>
          </div>
          <div class="flex items-center justify-between">
            <dt>Delivery Fee</dt>
            <dd>₱<span id="summary-delivery"><?php echo number_format($data['deliveryFee'], 2); ?></span></dd>
          </div>
          <div class="flex items-center justify-between">
            <dt>Tax</dt>
            <dd>₱<span id="summary-tax"><?php echo number_format($data['tax'], 2); ?></span></dd>
          </div>
        </dl>
        <div class="mt-3 flex items-center justify-between text-lg font-semibold">
          <span>Total</span><span>₱<span id="summary-total"><?php echo number_format($data['total'], 2); ?></span></span>
        </div>
        <button id="place-order" class="btn-primary cursor-pointer mt-6 w-full text-center"
          data-delivery-fee="<?php echo htmlspecialchars((string) ($data['deliveryFee'] ?? 0), ENT_QUOTES); ?>"
          data-tax="<?php echo htmlspecialchars((string) ($data['tax'] ?? 0), ENT_QUOTES); ?>" <?php if (!empty($data['selectedMode']) && !empty($data['selectedIds'])): ?>
            data-selected="<?php echo htmlspecialchars(implode(',', array_map('intval', $data['selectedIds'])), ENT_QUOTES); ?>"
          <?php endif; ?>   <?php if (!empty($data['singleMode']) && !empty($data['singleProductId'])): ?>
            data-single-product-id="<?php echo (int) $data['singleProductId']; ?>" <?php endif; ?>>
          Place Order
        </button>
        <a href="/COFFEE_ST/public/pages/cart.php"
          class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Cart
        </a>
        <p id="place-order-status" class="text-sm text-neutral-600 mt-3 hidden"></p>
      </div>
    </aside>
  </div>
<?php endif; ?>