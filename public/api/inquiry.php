<?php
// public/api/inquiry.php
require_once __DIR__ . '/../../src/config/bootstrap.php';

header('Content-Type: application/json');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get POST data
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');
$parent_id = isset($_POST['parent_id']) ? intval($_POST['parent_id']) : null;

// Get user_id if logged in
$user_id = null;
if (function_exists('current_user')) {
    $user = current_user();
    if ($user && isset($user['id'])) {
        $user_id = $user['id'];
    }
}

// Validate
$errors = [];
if ($name === '') $errors['name'] = 'Name is required.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Valid email is required.';
// Subject is optional, no validation
if ($message === '') $errors['message'] = 'Message is required.';
if ($errors) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit;
}

// Insert inquiry
try {
    $pdo = db();
    $stmt = $pdo->prepare('INSERT INTO inquiries (user_id, name, email, subject, message, parent_id, is_admin) VALUES (?, ?, ?, ?, ?, ?, 0)');
    $stmt->execute([
        $user_id,
        $name,
        $email,
        $subject !== '' ? $subject : null,
        $message,
        $parent_id,
    ]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to submit inquiry.']);
}
