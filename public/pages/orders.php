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

$title = 'My Orders - Coffee St.';
$controller = new OrderController(new CartRepository(db()), new OrderRepository(db()));
$resp = $controller->list();
$orders = [];

if (($resp['success'] ?? false) && isset($resp['orders'])) {
  $orders = array_map(function ($r) {
    return (object) $r;
  }, $resp['orders']);
}
?>

<?php include __DIR__ . "/../../src/includes/head.php"; ?>

<body class="min-h-screen bg-neutral-50 text-neutral-900 font-sans">

  <?php require_once __DIR__ . '/../../src/includes/header.php'; ?>

  <main class="mx-auto max-w-5xl px-4 pt-24 md:pt-28 pb-16">

    <?php include __DIR__ . '/../../src/views/orders-content.php'; ?>

  </main>

  <?php require_once __DIR__ . '/../../src/includes/footer.php'; ?>

  <?php include __DIR__ . '/../../src/includes/user-scripts.php'; ?>

</body>

</html>