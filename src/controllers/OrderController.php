<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\CartRepository;
use App\Repositories\OrderRepository;
use function App\Helpers\current_user;
use function App\Helpers\db;

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
    return (int) $user['id'];
  }

  public function checkout(array $payload): array
  {
    $uid = $this->requireUserId();
    $cart = $this->carts->getOrCreateActiveCart($uid);
    $details = $this->carts->getCartDetails($cart->id ?? 0);
    $singleProductId = isset($payload['single_product_id']) && $payload['single_product_id']
      ? (int) $payload['single_product_id']
      : null;
    $selectedIds = isset($payload['selected_product_ids']) && is_array($payload['selected_product_ids'])
      ? array_values(array_unique(array_map('intval', $payload['selected_product_ids'])))
      : null;

    $items = $details['items'];
    if ($singleProductId) {
      $items = array_values(array_filter($items, static fn($it) => (int) $it->product_id === $singleProductId));
      if (empty($items)) {
        return ['success' => false, 'error' => 'Selected item is no longer in your cart.'];
      }
    } elseif ($selectedIds && count($selectedIds) > 0) {
      $lookup = array_fill_keys($selectedIds, true);
      $items = array_values(array_filter($items, static fn($it) => isset($lookup[(int) $it->product_id])));
      if (empty($items)) {
        return ['success' => false, 'error' => 'Selected items are no longer in your cart.'];
      }
    }

    $subtotal = 0.0;
    foreach ($items as $it) {
      $lineUnit = (float) $it->unit_price + (float) $it->price_delta;
      $subtotal += $lineUnit * (int) $it->quantity;
    }
    if (!$singleProductId && !($selectedIds && count($selectedIds) > 0)) {
      $subtotal = $details['subtotal'];
    } else {
      $subtotal = round($subtotal, 2);
    }

    $itemsSnapshot = [];
    foreach ($items as $it) {
      $pstmt = db()->prepare('SELECT name FROM products WHERE id = :id');
      $pstmt->execute(['id' => $it->product_id]);
      $pname = ($pstmt->fetch()['name'] ?? '') ?: '';
      $delta = (float) ($it->price_delta ?? 0);
      $itemsSnapshot[] = [
        'product_id' => $it->product_id,
        'product_name' => $pname,
        'unit_price' => $it->unit_price,
        'quantity' => $it->quantity,
        'line_total' => round(($it->unit_price + $delta) * $it->quantity, 2),
      ];
    }
    $config = defined('BASE_PATH')
      ? require BASE_PATH . '/src/config/config.php'
      : ['order' => ['delivery_fee' => 1.78, 'tax_rate' => 0.08]];
    $delivery = (float) ($payload['delivery_fee'] ?? ($config['order']['delivery_fee'] ?? 1.78));
    $taxRate = (float) (($config['order']['tax_rate'] ?? 0.08));
    $tax = round($subtotal * $taxRate, 2);
    $total = round($subtotal + $delivery + $tax, 2);
    $snapshot = [
      'items' => $itemsSnapshot,
      'subtotal' => $subtotal,
      'delivery_fee' => $delivery,
      'tax' => $tax,
      'tax_rate' => $taxRate,
      'total' => $total,
    ];

    $orderId = $this->orders->createFromCart($uid, $snapshot);

    $upd = db()->prepare('UPDATE orders SET status = "paid", tax_rate = :rate, tax_amount = :tax WHERE id = :id');
    $upd->execute(['id' => $orderId, 'rate' => $taxRate, 'tax' => $tax]);

    if ($singleProductId) {
      $this->carts->removeItem($cart->id ?? 0, $singleProductId);
      $remaining = $this->carts->getCartDetails($cart->id ?? 0);
      if (($remaining['count'] ?? 0) <= 0) {
        $this->carts->markConverted($cart->id ?? 0);
      }
    } elseif ($selectedIds && count($selectedIds) > 0) {
      foreach ($selectedIds as $pid) {
        $this->carts->removeItem($cart->id ?? 0, (int) $pid);
      }
      $remaining = $this->carts->getCartDetails($cart->id ?? 0);
      if (($remaining['count'] ?? 0) <= 0) {
        $this->carts->markConverted($cart->id ?? 0);
      }
    } else {
      $this->carts->clearCart($cart->id ?? 0);
      $this->carts->markConverted($cart->id ?? 0);
    }

    return ['success' => true, 'order_id' => $orderId];
  }

  public function list(): array
  {
    $uid = $this->requireUserId();
    $orders = $this->orders->listForUser($uid);
    return ['success' => true, 'orders' => array_map(fn($o) => $o->toArray(), $orders)];
  }

  public function detailData(int $orderId): array
  {
    $uid = $this->requireUserId();
    $orders = $this->orders->listForUser($uid);
    $order = null;
    foreach ($orders as $o) {
      if ((int) ($o->id ?? 0) === $orderId) {
        $order = $o;
        break;
      }
    }
    if (!$order) {
      return ['success' => false, 'error' => 'Order not found'];
    }
    $items = $this->orders->getOrderItems($orderId);
    return [
      'success' => true,
      'order' => $order->toArray(),
      'items' => $items,
    ];
  }
}
