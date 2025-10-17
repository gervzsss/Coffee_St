<?php

declare(strict_types=1);

class CartItem
{
  public function __construct(
    public ?int $id,
    public int $cart_id,
    public int $product_id,
    public ?int $variant_id,
    public ?string $variant_name,
    public float $price_delta,
    public int $quantity,
    public float $unit_price,
    public ?string $created_at = null,
    public ?string $updated_at = null,
  ) {
  }

  public static function fromArray(array $row): self
  {
    return new self(
      isset($row['id']) ? (int)$row['id'] : null,
      (int) ($row['cart_id'] ?? 0),
      (int) ($row['product_id'] ?? 0),
      isset($row['variant_id']) ? (int)$row['variant_id'] : null,
      $row['variant_name'] ?? null,
      (float) ($row['price_delta'] ?? 0),
      (int) ($row['quantity'] ?? 1),
      (float) ($row['unit_price'] ?? 0),
      $row['created_at'] ?? null,
      $row['updated_at'] ?? null,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'cart_id' => $this->cart_id,
      'product_id' => $this->product_id,
      'variant_id' => $this->variant_id,
      'variant_name' => $this->variant_name,
      'price_delta' => $this->price_delta,
      'quantity' => $this->quantity,
      'unit_price' => $this->unit_price,
      'created_at' => $this->created_at,
      'updated_at' => $this->updated_at,
    ];
  }
}
