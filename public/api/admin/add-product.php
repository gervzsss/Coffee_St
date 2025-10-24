<?php
if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 3));
}

require_once BASE_PATH . '/src/includes/admin-auth-guard.php';
require_once BASE_PATH . '/src/config/bootstrap.php';

header('Content-Type: application/json');

use App\Services\CloudinaryService;
use function App\Helpers\db;

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$name = trim((string) ($_POST['productName'] ?? ''));
$price = (string) ($_POST['productPrice'] ?? '');
$category = trim((string) ($_POST['productCategory'] ?? ''));
$description = trim((string) ($_POST['productDescription'] ?? ''));
$isActive = isset($_POST['is_active']) ? (int) !!$_POST['is_active'] : 1;

if ($name === '' || $category === '' || $description === '') {
  http_response_code(400);
  echo json_encode(['error' => 'Missing required fields.']);
  exit;
}

if (!is_numeric($price)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid price.']);
  exit;
}
$priceVal = round((float) $price, 2);

$imageUrl = null;
if (isset($_FILES['product_image']) && is_array($_FILES['product_image'])) {
  $file = $_FILES['product_image'];
  if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK) {
    $tmp = (string) ($file['tmp_name'] ?? '');
    $type = (string) ($file['type'] ?? '');
    $size = (int) ($file['size'] ?? 0);
    $maxSize = 5 * 1024 * 1024;
    $allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if ($tmp && $size > 0 && $size <= $maxSize && in_array($type, $allowed, true)) {
      try {
        $upl = CloudinaryService::upload($tmp, [
          'folder' => 'products',
          'public_id' => pathinfo((string) ($file['name'] ?? 'product'), PATHINFO_FILENAME) . '-' . uniqid(),
          'overwrite' => true,
        ]);
        $imageUrl = $upl['secure_url'] ?? null;
      } catch (\Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Image upload failed', 'message' => $e->getMessage()]);
        exit;
      }
    }
  }
}

try {
  $pdo = db();
  $now = (new DateTimeImmutable())->format('Y-m-d H:i:s');
  $stmt = $pdo->prepare('INSERT INTO products (category, name, description, price, image_url, is_active, created_at, updated_at) VALUES (:category, :name, :description, :price, :image_url, :is_active, :c, :u)');
  $stmt->execute([
    'category' => $category,
    'name' => $name,
    'description' => $description,
    'price' => $priceVal,
    'image_url' => $imageUrl,
    'is_active' => $isActive,
    'c' => $now,
    'u' => $now,
  ]);
  $id = (int) $pdo->lastInsertId();
  echo json_encode(['ok' => true, 'id' => $id, 'image_url' => $imageUrl]);
} catch (\Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to create product', 'message' => $e->getMessage()]);
}
