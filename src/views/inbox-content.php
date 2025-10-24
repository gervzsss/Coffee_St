<main class="max-w-3xl mx-auto py-12 px-4">
  <h1 class="text-3xl font-bold mb-8">Your Messages</h1>
  <?php if (!$threads): ?>
    <div class="bg-white rounded-xl p-6 shadow text-gray-600">No messages yet.</div>
  <?php else: ?>
    <?php foreach ($threads as $thread): ?>
      <?php
      $threadData = $repo->getThreadWithMessages((int) $thread["id"]);
      $subject = trim((string) ($threadData["thread"]["subject"] ?? ""));
      $statusRaw = strtolower((string) ($threadData["thread"]["status"] ?? "pending"));
      $status = ucfirst($statusRaw);
      $openedAt = $threadData["thread"]["created_at"] ?? null;
      $updatedAt = $threadData["thread"]["last_message_at"] ?? null;
      $replyUrl = "/COFFEE_ST/public/pages/contact.php?subject=" . rawurlencode($subject);
      ?>
      <div class="mb-8 bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold">
            Subject:
            <?php if ($subject === ""): ?>
              <span class="italic text-gray-500">No Subject</span>
            <?php else: ?>
              <?= htmlspecialchars($subject) ?>
            <?php endif; ?>
          </h2>
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              <?= htmlspecialchars($status) ?>
            </span>
            <?php if ($statusRaw !== "done" && $subject !== ""): ?>
              <a href="<?= htmlspecialchars($replyUrl) ?>"
                class="inline-flex items-center gap-2 rounded-full bg-[#30442B] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#3a533a] focus:outline-none focus:ring-2 focus:ring-[#30442B]/30">
                Reply
              </a>
            <?php endif; ?>
          </div>
        </div>
        <div class="mb-4 text-sm text-gray-500">
          <span class="mr-4">Opened:
            <?= $openedAt ? htmlspecialchars(date("Y-m-d h:i A", strtotime($openedAt))) : "—" ?></span>
          <span>Updated: <?= $updatedAt ? htmlspecialchars(date("Y-m-d h:i A", strtotime($updatedAt))) : "—" ?></span>
        </div>
        <div class="space-y-4">
          <?php foreach ($threadData["messages"] as $message): ?>
            <div class="border border-gray-100 rounded-lg p-4">
              <div class="mb-1 flex items-center justify-between">
                <span
                  class="font-semibold text-sm <?= (isset($message["sender_type"]) && $message["sender_type"] === "admin") ? "text-[#30442B]" : "text-blue-700" ?>">
                  <?= (isset($message["sender_type"]) && $message["sender_type"] === "admin") ? "Coffee St. Admin" : htmlspecialchars($message["sender_name"] ?? "You") ?>
                </span>
                <span class="text-xs text-gray-400 ml-2"><?= htmlspecialchars($message["created_at"] ?? '') ?></span>
              </div>
              <div class="text-gray-800 whitespace-pre-line"><?= htmlspecialchars($message["message"] ?? '') ?></div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    <?php endforeach; ?>
  <?php endif; ?>
</main>