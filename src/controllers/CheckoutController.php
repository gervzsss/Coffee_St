<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\CartRepository;
use App\Repositories\ProductRepository;
use function App\Helpers\current_user;
use function App\Helpers\db;

class CheckoutController
{
  public function __construct(private CartRepository $carts, private ProductRepository $products)
  {
  }

  public function getViewData(?int $singleProductId = null, ?array $selectedIds = null): array
  {
    $user = current_user() ?? [];
    $uid = (int) ($user['id'] ?? 0);

    $cart = $this->carts->getOrCreateActiveCart($uid);
    $details = $this->carts->getCartDetails($cart->id ?? 0);
    $items = $details['items'] ?? [];

    $singleMode = $singleProductId ? true : false;
    $selectedMode = ($selectedIds !== null && count($selectedIds) > 0);
    if ($singleMode) {
      $items = array_values(array_filter($items, static fn($it) => (int) $it->product_id === $singleProductId));
      if (empty($items)) {
        $singleMode = false;
        $singleProductId = null;
      }
    } elseif ($selectedMode) {
      $lookup = array_fill_keys(array_map('intval', $selectedIds), true);
      $items = array_values(array_filter($items, static fn($it) => isset($lookup[(int) $it->product_id])));
      if (empty($items)) {
        $selectedMode = false;
        $selectedIds = null;
      }
    }

    if ($singleMode || $selectedMode) {
      $subtotal = 0.0;
      foreach ($items as $line) {
        $lineUnit = (float) $line->unit_price + (float) $line->price_delta;
        $subtotal += $lineUnit * (int) $line->quantity;
      }
      $subtotal = round($subtotal, 2);
    } else {
      $subtotal = (float) ($details['subtotal'] ?? 0.0);
    }

    $config = defined('BASE_PATH') ? require BASE_PATH . '/src/config/config.php' : ['order' => ['delivery_fee' => 1.78, 'tax_rate' => 0.08]];
    $deliveryFee = (float) ($config['order']['delivery_fee'] ?? 1.78);
    $taxRate = (float) ($config['order']['tax_rate'] ?? 0.08);
    $tax = round($subtotal * $taxRate, 2);
    $total = round($subtotal + $deliveryFee + $tax, 2);

    return [
      'user' => $user,
      'cart' => $cart,
      'items' => $items,
      'subtotal' => $subtotal,
      'deliveryFee' => $deliveryFee,
      'tax' => $tax,
      'total' => $total,
      'singleMode' => $singleMode,
      'singleProductId' => $singleProductId,
      'selectedMode' => $selectedMode,
      'selectedIds' => $selectedIds,
      // Also expose repositories when needed by views
      'productRepo' => $this->products,
    ];
  }
}
