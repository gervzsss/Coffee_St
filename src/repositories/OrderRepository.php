<?php

declare(strict_types=1);

if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 2));
}

require_once BASE_PATH . '/src/config/db.php';
require_once BASE_PATH . '/src/models/Order.php';
require_once BASE_PATH . '/src/models/OrderItem.php';

class OrderRepository
{
  public function __construct(private \PDO $connection)
  {
  }

  /**
   * Create an order from the given cart snapshot and items.
   * Returns created Order id.
   * @param array{items: array<int,array{product_id:int,product_name:string,unit_price:float,quantity:int,line_total:float}>, subtotal: float, delivery_fee: float, tax: float, total: float} $snapshot
   */
  public function createFromCart(int $userId, array $snapshot): int
  {
    $this->connection->beginTransaction();
    try {
      $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
      $stmt = $this->connection->prepare('INSERT INTO orders (user_id, status, subtotal, delivery_fee, tax, total, created_at, updated_at) VALUES (:uid, "pending", :s, :d, :t, :tot, :c, :u)');
      $stmt->execute([
        'uid' => $userId,
        's' => $snapshot['subtotal'],
        'd' => $snapshot['delivery_fee'],
        't' => $snapshot['tax'],
        'tot' => $snapshot['total'],
        'c' => $now,
        'u' => $now,
      ]);
      $orderId = (int)$this->connection->lastInsertId();

      $itemStmt = $this->connection->prepare('INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, line_total, created_at, updated_at) VALUES (:oid, :pid, :name, :price, :qty, :line, :c, :u)');
      foreach ($snapshot['items'] as $it) {
        $itemStmt->execute([
          'oid' => $orderId,
          'pid' => $it['product_id'],
          'name' => $it['product_name'],
          'price' => $it['unit_price'],
          'qty' => $it['quantity'],
          'line' => $it['line_total'],
          'c' => $now,
          'u' => $now,
        ]);
      }

      $this->connection->commit();
      return $orderId;
    } catch (\Throwable $e) {
      $this->connection->rollBack();
      throw $e;
    }
  }

  /** @return Order[] */
  public function listForUser(int $userId): array
  {
    $stmt = $this->connection->prepare('SELECT * FROM orders WHERE user_id = :uid ORDER BY created_at DESC');
    $stmt->execute(['uid' => $userId]);
    $rows = $stmt->fetchAll();
    return array_map(static fn(array $r) => Order::fromArray($r), $rows ?: []);
  }

  /** @return array<int, array> */
  public function getOrderItems(int $orderId): array
  {
    $stmt = $this->connection->prepare('SELECT * FROM order_items WHERE order_id = :oid');
    $stmt->execute(['oid' => $orderId]);
    return $stmt->fetchAll() ?: [];
  }
}
