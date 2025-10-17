<?php

function renderAdminContent() {
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
          <button data-tab="customer" class="tab-button flex-1 px-8 py-4 bg-white text-[#30442B] rounded-lg shadow-sm hover:shadow-md transition-all">
            <span class="text-base font-bold uppercase tracking-wider">Customer Accounts (6)</span>
          </button>
          <button data-tab="staff" class="tab-button flex-1 px-8 py-4 text-white hover:bg-white/10 rounded-lg transition-all">
            <span class="text-base font-bold uppercase tracking-wider">Staff Accounts</span>
          </button>
          <button data-tab="inquiries" class="tab-button flex-1 px-8 py-4 text-white hover:bg-white/10 rounded-lg transition-all">
            <span class="text-base font-bold uppercase tracking-wider">Inquiries</span>
          </button>
        </div>
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
              $initials = implode("", array_map(fn($n) => strtoupper($n[0]), explode(" ", $user["name"])));
            ?>
            <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
              <td class="py-4 pl-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-[#30442B] text-white flex items-center justify-center font-medium">
                    <?= $initials ?>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800"><?= $user["name"] ?></p>
                    <p class="text-gray-500 text-xs"><?= $user["phone"] ?></p>
                  </div>
                </div>
              </td>
              <td class="py-4">
                <p class="text-gray-600"><?= $user["email"] ?></p>
              </td>
              <td class="py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  <?= $user["role"] ?>
                </span>
              </td>
              <td class="py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                  <?= $user["status"] ?>
                </span>
              </td>
              <td class="py-4">
                <p class="text-gray-600"><?= $user["lastLogin"] ?></p>
              </td>
              <td class="py-4">
                <div class="flex items-center gap-2">
                  <button class="p-2 hover:bg-[#30442B]/10 rounded-xl transition-all duration-300" title="View Details">
                    <i class="fas fa-circle-info text-[#30442B]"></i>
                  </button>
                  <button class="p-2 hover:bg-red-50 rounded-xl transition-all duration-300 delete-user" title="Delete Account">
                    <i class="fas fa-trash-alt text-red-500"></i>
                  </button>
                </div>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Staff Tab -->
    <div id="staffContent" class="tab-content p-8" style="display: none;">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-bold text-gray-800">Staff Accounts</h3>
          <p class="text-sm text-gray-500 mt-1">Manage staff accounts and access</p>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-sm font-medium text-gray-500 border-b border-gray-100">
              <th class="pb-4 pl-4">Staff</th>
              <th class="pb-4">Contact</th>
              <th class="pb-4">Role</th>
              <th class="pb-4">Status</th>
              <th class="pb-4">Last Active</th>
              <th class="pb-4">Action</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <?php
            $staffMembers = [
              [
                "name" => "James Williams",
                "phone" => "+1 234-567-8902",
                "email" => "james.w@coffee.com",
                "role" => "Staff",
                "status" => "Active",
                "lastActive" => "1 hour ago",
              ],
              // ... add more staff as needed
            ];
            foreach ($staffMembers as $staff):
              $initials = implode("", array_map(fn($n) => strtoupper($n[0]), explode(" ", $staff["name"])));
            ?>
            <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-all duration-300">
              <td class="py-4 pl-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-[#30442B] text-white flex items-center justify-center font-medium">
                    <?= $initials ?>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800"><?= $staff["name"] ?></p>
                    <p class="text-gray-500 text-xs"><?= $staff["phone"] ?></p>
                  </div>
                </div>
              </td>
              <td class="py-4">
                <p class="text-gray-600"><?= $staff["email"] ?></p>
              </td>
              <td class="py-4">
                <span class="px-3 py-1 rounded-xl text-xs font-medium <?= $staff["role"] === "Admin" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700" ?>">
                  <?= $staff["role"] ?>
                </span>
              </td>
              <td class="py-4">
                <span class="px-3 py-1 rounded-xl text-xs font-medium bg-green-50 text-green-700">
                  <?= $staff["status"] ?>
                </span>
              </td>
              <td class="py-4">
                <p class="text-gray-600"><?= $staff["lastActive"] ?></p>
              </td>
              <td class="py-4">
                <div class="flex items-center gap-2">
                  <button class="edit-staff p-2 hover:bg-[#30442B]/10 rounded-xl transition-all duration-300" title="Edit Account" data-name="<?= $staff["name"] ?>" data-email="<?= $staff["email"] ?>" data-phone="<?= $staff["phone"] ?>" data-role="<?= $staff["role"] ?>">
                    <i class="fas fa-edit text-[#30442B]"></i>
                  </button>
                  <button class="delete-staff p-2 hover:bg-red-50 rounded-xl transition-all duration-300" title="Delete Account">
                    <i class="fas fa-trash-alt text-red-500"></i>
                  </button>
                </div>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Inquiries Tab -->
    <div id="inquiriesContent" class="tab-content p-8" style="display: none;">
      <?php include_once __DIR__ . '/inquiries-list.php'; ?>
    </div>

    <!-- Modals -->
    <?php
      include_once __DIR__ . "/../../components/modals/admin-account-modals.php";
      renderUserDetailsModal();
      renderBanConfirmModal();
      renderEditStaffModal();
      renderAddStaffModal();
      renderReplyInquiryModal();
    ?>
  </div>
</div>
<?php
}