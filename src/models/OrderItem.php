<?php

declare(strict_types=1);

class OrderItem
{
  public function __construct(
    public ?int $id,
    public int $order_id,
    public int $product_id,
    public string $product_name,
    public float $unit_price,
    public int $quantity,
    public float $line_total,
    public ?string $created_at = null,
    public ?string $updated_at = null,
  ) {
  }

  public static function fromArray(array $row): self
  {
    return new self(
      isset($row['id']) ? (int)$row['id'] : null,
      (int) ($row['order_id'] ?? 0),
      (int) ($row['product_id'] ?? 0),
      (string) ($row['product_name'] ?? ''),
      (float) ($row['unit_price'] ?? 0),
      (int) ($row['quantity'] ?? 1),
      (float) ($row['line_total'] ?? 0),
      $row['created_at'] ?? null,
      $row['updated_at'] ?? null,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'order_id' => $this->order_id,
      'product_id' => $this->product_id,
      'product_name' => $this->product_name,
      'unit_price' => $this->unit_price,
      'quantity' => $this->quantity,
      'line_total' => $this->line_total,
      'created_at' => $this->created_at,
      'updated_at' => $this->updated_at,
    ];
  }
}
