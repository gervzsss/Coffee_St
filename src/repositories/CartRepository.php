<?php

declare(strict_types=1);

if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 2));
}

require_once BASE_PATH . '/src/config/db.php';
require_once BASE_PATH . '/src/models/Cart.php';
require_once BASE_PATH . '/src/models/CartItem.php';
require_once BASE_PATH . '/src/repositories/ProductRepository.php';

class CartRepository
{
  public function __construct(private \PDO $connection)
  {
  }

  public function getOrCreateActiveCart(int $userId): Cart
  {
    $stmt = $this->connection->prepare('SELECT * FROM carts WHERE user_id = :uid AND status = "active" LIMIT 1');
    $stmt->execute(['uid' => $userId]);
    $row = $stmt->fetch();
    if ($row) {
      return Cart::fromArray($row);
    }
    $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
    $ins = $this->connection->prepare('INSERT INTO carts (user_id, status, created_at, updated_at) VALUES (:uid, "active", :c, :u)');
    $ins->execute(['uid' => $userId, 'c' => $now, 'u' => $now]);
    $id = (int)$this->connection->lastInsertId();
    return new Cart($id, $userId, 'active', $now, $now);
  }

  /** @return array{items: CartItem[], subtotal: float, count: int} */
  public function getCartDetails(int $cartId): array
  {
    $stmt = $this->connection->prepare('SELECT * FROM cart_items WHERE cart_id = :cid');
    $stmt->execute(['cid' => $cartId]);
    $rows = $stmt->fetchAll();
    $items = array_map(static fn(array $r) => CartItem::fromArray($r), $rows);
    $subtotal = 0.0; $count = 0;
    foreach ($items as $it) {
      $lineUnit = (float)$it->unit_price + (float)$it->price_delta;
      $subtotal += $lineUnit * (int)$it->quantity;
      $count += (int)$it->quantity;
    }
    return ['items' => $items, 'subtotal' => round($subtotal, 2), 'count' => $count];
  }

  public function addOrUpdateItem(int $cartId, int $productId, int $quantity, ?int $variantId = null): CartItem
  {
    $quantity = max(1, $quantity);
    // resolve price snapshot from product
    $productRepo = new ProductRepository($this->connection);
    $product = $productRepo->findById($productId);
    if (!$product) {
      throw new \RuntimeException('Product not found');
    }
    // variant lookup
    $variantName = null; $priceDelta = 0.0; $variantIdFiltered = null;
    if ($variantId) {
      try {
        $stmtV = $this->connection->prepare('SELECT id, name, price_delta FROM product_variants WHERE id = :id AND product_id = :pid');
        $stmtV->execute(['id' => $variantId, 'pid' => $productId]);
        if ($rowV = $stmtV->fetch()) {
          $variantIdFiltered = (int)$rowV['id'];
          $variantName = (string)$rowV['name'];
          $priceDelta = (float)$rowV['price_delta'];
        }
      } catch (\Throwable $e) {
        // variants table may not exist yet; ignore gracefully
        $variantIdFiltered = null; $variantName = null; $priceDelta = 0.0;
      }
    }
    $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
    // insert new row; allow multiple lines per product if variant differs
    try {
      // Variant-aware insert; relies on unique (cart_id, product_id, variant_id)
      $sql = 'INSERT INTO cart_items (cart_id, product_id, variant_id, variant_name, quantity, unit_price, price_delta, created_at, updated_at)
              VALUES (:cid, :pid, :vid, :vname, :qty, :price, :delta, :c, :u)
              ON DUPLICATE KEY UPDATE quantity = quantity + :qty2, updated_at = :u2';
      $stmt = $this->connection->prepare($sql);
      $stmt->execute([
        'cid' => $cartId,
        'pid' => $productId,
        'vid' => $variantIdFiltered,
        'vname' => $variantName,
        'qty' => $quantity,
        'price' => $product->price,
        'delta' => $priceDelta,
        'c' => $now,
        'u' => $now,
        'qty2' => $quantity,
        'u2' => $now,
      ]);
    } catch (\PDOException $ex) {
      // Fallback for legacy schema without variant columns and unique (cart_id, product_id)
      $legacySql = 'INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, created_at, updated_at)
                    VALUES (:cid, :pid, :qty, :price, :c, :u)
                    ON DUPLICATE KEY UPDATE quantity = quantity + :qty2, updated_at = :u2';
      $stmt = $this->connection->prepare($legacySql);
      $stmt->execute([
        'cid' => $cartId,
        'pid' => $productId,
        'qty' => $quantity,
        'price' => $product->price,
        'c' => $now,
        'u' => $now,
        'qty2' => $quantity,
        'u2' => $now,
      ]);
    }

    // return current row
    $sel = $this->connection->prepare('SELECT * FROM cart_items WHERE cart_id = :cid AND product_id = :pid ORDER BY id DESC LIMIT 1');
    $sel->execute(['cid' => $cartId, 'pid' => $productId]);
    $row = $sel->fetch();
    return CartItem::fromArray($row ?: []);
  }

  public function setQuantity(int $cartId, int $productId, int $quantity): void
  {
    if ($quantity <= 0) {
      $this->removeItem($cartId, $productId);
      return;
    }
    $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
    $stmt = $this->connection->prepare('UPDATE cart_items SET quantity = :q, updated_at = :u WHERE cart_id = :cid AND product_id = :pid');
    $stmt->execute(['q' => $quantity, 'u' => $now, 'cid' => $cartId, 'pid' => $productId]);
  }

  public function removeItem(int $cartId, int $productId): void
  {
    $stmt = $this->connection->prepare('DELETE FROM cart_items WHERE cart_id = :cid AND product_id = :pid');
    $stmt->execute(['cid' => $cartId, 'pid' => $productId]);
  }

  public function clearCart(int $cartId): void
  {
    $stmt = $this->connection->prepare('DELETE FROM cart_items WHERE cart_id = :cid');
    $stmt->execute(['cid' => $cartId]);
  }

  public function markConverted(int $cartId): void
  {
    $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
    $stmt = $this->connection->prepare('UPDATE carts SET status = "converted", updated_at = :u WHERE id = :id');
    $stmt->execute(['u' => $now, 'id' => $cartId]);
  }
}
