$(document).ready(function () {
  // Initialize the first tab (Customer)
  $('#staffContent, #inquiriesContent').hide();
  $('#staffStats, #inquiriesStats').hide();
  $('#customerContent').show();
  $('#customerStats').show();

  // Initialize button styles
  $('.tab-button[data-tab="customer"]').addClass('bg-white text-[#30442B]')
    .siblings().removeClass('bg-white text-[#30442B]').addClass('text-white');

  // Tab switching functionality
  $('.tab-button').on('click', function () {
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

  function formatDateTime(value) {
    if (!value) return '—';
    var normalized = String(value).replace(' ', 'T');
    var date = new Date(normalized);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  var STATUS_BADGE_CLASSES = {
    pending: 'bg-yellow-50 text-yellow-700',
    responded: 'bg-green-50 text-green-700',
    done: 'bg-slate-100 text-slate-600',
  };

  var AVATAR_CLASSES = {
    pending: 'bg-yellow-100 text-yellow-600',
    responded: 'bg-green-100 text-green-600',
    done: 'bg-slate-200 text-slate-600',
  };

  function applyThreadStatus($card, status, updatedAt) {
    var normalizedStatus = status || 'pending';
    var label = normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
    var badgeClasses = STATUS_BADGE_CLASSES[normalizedStatus] || STATUS_BADGE_CLASSES.pending;
    var avatarClasses = AVATAR_CLASSES[normalizedStatus] || AVATAR_CLASSES.pending;

    var $badge = $card.find('.inquiry-status');
    $badge
      .removeClass(Object.values(STATUS_BADGE_CLASSES).join(' '))
      .addClass(badgeClasses)
      .text(label);

    var $avatar = $card.find('.inquiry-avatar');
    $avatar
      .removeClass(Object.values(AVATAR_CLASSES).join(' '))
      .addClass(avatarClasses);

    if (updatedAt) {
      var formatted = formatDateTime(updatedAt);
      $card.find('.thread-updated-at').text('Updated: ' + formatted);
    }

    $card.attr('data-thread-status', normalizedStatus);

    if (normalizedStatus === 'done') {
      $card.find('.mark-thread-done').remove();
    }
  }

  // View details functionality (Customer only)
  $(document).on('click', '#customerContent .fa-circle-info', function () {
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
  $(document).on('click', '#customerContent .delete-user', function () {
    const name = $(this).closest('tr').find('.font-medium.text-gray-800').text();
    $('#banUserName').text(name);
    showModal('banConfirmModal');
  });

  // Add Staff Button
  $('#addStaffBtn').on('click', function () {
    // Clear form
    $('#addStaffForm')[0].reset();
    showModal('addStaffModal');
  });

  // Edit Staff Button
  $(document).on('click', '.edit-staff', function () {
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
  $(document).on('click', '.delete-staff', function () {
    const name = $(this).closest('tr').find('.font-medium.text-gray-800').text();
    $('#banUserName').text(name);
    showModal('banConfirmModal');
  });

  // Reply to Inquiry Button Click
  let activeReplyButton = null;
  let isSendingReply = false;

  $(document).on('click', '.reply-inquiry', function (e) {
    e.preventDefault();
    e.stopPropagation();

    activeReplyButton = $(this);

    const threadId = activeReplyButton.data('thread-id');
    const name = activeReplyButton.data('name');
    const email = activeReplyButton.data('email');
    const subjectRaw = activeReplyButton.data('subject') || '';
    const subjectDisplay = activeReplyButton.data('subject-display') || 'No Subject';
    const date = activeReplyButton.data('date') || '—';
    const message = activeReplyButton.data('message') || '';

    $('#replyInquiryId').val(threadId);
    $('#replyName').text(name || '—');
    $('#replyEmail').text(email || '—');
    $('#replyDate').text(date);
    $('#replyCustomerMessage').text(message || '—');

    const $subject = $('#replySubject');
    $subject.text(subjectDisplay);
    if (!subjectRaw.trim()) {
      $subject.addClass('italic text-gray-400');
    } else {
      $subject.removeClass('italic text-gray-400');
    }

    $('#replyError').addClass('hidden').text('');
    $('#replyResponseText').val('');

    showModal('replyInquiryModal');
    $('#replyResponseText').trigger('focus');
  });

  $('#sendReply').on('click', function (e) {
    e.preventDefault();
    if (isSendingReply) return;

    const threadId = parseInt($('#replyInquiryId').val(), 10);
    const response = $('#replyResponseText').val().trim();

    if (!response) {
      $('#replyError').removeClass('hidden').text('Please enter a reply before sending.');
      $('#replyResponseText').focus();
      return;
    }
    if (!Number.isInteger(threadId) || threadId <= 0) {
      $('#replyError').removeClass('hidden').text('Invalid inquiry reference. Please reload the page.');
      return;
    }

    isSendingReply = true;
    const $sendBtn = $('#sendReply');
    $sendBtn.prop('disabled', true).text('Sending…');
    $('#replyError').addClass('hidden').text('');

    $.ajax({
      url: '/COFFEE_ST/public/api/inquiry-reply.php',
      method: 'POST',
      dataType: 'json',
      data: {
        thread_id: threadId,
        message: response,
      },
    })
      .done(function (payload) {
        if (!payload || payload.success !== true) {
          const errorMessage = payload && payload.error ? payload.error : 'Unable to send reply right now.';
          $('#replyError').removeClass('hidden').text(errorMessage);
          return;
        }

        hideModal('replyInquiryModal');
        $('#replyResponseText').val('');

        if (activeReplyButton) {
          const $card = activeReplyButton.closest('.inquiry-card');
          var newStatus = (payload.thread && payload.thread.status) ? payload.thread.status : 'responded';
          var updatedAt = payload.thread && payload.thread.last_message_at ? payload.thread.last_message_at : null;
          applyThreadStatus($card, newStatus, updatedAt);

          if (updatedAt) {
            activeReplyButton.data('date', formatDateTime(updatedAt));
          }

          activeReplyButton = null;
        }

        alert('Reply sent successfully.');
      })
      .fail(function (xhr) {
        let message = 'Failed to send reply. Please try again.';
        if (xhr.responseJSON && xhr.responseJSON.error) {
          message = xhr.responseJSON.error;
        }
        $('#replyError').removeClass('hidden').text(message);
      })
      .always(function () {
        isSendingReply = false;
        $sendBtn.prop('disabled', false).text('Send Reply');
      });
  });

  $('#cancelReply').on('click', function (e) {
    e.preventDefault();
    hideModal('replyInquiryModal');
    $('#replyResponseText').val('');
    $('#replyError').addClass('hidden').text('');
    activeReplyButton = null;
  });

  // Handle ban/delete confirmation
  $('.confirm-ban').on('click', function () {
    alert('User has been deleted successfully');
    hideModal('banConfirmModal');
  });

  $(document).on('click', '.mark-thread-done', function (e) {
    e.preventDefault();

    const $button = $(this);
    const threadId = parseInt($button.data('thread-id'), 10);
    if (!Number.isInteger(threadId) || threadId <= 0) {
      alert('Invalid thread reference.');
      return;
    }

    $button.prop('disabled', true).text('Marking…');

    $.ajax({
      url: '/COFFEE_ST/public/api/thread-status.php',
      method: 'POST',
      dataType: 'json',
      data: {
        thread_id: threadId,
        status: 'done',
      },
    })
      .done(function (payload) {
        if (!payload || payload.success !== true) {
          const errorMessage = payload && payload.error ? payload.error : 'Unable to update status.';
          alert(errorMessage);
          return;
        }

        const $card = $button.closest('.inquiry-card');
        var updatedAt = payload.thread && payload.thread.last_message_at ? payload.thread.last_message_at : null;
        applyThreadStatus($card, 'done', updatedAt);
      })
      .fail(function (xhr) {
        let message = 'Failed to update thread status.';
        if (xhr.responseJSON && xhr.responseJSON.error) {
          message = xhr.responseJSON.error;
        }
        alert(message);
      })
      .always(function () {
        $button.prop('disabled', false).text('Mark Done');
      });
  });

  // Add Staff Form Submit
  $('#addStaffForm').on('submit', function (e) {
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
  $('#editStaffForm').on('submit', function (e) {
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
  $('#showPassword').on('change', function () {
    const passwordFields = $('#addStaffPassword, #addStaffRetypePassword');
    if ($(this).is(':checked')) {
      passwordFields.attr('type', 'text');
    } else {
      passwordFields.attr('type', 'password');
    }
  });

  // Close modals
  $('.close-modal, .cancel-ban').on('click', function (e) {
    e.preventDefault();
    hideModal('userDetailsModal');
    hideModal('banConfirmModal');
    hideModal('editStaffModal');
    hideModal('addStaffModal');
    hideModal('replyInquiryModal');
    $('#replyError').addClass('hidden').text('');
    $('#replyResponseText').val('');
    activeReplyButton = null;
  });

  // Close modals when clicking outside
  $(window).on('click', function (event) {
    if ($(event.target).hasClass('fixed') && $(event.target).hasClass('bg-gray-900\/50')) {
      hideModal('userDetailsModal');
      hideModal('banConfirmModal');
      hideModal('editStaffModal');
      hideModal('addStaffModal');
      hideModal('replyInquiryModal');
      $('#replyResponseText').val('');
      $('#replyError').addClass('hidden').text('');
      activeReplyButton = null;
    }
  });

  // Prevent modal from closing when clicking inside modal content
  $('.fixed > div').on('click', function (e) {
    e.stopPropagation();
  });

  // Search functionality
  $('#searchInput').on('input', function () {
    const searchQuery = $(this).val().toLowerCase();
    $('.tab-content:visible tbody tr').each(function () {
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
  $('#statusFilter').on('change', function () {
    const selectedStatus = $(this).val().toLowerCase();
    if (selectedStatus === 'all status') {
      $('.tab-content:visible tbody tr').show();
      return;
    }

    $('.tab-content:visible tbody tr').each(function () {
      const status = $(this).find('.rounded-full').text().trim().toLowerCase();
      if (status === selectedStatus) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });
});