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
$status = strtolower(trim((string) ($_POST['status'] ?? '')));

if ($threadId <= 0 || $status === '') {
  http_response_code(422);
  echo json_encode(['error' => 'Thread and status are required.']);
  exit;
}

try {
  $repo = new InquiryRepository(db());
  if ($status === 'done') {
    $summary = $repo->markThreadDone($threadId);
  } else {
    $repo->setThreadStatus($threadId, $status);
    $summary = $repo->getThreadById($threadId);
  }

  if (!$summary) {
    http_response_code(404);
    echo json_encode(['error' => 'Thread not found.']);
    return;
  }

  echo json_encode([
    'success' => true,
    'thread' => [
      'id' => $summary['id'],
      'status' => $summary['status'],
      'last_message_at' => $summary['last_message_at'] ?? null,
    ],
  ]);
} catch (\InvalidArgumentException $e) {
  http_response_code(422);
  echo json_encode(['error' => $e->getMessage()]);
} catch (\Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to update thread status.']);
}
