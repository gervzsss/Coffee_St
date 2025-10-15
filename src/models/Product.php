<?php

declare(strict_types=1);

class Product
{
  public int $id;
  public string $category;
  public string $name;
  public string $description;
  public float $price;
  public string $image;
  public bool $is_active;
  public ?string $created_at;
  public ?string $updated_at;

  public function __construct(
    int $id,
    string $category,
    string $name,
    string $description,
    float $price,
    string $image,
    bool $is_active,
    ?string $created_at = null,
    ?string $updated_at = null,
  ) {
    $this->id = $id;
    $this->category = $category;
    $this->name = $name;
    $this->description = $description;
    $this->price = $price;
    $this->image = $image;
    $this->is_active = $is_active;
    $this->created_at = $created_at;
    $this->updated_at = $updated_at;
  }

  public static function fromArray(array $row): self
  {
    return new self(
      (int) ($row['id'] ?? 0),
      (string) ($row['category'] ?? ''),
      (string) ($row['name'] ?? ''),
      (string) ($row['description'] ?? ''),
      (float) ($row['price'] ?? 0),
      (string) ($row['image'] ?? ''),
      (bool) ((int) ($row['is_active'] ?? 1)),
      $row['created_at'] ?? null,
      $row['updated_at'] ?? null,
    );
  }

  public function toArray(): array
  {
    return [
      'id' => $this->id,
      'category' => $this->category,
      'name' => $this->name,
      'description' => $this->description,
      'price' => $this->price,
      'image' => $this->image,
      'is_active' => $this->is_active,
      'created_at' => $this->created_at,
      'updated_at' => $this->updated_at,
    ];
  }
}
