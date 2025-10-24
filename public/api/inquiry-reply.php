<?php

require_once __DIR__ . '/../../src/config/bootstrap.php';
require_once __DIR__ . '/../../src/helpers/common.php';
require_once __DIR__ . '/../../src/repositories/repositories.php';
use App\Repositories\InquiryRepository;
use function App\Helpers\db;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

if (!\App\Helpers\is_admin_authenticated()) {
  http_response_code(403);
  echo json_encode(['error' => 'Unauthorized']);
  exit;
}


$threadId = isset($_POST['thread_id']) ? (int) $_POST['thread_id'] : 0;
if ($threadId <= 0 && isset($_POST['parent_id'])) {
  $threadId = (int) $_POST['parent_id'];
}

$message = trim((string) ($_POST['message'] ?? ''));
if ($threadId <= 0 || $message === '') {
  http_response_code(422);
  echo json_encode(['error' => 'Thread reference and message are required.']);
  exit;
}

$repo = new InquiryRepository(db());

try {
  $config = require __DIR__ . '/../../src/config/config.php';
  $adminEmail = $config['admin']['email'] ?? 'admin@coffeest.com';
  $adminName = 'Coffee St. Admin';

  $thread = $repo->getThreadById($threadId);
  if (!$thread) {
    http_response_code(404);
    echo json_encode(['error' => 'Thread not found.']);
    exit;
  }

  $summary = $repo->recordAdminReply($threadId, $message, $adminName, $adminEmail, null);

  if (!empty($summary['guest_email'])) {
    $to = $summary['guest_email'];
    $guestName = $summary['guest_name'] ?: 'Guest';
    $mailSubject = 'Reply to your inquiry at Coffee St.';
    $mailBody = "Hello {$guestName},\n\n{$message}\n\nBest regards,\n{$adminName}";
    @mail($to, $mailSubject, $mailBody, 'From: ' . $adminEmail);
  }

  echo json_encode([
    'success' => true,
    'thread' => [
      'id' => $summary['id'],
      'status' => $summary['status'],
      'last_message_at' => $summary['last_message_at'],
    ],
  ]);
} catch (\InvalidArgumentException $e) {
  http_response_code(422);
  echo json_encode(['error' => $e->getMessage()]);
} catch (\Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to send reply.']);
}
