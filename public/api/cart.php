<?php

declare(strict_types=1);

require_once __DIR__ . '/../../src/config/bootstrap.php';
require_once BASE_PATH . '/src/controllers/CartController.php';
use App\Controllers\CartController;
use App\Repositories\CartRepository;
use function App\Helpers\db;

header('Content-Type: application/json; charset=utf-8');

if (!\App\Helpers\is_authenticated()) {
  http_response_code(401);
  echo json_encode(['success' => false, 'error' => 'Please login to manage your cart.']);
  exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? ($_POST['action'] ?? 'get');

$controller = new CartController(new CartRepository(db()));

try {
  switch ($action) {
    case 'add':
      if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        break;
      }
      $payload = [
        'product_id' => (int) ($_POST['product_id'] ?? 0),
        'quantity' => (int) ($_POST['quantity'] ?? 1),
        'variant_id' => isset($_POST['variant_id']) ? (int) $_POST['variant_id'] : null,
      ];
      if ($payload['product_id'] <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid product.']);
        break;
      }
      if ($payload['quantity'] <= 0) {
        $payload['quantity'] = 1;
      }
      echo json_encode($controller->add($payload));
      break;
    case 'setQty':
      if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        break;
      }
      $payload = [
        'product_id' => (int) ($_POST['product_id'] ?? 0),
        'quantity' => (int) ($_POST['quantity'] ?? 0),
      ];
      echo json_encode($controller->setQty($payload));
      break;
    case 'remove':
      if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        break;
      }
      $payload = ['product_id' => (int) ($_POST['product_id'] ?? 0)];
      echo json_encode($controller->remove($payload));
      break;
    case 'get':
    default:
      echo json_encode($controller->get());
  }
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Cart operation failed: ' . $e->getMessage()]);
}
