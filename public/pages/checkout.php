<?php
require_once __DIR__ . '/../../src/config/bootstrap.php';
require_once BASE_PATH . '/src/controllers/CheckoutController.php';
use App\Repositories\CartRepository;
use App\Repositories\ProductRepository;
use App\Controllers\CheckoutController;
use function App\Helpers\db;
use function App\Helpers\is_authenticated;

if (!is_authenticated()) {
  header('Location: /COFFEE_ST/public/pages/cart.php');
  exit;
}

$title = 'Checkout - Coffee St.';
$productRepo = new ProductRepository(db());
$controller = new CheckoutController(new CartRepository(db()), $productRepo);
$singleParam = filter_input(INPUT_GET, 'single', FILTER_VALIDATE_INT);
$data = $controller->getViewData($singleParam);

?>

<?php include __DIR__ . "/../../src/includes/head.php"; ?>

<body class="min-h-screen bg-neutral-50 text-neutral-900 font-sans">

  <?php require_once __DIR__ . '/../../src/includes/header.php'; ?>

  <main class="mx-auto max-w-5xl px-4 pt-24 md:pt-28 pb-16">

    <?php include __DIR__ . '/../../src/views/checkout-content.php'; ?>

  </main>

  <?php require_once __DIR__ . '/../../src/includes/footer.php'; ?>

  <?php include __DIR__ . '/../../src/includes/user-scripts.php'; ?>

  <script src="/COFFEE_ST/src/resources/js/checkout.js" defer></script>

</body>

</html>