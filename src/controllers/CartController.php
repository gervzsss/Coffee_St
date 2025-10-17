<?php

declare(strict_types=1);

if (!defined('BASE_PATH')) {
  define('BASE_PATH', dirname(__DIR__, 2));
}

require_once BASE_PATH . '/src/repositories/CartRepository.php';
require_once BASE_PATH . '/src/helpers/auth.php';

class CartController
{
  public function __construct(private CartRepository $repo)
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

  public function add(array $payload): array
  {
    $uid = $this->requireUserId();
    $cart = $this->repo->getOrCreateActiveCart($uid);
    $productId = (int)($payload['product_id'] ?? 0);
    $qty = max(1, (int)($payload['quantity'] ?? 1));
    $variantId = isset($payload['variant_id']) ? (int)$payload['variant_id'] : null;
    $item = $this->repo->addOrUpdateItem($cart->id ?? 0, $productId, $qty, $variantId);
    $summary = $this->repo->getCartDetails($cart->id ?? 0);
    return [
      'success' => true,
      'item' => $item->toArray(),
      'summary' => $summary,
    ];
  }

  public function setQty(array $payload): array
  {
    $uid = $this->requireUserId();
    $cart = $this->repo->getOrCreateActiveCart($uid);
    $pid = (int)($payload['product_id'] ?? 0);
    $qty = (int)($payload['quantity'] ?? 0);
    $this->repo->setQuantity($cart->id ?? 0, $pid, $qty);
    $summary = $this->repo->getCartDetails($cart->id ?? 0);
    return ['success' => true, 'summary' => $summary];
  }

  public function remove(array $payload): array
  {
    $uid = $this->requireUserId();
    $cart = $this->repo->getOrCreateActiveCart($uid);
    $pid = (int)($payload['product_id'] ?? 0);
    $this->repo->removeItem($cart->id ?? 0, $pid);
    $summary = $this->repo->getCartDetails($cart->id ?? 0);
    return ['success' => true, 'summary' => $summary];
  }

  public function get(): array
  {
    $uid = $this->requireUserId();
    $cart = $this->repo->getOrCreateActiveCart($uid);
    $summary = $this->repo->getCartDetails($cart->id ?? 0);
    return ['success' => true, 'cart' => $cart->toArray(), 'summary' => $summary];
  }
}
