<?php

declare(strict_types=1);

require_once __DIR__ . '/../../src/config/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  header('Allow: POST');
  echo json_encode([
    'success' => false,
    'error' => 'Method not allowed.',
  ]);
  exit;
}

logout_user();

echo json_encode([
  'success' => true,
]);
exit;
