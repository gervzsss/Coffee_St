<?php
if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 3));
}

require_once BASE_PATH . '/src/includes/admin-auth-guard.php';
require_once BASE_PATH . '/src/config/bootstrap.php';

header('Content-Type: application/json');

use function App\Helpers\db;

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$id = (int) ($_POST['product_id'] ?? 0);
$available = isset($_POST['available']) ? (int) !!$_POST['available'] : null;
if ($id <= 0 || $available === null) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid parameters']);
  exit;
}

try {
  $pdo = db();
  $stmt = $pdo->prepare('UPDATE products SET is_active = :a, updated_at = NOW() WHERE id = :id');
  $stmt->execute(['a' => $available, 'id' => $id]);
  echo json_encode(['ok' => true]);
} catch (\Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to update availability', 'message' => $e->getMessage()]);
}
