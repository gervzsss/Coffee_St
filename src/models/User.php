<?php

declare(strict_types=1);

class User
{
  public function __construct(
    public ?int $id,
    public string $first_name,
    public string $last_name,
    public string $email,
    public ?string $address,
    public ?string $phone,
    public ?string $password_hash,
    public ?string $created_at = null,
    public ?string $updated_at = null
  ) {
  }

  public static function fromArray(array $data): self
  {
    return new self(
      isset($data['id']) ? (int) $data['id'] : null,
      $data['first_name'] ?? '',
      $data['last_name'] ?? '',
      $data['email'] ?? '',
      $data['address'] ?? null,
      $data['phone'] ?? null,
      $data['password_hash'] ?? null,
      $data['created_at'] ?? null,
      $data['updated_at'] ?? null
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'first_name' => $this->first_name,
      'last_name' => $this->last_name,
      'email' => $this->email,
      'address' => $this->address,
      'phone' => $this->phone,
      'created_at' => $this->created_at,
      'updated_at' => $this->updated_at,
    ];
  }
}
