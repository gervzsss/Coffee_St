<?php
function renderAdminHeader()
{
  ?>
  <!-- Main Content -->
  <div class="main-content min-h-screen p-6 ml-64 transition-all duration-300 ease-in-out">
    <div class="max-w-screen-2xl mx-auto">
      <!-- Header Section -->
      <div class="admin-header bg-[#30442B] text-white rounded-2xl p-8 mb-8 transition-all duration-300 ease-in-out">
        <h1 class="text-3xl md:text-4xl font-extrabold transition-all duration-300">ORDERS & TRACKING</h1>
        <p class="text-sm text-white/80 mt-2">Manage customer orders and track their progress</p>
      </div>

      <!-- Order Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8 transition-all duration-300"
        :class="sidebarOpen ? '' : 'lg:grid-cols-4'">
        <!-- All Orders -->
        <div
          class="status-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105 hover:bg-[#30442B]/5 group"
          data-status="all">
          <div class="text-4xl font-bold mb-2 text-gray-800 group-hover:text-[#30442B]" id="total-orders">0</div>
          <div class="text-sm font-medium text-gray-500 group-hover:text-[#30442B]">All Orders</div>
          <div
            class="status-indicator bg-[#30442B] h-1 w-full rounded-full absolute bottom-0 left-0 transform scale-x-0 transition-transform duration-300">
          </div>
        </div>

        <!-- Processing Orders -->
        <div
          class="status-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105 hover:bg-blue-50/50 group"
          data-status="processing">
          <div class="text-4xl font-bold mb-2 text-gray-800 group-hover:text-blue-600" id="processing-count">0</div>
          <div class="text-sm font-medium text-gray-500 group-hover:text-blue-600">Processing Orders</div>
          <div
            class="status-indicator bg-blue-500 h-1 w-full rounded-full absolute bottom-0 left-0 transform scale-x-0 transition-transform duration-300">
          </div>
        </div>

        <!-- Out for Delivery -->
        <div
          class="status-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105 hover:bg-purple-50/50 group"
          data-status="out-for-delivery">
          <div class="text-4xl font-bold mb-2 text-gray-800 group-hover:text-purple-600" id="out-for-delivery-count">0
          </div>
          <div class="text-sm font-medium text-gray-500 group-hover:text-purple-600">Out for Delivery</div>
          <div
            class="status-indicator bg-purple-500 h-1 w-full rounded-full absolute bottom-0 left-0 transform scale-x-0 transition-transform duration-300">
          </div>
        </div>

        <!-- Completed Orders -->
        <div
          class="status-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105 hover:bg-green-50/50 group"
          data-status="completed">
          <div class="text-4xl font-bold mb-2 text-gray-800 group-hover:text-green-600" id="completed-count">0</div>
          <div class="text-sm font-medium text-gray-500 group-hover:text-green-600">Completed Orders</div>
          <div
            class="status-indicator bg-green-500 h-1 w-full rounded-full absolute bottom-0 left-0 transform scale-x-0 transition-transform duration-300">
          </div>
        </div>

        <!-- Failed Orders -->
        <div
          class="status-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105 hover:bg-red-50/50 group"
          data-status="failed">
          <div class="text-4xl font-bold mb-2 text-gray-800 group-hover:text-red-600" id="failed-count">0</div>
          <div class="text-sm font-medium text-gray-500 group-hover:text-red-600">Failed Orders</div>
          <div
            class="status-indicator bg-red-500 h-1 w-full rounded-full absolute bottom-0 left-0 transform scale-x-0 transition-transform duration-300">
          </div>
        </div>
      </div>

      <!-- Search and Filter Section -->
      <div class="bg-[#30442B] rounded-2xl p-4 mb-8 transition-all duration-300 ease-in-out">
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div class="relative flex-1 max-w-2xl">
            <input type="text" placeholder="Search by Order number or customer name......"
              class="w-full pl-10 pr-4 py-3 bg-white border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 shadow-sm transition-all duration-300">
            <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div class="md:ml-4">
            <button
              class="w-full md:w-auto px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center md:justify-start gap-2">
              <span class="font-medium text-gray-700">CATEGORIES</span>
              <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="bg-white rounded-2xl shadow-sm transition-all duration-300 ease-in-out">
        <div class="px-8 py-6 border-b border-gray-100">
          <h2 class="text-xl font-semibold text-gray-800">
            <span id="orders-header-text">All Orders</span>
            (<span id="filtered-count">0</span>)
          </h2>
        </div>

        <!-- Order Items -->
        <div class="p-8 space-y-4">
          <?php
}

// Render the modal
function renderOrderModal()
{
  ?>
          <!-- Status Confirmation Modal -->
          <div id="statusConfirmModal" class="fixed inset-0 bg-black/50 z-[60] hidden">
            <div
              class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl max-w-md w-full mx-4 shadow-xl transform transition-all duration-300 scale-95 opacity-0">
              <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Confirm Status Change</h3>
                <p class="text-gray-600 mb-2">Change order status from <span id="oldStatus" class="font-medium"></span> to
                  <span id="newStatus" class="font-medium"></span>?
                </p>
                <p class="text-sm text-gray-500">Are you sure you want to change the order status? This action will be
                  logged.</p>

                <!-- Cancellation Reason Input (Hidden by default) -->
                <div id="cancellationReasonContainer" class="hidden mt-4">
                  <label for="cancellationReason" class="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Cancellation <span class="text-red-500">*</span>
                  </label>
                  <textarea id="cancellationReason"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B]/20 resize-none transition-all duration-200"
                    rows="3" placeholder="Please provide a reason for cancelling this order..."></textarea>
                  <p id="reasonError" class="hidden mt-1 text-sm text-red-600">Please provide a reason for cancellation.
                  </p>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                  <button id="cancelStatusChange"
                    class="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200">
                    Cancel
                  </button>
                  <button id="confirmStatusChange"
                    class="px-4 py-2 bg-[#30442B] text-white font-medium rounded-lg hover:bg-[#3a533c] transition-all duration-200">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Details Modal -->
          <div id="orderDetailsModal" class="fixed inset-0 bg-black/50 z-50 hidden">
            <div
              class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl max-w-lg w-full mx-4 shadow-xl transform transition-all duration-300">
              <!-- Modal Header -->
              <div class="p-6 border-b border-gray-100">
                <div class="flex flex-col gap-1">
                  <h3 class="text-xl font-semibold text-gray-800">Order Details</h3>
                  <p class="text-sm text-gray-500">Complete information for <span id="orderNumber"></span></p>
                </div>
              </div>

              <!-- Status Bar -->
              <div class="px-6 py-3 bg-gray-50 border-b border-gray-100">
                <div class="flex items-center gap-3">
                  <div id="statusBadge"
                    class="px-4 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </div>
                  <select id="orderStatus"
                    class="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B]/20 hover:bg-gray-50 transition-colors">
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <!-- Modal Content -->
              <div class="p-6 space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto">
                <!-- Customer Information -->
                <div class="space-y-3">
                  <h4 class="text-sm font-semibold text-gray-800">Customer Information</h4>
                  <div class="space-y-2 text-sm text-gray-600">
                    <p id="customerName"></p>
                    <p id="customerEmail"></p>
                    <p id="customerPhone"></p>
                    <p id="customerAddress"></p>
                  </div>
                </div>

                <!-- Order Items -->
                <div class="space-y-3">
                  <h4 class="text-sm font-semibold text-gray-800">Order Items</h4>
                  <div id="orderItems" class="divide-y divide-gray-100"></div>
                </div>

                <!-- Total -->
                <div class="pt-4 border-t border-gray-100">
                  <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-800">Total</span>
                    <span id="orderTotal" class="text-xl font-bold text-gray-800"></span>
                  </div>
                </div>

                <!-- Activity Log -->
                <div class="space-y-3">
                  <h4 class="text-sm font-semibold text-gray-800">Activity Log</h4>
                  <div id="activityLog" class="space-y-2 text-sm"></div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="border-t border-gray-100 p-6 flex justify-end">
                <button onclick="closeOrderDetails()"
                  class="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200">
                  Close
                </button>
              </div>
            </div>
          </div>
          <?php
}

// Order card template
function renderOrderCard($order)
{
  $statusClass = [
    "Pending" => "bg-yellow-50 text-yellow-700",
    "Confirmed" => "bg-blue-50 text-blue-700",
    "Processing" => "bg-blue-50 text-blue-700",
    "Out for Delivery" => "bg-purple-50 text-purple-700",
    "Cancelled" => "bg-red-50 text-red-700",
    "Failed" => "bg-red-50 text-red-700",
  ];

  $status = $order["status"] ?? "Pending";
  $statusStyle = $statusClass[$status] ?? $statusClass["Pending"];
  ?>
          <div
            class="order-item group bg-white rounded-xl border border-gray-100 p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer"
            data-order-id="<?= $order["id"] ?>" data-status="<?= strtolower($status) ?>">
            <div class="flex justify-between items-start mb-4">
              <div class="space-y-3">
                <div class="flex items-center gap-3 flex-wrap">
                  <h3 class="text-lg font-semibold text-gray-800 group-hover:text-[#30442B] transition-colors"><?= $order[
                    "id"
                  ] ?></h3>
                  <span class="status-badge px-3 py-1 <?= $statusStyle ?> text-sm font-medium rounded-full">
                    <?= $status ?>
                  </span>
                  <?php if (isset($order["urgent"]) && $order["urgent"]): ?>
                    <span class="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full animate-pulse">
                      Urgent
                    </span>
                  <?php endif; ?>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                  <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="font-medium"><?= $order[
                    "customer_name"
                  ] ?></span>
                  <span class="text-gray-400">• <?= $order[
                    "time_ago"
                  ] ?></span>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                  <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span class="group-hover:text-gray-900 transition-colors"><?= $order[
                    "address"
                  ] ?></span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-gray-800">$<?= number_format(
                  $order["total"],
                  2,
                ) ?></div>
                <div class="text-sm text-gray-500 mt-1"><?= $order[
                  "item_count"
                ] ?> items</div>
              </div>
            </div>
            <?php if (isset($order["note"]) && $order["note"]): ?>
              <div
                class="bg-gray-50/50 p-4 rounded-xl mt-4 border border-gray-100 group-hover:border-gray-200 transition-all">
                <p class="text-gray-600">
                  <span class="font-medium">Note:</span> <?= $order["note"] ?>
                </p>
              </div>
            <?php endif; ?>
            <div class="mt-6">
              <select
                class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B]/20 hover:bg-gray-50/80 transition-colors cursor-pointer"
                onchange="updateOrderStatus(this, '<?= $order["id"] ?>')" aria-label="Change order status">
                <option value="Pending" <?= $status === "Pending"
                  ? "selected"
                  : "" ?>>Pending</option>
                <option value="Confirmed" <?= $status === "Confirmed"
                  ? "selected"
                  : "" ?>>Confirmed</option>
                <option value="Cancelled" <?= $status === "Cancelled"
                  ? "selected"
                  : "" ?>>Cancelled</option>
              </select>
            </div>
          </div>
          <?php
}
?>