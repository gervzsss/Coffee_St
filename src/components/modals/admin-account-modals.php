<?php
function renderUserDetailsModal()
{
  ?>
  <!-- User Details Modal (For Customer) -->
  <div id="userDetailsModal"
    class="fixed inset-0 z-50 hidden items-center justify-center bg-gray-900/50 backdrop-blur-sm">
    <div class="mx-4 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
      <div class="p-8">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800">
            User Details - <span id="modalUserName" class="text-[#30442B]"></span>
          </h2>
          <button class="close-modal rounded-full p-2 transition-all hover:bg-gray-100">
            <i class="fas fa-times text-gray-400"></i>
          </button>
        </div>

        <div class="mb-6 rounded-xl bg-white p-6">
          <p class="mb-4 text-sm text-gray-500">
            Complete user information and activity history
          </p>
          <div class="mb-6 grid grid-cols-3 gap-4">
            <div>
              <p class="text-xs text-gray-500">Email</p>
              <p class="font-medium text-gray-800" id="modalEmail"></p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Phone</p>
              <p class="font-medium text-gray-800" id="modalPhone"></p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Status</p>
              <p class="font-medium text-gray-800" id="modalStatus"></p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-6 text-center">
            <div class="rounded-xl bg-gray-50 p-4">
              <p class="text-2xl font-bold text-gray-800" id="modalTotalOrders">
                24
              </p>
              <p class="mt-1 text-xs text-gray-500">Total Orders</p>
            </div>
            <div class="rounded-xl bg-gray-50 p-4">
              <p class="text-2xl font-bold text-gray-800" id="modalTotalSpent">
                $186.50
              </p>
              <p class="mt-1 text-xs text-gray-500">Total Spent</p>
            </div>
            <div class="rounded-xl bg-gray-50 p-4">
              <p class="text-2xl font-bold text-gray-800" id="modalJoinDate">
                2024-01-10
              </p>
              <p class="mt-1 text-xs text-gray-500">Joined</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between rounded-xl bg-green-50 p-6">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <i class="fas fa-shield-alt text-green-600"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-800">Clean record</p>
              <p class="text-xs text-gray-500">
                No scam warnings or fraudulent activity reported
              </p>
            </div>
          </div>
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <i class="fas fa-check text-green-600"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
<?php }
function renderBanConfirmModal()
{ ?>
  <!-- Delete Confirmation Modal -->
  <div id="banConfirmModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-gray-900/50 backdrop-blur-sm">
    <div class="mx-4 w-full max-w-md rounded-2xl bg-white shadow-xl">
      <div class="p-6 text-center">
        <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50">
          <i class="fas fa-exclamation-triangle text-2xl text-red-500"></i>
        </div>
        <h3 class="mb-2 text-xl font-bold text-gray-800">
          Confirm Status Change
        </h3>
        <p class="mb-6 text-gray-600">
          Are you sure you want to block
          <span id="banUserName" class="font-medium"></span>? This action will be
          logged.
        </p>

        <div class="flex items-center justify-center gap-3">
          <button
            class="cancel-ban cursor-pointer rounded-xl bg-gray-100 px-8 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200">
            Cancel
          </button>
          <button
            class="confirm-ban cursor-pointer rounded-xl bg-[#30442B] px-8 py-3 text-sm font-medium text-white transition-all hover:bg-[#3a5336]">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
<?php }
function renderEditStaffModal()
{ ?>
  <!-- Edit Staff Modal -->
  <div id="editStaffModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-gray-900/50 backdrop-blur-sm">
    <div class="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl">
      <div class="p-6">
        <div class="mb-6 text-center">
          <h2 class="mb-1 text-2xl font-bold text-gray-800">Edit User</h2>
          <p class="text-sm text-gray-500">
            Register a new customer or create a staff account
          </p>
        </div>

        <form id="editStaffForm" class="space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="editFullName"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="editEmail"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">User Role</label>
              <select id="editRole"
                class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none">
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select id="editStatus"
                class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <button type="submit"
            class="mt-6 w-full rounded-xl bg-[#30442B] px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:bg-[#3a5336] hover:shadow-xl">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  </div>
<?php }
function renderAddStaffModal()
{ ?>
  <!-- Add Staff Modal -->
  <div id="addStaffModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-gray-900/50 backdrop-blur-sm">
    <div class="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl">
      <div class="p-6">
        <div class="mb-6 text-center">
          <h2 class="mb-1 text-2xl font-bold text-gray-800">Add New User</h2>
          <p class="text-sm text-gray-500">
            Register a new customer or create a staff account
          </p>
        </div>

        <form id="addStaffForm" class="space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <input type="password"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none" />
            </div>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="tel"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">User Role</label>
            <select
              class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none">
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" id="sendCredentials" class="rounded text-[#30442B] focus:ring-[#30442B]" />
            <label for="sendCredentials" class="text-sm text-gray-600">Send login credentials via email</label>
          </div>

          <button type="submit"
            class="mt-6 w-full rounded-xl bg-[#30442B] px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:bg-[#3a5336] hover:shadow-xl">
            Add New User
          </button>
        </form>
      </div>
    </div>
  </div>
<?php }
function renderReplyInquiryModal()
{ ?>
  <!-- Reply to Inquiry Modal -->
  <div id="replyInquiryModal"
    class="fixed inset-0 z-50 hidden items-center justify-center bg-gray-900/50 backdrop-blur-sm">
    <div class="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
      <div class="p-6">
        <div class="mb-6">
          <h2 class="mb-1 text-2xl font-bold text-gray-800">Reply to Message</h2>
          <p class="text-sm text-gray-500">
            Send a response to the customer's message
          </p>
        </div>
        <input type="hidden" id="replyInquiryId" value="" />
        <div class="space-y-5">
          <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <p class="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase">
                From
              </p>
              <p id="replyName" class="mt-1 text-base font-medium text-gray-800">
                —
              </p>
            </div>
            <div>
              <p class="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase">
                Email
              </p>
              <p id="replyEmail" class="mt-1 text-base text-gray-700">—</p>
            </div>
            <div>
              <p class="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase">
                Received
              </p>
              <p id="replyDate" class="mt-1 text-base text-gray-700">—</p>
            </div>
          </div>

          <div>
            <p class="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase">
              Subject
            </p>
            <p id="replySubject" class="mt-2 text-base font-medium text-gray-800">
              —
            </p>
          </div>

          <div>
            <p class="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase">
              Customer Message
            </p>
            <div id="replyCustomerMessage"
              class="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm whitespace-pre-line text-gray-700">
              —
            </div>
          </div>

          <div>
            <label for="replyResponseText" class="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase">Your
              Response</label>
            <textarea id="replyResponseText"
              class="mt-2 h-32 w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none"
              placeholder="Type your reply here..." required></textarea>
            <p id="replyError" class="mt-2 hidden text-sm font-medium text-red-600"></p>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button id="cancelReply"
              class="cursor-pointer rounded-xl bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200">
              Cancel
            </button>
            <button id="sendReply"
              class="cursor-pointer rounded-xl bg-[#30442B] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#3a5336] disabled:cursor-not-allowed disabled:opacity-70">
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
<?php } ?>