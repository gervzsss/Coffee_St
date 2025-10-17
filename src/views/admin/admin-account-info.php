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

            <!-- Statistics Cards -->
            <!-- Customer Statistics -->
            <div id="customerStats" class="stats-container mb-8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Total Customers -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-sm font-medium text-gray-500">Total Customers</h3>
                        </div>
                        <p class="text-3xl font-bold text-gray-800">6</p>
                    </div>

                    <!-- Active Users -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-sm font-medium text-gray-500">Active</h3>
                        </div>
                        <p class="text-3xl font-bold text-gray-800">4</p>
                    </div>

                    <!-- Banned Users -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-sm font-medium text-gray-500">Banned</h3>
                        </div>
                        <p class="text-3xl font-bold text-gray-800">10</p>
                    </div>

                    <!-- Unread Messages -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
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
                    <!-- Total Staff Accounts -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-sm font-medium text-gray-500">Total Accounts</h3>
                        </div>
                        <p class="text-3xl font-bold text-gray-800">8</p>
                    </div>

                    <!-- Staff Members -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-sm font-medium text-gray-500">Staff</h3>
                        </div>
                        <p class="text-3xl font-bold text-gray-800">6</p>
                    </div>

                    <!-- Admin Members -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
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
                    <!-- Total Messages -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-sm font-medium text-gray-500">Total Messages</h3>
                        </div>
                        <p class="text-3xl font-bold text-gray-800">15</p>
                    </div>

                    <!-- Unread Messages -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-sm font-medium text-gray-500">Unread</h3>
                        </div>
                        <p class="text-3xl font-bold text-gray-800">3</p>
                    </div>

                    <!-- Archived Messages -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-sm font-medium text-gray-500">Archived</h3>
                        </div>
                        <p class="text-3xl font-bold text-gray-800">8</p>
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
                            <input type="text" 
                                   id="searchInput"
                                   placeholder="Search..." 
                                   class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-all bg-white">
                        </div>
                        <select id="statusFilter" class="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] bg-white transition-all">
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
                                        'name' => 'John Doe',
                                        'phone' => '+1 234-567-8900',
                                        'email' => 'john@email.com',
                                        'role' => 'Customer',
                                        'status' => 'Active',
                                        'lastLogin' => '2024-01-15 10:00 AM'
                                    ],
                                    [
                                        'name' => 'Sarah Johnson',
                                        'phone' => '+1 234-567-8901',
                                        'email' => 'sarah.j@email.com',
                                        'role' => 'Customer',
                                        'status' => 'Active',
                                        'lastLogin' => '2024-01-14 03:30 PM'
                                    ]
                                ];

                                foreach ($customerUsers as $user):
                                    $initials = implode('', array_map(fn($n) => strtoupper($n[0]), explode(' ', $user['name'])));
                                ?>
                                <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                    <td class="py-4 pl-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-full bg-[#30442B] text-white flex items-center justify-center font-medium">
                                                <?= $initials ?>
                                            </div>
                                            <div>
                                                <p class="font-medium text-gray-800"><?= $user['name'] ?></p>
                                                <p class="text-gray-500 text-xs"><?= $user['phone'] ?></p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-4">
                                        <p class="text-gray-600"><?= $user['email'] ?></p>
                                    </td>
                                    <td class="py-4">
                                        <span class="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            <?= $user['role'] ?>
                                        </span>
                                    </td>
                                    <td class="py-4">
                                        <span class="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                            <?= $user['status'] ?>
                                        </span>
                                    </td>
                                    <td class="py-4">
                                        <p class="text-gray-600"><?= $user['lastLogin'] ?></p>
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
                            <p class="text-sm text-gray-500 mt-1">Manage staff access and permissions</p>
                        </div>
                        <button id="addStaffBtn" class="px-6 py-2.5 bg-[#30442B] text-white rounded-xl hover:bg-[#3a5336] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
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
                                        'name' => 'Admin User',
                                        'phone' => '+1 555-123-4567',
                                        'email' => 'admin@coffee.com',
                                        'role' => 'Admin',
                                        'status' => 'Active',
                                        'lastActive' => 'Just now'
                                    ],
                                    [
                                        'name' => 'Maria Santos',
                                        'phone' => '+1 555-234-5678',
                                        'email' => 'maria.santos@coffee.com',
                                        'role' => 'Staff',
                                        'status' => 'Active',
                                        'lastActive' => '5 mins ago'
                                    ],
                                    [
                                        'name' => 'James Wilson',
                                        'phone' => '+1 555-345-6789',
                                        'email' => 'james.w@coffee.com',
                                        'role' => 'Staff',
                                        'status' => 'Active',
                                        'lastActive' => '1 hour ago'
                                    ]
                                ];

                                foreach ($staffMembers as $staff):
                                    $initials = implode('', array_map(fn($n) => strtoupper($n[0]), explode(' ', $staff['name'])));
                                ?>
                                <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-all duration-300">
                                    <td class="py-4 pl-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-xl bg-[#30442B] text-white flex items-center justify-center font-medium">
                                                <?= $initials ?>
                                            </div>
                                            <div>
                                                <p class="font-medium text-gray-800"><?= $staff['name'] ?></p>
                                                <p class="text-gray-500 text-xs"><?= $staff['phone'] ?></p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-4">
                                        <p class="text-gray-600"><?= $staff['email'] ?></p>
                                    </td>
                                    <td class="py-4">
                                        <span class="px-3 py-1 rounded-xl text-xs font-medium <?= $staff['role'] === 'Admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700' ?>">
                                            <?= $staff['role'] ?>
                                        </span>
                                    </td>
                                    <td class="py-4">
                                        <span class="px-3 py-1 rounded-xl text-xs font-medium bg-green-50 text-green-700">
                                            <?= $staff['status'] ?>
                                        </span>
                                    </td>
                                    <td class="py-4">
                                        <p class="text-gray-600"><?= $staff['lastActive'] ?></p>
                                    </td>
                                    <td class="py-4">
                                        <div class="flex items-center gap-2">
                                            <button class="edit-staff p-2 hover:bg-[#30442B]/10 rounded-xl transition-all duration-300" title="Edit Account" 
                                                    data-name="<?= $staff['name'] ?>"
                                                    data-email="<?= $staff['email'] ?>"
                                                    data-phone="<?= $staff['phone'] ?>"
                                                    data-role="<?= $staff['role'] ?>">
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
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">Customer Inquiries</h3>
                            <p class="text-sm text-gray-500 mt-1">Manage and respond to customer messages</p>
                        </div>
                    </div>
                    <div class="grid gap-4">
                        <!-- Inquiry 1 -->
                        <div class="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-all bg-white">
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span class="text-blue-600 font-semibold text-sm">JS</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-800">Jane Smith</h4>
                                        <p class="text-sm text-gray-500">jane@email.com</p>
                                    </div>
                                </div>
                                <span class="px-3 py-1 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full">Pending</span>
                            </div>
                            <h5 class="font-medium text-gray-800 mb-2">Question about delivery times</h5>
                            <p class="text-gray-600 text-sm mb-3">What are your typical delivery times for orders placed in the morning? I need to plan my schedule</p>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">2024-01-15 08:15 AM</span>
                                <button class="reply-inquiry px-5 py-2 text-sm font-medium text-white bg-[#30442B] hover:bg-[#3a5336] rounded-lg transition-all shadow-sm"
                                        data-name="Jane Smith"
                                        data-email="jane@email.com"
                                        data-subject="Question about delivery times"
                                        data-date="2024-01-15 08:15 AM"
                                        data-message="What are your typical delivery times for orders placed in the morning? I need to plan my schedule">
                                    Reply
                                </button>
                            </div>
                        </div>

                        <!-- Inquiry 2 -->
                        <div class="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-all bg-white">
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                        <span class="text-green-600 font-semibold text-sm">MB</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-800">Michael Brown</h4>
                                        <p class="text-sm text-gray-500">michael.b@email.com</p>
                                    </div>
                                </div>
                                <span class="px-3 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">Responded</span>
                            </div>
                            <h5 class="font-medium text-gray-800 mb-2">Bulk order inquiry</h5>
                            <p class="text-gray-600 text-sm mb-3">Do you offer discounts for bulk orders? We need coffee for our office of 50 people</p>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">2024-01-14 02:30 PM</span>
                                <button class="reply-inquiry px-5 py-2 text-sm font-medium text-white bg-[#30442B] hover:bg-[#3a5336] rounded-lg transition-all shadow-sm"
                                        data-name="Michael Brown"
                                        data-email="michael.b@email.com"
                                        data-subject="Bulk order inquiry"
                                        data-date="2024-01-14 02:30 PM"
                                        data-message="Do you offer discounts for bulk orders? We need coffee for our office of 50 people">
                                    Reply
                                </button>
                            </div>
                        </div>

                        <!-- Inquiry 3 -->
                        <div class="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-all bg-white">
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                        <span class="text-purple-600 font-semibold text-sm">EW</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-800">Emily Wilson</h4>
                                        <p class="text-sm text-gray-500">emily.w@email.com</p>
                                    </div>
                                </div>
                                <span class="px-3 py-1 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full">Pending</span>
                            </div>
                            <h5 class="font-medium text-gray-800 mb-2">Product availability question</h5>
                            <p class="text-gray-600 text-sm mb-3">Is the Ethiopian blend still available? I couldn't find it on the website</p>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">2024-01-13 11:45 AM</span>
                                <button class="reply-inquiry px-5 py-2 text-sm font-medium text-white bg-[#30442B] hover:bg-[#3a5336] rounded-lg transition-all shadow-sm"
                                        data-name="Emily Wilson"
                                        data-email="emily.w@email.com"
                                        data-subject="Product availability question"
                                        data-date="2024-01-13 11:45 AM"
                                        data-message="Is the Ethiopian blend still available? I couldn't find it on the website">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <?php 
        include_once __DIR__ . '/../../components/modals/admin-account-modals.php';
        renderUserDetailsModal();
        renderBanConfirmModal();
        renderEditStaffModal();
        renderAddStaffModal();
        renderReplyInquiryModal();
        ?>
    </div>
    <?php
}
?>