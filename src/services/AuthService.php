<?php

declare(strict_types=1);

if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 2));
}

require_once BASE_PATH . '/src/repositories/UserRepository.php';

class AuthService
{
  private UserRepository $repository;

  public function __construct(UserRepository $repository)
  {
    $this->repository = $repository;
  }

  public function register(array $input): array
  {
    $data = $this->sanitizeRegisterInput($input);
    $errors = $this->validateRegisterInput($data);

    if (!empty($errors)) {
      return [
        'success' => false,
        'errors' => $errors,
      ];
    }

    if ($this->repository->findByEmail($data['email'])) {
      return [
        'success' => false,
        'errors' => ['email' => 'Email address is already registered.'],
      ];
    }

    $data['password_hash'] = password_hash($data['password'], PASSWORD_DEFAULT);
    $data['address'] = $data['address'] !== '' ? $data['address'] : null;
    $data['phone'] = $data['phone'] !== '' ? $data['phone'] : null;

    unset($data['password'], $data['password_confirmation']);

    $user = $this->repository->createUser($data);

    login_user($user->toArray());

    return [
      'success' => true,
      'message' => 'Account created successfully.',
      'user' => $user->toArray(),
    ];
  }

  public function login(array $input): array
  {
    $email = strtolower(trim($input['email'] ?? ''));
    $password = (string) ($input['password'] ?? '');

    $errors = [];
    if ($email === '') {
      $errors['email'] = 'Email is required.';
    }
    if ($password === '') {
      $errors['password'] = 'Password is required.';
    }

    if (!empty($errors)) {
      return [
        'success' => false,
        'errors' => $errors,
      ];
    }

    $user = $this->repository->verifyCredentials($email, $password);

    if (!$user) {
      return [
        'success' => false,
        'error' => 'Invalid email or password.',
      ];
    }

    login_user($user->toArray());

    return [
      'success' => true,
      'message' => 'Login successful.',
      'user' => $user->toArray(),
    ];
  }

  private function sanitizeRegisterInput(array $input): array
  {
    return [
      'first_name' => $this->clean($input['first_name'] ?? ''),
      'last_name' => $this->clean($input['last_name'] ?? ''),
      'email' => strtolower(trim((string) ($input['email'] ?? ''))),
      'address' => $this->clean($input['address'] ?? ''),
      'phone' => preg_replace('/[^\d+]/', '', (string) ($input['phone'] ?? '')),
      'password' => (string) ($input['password'] ?? ''),
      'password_confirmation' => (string) ($input['password_confirmation'] ?? ''),
    ];
  }

  private function validateRegisterInput(array $data): array
  {
    $errors = [];

    if ($data['first_name'] === '') {
      $errors['first_name'] = 'First name is required.';
    }

    if ($data['last_name'] === '') {
      $errors['last_name'] = 'Last name is required.';
    }

    if ($data['address'] === '') {
      $errors['address'] = 'Address is required.';
    }

    if ($data['email'] === '' || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
      $errors['email'] = 'Enter a valid email address.';
    }

    if ($data['phone'] === '') {
      $errors['phone'] = 'Contact number is required.';
    }

    if ($data['password'] === '' || strlen($data['password']) < 6) {
      $errors['password'] = 'Password must be at least 6 characters.';
    }

    if ($data['password_confirmation'] === '' || $data['password'] !== $data['password_confirmation']) {
      $errors['password_confirmation'] = 'Passwords do not match.';
    }

    return $errors;
  }

  private function clean(string $value): string
  {
    return trim(strip_tags($value));
  }
}
