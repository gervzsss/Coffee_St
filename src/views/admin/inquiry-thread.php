<?php
// src/views/admin/inquiry-thread.php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../repositories/InquiryRepository.php';

$threadId = isset($_GET['thread_id']) ? intval($_GET['thread_id']) : 0;
if (!$threadId) {
  echo '<div class="p-6 text-red-600">Invalid thread reference.</div>';
  return;
}

$repo = new InquiryRepository(db());
$threadData = $repo->getThreadWithMessages($threadId);
if (!$threadData) {
  echo '<div class="p-6 text-gray-600">Thread not found.</div>';
  return;
}

$thread = $threadData['thread'];
$messages = $threadData['messages'];
$subject = trim((string) ($thread['subject'] ?? ''));
$status = ucfirst((string) ($thread['status'] ?? 'pending'));
$openedAt = $thread['created_at'] ?? null;
$updatedAt = $thread['last_message_at'] ?? null;
$customerName = $thread['user_id']
  ? trim(sprintf('%s %s', $thread['first_name'] ?? '', $thread['last_name'] ?? ''))
  : ($thread['guest_name'] ?? 'Guest');
$customerEmail = $thread['user_id'] ? ($thread['user_email'] ?? '') : ($thread['guest_email'] ?? '');
?>
<div class="admin-inquiry-thread p-6">
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h2 class="text-2xl font-bold mb-1">Inquiry Conversation</h2>
      <p class="text-sm text-gray-500">
        <span class="font-medium text-gray-700">Customer:</span>
        <?= htmlspecialchars($customerName !== '' ? $customerName : 'Guest') ?>
        <?php if ($customerEmail): ?>
          <span class="ml-2 text-xs text-gray-400">(<?= htmlspecialchars($customerEmail) ?>)</span>
        <?php endif; ?>
      </p>
      <p class="text-sm text-gray-500 mt-1">
        <span class="mr-3">Opened: <?= $openedAt ? htmlspecialchars(date('Y-m-d h:i A', strtotime($openedAt))) : '—' ?></span>
        <span>Updated: <?= $updatedAt ? htmlspecialchars(date('Y-m-d h:i A', strtotime($updatedAt))) : '—' ?></span>
      </p>
    </div>
    <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
      <?= htmlspecialchars($status) ?>
    </span>
  </div>
  <div class="mb-6">
    <span class="text-sm font-semibold text-gray-700">Subject:</span>
    <?php if ($subject === ''): ?>
      <span class="italic text-gray-400">No Subject</span>
    <?php else: ?>
      <span class="text-gray-800"><?= htmlspecialchars($subject) ?></span>
    <?php endif; ?>
  </div>
  <div class="space-y-6">
    <?php foreach ($messages as $message): ?>
      <?php
        $senderType = $message['sender_type'];
        $isAdmin = $senderType === 'admin';
        $avatarClass = $isAdmin ? 'bg-[#30442B] text-white' : 'bg-blue-100 text-blue-800';
        if ($senderType === 'guest') {
          $avatarClass = 'bg-yellow-100 text-yellow-700';
        }
        $senderName = $isAdmin ? 'Coffee St. Admin' : ($message['sender_name'] ?: 'Customer');
      ?>
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold <?= $avatarClass ?>">
            <?= strtoupper(substr($senderName, 0, 2)) ?>
          </div>
          <div>
            <span class="font-semibold text-gray-800"><?= htmlspecialchars($senderName) ?></span>
            <?php if (!empty($message['sender_email'])): ?>
              <span class="text-xs text-gray-500 ml-2"><?= htmlspecialchars($message['sender_email']) ?></span>
            <?php endif; ?>
          </div>
          <span class="ml-auto text-xs text-gray-400"><?= htmlspecialchars($message['created_at']) ?></span>
        </div>
        <div class="text-gray-700 whitespace-pre-line"><?= htmlspecialchars($message['message']) ?></div>
      </div>
    <?php endforeach; ?>
  </div>
  <form class="mt-8" method="POST" action="/COFFEE_ST/public/api/inquiry-reply.php">
    <input type="hidden" name="thread_id" value="<?= $threadId; ?>">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Reply Message</label>
      <textarea name="message" rows="4" class="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900" required></textarea>
    </div>
    <button type="submit" class="bg-[#30442B] text-white px-6 py-2 rounded-xl font-semibold">Send Reply</button>
  </form>
</div>
