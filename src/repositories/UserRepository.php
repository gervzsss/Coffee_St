<?php

declare(strict_types=1);

if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 2));
}

require_once BASE_PATH . '/src/config/db.php';
require_once BASE_PATH . '/src/models/User.php';

class UserRepository
{
  private \PDO $connection;

  public function __construct(\PDO $connection)
  {
    $this->connection = $connection;
  }

  public function findByEmail(string $email): ?User
  {
    $stmt = $this->connection->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
    $stmt->execute(['email' => $email]);
    $row = $stmt->fetch();

    return $row ? User::fromArray($row) : null;
  }

  public function createUser(array $data): User
  {
    $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');

    $stmt = $this->connection->prepare(
      'INSERT INTO users (first_name, last_name, email, password_hash, address, phone, created_at, updated_at)
             VALUES (:first_name, :last_name, :email, :password_hash, :address, :phone, :created_at, :updated_at)'
    );

    $stmt->execute([
      'first_name' => $data['first_name'],
      'last_name' => $data['last_name'],
      'email' => $data['email'],
      'password_hash' => $data['password_hash'],
      'address' => $data['address'] ?? null,
      'phone' => $data['phone'] ?? null,
      'created_at' => $now,
      'updated_at' => $now,
    ]);

    $id = (int) $this->connection->lastInsertId();
    $user = $this->findByEmail($data['email']);

    if ($user === null) {
      throw new \RuntimeException('Failed to create user record.');
    }

    return $user;
  }

  public function verifyCredentials(string $email, string $password): ?User
  {
    $user = $this->findByEmail($email);

    if (!$user || !$user->password_hash) {
      return null;
    }

    if (!password_verify($password, $user->password_hash)) {
      return null;
    }

    return $user;
  }
}
