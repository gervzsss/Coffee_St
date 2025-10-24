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

$id = (int) ($_POST['product_id'] ?? 0);
$name = isset($_POST['productName']) ? trim((string) $_POST['productName']) : null;
$price = isset($_POST['productPrice']) ? (string) $_POST['productPrice'] : null;
$category = isset($_POST['productCategory']) ? trim((string) $_POST['productCategory']) : null;
$description = isset($_POST['productDescription']) ? trim((string) $_POST['productDescription']) : null;
$isActive = isset($_POST['is_active']) ? (int) !!$_POST['is_active'] : null;

if ($id <= 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid product id']);
  exit;
}

try {
  $pdo = db();
  $sel = $pdo->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
  $sel->execute(['id' => $id]);
  $row = $sel->fetch();
  if (!$row) {
    http_response_code(404);
    echo json_encode(['error' => 'Product not found']);
    exit;
  }

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
        $upl = CloudinaryService::upload($tmp, [
          'folder' => 'products',
          'public_id' => pathinfo((string) ($file['name'] ?? 'product'), PATHINFO_FILENAME) . '-' . $id,
          'overwrite' => true,
        ]);
        $imageUrl = $upl['secure_url'] ?? null;
      }
    }
  }

  $sets = [];
  $params = ['id' => $id];
  if ($name !== null) {
    $sets[] = 'name = :name';
    $params['name'] = $name;
  }
  if ($price !== null) {
    if (!is_numeric($price)) {
      http_response_code(400);
      echo json_encode(['error' => 'Invalid price']);
      exit;
    }
    $sets[] = 'price = :price';
    $params['price'] = round((float) $price, 2);
  }
  if ($category !== null) {
    $sets[] = 'category = :category';
    $params['category'] = $category;
  }
  if ($description !== null) {
    $sets[] = 'description = :description';
    $params['description'] = $description;
  }
  if ($isActive !== null) {
    $sets[] = 'is_active = :is_active';
    $params['is_active'] = $isActive;
  }
  if ($imageUrl !== null) {
    $sets[] = 'image_url = :image_url';
    $params['image_url'] = $imageUrl;
  }
  if (!$sets) {
    echo json_encode(['ok' => true, 'message' => 'No changes']);
    exit;
  }
  $sets[] = 'updated_at = :u';
  $params['u'] = (new DateTimeImmutable())->format('Y-m-d H:i:s');
  $sql = 'UPDATE products SET ' . implode(', ', $sets) . ' WHERE id = :id';
  $upd = $pdo->prepare($sql);
  $upd->execute($params);

  echo json_encode(['ok' => true, 'image_url' => $imageUrl]);
} catch (\Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to update product', 'message' => $e->getMessage()]);
}
