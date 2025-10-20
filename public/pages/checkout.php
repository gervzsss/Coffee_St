<?php

require_once __DIR__ . '/../../src/config/bootstrap.php';
require_once BASE_PATH . '/src/repositories/repositories.php';
use App\Repositories\CartRepository;
use App\Repositories\ProductRepository;
use function App\Helpers\current_user;
use function App\Helpers\db;
use function App\Helpers\is_authenticated;

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
  <?php require_once __DIR__ . '/../../src/includes/header.php'; ?>

  <main class="mx-auto max-w-5xl px-4 pt-24 md:pt-28 pb-16">
    <?php include __DIR__ . '/../../src/views/checkout-content.php'; ?>
  </main>

  <?php require_once __DIR__ . '/../../src/includes/footer.php'; ?>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"
    integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
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