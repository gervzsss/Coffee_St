<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Services\AuthService;

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
