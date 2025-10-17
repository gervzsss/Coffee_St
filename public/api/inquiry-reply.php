<?php
// public/api/inquiry-reply.php
require_once __DIR__ . '/../../src/config/bootstrap.php';
require_once __DIR__ . '/../../src/repositories/InquiryRepository.php';

header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$parent_id = isset($_POST['parent_id']) ? intval($_POST['parent_id']) : 0;
$message = trim($_POST['message'] ?? '');
if (!$parent_id || $message === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Parent inquiry and message required.']);
    exit;
}

$repo = new InquiryRepository(db());
// Get parent inquiry info
$stmt = db()->prepare('SELECT * FROM inquiries WHERE id = ?');
$stmt->execute([$parent_id]);
$parent = $stmt->fetch();
if (!$parent) {
    http_response_code(404);
    echo json_encode(['error' => 'Parent inquiry not found.']);
    exit;
}
// Admin reply
$repo->reply($parent_id, $message, true, null, 'Admin', 'admin@coffeest.com');

// If guest, send email
if (!$parent['user_id']) {
    // Use PHP mail() for simplicity; replace with robust mailer in production
    $to = $parent['email'];
    $subject = 'Reply to your inquiry at Coffee St.';
    $body = "Hello " . $parent['name'] . ",\n\n" . $message . "\n\nBest regards,\nCoffee St. Admin";
    @mail($to, $subject, $body, "From: admin@coffeest.com");
}

// TODO: For users, add notification logic

echo json_encode(['success' => true]);
