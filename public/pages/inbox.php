<?php
// public/pages/inbox.php
require_once __DIR__ . '/../../src/config/bootstrap.php';
require_once __DIR__ . '/../../src/repositories/InquiryRepository.php';

if (!function_exists('current_user') || !($user = current_user()) || !isset($user['id'])) {
    header('Location: /COFFEE_ST/public/pages/login.php');
    exit;
}

$repo = new InquiryRepository(db());
$stmt = db()->prepare('SELECT * FROM inquiries WHERE user_id = ? AND parent_id IS NULL ORDER BY created_at DESC');
$stmt->execute([$user['id']]);
$threads = $stmt->fetchAll();

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inbox — Coffee St.</title>
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css">
</head>
<body class="min-h-screen bg-neutral-50 font-poppins text-neutral-900">
  <?php include __DIR__ . '/../../src/includes/header.php'; ?>
  <main class="max-w-3xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-bold mb-8">Your Messages</h1>
    <?php if (!$threads): ?>
      <div class="bg-white rounded-xl p-6 shadow text-gray-600">No messages yet.</div>
    <?php else: ?>
      <?php foreach ($threads as $thread): ?>
        <div class="mb-8 bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-semibold mb-2">Subject: <?= htmlspecialchars($thread['message']) ?></h2>
          <?php
            $msgs = $repo->getThread($thread['id']);
          ?>
          <div class="space-y-4">
            <?php foreach ($msgs as $msg): ?>
              <div class="border-b pb-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold text-sm <?= $msg['is_admin'] ? 'text-[#30442B]' : 'text-blue-700' ?>">
                    <?= $msg['is_admin'] ? 'Admin' : htmlspecialchars($msg['name']) ?>
                  </span>
                  <span class="text-xs text-gray-400 ml-2"><?= htmlspecialchars($msg['created_at']) ?></span>
                </div>
                <div class="text-gray-800 whitespace-pre-line"><?= htmlspecialchars($msg['message']) ?></div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
      <?php endforeach; ?>
    <?php endif; ?>
  </main>
  <?php include __DIR__ . '/../../src/includes/footer.php'; ?>
</body>
</html>
