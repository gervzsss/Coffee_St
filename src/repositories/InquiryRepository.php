<?php
// src/repositories/InquiryRepository.php
class InquiryRepository {
    private $pdo;
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    public function getAll($limit = 50, $offset = 0) {
        $stmt = $this->pdo->prepare('SELECT i.*, u.email AS user_email FROM inquiries i LEFT JOIN users u ON i.user_id = u.id ORDER BY i.created_at DESC LIMIT ? OFFSET ?');
        $stmt->execute([$limit, $offset]);
        return $stmt->fetchAll();
    }
    public function getThread($inquiryId) {
        $stmt = $this->pdo->prepare('SELECT * FROM inquiries WHERE id = ? OR parent_id = ? ORDER BY created_at ASC');
        $stmt->execute([$inquiryId, $inquiryId]);
        return $stmt->fetchAll();
    }
    public function reply($parentId, $message, $isAdmin, $userId = null, $name = '', $email = '', $subject = null) {
        $stmt = $this->pdo->prepare('INSERT INTO inquiries (user_id, name, email, subject, message, parent_id, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$userId, $name, $email, $subject, $message, $parentId, $isAdmin ? 1 : 0]);
        return $this->pdo->lastInsertId();
    }
}
