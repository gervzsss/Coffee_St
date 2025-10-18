<?php
declare(strict_types=1);

require_once __DIR__ . '/../../src/config/bootstrap.php';
require_once __DIR__ . '/../../src/repositories/VariantRepository.php';

header('Content-Type: application/json');

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        exit;
    }

    $pid = isset($_GET['product_id']) ? (int) $_GET['product_id'] : 0;
    if ($pid <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing product_id']);
        exit;
    }

    $repo = new VariantRepository(db());
    $variants = $repo->getActiveByProduct($pid);
    echo json_encode(['success' => true, 'variants' => $variants]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error fetching variants']);
}
