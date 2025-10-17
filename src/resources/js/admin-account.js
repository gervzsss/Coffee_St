$(document).ready(function() {
    // Initialize the first tab (Customer)
    $('#staffContent, #inquiriesContent').hide();
    $('#staffStats, #inquiriesStats').hide();
    $('#customerContent').show();
    $('#customerStats').show();
    
    // Initialize button styles
    $('.tab-button[data-tab="customer"]').addClass('bg-white text-[#30442B]')
        .siblings().removeClass('bg-white text-[#30442B]').addClass('text-white');

    // Tab switching functionality
    $('.tab-button').on('click', function() {
        const tabId = $(this).data('tab');
        
        // Update button styles
        $('.tab-button').removeClass('bg-white text-[#30442B]').addClass('text-white');
        $(this).removeClass('text-white').addClass('bg-white text-[#30442B]');

        // Hide all content and stats
        $('.tab-content').hide();
        $('.stats-container').hide();

        // Show the appropriate content and stats with fade effect
        $(`#${tabId}Content`).fadeIn(300);
        $(`#${tabId}Stats`).fadeIn(300);
    });

    // Modal functionality
    function showModal(modalId) {
        $(`#${modalId}`).removeClass('hidden').addClass('flex');
        $('body').css('overflow', 'hidden'); // Prevent background scrolling
    }

    function hideModal(modalId) {
        $(`#${modalId}`).removeClass('flex').addClass('hidden');
        $('body').css('overflow', 'auto'); // Restore scrolling
    }

    // View details functionality (Customer only)
    $(document).on('click', '#customerContent .fa-circle-info', function() {
        const row = $(this).closest('tr');
        const name = row.find('.font-medium.text-gray-800').text();
        const email = row.find('td:nth-child(2) p').text();
        const phone = row.find('.text-gray-500.text-xs').text();
        const status = row.find('.rounded-full').text().trim();

        // Populate modal with user data
        $('#modalUserName').text(name);
        $('#modalEmail').text(email);
        $('#modalPhone').text(phone);
        $('#modalStatus')
            .text(status)
            .removeClass()
            .addClass('inline-block px-3 py-1 rounded-full text-xs font-medium')
            .addClass(status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700');
        $('#modalOrders').text('12');
        $('#modalJoined').text('2024-01-10');
        $('#modalSpent').text('$186.50');

        showModal('userDetailsModal');
    });

    // Delete customer user functionality with confirmation
    $(document).on('click', '#customerContent .delete-user', function() {
        const name = $(this).closest('tr').find('.font-medium.text-gray-800').text();
        $('#banUserName').text(name);
        showModal('banConfirmModal');
    });

    // Add Staff Button
    $('#addStaffBtn').on('click', function() {
        // Clear form
        $('#addStaffForm')[0].reset();
        showModal('addStaffModal');
    });

    // Edit Staff Button
    $(document).on('click', '.edit-staff', function() {
        const name = $(this).data('name');
        const email = $(this).data('email');
        const phone = $(this).data('phone');
        const role = $(this).data('role');

        // Populate edit form
        $('#editStaffName').val(name);
        $('#editStaffEmail').val(email);
        $('#editStaffPhone').val(phone);
        $('#editStaffRole').val(role);

        showModal('editStaffModal');
    });

    // Delete Staff functionality
    $(document).on('click', '.delete-staff', function() {
        const name = $(this).closest('tr').find('.font-medium.text-gray-800').text();
        $('#banUserName').text(name);
        showModal('banConfirmModal');
    });

    // Reply to Inquiry Button Click
    $(document).on('click', '.reply-inquiry', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const name = $(this).data('name');
        const email = $(this).data('email');
        const subject = $(this).data('subject');
        const date = $(this).data('date');
        const message = $(this).data('message');

        console.log('Reply button clicked', { name, email, subject, date, message }); // Debug log

        // Populate reply modal
        $('#replySubject').text(subject);
        $('#replyName').text(name);
        $('#replyEmail').text(email);
        $('#replyDate').text(date);
        $('#replyCustomerMessage').text(message);
        $('#replyResponseText').val('');

        showModal('replyInquiryModal');
    });

    // Send Reply Button
    $('#sendReply').on('click', function(e) {
        e.preventDefault();
        const response = $('#replyResponseText').val();
        
        if (!response.trim()) {
            alert('Please type a response before sending');
            return;
        }

        // Here you would typically make an API call to send the email
        alert('Reply sent successfully!');
        hideModal('replyInquiryModal');
        $('#replyResponseText').val('');
    });

    // Cancel Reply Button
    $('#cancelReply').on('click', function(e) {
        e.preventDefault();
        hideModal('replyInquiryModal');
        $('#replyResponseText').val('');
    });

    // Handle ban/delete confirmation
    $('.confirm-ban').on('click', function() {
        alert('User has been deleted successfully');
        hideModal('banConfirmModal');
    });

    // Add Staff Form Submit
    $('#addStaffForm').on('submit', function(e) {
        e.preventDefault();
        
        const name = $('#addStaffName').val();
        const email = $('#addStaffEmail').val();
        const phone = $('#addStaffPhone').val();
        const role = $('#addStaffRole').val();
        const password = $('#addStaffPassword').val();
        const retypePassword = $('#addStaffRetypePassword').val();

        // Validation
        if (!name || !email || !phone || !role || !password || !retypePassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== retypePassword) {
            alert('Passwords do not match');
            return;
        }

        // Here you would typically make an API call to add the staff
        alert(`Staff member ${name} has been added successfully`);
        hideModal('addStaffModal');
        $('#addStaffForm')[0].reset();
    });

    // Edit Staff Form Submit
    $('#editStaffForm').on('submit', function(e) {
        e.preventDefault();
        
        const name = $('#editStaffName').val();
        const email = $('#editStaffEmail').val();
        const phone = $('#editStaffPhone').val();
        const role = $('#editStaffRole').val();

        // Validation
        if (!name || !email || !phone || !role) {
            alert('Please fill in all fields');
            return;
        }

        // Here you would typically make an API call to update the staff
        alert(`Staff member ${name} has been updated successfully`);
        hideModal('editStaffModal');
    });

    // Show Password Toggle
    $('#showPassword').on('change', function() {
        const passwordFields = $('#addStaffPassword, #addStaffRetypePassword');
        if ($(this).is(':checked')) {
            passwordFields.attr('type', 'text');
        } else {
            passwordFields.attr('type', 'password');
        }
    });

    // Close modals
    $('.close-modal, .cancel-ban').on('click', function(e) {
        e.preventDefault();
        hideModal('userDetailsModal');
        hideModal('banConfirmModal');
        hideModal('editStaffModal');
        hideModal('addStaffModal');
        hideModal('replyInquiryModal');
    });

    // Close modals when clicking outside
    $(window).on('click', function(event) {
        if ($(event.target).hasClass('fixed') && $(event.target).hasClass('bg-gray-900\/50')) {
            hideModal('userDetailsModal');
            hideModal('banConfirmModal');
            hideModal('editStaffModal');
            hideModal('addStaffModal');
            hideModal('replyInquiryModal');
        }
    });

    // Prevent modal from closing when clicking inside modal content
    $('.fixed > div').on('click', function(e) {
        e.stopPropagation();
    });

    // Search functionality
    $('#searchInput').on('input', function() {
        const searchQuery = $(this).val().toLowerCase();
        $('.tab-content:visible tbody tr').each(function() {
            const name = $(this).find('.font-medium.text-gray-800').text().toLowerCase();
            const email = $(this).find('td:nth-child(2) p').text().toLowerCase();
            const phone = $(this).find('.text-gray-500.text-xs').text().toLowerCase();
            
            if (name.includes(searchQuery) || email.includes(searchQuery) || phone.includes(searchQuery)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // Status filter functionality
    $('#statusFilter').on('change', function() {
        const selectedStatus = $(this).val().toLowerCase();
        if (selectedStatus === 'all status') {
            $('.tab-content:visible tbody tr').show();
            return;
        }

        $('.tab-content:visible tbody tr').each(function() {
            const status = $(this).find('.rounded-full').text().trim().toLowerCase();
            if (status === selectedStatus) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});