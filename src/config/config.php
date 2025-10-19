<?php
declare(strict_types=1);

/**
 * Unified configuration for Coffee_St.
 *
 * Sections:
 * - db: database connection details
 * - admin: admin account configuration
 * - order: order-related settings (fees, tax)
 */

return [
  'db' => [
    'host' => $_ENV['DB_HOST'] ?? '127.0.0.1',
    'port' => $_ENV['DB_PORT'] ?? '3306',
    'database' => $_ENV['DB_DATABASE'] ?? '',
    'username' => $_ENV['DB_USERNAME'] ?? '',
    'password' => $_ENV['DB_PASSWORD'] ?? '',
    'charset' => $_ENV['DB_CHARSET'] ?? 'utf8mb4',
    'options' => [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false,
    ],
  ],
  'admin' => [
    'email' => $_ENV['ADMIN_EMAIL'] ?? 'admin@coffeest.com',
    'password_hash' => $_ENV['ADMIN_PASSWORD_HASH'] ?? 'admin',
  ],
  'order' => [
    'delivery_fee' => (float) ($_ENV['ORDER_DELIVERY_FEE'] ?? 1.78),
    'tax_rate' => (float) ($_ENV['ORDER_TAX_RATE'] ?? 0.08),
  ],
];
