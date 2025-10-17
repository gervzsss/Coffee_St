<?php

declare(strict_types=1);

require_once __DIR__ . '/../../src/config/bootstrap.php';
require_once BASE_PATH . '/src/controllers/OrderController.php';

header('Content-Type: application/json; charset=utf-8');

if (!is_authenticated()) {
  http_response_code(401);
  echo json_encode(['success' => false, 'error' => 'Please login to checkout.']);
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  http_response_code(405);
  header('Allow: POST');
  echo json_encode(['success'=>false,'error'=>'Method not allowed']);
  exit;
}

try {
  $controller = new OrderController(new CartRepository(db()), new OrderRepository(db()));
  $payload = [
    'delivery_fee' => (float)($_POST['delivery_fee'] ?? 1.78),
    'tax' => isset($_POST['tax']) ? (float)$_POST['tax'] : null,
  ];
  echo json_encode($controller->checkout($payload));
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Checkout failed.']);
}
