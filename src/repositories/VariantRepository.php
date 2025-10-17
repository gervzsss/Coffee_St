<?php

declare(strict_types=1);

if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 2));
}

require_once BASE_PATH . '/src/config/db.php';

class VariantRepository
{
  public function __construct(private \PDO $connection)
  {
  }

  /** @return array<int, array{group_name:string,name:string,price_delta:float,id:int}> */
  public function getActiveByProduct(int $productId): array
  {
    $stmt = $this->connection->prepare('SELECT id, group_name, name, price_delta FROM product_variants WHERE product_id = :pid AND is_active = 1 ORDER BY group_name, name');
    $stmt->execute(['pid' => $productId]);
    $rows = $stmt->fetchAll() ?: [];
    return array_map(static function(array $r){
      return [
        'id' => (int)$r['id'],
        'group_name' => (string)$r['group_name'],
        'name' => (string)$r['name'],
        'price_delta' => (float)$r['price_delta'],
      ];
    }, $rows);
  }
}
