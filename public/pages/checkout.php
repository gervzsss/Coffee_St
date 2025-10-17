<?php
require_once __DIR__ . '/../../src/config/bootstrap.php';
require_once BASE_PATH . '/src/repositories/CartRepository.php';
require_once BASE_PATH . '/src/repositories/ProductRepository.php';

if (!is_authenticated()) {
  header('Location: /COFFEE_ST/public/pages/cart.php');
  exit;
}

$title = 'Checkout - Coffee St.';
$user = current_user();
$cartRepo = new CartRepository(db());
$productRepo = new ProductRepository(db());
$cart = $cartRepo->getOrCreateActiveCart((int) $user['id']);
$details = $cartRepo->getCartDetails($cart->id ?? 0);
$items = $details['items'];
$singleProductId = isset($_GET['single']) ? (int) $_GET['single'] : null;
$singleMode = $singleProductId ? true : false;

if ($singleMode) {
  $items = array_values(array_filter($items, static fn($it) => (int) $it->product_id === $singleProductId));
  if (empty($items)) {
    $singleMode = false;
    $singleProductId = null;
  }
}

if ($singleMode) {
  $subtotal = 0.0;
  foreach ($items as $line) {
    $lineUnit = (float) $line->unit_price + (float) $line->price_delta;
    $subtotal += $lineUnit * (int) $line->quantity;
  }
  $subtotal = round($subtotal, 2);
} else {
  $subtotal = $details['subtotal'];
}
$deliveryFee = 1.78;
$tax = round($subtotal * 0.08, 2);
$total = round($subtotal + $deliveryFee + $tax, 2);
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?php echo htmlspecialchars($title); ?></title>
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css" />
</head>

<body class="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
  <?php include __DIR__ . '/../../src/includes/header.php'; ?>

  <main class="mx-auto max-w-5xl px-4 py-32">
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
                    <?php echo (int) $it->quantity; ?></span>
                  <span class="font-medium">$<?php echo number_format($it->unit_price * $it->quantity, 2); ?></span>
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
                <dd>$<?php echo number_format($subtotal, 2); ?></dd>
              </div>
              <div class="flex justify-between">
                <dt>Delivery Fee</dt>
                <dd>$<?php echo number_format($deliveryFee, 2); ?></dd>
              </div>
              <div class="flex justify-between">
                <dt>Tax</dt>
                <dd>$<?php echo number_format($tax, 2); ?></dd>
              </div>
            </dl>
            <div class="flex justify-between items-center mt-3 text-lg font-semibold">
              <span>Total</span><span>$<?php echo number_format($total, 2); ?></span>
            </div>
            <button id="place-order"
              class="cursor-pointer mt-6 w-full py-3 rounded bg-[#30442B] text-white hover:bg-[#3d5a38] transition">Place
              Order</button>
            <p id="place-order-status" class="text-sm text-neutral-600 mt-3 hidden"></p>
          </div>
        </aside>
      </div>
    <?php endif; ?>
  </main>

  <?php include __DIR__ . '/../../src/includes/footer.php'; ?>

  <script src="/COFFEE_ST/src/resources/jquery-3.7.1.min.js"></script>
  <script src="/COFFEE_ST/src/resources/js/app.js"></script>
  <script>
    $(function () {
      const singleProductId = <?php echo json_encode($singleMode ? (int) $singleProductId : null); ?>;
      $('#place-order').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        $('#place-order-status').removeClass('hidden').text('Processing your order...');
        var payload = { delivery_fee: <?php echo json_encode($deliveryFee); ?>, tax: <?php echo json_encode($tax); ?> };
        if (singleProductId) {
          payload.single_product_id = singleProductId;
        }
        $.post('/COFFEE_ST/public/api/checkout.php', payload)
          .done(function (resp) {
            if (resp && resp.success) {
              $('#place-order-status').text('Order placed! Redirecting...');
              setTimeout(function () { window.location.href = '/COFFEE_ST/public/pages/orders.php'; }, 800);
            } else {
              $('#place-order-status').text('Unable to place order.');
              $btn.prop('disabled', false);
            }
          })
          .fail(function () {
            $('#place-order-status').text('Checkout failed. Please try again.');
            $btn.prop('disabled', false);
          });
      });
    });
  </script>
</body>

</html>