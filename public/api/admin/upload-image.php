<?php
if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 3));
}

require_once BASE_PATH . '/src/includes/admin-auth-guard.php';
require_once BASE_PATH . '/src/config/bootstrap.php';

header('Content-Type: application/json');

use App\Services\CloudinaryService;
use function App\Helpers\db;

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

if (!isset($_POST['product_id']) || !is_numeric($_POST['product_id'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing or invalid product_id']);
  exit;
}

$productId = (int) $_POST['product_id'];

if (!isset($_FILES['product_image']) || !is_array($_FILES['product_image'])) {
  http_response_code(400);
  echo json_encode(['error' => 'No file uploaded']);
  exit;
}

$file = $_FILES['product_image'];
if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
  http_response_code(400);
  echo json_encode(['error' => 'Upload error', 'code' => $file['error']]);
  exit;
}

$tmpPath = $file['tmp_name'] ?? '';
$size = (int) ($file['size'] ?? 0);
$name = (string) ($file['name'] ?? '');
$type = (string) ($file['type'] ?? '');

$maxSize = 5 * 1024 * 1024; // 5MB
$allowed = ['image/jpeg', 'image/png', 'image/webp'];
if ($size <= 0 || $size > $maxSize) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid file size']);
  exit;
}
if (!in_array($type, $allowed, true)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid file type']);
  exit;
}

try {
  $result = CloudinaryService::upload($tmpPath, [
    'folder' => 'products',
    'public_id' => pathinfo($name, PATHINFO_FILENAME) . '-' . $productId,
    'overwrite' => true,
    'resource_type' => 'image',
  ]);
  $secureUrl = $result['secure_url'] ?? '';
  if ($secureUrl === '') {
    throw new RuntimeException('No secure_url returned from Cloudinary');
  }

  $pdo = db();
  $stmt = $pdo->prepare('UPDATE products SET image_url = :url, updated_at = NOW() WHERE id = :id');
  $stmt->execute(['url' => $secureUrl, 'id' => $productId]);

  echo json_encode(['ok' => true, 'image_url' => $secureUrl]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Upload failed', 'message' => $e->getMessage()]);
}
