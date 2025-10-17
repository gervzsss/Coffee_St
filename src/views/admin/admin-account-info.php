<?php
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/../../repositories/InquiryRepository.php";

function renderAdminContent()
{
  $pdo = db();
  $repo = new InquiryRepository($pdo);
  $allInquiries = $repo->getAll(200, 0);
  $topLevelInquiries = array_values(
    array_filter($allInquiries, static function ($inquiry) {
      return empty($inquiry["parent_id"]);
    }),
  );

  $formatInitials = static function ($name) {
    $parts = preg_split("/\s+/", trim((string) $name));
    $initials = "";
    foreach ($parts as $part) {
      if ($part === "") {
        continue;
      }
      $initials .= strtoupper(substr($part, 0, 1));
      if (strlen($initials) >= 2) {
        break;
      }
    }
    return $initials !== "" ? $initials : "??";
  };

  $enrichedInquiries = [];
  foreach ($topLevelInquiries as $inquiry) {
    $thread = $repo->getThread($inquiry["id"]);
    $hasAdminReply = false;
    foreach ($thread as $message) {
      if (!empty($message["is_admin"])) {
        $hasAdminReply = true;
        break;
      }
    }

    $firstMessage = $thread[0]["message"] ?? ($inquiry["message"] ?? "");
    $preview =
      mb_strlen($firstMessage) > 160
      ? mb_substr($firstMessage, 0, 157) . "…"
      : $firstMessage;
    $createdAt = $inquiry["created_at"] ?? "";
    $createdAtDisplay = $createdAt
      ? date("Y-m-d h:i A", strtotime($createdAt))
      : "—";

    $enrichedInquiries[] = [
      "id" => $inquiry["id"],
      "name" => $inquiry["name"],
      "email" => $inquiry["email"],
      "subject" => $inquiry["subject"] ?? null,
      "subject_display" =>
        ($inquiry["subject"] ?? "") !== ""
        ? $inquiry["subject"]
        : "No Subject",
      "message_preview" => $preview,
      "created_at_display" => $createdAtDisplay,
      "initials" => $formatInitials($inquiry["name"]),
      "has_admin_reply" => $hasAdminReply,
    ];
  }

  $totalInquiries = count($enrichedInquiries);
  $respondedCount = count(
    array_filter(
      $enrichedInquiries,
      static fn($inq) => $inq["has_admin_reply"],
    ),
  );
  $pendingCount = $totalInquiries - $respondedCount;
  $archivedCount = 0;
  ?>
  <div class="main-content min-h-screen p-6 ml-64 transition-all duration-300 ease-in-out">
    <div class="max-w-screen-2xl mx-auto">
      <!-- Header -->
      <div class="admin-header bg-[#30442B] text-white rounded-2xl p-8 mb-8 transition-all duration-300 ease-in-out">
        <div class="text-center mb-8">
          <h1 class="text-4xl md:text-5xl font-extrabold mb-3">Account Management</h1>
          <p class="text-base text-white/90">Control access, manage users, and handle communications</p>
        </div>

        <!-- Navigation Tabs -->
        <div class="max-w-4xl mx-auto">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-2 flex items-center justify-between gap-3">
            <button data-tab="customer"
              class="cursor-pointer tab-button flex-1 px-8 py-4 bg-white text-[#30442B] rounded-lg shadow-sm hover:shadow-md transition-all">
              <span class="text-base font-bold uppercase tracking-wider">Customer Accounts (6)</span>
            </button>
            <button data-tab="staff"
              class="cursor-pointer tab-button flex-1 px-8 py-4 text-white hover:bg-white/10 rounded-lg transition-all">
              <span class="text-base font-bold uppercase tracking-wider">Staff Accounts</span>
            </button>
            <button data-tab="inquiries"
              class="cursor-pointer tab-button flex-1 px-8 py-4 text-white hover:bg-white/10 rounded-lg transition-all">
              <span class="text-base font-bold uppercase tracking-wider">Inquiries</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <!-- Customer Statistics -->
      <div id="customerStats" class="stats-container mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Customers -->
          <div
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-medium text-gray-500">Total Customers</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800">6</p>
          </div>

          <!-- Active Users -->
          <div
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-medium text-gray-500">Active</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800">4</p>
          </div>

          <!-- Banned Users -->
          <div
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-medium text-gray-500">Banned</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800">10</p>
          </div>

          <!-- Unread Messages -->
          <div
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-medium text-gray-500">Unread Messages</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800">2</p>
          </div>
        </div>
      </div>

      <!-- Staff Statistics -->
      <div id="staffStats" class="stats-container mb-8" style="display: none;">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-medium text-gray-500">Total Accounts</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800">8</p>
          </div>
          <div
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-medium text-gray-500">Staff</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800">6</p>
          </div>
          <div
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-medium text-gray-500">Admin</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800">2</p>
          </div>
        </div>
      </div>

      <!-- Inquiries Statistics -->
      <div id="inquiriesStats" class="stats-container mb-8" style="display: none;">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-medium text-gray-500">Total Messages</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800"><?= $totalInquiries ?></p>
          </div>
          <div
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-medium text-gray-500">Pending</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800"><?= $pendingCount ?></p>
          </div>
          <div
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-medium text-gray-500">Responded</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800"><?= $respondedCount ?></p>
          </div>
        </div>
      </div>

      <!-- Account Management Content -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <!-- Search and Filter -->
        <div class="p-8 border-b border-gray-100 bg-[#30442B]/5">
          <div class="flex gap-4">
            <div class="relative flex-1">
              <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" id="searchInput" placeholder="Search..."
                class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-all bg-white">
            </div>
            <select id="statusFilter"
              class="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] bg-white transition-all">
              <option>ALL STATUS</option>
              <option>Active</option>
              <option>Banned</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        <!-- Tab Contents -->
        <!-- Customer Tab -->
        <div id="customerContent" class="tab-content p-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-gray-800">Customer Accounts</h3>
              <p class="text-sm text-gray-500 mt-1">Manage customer accounts and access</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left text-sm font-medium text-gray-500 border-b border-gray-100">
                  <th class="pb-4 pl-4">User</th>
                  <th class="pb-4">Contact</th>
                  <th class="pb-4">Role</th>
                  <th class="pb-4">Status</th>
                  <th class="pb-4">Last Login</th>
                  <th class="pb-4">Action</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <?php
                $customerUsers = [
                  [
                    "name" => "John Doe",
                    "phone" => "+1 234-567-8900",
                    "email" => "john@email.com",
                    "role" => "Customer",
                    "status" => "Active",
                    "lastLogin" => "2024-01-15 10:00 AM",
                  ],
                  [
                    "name" => "Sarah Johnson",
                    "phone" => "+1 234-567-8901",
                    "email" => "sarah.j@email.com",
                    "role" => "Customer",
                    "status" => "Active",
                    "lastLogin" => "2024-01-14 03:30 PM",
                  ],
                ];
                foreach ($customerUsers as $user):
                  $initials = $formatInitials($user["name"]); ?>
                  <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td class="py-4 pl-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 rounded-full bg-[#30442B] text-white flex items-center justify-center font-medium">
                          <?= htmlspecialchars($initials) ?>
                        </div>
                        <div>
                          <p class="font-medium text-gray-800"><?= htmlspecialchars(
                            $user["name"],
                          ) ?></p>
                          <p class="text-gray-500 text-xs"><?= htmlspecialchars(
                            $user["phone"],
                          ) ?></p>
                        </div>
                      </div>
                    </td>
                    <td class="py-4">
                      <p class="text-gray-600"><?= htmlspecialchars(
                        $user["email"],
                      ) ?></p>
                    </td>
                    <td class="py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        <?= htmlspecialchars($user["role"]) ?>
                      </span>
                    </td>
                    <td class="py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <?= htmlspecialchars($user["status"]) ?>
                      </span>
                    </td>
                    <td class="py-4">
                      <p class="text-gray-600"><?= htmlspecialchars(
                        $user["lastLogin"],
                      ) ?></p>
                    </td>
                    <td class="py-4">
                      <div class="flex items-center gap-2">
                        <button class="p-2 hover:bg-[#30442B]/10 rounded-xl transition-all duration-300"
                          title="View Details">
                          <i class="fas fa-circle-info text-[#30442B]"></i>
                        </button>
                        <button class="p-2 hover:bg-red-50 rounded-xl transition-all duration-300 delete-user"
                          title="Delete Account">
                          <i class="fas fa-trash-alt text-red-500"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <?php
                endforeach;
                ?>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Staff Tab -->
        <div id="staffContent" class="tab-content p-8" style="display: none;">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-gray-800">Staff Accounts</h3>
              <p class="text-sm text-gray-500 mt-1">Manage staff access and permissions</p>
            </div>
            <button id="addStaffBtn"
              class="px-6 py-2.5 bg-[#30442B] text-white rounded-xl hover:bg-[#3a5336] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
              <i class="fas fa-plus"></i>
              Add Staff
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left text-sm font-medium text-gray-500 border-b border-gray-100">
                  <th class="pb-4 pl-4">Staff Member</th>
                  <th class="pb-4">Contact</th>
                  <th class="pb-4">Role</th>
                  <th class="pb-4">Status</th>
                  <th class="pb-4">Last Active</th>
                  <th class="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <?php
                $staffMembers = [
                  [
                    "name" => "Admin User",
                    "phone" => "+1 555-123-4567",
                    "email" => "admin@coffee.com",
                    "role" => "Admin",
                    "status" => "Active",
                    "lastActive" => "Just now",
                  ],
                  [
                    "name" => "Maria Santos",
                    "phone" => "+1 555-234-5678",
                    "email" => "maria.santos@coffee.com",
                    "role" => "Staff",
                    "status" => "Active",
                    "lastActive" => "5 mins ago",
                  ],
                  [
                    "name" => "James Wilson",
                    "phone" => "+1 555-345-6789",
                    "email" => "james.w@coffee.com",
                    "role" => "Staff",
                    "status" => "Active",
                    "lastActive" => "1 hour ago",
                  ],
                ];
                foreach ($staffMembers as $staff):
                  $initials = $formatInitials($staff["name"]); ?>
                  <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-all duration-300">
                    <td class="py-4 pl-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 rounded-xl bg-[#30442B] text-white flex items-center justify-center font-medium">
                          <?= htmlspecialchars($initials) ?>
                        </div>
                        <div>
                          <p class="font-medium text-gray-800"><?= htmlspecialchars(
                            $staff["name"],
                          ) ?></p>
                          <p class="text-gray-500 text-xs"><?= htmlspecialchars(
                            $staff["phone"],
                          ) ?></p>
                        </div>
                      </div>
                    </td>
                    <td class="py-4">
                      <p class="text-gray-600"><?= htmlspecialchars(
                        $staff["email"],
                      ) ?></p>
                    </td>
                    <td class="py-4">
                      <span class="px-3 py-1 rounded-xl text-xs font-medium <?= $staff[
                        "role"
                      ] === "Admin"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-blue-50 text-blue-700" ?>">
                        <?= htmlspecialchars($staff["role"]) ?>
                      </span>
                    </td>
                    <td class="py-4">
                      <span class="px-3 py-1 rounded-xl text-xs font-medium bg-green-50 text-green-700">
                        <?= htmlspecialchars($staff["status"]) ?>
                      </span>
                    </td>
                    <td class="py-4">
                      <p class="text-gray-600"><?= htmlspecialchars(
                        $staff["lastActive"],
                      ) ?></p>
                    </td>
                    <td class="py-4">
                      <div class="flex items-center gap-2">
                        <button class="edit-staff p-2 hover:bg-[#30442B]/10 rounded-xl transition-all duration-300"
                          title="Edit Account" data-name="<?= htmlspecialchars(
                            $staff["name"],
                            ENT_QUOTES,
                          ) ?>" data-email="<?= htmlspecialchars(
                             $staff["email"],
                             ENT_QUOTES,
                           ) ?>" data-phone="<?= htmlspecialchars(
                              $staff["phone"],
                              ENT_QUOTES,
                            ) ?>" data-role="<?= htmlspecialchars($staff["role"], ENT_QUOTES) ?>">
                          <i class="fas fa-edit text-[#30442B]"></i>
                        </button>
                        <button class="delete-staff p-2 hover:bg-red-50 rounded-xl transition-all duration-300"
                          title="Delete Account">
                          <i class="fas fa-trash-alt text-red-500"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <?php
                endforeach;
                ?>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Inquiries Tab -->
        <div id="inquiriesContent" class="tab-content p-8" style="display: none;">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-gray-800">Customer Inquiries</h3>
              <p class="text-sm text-gray-500 mt-1">Manage and respond to customer messages</p>
            </div>
          </div>
          <div class="grid gap-4">
            <?php if (empty($enrichedInquiries)): ?>
              <div
                class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#30442B]/10 text-[#30442B]">
                  <i class="fas fa-inbox text-xl"></i>
                </div>
                <h4 class="text-lg font-semibold text-gray-700">No inquiries yet</h4>
                <p class="mt-2 max-w-md text-sm text-gray-500">Customer messages will appear here once they submit the
                  contact form.</p>
              </div>
            <?php else: ?>
              <?php foreach ($enrichedInquiries as $inq): ?>
                <div class="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-all bg-white">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-full <?= $inq[
                        "has_admin_reply"
                      ]
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600" ?> flex items-center justify-center text-sm font-semibold">
                        <?= htmlspecialchars($inq["initials"]) ?>
                      </div>
                      <div>
                        <h4 class="font-semibold text-gray-800"><?= htmlspecialchars(
                          $inq["name"],
                        ) ?></h4>
                        <p class="text-sm text-gray-500"><?= htmlspecialchars(
                          $inq["email"],
                        ) ?></p>
                      </div>
                    </div>
                    <span class="px-3 py-1 text-xs font-medium rounded-full <?= $inq[
                      "has_admin_reply"
                    ]
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700" ?>">
                      <?= $inq["has_admin_reply"] ? "Responded" : "Pending" ?>
                    </span>
                  </div>
                  <h5 class="font-medium text-gray-800 mb-2">
                    <?php if (($inq["subject"] ?? "") === ""): ?>
                      <span class="italic text-gray-400">No Subject</span>
                    <?php else: ?>
                      <?= htmlspecialchars($inq["subject"]) ?>
                    <?php endif; ?>
                  </h5>
                  <p class="text-gray-600 text-sm mb-3"><?= nl2br(
                    htmlspecialchars($inq["message_preview"]),
                  ) ?></p>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500"><?= htmlspecialchars(
                      $inq["created_at_display"],
                    ) ?></span>
                    <div class="flex items-center gap-2">
                      <a href="/COFFEE_ST/public/admin/inquiry-thread.php?inquiry_id=<?= $inq[
                        "id"
                      ] ?>"
                        class="px-4 py-2 text-sm font-medium text-[#30442B] hover:text-white hover:bg-[#30442B] border border-[#30442B] rounded-lg transition-all shadow-sm">
                        View Thread
                      </a>
                      <button
                        class="cursor-pointer reply-inquiry px-5 py-2 text-sm font-medium text-white bg-[#30442B] hover:bg-[#3a5336] rounded-lg transition-all shadow-sm"
                        data-inquiry-id="<?= $inq[
                          "id"
                        ] ?>" data-name="<?= htmlspecialchars(
                           $inq["name"],
                           ENT_QUOTES,
                         ) ?>" data-email="<?= htmlspecialchars(
                            $inq["email"],
                            ENT_QUOTES,
                          ) ?>" data-subject="<?= htmlspecialchars(
                             $inq["subject_display"],
                             ENT_QUOTES,
                           ) ?>" data-message="<?= htmlspecialchars(
                              $inq["message_preview"],
                              ENT_QUOTES,
                            ) ?>">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
        </div>
      </div>
    </div>

    <?php
    include_once __DIR__ . "/../../components/modals/admin-account-modals.php";
    renderUserDetailsModal();
    renderBanConfirmModal();
    renderEditStaffModal();
    renderAddStaffModal();
    renderReplyInquiryModal(); ?>
  </div>
  <?php
}
