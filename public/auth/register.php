<?php

declare(strict_types=1);

require_once __DIR__ . '/../../src/config/bootstrap.php';

use App\Controllers\AuthController;
use App\Services\AuthService;
use App\Repositories\UserRepository;
use function App\Helpers\db;

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

  $filters = [
    'first_name' => FILTER_UNSAFE_RAW,
    'last_name' => FILTER_UNSAFE_RAW,
    'email' => FILTER_SANITIZE_EMAIL,
    'address' => FILTER_UNSAFE_RAW,
    'phone' => FILTER_UNSAFE_RAW,
    'password' => FILTER_UNSAFE_RAW,
    'password_confirmation' => FILTER_UNSAFE_RAW,
  ];

  $payload = filter_input_array(INPUT_POST, $filters) ?: [];

  $response = $controller->handleRegister($payload);

  $status = ($response['success'] ?? false) ? 200 : 422;
  http_response_code($status);
  echo json_encode($response, JSON_UNESCAPED_UNICODE);
  exit;
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'error' => 'Unable to process registration right now.',
  ]);
  exit;
}
