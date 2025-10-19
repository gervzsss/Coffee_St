<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Services\AuthService;

/**
 * Controller for authentication actions (register, login).
 */
class AuthController
{
  private AuthService $service;

  public function __construct(AuthService $service)
  {
    $this->service = $service;
  }

  /**
   * Handle user registration.
   *
   * @param array $payload
   * @return array
   */
  public function handleRegister(array $payload): array
  {
    return $this->service->register($payload);
  }

  /**
   * Handle user login.
   *
   * @param array $payload
   * @return array
   */
  public function handleLogin(array $payload): array
  {
    return $this->service->login($payload);
  }
}
