<?php

declare(strict_types=1);

if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 2));
}

require_once BASE_PATH . '/src/repositories/CartRepository.php';
require_once BASE_PATH . '/src/repositories/OrderRepository.php';
require_once BASE_PATH . '/src/helpers/auth.php';
require_once BASE_PATH . '/src/config/order.php';

class OrderController
{
  public function __construct(private CartRepository $carts, private OrderRepository $orders)
  {
  }

  private function requireUserId(): int
  {
    $user = current_user();
    if (!$user || !isset($user['id'])) {
      throw new \RuntimeException('Unauthorized');
    }
    return (int)$user['id'];
  }

  public function checkout(array $payload): array
  {
    $uid = $this->requireUserId();
    $cart = $this->carts->getOrCreateActiveCart($uid);
    $details = $this->carts->getCartDetails($cart->id ?? 0);

    // Build snapshot
    $itemsSnapshot = [];
    foreach ($details['items'] as $it) {
      // get product name for snapshot
      $pstmt = db()->prepare('SELECT name FROM products WHERE id = :id');
      $pstmt->execute(['id' => $it->product_id]);
      $pname = ($pstmt->fetch()['name'] ?? '') ?: '';
      $delta = (float)($it->price_delta ?? 0);
      $itemsSnapshot[] = [
        'product_id' => $it->product_id,
        'product_name' => $pname,
        'unit_price' => $it->unit_price,
        'quantity' => $it->quantity,
        'line_total' => round(($it->unit_price + $delta) * $it->quantity, 2),
      ];
    }
    $orderConfig = require BASE_PATH . '/src/config/order.php';
    $delivery = (float) ($payload['delivery_fee'] ?? $orderConfig['delivery_fee']);
    $taxRate = (float) ($orderConfig['tax_rate'] ?? 0.08);
    $tax = round($details['subtotal'] * $taxRate, 2);
    $total = round($details['subtotal'] + $delivery + $tax, 2);
    $snapshot = [
      'items' => $itemsSnapshot,
      'subtotal' => $details['subtotal'],
      'delivery_fee' => $delivery,
      'tax' => $tax,
      'tax_rate' => $taxRate,
      'total' => $total,
    ];

    $orderId = $this->orders->createFromCart($uid, $snapshot);

    // mock payment: mark as paid immediately
  $upd = db()->prepare('UPDATE orders SET status = "paid", tax_rate = :rate, tax_amount = :tax WHERE id = :id');
  $upd->execute(['id' => $orderId, 'rate' => $taxRate, 'tax' => $tax]);

    // finalize cart
    $this->carts->clearCart($cart->id ?? 0);
    $this->carts->markConverted($cart->id ?? 0);

    return ['success' => true, 'order_id' => $orderId];
  }

  public function list(): array
  {
    $uid = $this->requireUserId();
    $orders = $this->orders->listForUser($uid);
    return ['success' => true, 'orders' => array_map(fn($o) => $o->toArray(), $orders)];
  }
}
