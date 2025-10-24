<?php
require_once __DIR__ . '/../../src/config/bootstrap.php';
use App\Controllers\CartController;
use App\Repositories\CartRepository;
use App\Repositories\ProductRepository;
use function App\Helpers\db;

$title = 'Cart - Coffee St.';

$controller = new CartController(new CartRepository(db()), new ProductRepository(db()));
$vm = $controller->viewData();

$isAuthenticated = (bool) ($vm['isAuthenticated'] ?? false);
$items = $vm['items'] ?? [];
$products = $vm['products'] ?? [];
$subtotal = (float) ($vm['subtotal'] ?? 0.0);
$deliveryFee = (float) ($vm['deliveryFee'] ?? 1.78);
$tax = (float) ($vm['tax'] ?? 0.0);
$total = (float) ($vm['total'] ?? 0.0);
?>

<?php include __DIR__ . "/../../src/includes/head.php"; ?>

<body class="min-h-screen bg-neutral-50 text-neutral-900 font-sans">

  <?php require_once __DIR__ . '/../../src/includes/header.php'; ?>

  <main class="mx-auto max-w-6xl px-4 pt-24 md:pt-28 pb-16">

    <?php include __DIR__ . '/../../src/views/cart-content.php'; ?>

  </main>

  <?php require_once __DIR__ . '/../../src/includes/footer.php'; ?>

  <?php include __DIR__ . '/../../src/components/modals/auth-modals.php'; ?>

  <?php include __DIR__ . '/../../src/includes/user-scripts.php'; ?>

  <script src="/COFFEE_ST/src/resources/js/cart.js"></script>

</body>

</html>