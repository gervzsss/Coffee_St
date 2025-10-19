<?php
declare(strict_types=1);

namespace App\Models;

/**
 * Aggregated model classes for Coffee_St.
 * Includes: Product, User, Cart, CartItem, Order, OrderItem
 */

// ------------------------- Product -------------------------
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

// ------------------------- User -------------------------
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

// ------------------------- Cart -------------------------
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
      isset($row['id']) ? (int) $row['id'] : null,
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

// ------------------------- CartItem -------------------------
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
      isset($row['id']) ? (int) $row['id'] : null,
      (int) ($row['cart_id'] ?? 0),
      (int) ($row['product_id'] ?? 0),
      isset($row['variant_id']) ? (int) $row['variant_id'] : null,
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

// ------------------------- Order -------------------------
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
      isset($row['id']) ? (int) $row['id'] : null,
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

// ------------------------- OrderItem -------------------------
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
      isset($row['id']) ? (int) $row['id'] : null,
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
