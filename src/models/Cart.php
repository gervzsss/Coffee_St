<?php

declare(strict_types=1);

class Cart
{
  public function __construct(
    public ?int $id,
    public int $user_id,
    public string $status = 'active',
    public ?string $created_at = null,
    public ?string $updated_at = null,
  ) {
  }

  public static function fromArray(array $row): self
  {
    return new self(
      isset($row['id']) ? (int)$row['id'] : null,
      (int) ($row['user_id'] ?? 0),
      (string) ($row['status'] ?? 'active'),
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
      'created_at' => $this->created_at,
      'updated_at' => $this->updated_at,
    ];
  }
}
