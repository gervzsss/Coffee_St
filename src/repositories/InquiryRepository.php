<?php

declare(strict_types=1);

// src/repositories/InquiryRepository.php
class InquiryRepository
{
  private const VALID_STATUSES = ['pending', 'responded', 'done'];

  private \PDO $pdo;

  public function __construct(\PDO $pdo)
  {
    $this->pdo = $pdo;
  }

  /**
   * Locate an existing thread for the provided user/email + subject combination.
   */
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

    $timestamp = (new DateTimeImmutable())->format('Y-m-d H:i:s');
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
      throw new InvalidArgumentException('Subject is required for threading.');
    }

    $message = trim($message);
    if ($message === '') {
      throw new InvalidArgumentException('Message cannot be empty.');
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
        throw new RuntimeException('Unable to load thread summary.');
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
      throw new InvalidArgumentException('Reply message cannot be empty.');
    }

    $this->pdo->beginTransaction();
    try {
      $thread = $this->getThreadById($threadId);
      if (!$thread) {
        throw new RuntimeException('Thread not found.');
      }

  $this->addMessage($threadId, 'admin', $adminUserId, $adminName, $adminEmail, $message);
  $this->setThreadStatus($threadId, 'responded');
  // Auto-mark as read when admin replies
  $this->updateThreadMetadata($threadId, ['admin_last_viewed_at' => (new \DateTimeImmutable())->format('Y-m-d H:i:s')]);

      $this->pdo->commit();

      $summary = $this->getThreadSummary($threadId);
      if (!$summary) {
        throw new RuntimeException('Unable to load thread summary.');
      }
      return $summary;
    } catch (\Throwable $e) {
      if ($this->pdo->inTransaction()) {
        $this->pdo->rollBack();
      }
      throw $e;
    }
  }

  /**
   * Mark a thread as viewed by admin now.
   */
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
        throw new InvalidArgumentException('Invalid status filter.');
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

  public function setThreadStatus(int $threadId, string $status): void
  {
    $status = strtolower($status);
    if (!in_array($status, self::VALID_STATUSES, true)) {
      throw new InvalidArgumentException('Invalid thread status provided.');
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
      throw new RuntimeException('Unable to load thread summary.');
    }
    return $summary;
  }
}
