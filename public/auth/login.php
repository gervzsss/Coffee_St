<?php

declare(strict_types=1);

require_once __DIR__ . '/../../src/config/bootstrap.php';
require_once BASE_PATH . '/src/controllers/AuthController.php';

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

try {
  $controller = new AuthController(new AuthService(new UserRepository(db())));

  $payload = filter_input_array(INPUT_POST, [
    'email' => FILTER_SANITIZE_EMAIL,
    'password' => FILTER_UNSAFE_RAW,
  ]) ?: [];

  $response = $controller->handleLogin($payload);

  $status = ($response['success'] ?? false) ? 200 : 422;
  http_response_code($status);
  echo json_encode($response, JSON_UNESCAPED_UNICODE);
  exit;
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'error' => 'Unable to process login request right now.',
  ]);
  exit;
}
