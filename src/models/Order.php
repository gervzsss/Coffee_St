<?php

declare(strict_types=1);

class Order
{
  public function __construct(
    public ?int $id,
    public int $user_id,
    public string $status,
    public float $subtotal,
    public float $delivery_fee,
    public float $tax,
    public float $total,
    public ?string $created_at = null,
    public ?string $updated_at = null,
  ) {
  }

  public static function fromArray(array $row): self
  {
    return new self(
      isset($row['id']) ? (int)$row['id'] : null,
      (int) ($row['user_id'] ?? 0),
      (string) ($row['status'] ?? 'pending'),
      (float) ($row['subtotal'] ?? 0),
      (float) ($row['delivery_fee'] ?? 0),
      (float) ($row['tax'] ?? 0),
      (float) ($row['total'] ?? 0),
      $row['created_at'] ?? null,
      $row['updated_at'] ?? null,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'user_id' => $this->user_id,
      'status' => $this->status,
      'subtotal' => $this->subtotal,
      'delivery_fee' => $this->delivery_fee,
      'tax' => $this->tax,
      'total' => $this->total,
      'created_at' => $this->created_at,
      'updated_at' => $this->updated_at,
    ];
  }
}
