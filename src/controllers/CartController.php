<?php
declare(strict_types=1);



namespace App\Controllers;

use App\Repositories\CartRepository;
use function App\Helpers\current_user;

/**
 * Controller for cart actions (add, setQty, remove, get).
 */
class CartController
{
  public function __construct(private CartRepository $repo)
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
}
