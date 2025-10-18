<?php
require_once __DIR__ . '/../../src/config/bootstrap.php';
require_once BASE_PATH . '/src/repositories/OrderRepository.php';

if (!is_authenticated()) {
  header('Location: /COFFEE_ST/public/index.php');
  exit;
}

$orderId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$repo = new OrderRepository(db());
$orders = $repo->listForUser((int) current_user()['id']);
$order = null;
foreach ($orders as $o) {
  if ((int) $o->id === $orderId) {
    $order = $o;
    break;
  }
}
if (!$order) {
  header('Location: /COFFEE_ST/public/pages/orders.php');
  exit;
}
$items = $repo->getOrderItems($orderId);
$title = 'Order #' . $orderId . ' - Coffee St.';
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
    <h1 class="text-3xl font-bold text-[#30442B] mb-6">Order #<?php echo (int) $orderId; ?></h1>
    <div class="rounded-lg border bg-white p-6 shadow-sm">
      <p class="text-sm text-neutral-600 mb-4">Placed on
        <?php echo htmlspecialchars(date('M j, Y g:i A', strtotime($order->created_at ?? 'now'))); ?> • Status: <span
          class="font-medium text-[#30442B] uppercase"><?php echo htmlspecialchars($order->status); ?></span>
      </p>
      <table class="w-full text-sm">
        <thead class="text-neutral-500 border-b">
          <tr>
            <th class="text-left py-2">Item</th>
            <th class="text-right">Qty</th>
            <th class="text-right">Unit</th>
            <th class="text-right">Line</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($items as $it): ?>
            <tr class="border-b last:border-0">
              <td class="py-2">
                <div class="font-medium"><?php echo htmlspecialchars($it['product_name']); ?></div>
                <?php if (!empty($it['variant_name'])): ?>
                  <div class="text-xs text-neutral-500"><?php echo htmlspecialchars($it['variant_name']); ?></div>
                <?php endif; ?>
              </td>
              <td class="text-right"><?php echo (int) $it['quantity']; ?></td>
              <td class="text-right">
                ₱<?php echo number_format(((float) $it['unit_price'] + (float) $it['price_delta']), 2); ?></td>
              <td class="text-right">₱<?php echo number_format((float) $it['line_total'], 2); ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
      <div class="mt-4 space-y-1 text-sm">
        <div class="flex justify-between">
          <span>Subtotal</span><span>₱<?php echo number_format($order->subtotal, 2); ?></span>
        </div>
        <div class="flex justify-between">
          <span>Delivery</span><span>₱<?php echo number_format($order->delivery_fee, 2); ?></span>
        </div>
        <div class="flex justify-between"><span>Tax
            (<?php echo number_format((float) ($order->tax_rate ?? 0) * 100, 2); ?>%)</span><span>₱<?php echo number_format((float) ($order->tax_amount ?? $order->tax), 2); ?></span>
        </div>
        <div class="flex justify-between font-semibold text-lg pt-2">
          <span>Total</span><span>₱<?php echo number_format($order->total, 2); ?></span>
        </div>
      </div>
    </div>
  </main>
  <?php include __DIR__ . '/../../src/includes/footer.php'; ?>
  <script src="/COFFEE_ST/src/resources/jquery-3.7.1.min.js"></script>
  <script src="/COFFEE_ST/src/resources/js/app.js"></script>
  <script src="/COFFEE_ST/src/resources/js/login-validation.js"></script>
</body>

</html>