<?php

declare(strict_types=1);

if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 2));
}

require_once BASE_PATH . '/src/config/db.php';
require_once BASE_PATH . '/src/models/Product.php';

class ProductRepository
{
  private \PDO $connection;

  public function __construct(\PDO $connection)
  {
    $this->connection = $connection;
  }

  /**
   * Fetch all active products ordered by category then name.
   *
   * @return Product[]
   */
  public function getAllActive(): array
  {
    $stmt = $this->connection->prepare(
      'SELECT * FROM products WHERE is_active = 1 ORDER BY category ASC, name ASC'
    );
    $stmt->execute();
    $rows = $stmt->fetchAll();

    return array_map(static fn(array $row): Product => Product::fromArray($row), $rows);
  }

  /**
   * Fetch all active products keyed by category.
   *
   * @return array<string, Product[]>
   */
  public function getActiveGroupedByCategory(): array
  {
    $products = $this->getAllActive();
    $grouped = [];

    foreach ($products as $product) {
      $grouped[$product->category][] = $product;
    }

    return $grouped;
  }

  public function findById(int $id): ?Product
  {
    $stmt = $this->connection->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();

    return $row ? Product::fromArray($row) : null;
  }
}
