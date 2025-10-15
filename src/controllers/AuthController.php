<?php

declare(strict_types=1);

if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 2));
}

require_once BASE_PATH . '/src/services/AuthService.php';

class AuthController
{
  private AuthService $service;

  public function __construct(AuthService $service)
  {
    $this->service = $service;
  }

  public function handleRegister(array $payload): array
  {
    return $this->service->register($payload);
  }

  public function handleLogin(array $payload): array
  {
    return $this->service->login($payload);
  }
}
