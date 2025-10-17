<?php
function renderUserDetailsModal() {
    ?>
    <!-- User Details Modal (For Customer) -->
    <div id="userDetailsModal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm hidden items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4">
            <div class="p-8">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-gray-800">User Details - <span id="modalUserName" class="text-[#30442B]"></span></h2>
                    <button class="close-modal p-2 hover:bg-gray-100 rounded-full transition-all">
                        <i class="fas fa-times text-gray-400"></i>
                    </button>
                </div>
                
                <div class="bg-white rounded-xl p-6 mb-6">
                    <p class="text-sm text-gray-500 mb-4">Complete user information and activity history</p>
                    <div class="grid grid-cols-3 gap-4 mb-6">
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
                        <div class="bg-gray-50 rounded-xl p-4">
                            <p class="text-2xl font-bold text-gray-800" id="modalTotalOrders">24</p>
                            <p class="text-xs text-gray-500 mt-1">Total Orders</p>
                        </div>
                        <div class="bg-gray-50 rounded-xl p-4">
                            <p class="text-2xl font-bold text-gray-800" id="modalTotalSpent">$186.50</p>
                            <p class="text-xs text-gray-500 mt-1">Total Spent</p>
                        </div>
                        <div class="bg-gray-50 rounded-xl p-4">
                            <p class="text-2xl font-bold text-gray-800" id="modalJoinDate">2024-01-10</p>
                            <p class="text-xs text-gray-500 mt-1">Joined</p>
                        </div>
                    </div>
                </div>

                <div class="bg-green-50 rounded-xl p-6 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <i class="fas fa-shield-alt text-green-600"></i>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-800">Clean record</p>
                            <p class="text-xs text-gray-500">No scam warnings or fraudulent activity reported</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                        <i class="fas fa-check text-green-600"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php
}

function renderBanConfirmModal() {
    ?>
    <!-- Delete Confirmation Modal -->
    <div id="banConfirmModal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm hidden items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div class="p-6 text-center">
                <div class="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Confirm Status Change</h3>
                <p class="text-gray-600 mb-6">Are you sure you want to block <span id="banUserName" class="font-medium"></span>? This action will be logged.</p>
                
                <div class="flex items-center justify-center gap-3">
                    <button class="cancel-ban px-8 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                        Cancel
                    </button>
                    <button class="confirm-ban px-8 py-3 text-sm font-medium text-white bg-[#30442B] hover:bg-[#3a5336] rounded-xl transition-all">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </div>
    <?php
}

function renderEditStaffModal() {
    ?>
    <!-- Edit Staff Modal -->
    <div id="editStaffModal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm hidden items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div class="p-6">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-1">Edit User</h2>
                    <p class="text-sm text-gray-500">Register a new customer or create a staff account</p>
                </div>
                
                <form id="editStaffForm" class="space-y-4">
                    <div>
                        <label class="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                        <input type="text" id="editFullName" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-all">
                    </div>
                    
                    <div>
                        <label class="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                        <input type="email" id="editEmail" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-all">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-1 block">User Role</label>
                            <select id="editRole" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] bg-white transition-all">
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                            <select id="editStatus" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] bg-white transition-all">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    
                    <button type="submit" class="w-full px-6 py-3 bg-[#30442B] text-white rounded-xl hover:bg-[#3a5336] transition-all duration-300 font-medium shadow-lg hover:shadow-xl mt-6">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    </div>
    <?php
}

function renderAddStaffModal() {
    ?>
    <!-- Add Staff Modal -->
    <div id="addStaffModal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm hidden items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div class="p-6">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-1">Add New User</h2>
                    <p class="text-sm text-gray-500">Register a new customer or create a staff account</p>
                </div>
                
                <form id="addStaffForm" class="space-y-4">
                    <div>
                        <label class="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                        <input type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-all">
                    </div>
                    
                    <div>
                        <label class="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                        <input type="email" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-all">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                            <input type="password" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-all">
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-1 block">Confirm Password</label>
                            <input type="password" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-all">
                        </div>
                    </div>
                    
                    <div>
                        <label class="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                        <input type="tel" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-all">
                    </div>
                    
                    <div>
                        <label class="text-sm font-medium text-gray-700 mb-1 block">User Role</label>
                        <select class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] bg-white transition-all">
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <input type="checkbox" id="sendCredentials" class="rounded text-[#30442B] focus:ring-[#30442B]">
                        <label for="sendCredentials" class="text-sm text-gray-600">Send login credentials via email</label>
                    </div>
                    
                    <button type="submit" class="w-full px-6 py-3 bg-[#30442B] text-white rounded-xl hover:bg-[#3a5336] transition-all duration-300 font-medium shadow-lg hover:shadow-xl mt-6">
                        Add New User
                    </button>
                </form>
            </div>
        </div>
    </div>
    <?php
}

function renderReplyInquiryModal() {
    ?>
    <!-- Reply to Inquiry Modal -->
    <div id="replyInquiryModal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm hidden items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
            <div class="p-6">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-1">Reply to Message</h2>
                    <p class="text-sm text-gray-500">Send a response to the customer's message</p>
                </div>
                
                <div class="space-y-4">
                    <!-- Subject -->
                    <div>
                        <label class="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
                        <p class="text-base text-gray-800" id="inquirySubject">Re: Question about delivery times</p>
                    </div>

                    <!-- Customer Message -->
                    <div>
                        <label class="text-sm font-medium text-gray-700 mb-1 block">Customer's Message</label>
                        <p class="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl" id="inquiryMessage">What are your typical delivery times for orders placed in the morning? I need to plan my schedule.</p>
                    </div>

                    <!-- Your Response -->
                    <div>
                        <label class="text-sm font-medium text-gray-700 mb-1 block">Your Response</label>
                        <textarea class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-all h-32"></textarea>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex items-center gap-3 pt-2">
                        <button class="cancel-reply px-8 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                            Cancel
                        </button>
                        <button class="send-reply px-8 py-3 text-sm font-medium text-white bg-[#30442B] hover:bg-[#3a5336] rounded-xl transition-all">
                            Send Reply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php
}
?>
