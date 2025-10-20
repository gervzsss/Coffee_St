<?php
declare(strict_types=1);



namespace App\Controllers;

use App\Repositories\CartRepository;
use App\Repositories\ProductRepository;
use function App\Helpers\current_user;
use function App\Helpers\db;

/**
 * Controller for cart actions (add, setQty, remove, get).
 */
class CartController
{
  public function __construct(private CartRepository $repo, private ?ProductRepository $products = null)
  {
    // Allow backward-compatible construction from existing API usage by lazily creating ProductRepository
    if ($this->products === null) {
      try {
        $this->products = new ProductRepository(db());
      } catch (\Throwable $e) {
        // If db() is not available in some contexts (e.g., during certain tests), leave as null
        $this->products = null;
      }
    }
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
   * Add an item to the cart.
   *
   * @param array $payload
   * @return array
   */
  public function add(array $payload): array
  {
    $uid = $this->requireUserId();
    $cart = $this->repo->getOrCreateActiveCart($uid);
    $productId = (int) ($payload['product_id'] ?? 0);
    $qty = max(1, (int) ($payload['quantity'] ?? 1));
    $variantId = isset($payload['variant_id']) ? (int) $payload['variant_id'] : null;
    $item = $this->repo->addOrUpdateItem($cart->id ?? 0, $productId, $qty, $variantId);
    $summary = $this->repo->getCartDetails($cart->id ?? 0);
    return [
      'success' => true,
      'item' => $item->toArray(),
      'summary' => $summary,
    ];
  }

  /**
   * Set the quantity of an item in the cart.
   *
   * @param array $payload
   * @return array
   */
  public function setQty(array $payload): array
  {
    $uid = $this->requireUserId();
    $cart = $this->repo->getOrCreateActiveCart($uid);
    $pid = (int) ($payload['product_id'] ?? 0);
    $qty = (int) ($payload['quantity'] ?? 0);
    $this->repo->setQuantity($cart->id ?? 0, $pid, $qty);
    $summary = $this->repo->getCartDetails($cart->id ?? 0);
    return ['success' => true, 'summary' => $summary];
  }

  /**
   * Remove an item from the cart.
   *
   * @param array $payload
   * @return array
   */
  public function remove(array $payload): array
  {
    $uid = $this->requireUserId();
    $cart = $this->repo->getOrCreateActiveCart($uid);
    $pid = (int) ($payload['product_id'] ?? 0);
    $this->repo->removeItem($cart->id ?? 0, $pid);
    $summary = $this->repo->getCartDetails($cart->id ?? 0);
    return ['success' => true, 'summary' => $summary];
  }

  /**
   * Get the current user's cart.
   *
   * @return array
   */
  public function get(): array
  {
    $uid = $this->requireUserId();
    $cart = $this->repo->getOrCreateActiveCart($uid);
    $summary = $this->repo->getCartDetails($cart->id ?? 0);
    return ['success' => true, 'cart' => $cart->toArray(), 'summary' => $summary];
  }

  /**
   * Build a view model for rendering the cart page without throwing on guests.
   * Returns keys:
   * - isAuthenticated: bool
   * - items: array<int, array{product_id:int, quantity:int, unit_price:float, price_delta:float, variant_name:?string}>
   * - products: array<int, array{id:int,name:string,image:string,price:float}>
   * - subtotal: float
   * - deliveryFee: float
   * - tax: float
   * - total: float
   */
  public function viewData(): array
  {
    $user = current_user();
    if (!$user || !isset($user['id'])) {
      return [
        'isAuthenticated' => false,
        'items' => [],
        'products' => [],
        'subtotal' => 0.0,
        'deliveryFee' => (float) (($this->loadConfig()['order']['delivery_fee'] ?? 1.78)),
        'tax' => 0.0,
        'total' => 0.0,
      ];
    }

    $uid = (int) $user['id'];
    $cart = $this->repo->getOrCreateActiveCart($uid);
    $details = $this->repo->getCartDetails($cart->id ?? 0);
    $itemsVm = [];
    $productMap = [];
    foreach ($details['items'] as $it) {
      $pid = (int) $it->product_id;
      $itemsVm[] = [
        'product_id' => $pid,
        'quantity' => (int) $it->quantity,
        'unit_price' => (float) $it->unit_price,
        'price_delta' => (float) ($it->price_delta ?? 0),
        'variant_name' => $it->variant_name ?? null,
      ];
      if ($this->products && !isset($productMap[$pid])) {
        $p = $this->products->findById($pid);
        if ($p) {
          $productMap[$pid] = [
            'id' => (int) $p->id,
            'name' => (string) $p->name,
            'image' => (string) $p->image,
            'price' => (float) $p->price,
          ];
        }
      }
    }

    $subtotal = (float) ($details['subtotal'] ?? 0.0);
    $cfg = $this->loadConfig();
    $delivery = (float) ($cfg['order']['delivery_fee'] ?? 1.78);
    $taxRate = (float) ($cfg['order']['tax_rate'] ?? 0.08);
    $tax = round($subtotal * $taxRate, 2);
    $total = round($subtotal + $delivery + $tax, 2);

    return [
      'isAuthenticated' => true,
      'items' => $itemsVm,
      'products' => $productMap,
      'subtotal' => $subtotal,
      'deliveryFee' => $delivery,
      'tax' => $tax,
      'total' => $total,
    ];
  }

  /**
   * Load unified configuration.
   * @return array
   */
  private function loadConfig(): array
  {
    try {
      if (defined('BASE_PATH')) {
        /** @var array $cfg */
        $cfg = require BASE_PATH . '/src/config/config.php';
        return $cfg;
      }
    } catch (\Throwable $e) {
      // fall through
    }
    return [
      'order' => [
        'delivery_fee' => 1.78,
        'tax_rate' => 0.08,
      ],
    ];
  }
}
