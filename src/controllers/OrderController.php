<?php
declare(strict_types=1);



namespace App\Controllers;

use App\Repositories\CartRepository;
use App\Repositories\OrderRepository;
use function App\Helpers\current_user;
use function App\Helpers\db;

/**
 * Controller for order actions (checkout, list).
 */
class OrderController
{
  public function __construct(private CartRepository $carts, private OrderRepository $orders)
  {
  }

  /**
   * Get the current user's ID or throw if not authenticated.
   *
   * @return int
   * @throws \RuntimeException
   */
  private function requireUserId(): int
  {
    $user = current_user();
    if (!$user || !isset($user['id'])) {
      throw new \RuntimeException('Unauthorized');
    }
    return (int) $user['id'];
  }

  /**
   * Handle checkout and order creation.
   *
   * @param array $payload
   * @return array
   */
  public function checkout(array $payload): array
  {
    $uid = $this->requireUserId();
    $cart = $this->carts->getOrCreateActiveCart($uid);
    $details = $this->carts->getCartDetails($cart->id ?? 0);
    $singleProductId = isset($payload['single_product_id']) && $payload['single_product_id']
      ? (int) $payload['single_product_id']
      : null;

    $items = $details['items'];
    if ($singleProductId) {
      $items = array_values(array_filter($items, static fn($it) => (int) $it->product_id === $singleProductId));
      if (empty($items)) {
        return ['success' => false, 'error' => 'Selected item is no longer in your cart.'];
      }
    }

    $subtotal = 0.0;
    foreach ($items as $it) {
      $lineUnit = (float) $it->unit_price + (float) $it->price_delta;
      $subtotal += $lineUnit * (int) $it->quantity;
    }
    if (!$singleProductId) {
      $subtotal = $details['subtotal'];
    } else {
      $subtotal = round($subtotal, 2);
    }

    // Build snapshot
    $itemsSnapshot = [];
    foreach ($items as $it) {
      // get product name for snapshot using merged helpers db()
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
    // Load order config from unified config
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

    // mock payment: mark as paid immediately
    $upd = db()->prepare('UPDATE orders SET status = "paid", tax_rate = :rate, tax_amount = :tax WHERE id = :id');
    $upd->execute(['id' => $orderId, 'rate' => $taxRate, 'tax' => $tax]);

    // finalize cart
    if ($singleProductId) {
      $this->carts->removeItem($cart->id ?? 0, $singleProductId);
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

  /**
   * List all orders for the current user.
   *
   * @return array
   */
  public function list(): array
  {
    $uid = $this->requireUserId();
    $orders = $this->orders->listForUser($uid);
    return ['success' => true, 'orders' => array_map(fn($o) => $o->toArray(), $orders)];
  }
}
