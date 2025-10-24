<?php
if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 3));
}

require_once BASE_PATH . '/src/includes/admin-auth-guard.php';
require_once BASE_PATH . '/src/config/bootstrap.php';

header('Content-Type: application/json');

use function App\Helpers\db;

$id = (int) ($_GET['id'] ?? 0);
if ($id <= 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid id']);
  exit;
}

try {
  $pdo = db();
  $stmt = $pdo->prepare('SELECT id, name, category, description, price, image_url, is_active FROM products WHERE id = :id LIMIT 1');
  $stmt->execute(['id' => $id]);
  $row = $stmt->fetch();
  if (!$row) {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
    exit;
  }
  echo json_encode(['ok' => true, 'product' => $row]);
} catch (\Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to load product', 'message' => $e->getMessage()]);
}
