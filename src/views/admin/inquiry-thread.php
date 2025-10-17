<?php
// src/views/admin/inquiry-thread.php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../repositories/InquiryRepository.php';

$inquiryId = isset($_GET['inquiry_id']) ? intval($_GET['inquiry_id']) : 0;
if (!$inquiryId) {
    echo '<div class="p-6 text-red-600">Invalid inquiry ID.</div>';
    return;
}
$repo = new InquiryRepository(db());
$thread = $repo->getThread($inquiryId);
if (!$thread) {
    echo '<div class="p-6 text-gray-600">No messages found for this inquiry.</div>';
    return;
}
?>
<div class="admin-inquiry-thread p-6">
  <h2 class="text-2xl font-bold mb-2">Inquiry Conversation</h2>
  <?php
    // Show subject from first message in thread
    $subject = isset($thread[0]['subject']) ? trim($thread[0]['subject']) : '';
  ?>
  <div class="mb-6">
    <span class="text-sm font-semibold text-gray-700">Subject:</span>
    <?php if ($subject === ''): ?>
      <span class="italic text-gray-400">No Subject</span>
    <?php else: ?>
      <span class="text-gray-800"><?= htmlspecialchars($subject) ?></span>
    <?php endif; ?>
  </div>
  <div class="space-y-6">
    <?php foreach ($thread as $msg): ?>
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold <?php echo $msg['is_admin'] ? 'bg-[#30442B] text-white' : ($msg['user_id'] ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'); ?>">
          <?php echo strtoupper(substr($msg['name'],0,2)); ?>
        </div>
        <div>
          <span class="font-semibold text-gray-800"><?php echo htmlspecialchars($msg['name']); ?></span>
          <span class="text-xs text-gray-500 ml-2"><?php echo htmlspecialchars($msg['email']); ?></span>
        </div>
        <span class="ml-auto text-xs text-gray-400"><?php echo htmlspecialchars($msg['created_at']); ?></span>
      </div>
      <div class="text-gray-700 whitespace-pre-line"><?php echo htmlspecialchars($msg['message']); ?></div>
    </div>
    <?php endforeach; ?>
  </div>
  <form class="mt-8" method="POST" action="/COFFEE_ST/public/api/inquiry-reply.php">
    <input type="hidden" name="parent_id" value="<?php echo $inquiryId; ?>">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Reply Message</label>
      <textarea name="message" rows="4" class="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900" required></textarea>
    </div>
    <button type="submit" class="bg-[#30442B] text-white px-6 py-2 rounded-xl font-semibold">Send Reply</button>
  </form>
</div>
