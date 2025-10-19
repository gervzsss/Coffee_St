<?php
declare(strict_types=1);

namespace App\Repositories;

use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\CartItem;

/**
 * Aggregated repositories for Coffee_St.
 * Includes: ProductRepository, UserRepository, OrderRepository, CartRepository, VariantRepository, InquiryRepository
 */

// ------------------------- ProductRepository -------------------------
class ProductRepository
{
  public function __construct(private \PDO $connection)
  {
  }

  /** @return Product[] */
  public function getAllActive(): array
  {
    $stmt = $this->connection->prepare(
      'SELECT * FROM products WHERE is_active = 1 ORDER BY category ASC, name ASC'
    );
    $stmt->execute();
    $rows = $stmt->fetchAll();
    if (!is_array($rows)) {
      return [];
    }
    return array_map(static fn(array $row): Product => Product::fromArray($row), $rows);
  }

  /** @return array<string, Product[]> */
  public function getActiveGroupedByCategory(): array
  {
    $products = $this->getAllActive();
    $grouped = [];
    foreach ($products as $product) {
      $grouped[$product->category][] = $product;
    }
    return $grouped;
  }

  public function findById(int $id): ?Product
  {
    $stmt = $this->connection->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    if (!is_array($row)) {
      return null;
    }
    return Product::fromArray($row);
  }
}

// ------------------------- UserRepository -------------------------
class UserRepository
{
  public function __construct(private \PDO $connection)
  {
  }

  public function findByEmail(string $email): ?User
  {
    $stmt = $this->connection->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
    $stmt->execute(['email' => $email]);
    $row = $stmt->fetch();
    if (!is_array($row)) {
      return null;
    }
    return User::fromArray($row);
  }

  public function createUser(array $data): User
  {
    $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
    $stmt = $this->connection->prepare(
      'INSERT INTO users (first_name, last_name, email, password_hash, address, phone, created_at, updated_at)
       VALUES (:first_name, :last_name, :email, :password_hash, :address, :phone, :created_at, :updated_at)'
    );
    $stmt->execute([
      'first_name' => $data['first_name'],
      'last_name' => $data['last_name'],
      'email' => $data['email'],
      'password_hash' => $data['password_hash'],
      'address' => $data['address'] ?? null,
      'phone' => $data['phone'] ?? null,
      'created_at' => $now,
      'updated_at' => $now,
    ]);
    $user = $this->findByEmail($data['email']);
    if ($user === null) {
      throw new \RuntimeException('Failed to create user record.');
    }
    return $user;
  }

  public function verifyCredentials(string $email, string $password): ?User
  {
    $user = $this->findByEmail($email);
    if (!$user || !$user->password_hash) {
      return null;
    }
    if (!password_verify($password, $user->password_hash)) {
      return null;
    }
    return $user;
  }
}

// ------------------------- OrderRepository -------------------------
class OrderRepository
{
  public function __construct(private \PDO $connection)
  {
  }

  /**
   * @param array{items: array<int,array{product_id:int,product_name:string,unit_price:float,quantity:int,line_total:float}>, subtotal: float, delivery_fee: float, tax: float, total: float} $snapshot
   */
  public function createFromCart(int $userId, array $snapshot): int
  {
    $this->connection->beginTransaction();
    try {
      $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
      $stmt = $this->connection->prepare('INSERT INTO orders (user_id, status, subtotal, delivery_fee, tax, total, created_at, updated_at) VALUES (:uid, "pending", :s, :d, :t, :tot, :c, :u)');
      $stmt->execute([
        'uid' => $userId,
        's' => $snapshot['subtotal'],
        'd' => $snapshot['delivery_fee'],
        't' => $snapshot['tax'],
        'tot' => $snapshot['total'],
        'c' => $now,
        'u' => $now,
      ]);
      $orderId = (int) $this->connection->lastInsertId();

      $itemStmt = $this->connection->prepare('INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, line_total, created_at, updated_at) VALUES (:oid, :pid, :name, :price, :qty, :line, :c, :u)');
      foreach ($snapshot['items'] as $it) {
        $itemStmt->execute([
          'oid' => $orderId,
          'pid' => $it['product_id'],
          'name' => $it['product_name'],
          'price' => $it['unit_price'],
          'qty' => $it['quantity'],
          'line' => $it['line_total'],
          'c' => $now,
          'u' => $now,
        ]);
      }

      $this->connection->commit();
      return $orderId;
    } catch (\Throwable $e) {
      $this->connection->rollBack();
      throw $e;
    }
  }

  /** @return Order[] */
  public function listForUser(int $userId): array
  {
    $stmt = $this->connection->prepare('SELECT * FROM orders WHERE user_id = :uid ORDER BY created_at DESC');
    $stmt->execute(['uid' => $userId]);
    $rows = $stmt->fetchAll();
    return array_map(static fn(array $r) => Order::fromArray($r), $rows ?: []);
  }

  /** @return array<int, array> */
  public function getOrderItems(int $orderId): array
  {
    $stmt = $this->connection->prepare('SELECT * FROM order_items WHERE order_id = :oid');
    $stmt->execute(['oid' => $orderId]);
    return $stmt->fetchAll() ?: [];
  }
}

// ------------------------- CartRepository -------------------------
class CartRepository
{
  public function __construct(private \PDO $connection)
  {
  }

  public function getOrCreateActiveCart(int $userId): Cart
  {
    $stmt = $this->connection->prepare('SELECT * FROM carts WHERE user_id = :uid AND status = "active" LIMIT 1');
    $stmt->execute(['uid' => $userId]);
    $row = $stmt->fetch();
    if ($row) {
      return Cart::fromArray($row);
    }
    $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
    $ins = $this->connection->prepare('INSERT INTO carts (user_id, status, created_at, updated_at) VALUES (:uid, "active", :c, :u)');
    $ins->execute(['uid' => $userId, 'c' => $now, 'u' => $now]);
    $id = (int) $this->connection->lastInsertId();
    return new Cart($id, $userId, 'active', $now, $now);
  }

  /** @return array{items: CartItem[], subtotal: float, count: int} */
  public function getCartDetails(int $cartId): array
  {
    $stmt = $this->connection->prepare('SELECT * FROM cart_items WHERE cart_id = :cid');
    $stmt->execute(['cid' => $cartId]);
    $rows = $stmt->fetchAll();
    $items = array_map(static fn(array $r) => CartItem::fromArray($r), $rows);
    $subtotal = 0.0;
    $count = 0;
    foreach ($items as $it) {
      $lineUnit = (float) $it->unit_price + (float) $it->price_delta;
      $subtotal += $lineUnit * (int) $it->quantity;
      $count += (int) $it->quantity;
    }
    return ['items' => $items, 'subtotal' => round($subtotal, 2), 'count' => $count];
  }

  public function addOrUpdateItem(int $cartId, int $productId, int $quantity, ?int $variantId = null): CartItem
  {
    $quantity = max(1, $quantity);
    $productRepo = new ProductRepository($this->connection);
    $product = $productRepo->findById($productId);
    if (!$product) {
      throw new \RuntimeException('Product not found');
    }
    $variantName = null;
    $priceDelta = 0.0;
    $variantIdFiltered = null;
    if ($variantId) {
      try {
        $stmtV = $this->connection->prepare('SELECT id, name, price_delta FROM product_variants WHERE id = :id AND product_id = :pid');
        $stmtV->execute(['id' => $variantId, 'pid' => $productId]);
        if ($rowV = $stmtV->fetch()) {
          $variantIdFiltered = (int) $rowV['id'];
          $variantName = (string) $rowV['name'];
          $priceDelta = (float) $rowV['price_delta'];
        }
      } catch (\Throwable $e) {
        $variantIdFiltered = null;
        $variantName = null;
        $priceDelta = 0.0;
      }
    }
    $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
    try {
      $sql = 'INSERT INTO cart_items (cart_id, product_id, variant_id, variant_name, quantity, unit_price, price_delta, created_at, updated_at)
              VALUES (:cid, :pid, :vid, :vname, :qty, :price, :delta, :c, :u)
              ON DUPLICATE KEY UPDATE quantity = quantity + :qty2, updated_at = :u2';
      $stmt = $this->connection->prepare($sql);
      $stmt->execute([
        'cid' => $cartId,
        'pid' => $productId,
        'vid' => $variantIdFiltered,
        'vname' => $variantName,
        'qty' => $quantity,
        'price' => $product->price,
        'delta' => $priceDelta,
        'c' => $now,
        'u' => $now,
        'qty2' => $quantity,
        'u2' => $now,
      ]);
    } catch (\PDOException $ex) {
      $legacySql = 'INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, created_at, updated_at)
                    VALUES (:cid, :pid, :qty, :price, :c, :u)
                    ON DUPLICATE KEY UPDATE quantity = quantity + :qty2, updated_at = :u2';
      $stmt = $this->connection->prepare($legacySql);
      $stmt->execute([
        'cid' => $cartId,
        'pid' => $productId,
        'qty' => $quantity,
        'price' => $product->price,
        'c' => $now,
        'u' => $now,
        'qty2' => $quantity,
        'u2' => $now,
      ]);
    }

    $sel = $this->connection->prepare('SELECT * FROM cart_items WHERE cart_id = :cid AND product_id = :pid ORDER BY id DESC LIMIT 1');
    $sel->execute(['cid' => $cartId, 'pid' => $productId]);
    $row = $sel->fetch();
    return CartItem::fromArray($row ?: []);
  }

  public function setQuantity(int $cartId, int $productId, int $quantity): void
  {
    if ($quantity <= 0) {
      $this->removeItem($cartId, $productId);
      return;
    }
    $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
    $stmt = $this->connection->prepare('UPDATE cart_items SET quantity = :q, updated_at = :u WHERE cart_id = :cid AND product_id = :pid');
    $stmt->execute(['q' => $quantity, 'u' => $now, 'cid' => $cartId, 'pid' => $productId]);
  }

  public function removeItem(int $cartId, int $productId): void
  {
    $stmt = $this->connection->prepare('DELETE FROM cart_items WHERE cart_id = :cid AND product_id = :pid');
    $stmt->execute(['cid' => $cartId, 'pid' => $productId]);
  }

  public function clearCart(int $cartId): void
  {
    $stmt = $this->connection->prepare('DELETE FROM cart_items WHERE cart_id = :cid');
    $stmt->execute(['cid' => $cartId]);
  }

  public function markConverted(int $cartId): void
  {
    $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
    $stmt = $this->connection->prepare('UPDATE carts SET status = "converted", updated_at = :u WHERE id = :id');
    $stmt->execute(['u' => $now, 'id' => $cartId]);
  }
}

// ------------------------- VariantRepository -------------------------
class VariantRepository
{
  public function __construct(private \PDO $connection)
  {
  }

  /** @return array<int, array{group_name:string,name:string,price_delta:float,id:int}> */
  public function getActiveByProduct(int $productId): array
  {
    $stmt = $this->connection->prepare('SELECT id, group_name, name, price_delta FROM product_variants WHERE product_id = :pid AND is_active = 1 ORDER BY group_name, name');
    $stmt->execute(['pid' => $productId]);
    $rows = $stmt->fetchAll() ?: [];
    return array_map(static function (array $r) {
      return [
        'id' => (int) $r['id'],
        'group_name' => (string) $r['group_name'],
        'name' => (string) $r['name'],
        'price_delta' => (float) $r['price_delta'],
      ];
    }, $rows);
  }
}

// ------------------------- InquiryRepository -------------------------
class InquiryRepository
{
  private const VALID_STATUSES = ['pending', 'responded', 'done'];
  public function __construct(private \PDO $pdo)
  {
  }

  private function findExistingThread(?int $userId, ?string $guestEmail, string $subject): ?array
  {
    $subject = trim($subject);
    if ($subject === '') {
      return null;
    }
    if ($userId !== null) {
      $stmt = $this->pdo->prepare(
        'SELECT * FROM inquiry_threads WHERE user_id = :user_id AND subject = :subject LIMIT 1',
      );
      $stmt->execute([
        'user_id' => $userId,
        'subject' => $subject,
      ]);
      $thread = $stmt->fetch();
      if ($thread) {
        return $thread;
      }
    }
    if ($guestEmail !== null) {
      $stmt = $this->pdo->prepare(
        'SELECT * FROM inquiry_threads WHERE guest_email = :guest_email AND subject = :subject LIMIT 1',
      );
      $stmt->execute([
        'guest_email' => $guestEmail,
        'subject' => $subject,
      ]);
      $thread = $stmt->fetch();
      if ($thread) {
        return $thread;
      }
    }
    return null;
  }

  private function createThread(
    ?int $userId,
    ?string $guestEmail,
    ?string $guestName,
    string $subject,
  ): int {
    $stmt = $this->pdo->prepare(
      'INSERT INTO inquiry_threads (user_id, guest_email, guest_name, subject, status, last_message_at) VALUES (:user_id, :guest_email, :guest_name, :subject, :status, NOW())',
    );
    $stmt->execute([
      'user_id' => $userId,
      'guest_email' => $guestEmail,
      'guest_name' => $guestName,
      'subject' => $subject,
      'status' => 'pending',
    ]);
    return (int) $this->pdo->lastInsertId();
  }

  private function updateThreadMetadata(int $threadId, array $fields): void
  {
    if (empty($fields)) {
      return;
    }
    $setParts = [];
    $params = ['id' => $threadId];
    foreach ($fields as $column => $value) {
      $setParts[] = sprintf('%s = :%s', $column, $column);
      $params[$column] = $value;
    }
    $sql = 'UPDATE inquiry_threads SET ' . implode(', ', $setParts) . ' WHERE id = :id';
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute($params);
  }

  private function addMessage(
    int $threadId,
    string $senderType,
    ?int $senderId,
    string $senderName,
    ?string $senderEmail,
    string $message,
  ): int {
    $stmt = $this->pdo->prepare(
      'INSERT INTO thread_messages (thread_id, sender_type, sender_id, sender_name, sender_email, message) VALUES (:thread_id, :sender_type, :sender_id, :sender_name, :sender_email, :message)',
    );
    $stmt->execute([
      'thread_id' => $threadId,
      'sender_type' => $senderType,
      'sender_id' => $senderId,
      'sender_name' => $senderName,
      'sender_email' => $senderEmail,
      'message' => $message,
    ]);

    $timestamp = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
    $this->updateThreadMetadata(
      $threadId,
      [
        'last_message_at' => $timestamp,
        'updated_at' => $timestamp,
      ],
    );

    return (int) $this->pdo->lastInsertId();
  }

  private function getThreadSummary(int $threadId): ?array
  {
    $stmt = $this->pdo->prepare(
      'SELECT t.*, u.first_name, u.last_name, u.email AS user_email
                FROM inquiry_threads t
                LEFT JOIN users u ON t.user_id = u.id
                WHERE t.id = :id',
    );
    $stmt->execute(['id' => $threadId]);
    $thread = $stmt->fetch();
    if (!$thread) {
      return null;
    }

    $detailsStmt = $this->pdo->prepare(
      'SELECT
                (SELECT tm.message FROM thread_messages tm WHERE tm.thread_id = :thread_id1 AND tm.sender_type IN (\'user\', \'guest\') ORDER BY tm.created_at ASC LIMIT 1) AS first_customer_message,
                (SELECT tm.message FROM thread_messages tm WHERE tm.thread_id = :thread_id2 AND tm.sender_type IN (\'user\', \'guest\') ORDER BY tm.created_at DESC LIMIT 1) AS latest_customer_message,
                (SELECT tm.created_at FROM thread_messages tm WHERE tm.thread_id = :thread_id3 ORDER BY tm.created_at ASC LIMIT 1) AS first_message_at,
                (SELECT tm.created_at FROM thread_messages tm WHERE tm.thread_id = :thread_id4 ORDER BY tm.created_at DESC LIMIT 1) AS last_message_created_at,
                (SELECT COUNT(*) FROM thread_messages tm WHERE tm.thread_id = :thread_id5 AND tm.sender_type = \'admin\') AS admin_reply_count'
    );
    $detailsStmt->execute([
      'thread_id1' => $threadId,
      'thread_id2' => $threadId,
      'thread_id3' => $threadId,
      'thread_id4' => $threadId,
      'thread_id5' => $threadId,
    ]);
    $details = $detailsStmt->fetch() ?: [];

    return array_merge($thread, $details);
  }

  public function submitInquiry(
    ?int $userId,
    ?string $guestEmail,
    ?string $guestName,
    string $subject,
    string $message,
    string $senderName,
    ?string $senderEmail,
  ): array {
    $subject = trim($subject);
    if ($subject === '') {
      throw new \InvalidArgumentException('Subject is required for threading.');
    }

    $message = trim($message);
    if ($message === '') {
      throw new \InvalidArgumentException('Message cannot be empty.');
    }

    $senderType = $userId !== null ? 'user' : 'guest';

    $this->pdo->beginTransaction();
    try {
      $thread = $this->findExistingThread($userId, $guestEmail, $subject);
      if ($thread === null) {
        $threadId = $this->createThread($userId, $guestEmail, $guestName, $subject);
      } else {
        $threadId = (int) $thread['id'];
        if ($guestName !== null && $thread['guest_name'] === null) {
          $this->updateThreadMetadata($threadId, ['guest_name' => $guestName]);
        }
      }

      $this->addMessage($threadId, $senderType, $userId, $senderName, $senderEmail, $message);
      $this->setThreadStatus($threadId, 'pending');

      $this->pdo->commit();
      $summary = $this->getThreadSummary($threadId);
      if (!$summary) {
        throw new \RuntimeException('Unable to load thread summary.');
      }
      return $summary;
    } catch (\Throwable $e) {
      if ($this->pdo->inTransaction()) {
        $this->pdo->rollBack();
      }
      throw $e;
    }
  }

  public function recordAdminReply(
    int $threadId,
    string $message,
    string $adminName,
    ?string $adminEmail,
    ?int $adminUserId = null,
  ): array {
    $message = trim($message);
    if ($message === '') {
      throw new \InvalidArgumentException('Reply message cannot be empty.');
    }

    $this->pdo->beginTransaction();
    try {
      $thread = $this->getThreadById($threadId);
      if (!$thread) {
        throw new \RuntimeException('Thread not found.');
      }

      $this->addMessage($threadId, 'admin', $adminUserId, $adminName, $adminEmail, $message);
      $this->setThreadStatus($threadId, 'responded');
      $this->updateThreadMetadata($threadId, ['admin_last_viewed_at' => (new \DateTimeImmutable())->format('Y-m-d H:i:s')]);

      $this->pdo->commit();

      $summary = $this->getThreadSummary($threadId);
      if (!$summary) {
        throw new \RuntimeException('Unable to load thread summary.');
      }
      return $summary;
    } catch (\Throwable $e) {
      if ($this->pdo->inTransaction()) {
        $this->pdo->rollBack();
      }
      throw $e;
    }
  }

  public function markThreadViewedByAdmin(int $threadId): void
  {
    $this->updateThreadMetadata($threadId, [
      'admin_last_viewed_at' => (new \DateTimeImmutable())->format('Y-m-d H:i:s'),
    ]);
  }

  public function getThreadById(int $threadId): ?array
  {
    $stmt = $this->pdo->prepare('SELECT * FROM inquiry_threads WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $threadId]);
    $thread = $stmt->fetch();
    return $thread ?: null;
  }

  public function getThreadWithMessages(int $threadId): ?array
  {
    $thread = $this->getThreadSummary($threadId);
    if (!$thread) {
      return null;
    }
    $messagesStmt = $this->pdo->prepare(
      'SELECT * FROM thread_messages WHERE thread_id = :thread_id ORDER BY created_at ASC',
    );
    $messagesStmt->execute(['thread_id' => $threadId]);
    $messages = $messagesStmt->fetchAll();
    return [
      'thread' => $thread,
      'messages' => $messages,
    ];
  }

  public function getThreadsForAdmin(?string $status = null, int $limit = 100, int $offset = 0): array
  {
    $constraints = [];
    $params = [];
    if ($status !== null) {
      $status = strtolower($status);
      if (!in_array($status, self::VALID_STATUSES, true)) {
        throw new \InvalidArgumentException('Invalid status filter.');
      }
      $constraints[] = 't.status = :status';
      $params['status'] = $status;
    }
    $where = $constraints ? ('WHERE ' . implode(' AND ', $constraints)) : '';
    $sql = 'SELECT
                            t.id,
                            t.user_id,
                            t.guest_email,
                            t.guest_name,
                            t.subject,
                            t.status,
                            t.created_at,
                            t.updated_at,
                            t.last_message_at,
                            t.admin_last_viewed_at,
                            CASE
                              WHEN t.admin_last_viewed_at IS NULL THEN 1
                              WHEN t.last_message_at > t.admin_last_viewed_at THEN 1
                              ELSE 0
                            END AS has_unread,
                            u.first_name,
                            u.last_name,
                            u.email AS user_email,
                            (
                                SELECT tm.message
                                FROM thread_messages tm
                                WHERE tm.thread_id = t.id AND tm.sender_type IN (\'user\', \'guest\')
                                ORDER BY tm.created_at ASC
                                LIMIT 1
                            ) AS first_customer_message,
                            (
                                SELECT tm.message
                                FROM thread_messages tm
                WHERE tm.thread_id = t.id
                                ORDER BY tm.created_at DESC
                                LIMIT 1
                            ) AS latest_customer_message,
                            (
                                SELECT tm.created_at
                                FROM thread_messages tm
                                WHERE tm.thread_id = t.id
                                ORDER BY tm.created_at ASC
                                LIMIT 1
                            ) AS first_message_at,
                            (
                                SELECT COUNT(*)
                                FROM thread_messages tm
                                WHERE tm.thread_id = t.id AND tm.sender_type = \'admin\'
                            ) AS admin_reply_count
                        FROM inquiry_threads t
                        LEFT JOIN users u ON t.user_id = u.id
                        ' . $where . '
                        ORDER BY t.last_message_at DESC
                        LIMIT :limit OFFSET :offset';
    $stmt = $this->pdo->prepare($sql);
    $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
    foreach ($params as $key => $value) {
      $stmt->bindValue(':' . $key, $value);
    }
    $stmt->execute();
    return $stmt->fetchAll();
  }

  public function getThreadsForUser(int $userId): array
  {
    $sql = 'SELECT t.*, (
                            SELECT tm.message FROM thread_messages tm WHERE tm.thread_id = t.id ORDER BY tm.created_at DESC LIMIT 1
                        ) AS last_message,
                        (
                            SELECT tm.created_at FROM thread_messages tm WHERE tm.thread_id = t.id ORDER BY tm.created_at DESC LIMIT 1
                        ) AS last_message_created_at
                        FROM inquiry_threads t
                        WHERE t.user_id = :user_id
                        ORDER BY t.last_message_at DESC';

    $stmt = $this->pdo->prepare($sql);
    $stmt->execute(['user_id' => $userId]);
    return $stmt->fetchAll();
  }

  /**
   * Fetch threads for a logged-in user including any previous guest threads that match their email.
   * This helps surface historical inquiries submitted before account creation or login.
   */
  public function getThreadsForUserOrEmail(int $userId, string $email): array
  {
    $email = trim(strtolower($email));
    $sql = 'SELECT t.*, (
                            SELECT tm.message FROM thread_messages tm WHERE tm.thread_id = t.id ORDER BY tm.created_at DESC LIMIT 1
                        ) AS last_message,
                        (
                            SELECT tm.created_at FROM thread_messages tm WHERE tm.thread_id = t.id ORDER BY tm.created_at DESC LIMIT 1
                        ) AS last_message_created_at
                        FROM inquiry_threads t
                        WHERE t.user_id = :user_id OR (t.user_id IS NULL AND t.guest_email = :email)
                        ORDER BY t.last_message_at DESC';

    $stmt = $this->pdo->prepare($sql);
    $stmt->execute(['user_id' => $userId, 'email' => $email]);
    return $stmt->fetchAll();
  }

  public function setThreadStatus(int $threadId, string $status): void
  {
    $status = strtolower($status);
    if (!in_array($status, self::VALID_STATUSES, true)) {
      throw new \InvalidArgumentException('Invalid thread status provided.');
    }
    $stmt = $this->pdo->prepare(
      'UPDATE inquiry_threads SET status = :status, updated_at = NOW() WHERE id = :id',
    );
    $stmt->execute([
      'status' => $status,
      'id' => $threadId,
    ]);
  }

  public function markThreadDone(int $threadId): array
  {
    $this->setThreadStatus($threadId, 'done');
    $summary = $this->getThreadSummary($threadId);
    if (!$summary) {
      throw new \RuntimeException('Unable to load thread summary.');
    }
    return $summary;
  }
}
