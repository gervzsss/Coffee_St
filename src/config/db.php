<?php
// Returns a shared PDO instance configured via environment variables.

declare(strict_types=1);

if (!defined('BASE_PATH')) {
  require_once __DIR__ . '/bootstrap.php';
}

function db(): \PDO
{
  static $pdo = null;

  if ($pdo instanceof \PDO) {
    return $pdo;
  }

  $host = $_ENV['DB_HOST'] ?? '127.0.0.1';
  $port = $_ENV['DB_PORT'] ?? '3306';
  $name = $_ENV['DB_DATABASE'] ?? '';
  $user = $_ENV['DB_USERNAME'] ?? '';
  $pass = $_ENV['DB_PASSWORD'] ?? '';
  $charset = $_ENV['DB_CHARSET'] ?? 'utf8mb4';

  if ($name === '') {
    throw new \RuntimeException('Database name is not configured.');
  }

  $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', $host, $port, $name, $charset);

  $options = [
    \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
    \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
    \PDO::ATTR_EMULATE_PREPARES => false,
  ];

  try {
    $pdo = new \PDO($dsn, $user, $pass, $options);
  } catch (\PDOException $e) {
    throw new \RuntimeException('Database connection failed.');
  }

  return $pdo;
}
