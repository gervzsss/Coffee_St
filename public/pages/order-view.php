<?php
require_once __DIR__ . '/../../src/config/bootstrap.php';
use App\Controllers\OrderController;
use App\Repositories\OrderRepository;
use App\Repositories\CartRepository;
use function App\Helpers\current_user;
use function App\Helpers\db;
use function App\Helpers\is_authenticated;

if (!is_authenticated()) {
  header('Location: /COFFEE_ST/public/index.php');
  exit;
}

$orderId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$controller = new OrderController(new CartRepository(db()), new OrderRepository(db()));
$resp = $controller->detailData($orderId);
if (!(($resp['success'] ?? false) && isset($resp['order']))) {
  header('Location: /COFFEE_ST/public/pages/orders.php');
  exit;
}
$order = (object) $resp['order'];
$items = $resp['items'] ?? [];
$title = 'Order #' . $orderId . ' - Coffee St.';
?>

<?php include __DIR__ . "/../../src/includes/head.php"; ?>

<body class="min-h-screen bg-neutral-50 text-neutral-900 font-sans">

  <?php require_once __DIR__ . '/../../src/includes/header.php'; ?>

  <main class="mx-auto max-w-5xl px-4 pt-24 md:pt-28 pb-16">

    <?php include __DIR__ . '/../../src/views/order-view-content.php'; ?>

  </main>

  <?php require_once __DIR__ . '/../../src/includes/footer.php'; ?>

  <?php include __DIR__ . '/../../src/includes/user-scripts.php'; ?>

</body>

</html>