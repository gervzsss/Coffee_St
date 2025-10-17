<?php
// src/views/admin/inquiries-list.php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../repositories/InquiryRepository.php';

$repo = new InquiryRepository(db());
$inquiries = $repo->getAll();
?>
<div class="admin-inquiries p-6">
  <h2 class="text-2xl font-bold mb-6">User & Guest Inquiries</h2>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white rounded-xl shadow">
      <thead>
        <tr>
          <th class="px-4 py-2">Date</th>
          <th class="px-4 py-2">Name</th>
          <th class="px-4 py-2">Email</th>
          <th class="px-4 py-2">Type</th>
           <th class="px-4 py-2">Subject</th>
          <th class="px-4 py-2">Message</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($inquiries as $inq): ?>
        <tr>
          <td class="px-4 py-2 text-xs text-gray-500"><?= htmlspecialchars($inq['created_at']) ?></td>
          <td class="px-4 py-2"><?= htmlspecialchars($inq['name']) ?></td>
          <td class="px-4 py-2"><?= htmlspecialchars($inq['email']) ?></td>
          <td class="px-4 py-2">
            <?php if ($inq['user_id']): ?>
              <span class="inline-block px-2 py-1 rounded bg-green-100 text-green-800 text-xs">User</span>
            <?php else: ?>
              <span class="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">Guest</span>
            <?php endif; ?>
           </td>
           <td class="px-4 py-2 max-w-xs truncate">
             <?php if (empty($inq['subject'])): ?>
               <span class="italic text-gray-400">No Subject</span>
             <?php else: ?>
               <?= htmlspecialchars($inq['subject']) ?>
             <?php endif; ?>
          </td>
          <td class="px-4 py-2 max-w-xs truncate"><?= nl2br(htmlspecialchars($inq['message'])) ?></td>
          <td class="px-4 py-2">
            <a href="/COFFEE_ST/public/admin/inquiry-thread.php?inquiry_id=<?= $inq['id'] ?>" class="text-[#30442B] hover:underline">View</a>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>
