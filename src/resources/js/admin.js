// ===== Admin Navbar =====
$(document).ready(function () {
  let sidebarOpen = true;
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    if (sidebarOpen) {
      $(".admin-sidebar").addClass("w-64").removeClass("w-20");
      $(".main-content").addClass("ml-64").removeClass("ml-20");
      $(".sidebar-content").fadeIn(200);
      $(".admin-header, .content-card")
        .addClass("lg:mr-4")
        .removeClass("lg:mr-8");
      $(".open-icon").removeClass("hidden");
      $(".close-icon").addClass("hidden");
    } else {
      $(".admin-sidebar").removeClass("w-64").addClass("w-20");
      $(".main-content").removeClass("ml-64").addClass("ml-20");
      $(".sidebar-content").fadeOut(200);
      $(".admin-header, .content-card")
        .removeClass("lg:mr-4")
        .addClass("lg:mr-8");
      $(".open-icon").addClass("hidden");
      $(".close-icon").removeClass("hidden");
    }
  }
  $(".sidebar-toggle").on("click", function (e) {
    e.preventDefault();
    toggleSidebar();
  });
  $(
    ".admin-sidebar .flex-col, .admin-sidebar span:not(.sidebar-toggle)",
  ).addClass("sidebar-content");
  $(window).on("resize", function () {
    if ($(window).width() < 768 && sidebarOpen) toggleSidebar();
  });
  $(".close-icon").addClass("hidden");
});

// ===== Admin Accounts (customers/staff/inquiries) =====
$(document).ready(function () {
  $("#staffContent, #inquiriesContent").hide();
  $("#staffStats, #inquiriesStats").hide();
  $("#customerContent").show();
  $("#customerStats").show();

  $('.tab-button[data-tab="customer"]')
    .addClass("bg-white text-[#30442B]")
    .siblings()
    .removeClass("bg-white text-[#30442B]")
    .addClass("text-white");

  $(".tab-button").on("click", function () {
    const tabId = $(this).data("tab");
    $(".tab-button")
      .removeClass("bg-white text-[#30442B]")
      .addClass("text-white");
    $(this).removeClass("text-white").addClass("bg-white text-[#30442B]");
    $(".tab-content").hide();
    $(".stats-container").hide();
    $(`#${tabId}Content`).fadeIn(300);
    $(`#${tabId}Stats`).fadeIn(300);
  });

  function showModal(modalId) {
    $(`#${modalId}`).removeClass("hidden").addClass("flex");
    $("body").css("overflow", "hidden");
  }
  function hideModal(modalId) {
    $(`#${modalId}`).removeClass("flex").addClass("hidden");
    $("body").css("overflow", "auto");
  }

  function formatDateTime(value) {
    if (!value) return "—";
    var normalized = String(value).replace(" ", "T");
    var date = new Date(normalized);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  var STATUS_BADGE_CLASSES = {
    pending: "bg-yellow-50 text-yellow-700",
    responded: "bg-green-50 text-green-700",
    done: "bg-slate-100 text-slate-600",
  };
  var AVATAR_CLASSES = {
    pending: "bg-yellow-100 text-yellow-600",
    responded: "bg-green-100 text-green-600",
    done: "bg-slate-200 text-slate-600",
  };
  function applyThreadStatus($card, status, updatedAt) {
    var normalizedStatus = status || "pending";
    var label =
      normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
    var badgeClasses =
      STATUS_BADGE_CLASSES[normalizedStatus] || STATUS_BADGE_CLASSES.pending;
    var avatarClasses =
      AVATAR_CLASSES[normalizedStatus] || AVATAR_CLASSES.pending;
    var $badge = $card.find(".inquiry-status");
    $badge
      .removeClass(Object.values(STATUS_BADGE_CLASSES).join(" "))
      .addClass(badgeClasses)
      .text(label);
    var $avatar = $card.find(".inquiry-avatar");
    $avatar
      .removeClass(Object.values(AVATAR_CLASSES).join(" "))
      .addClass(avatarClasses);
    if (updatedAt) {
      var formatted = formatDateTime(updatedAt);
      $card.find(".thread-updated-at").text("Updated: " + formatted);
    }
    $card.attr("data-thread-status", normalizedStatus);
    if (normalizedStatus === "done") {
      $card.find(".mark-thread-done").remove();
    }
  }

  $(document).on("click", "#customerContent .fa-circle-info", function () {
    const row = $(this).closest("tr");
    const name = row.find(".font-medium.text-gray-800").text();
    const email = row.find("td:nth-child(2) p").text();
    const phone = row.find(".text-gray-500.text-xs").text();
    const status = row.find(".rounded-full").text().trim();
    $("#modalUserName").text(name);
    $("#modalEmail").text(email);
    $("#modalPhone").text(phone);
    $("#modalStatus")
      .text(status)
      .removeClass()
      .addClass("inline-block px-3 py-1 rounded-full text-xs font-medium")
      .addClass(
        status === "Active"
          ? "bg-green-50 text-green-700"
          : "bg-gray-50 text-gray-700",
      );
    $("#modalOrders").text("12");
    $("#modalJoined").text("2024-01-10");
    $("#modalSpent").text("$186.50");
    showModal("userDetailsModal");
  });

  $(document).on("click", "#customerContent .delete-user", function () {
    const name = $(this)
      .closest("tr")
      .find(".font-medium.text-gray-800")
      .text();
    $("#banUserName").text(name);
    showModal("banConfirmModal");
  });
  $("#addStaffBtn").on("click", function () {
    $("#addStaffForm")[0].reset();
    showModal("addStaffModal");
  });
  $(document).on("click", ".edit-staff", function () {
    const name = $(this).data("name");
    const email = $(this).data("email");
    const phone = $(this).data("phone");
    const role = $(this).data("role");
    $("#editStaffName").val(name);
    $("#editStaffEmail").val(email);
    $("#editStaffPhone").val(phone);
    $("#editStaffRole").val(role);
    showModal("editStaffModal");
  });
  $(document).on("click", ".delete-staff", function () {
    const name = $(this)
      .closest("tr")
      .find(".font-medium.text-gray-800")
      .text();
    $("#banUserName").text(name);
    showModal("banConfirmModal");
  });

  let activeReplyButton = null;
  let isSendingReply = false;
  $(document).on("click", ".reply-inquiry", function (e) {
    e.preventDefault();
    e.stopPropagation();
    activeReplyButton = $(this);
    const threadId = activeReplyButton.data("thread-id");
    const name = activeReplyButton.data("name");
    const email = activeReplyButton.data("email");
    const subjectRaw = activeReplyButton.data("subject") || "";
    const subjectDisplay =
      activeReplyButton.data("subject-display") || "No Subject";
    const date = activeReplyButton.data("date") || "—";
    const message = activeReplyButton.data("message") || "";
    $("#replyInquiryId").val(threadId);
    $("#replyName").text(name || "—");
    $("#replyEmail").text(email || "—");
    $("#replyDate").text(date);
    $("#replyCustomerMessage").text(message || "—");
    const $subject = $("#replySubject");
    $subject.text(subjectDisplay);
    if (!subjectRaw.trim()) {
      $subject.addClass("italic text-gray-400");
    } else {
      $subject.removeClass("italic text-gray-400");
    }
    $("#replyError").addClass("hidden").text("");
    $("#replyResponseText").val("");
    showModal("replyInquiryModal");
    $("#replyResponseText").trigger("focus");
  });
  $("#sendReply").on("click", function (e) {
    e.preventDefault();
    if (isSendingReply) return;
    const threadId = parseInt($("#replyInquiryId").val(), 10);
    const response = $("#replyResponseText").val().trim();
    if (!response) {
      $("#replyError")
        .removeClass("hidden")
        .text("Please enter a reply before sending.");
      $("#replyResponseText").focus();
      return;
    }
    if (!Number.isInteger(threadId) || threadId <= 0) {
      $("#replyError")
        .removeClass("hidden")
        .text("Invalid inquiry reference. Please reload the page.");
      return;
    }
    isSendingReply = true;
    const $sendBtn = $("#sendReply");
    $sendBtn.prop("disabled", true).text("Sending…");
    $("#replyError").addClass("hidden").text("");
    $.ajax({
      url: "/COFFEE_ST/public/api/inquiry-reply.php",
      method: "POST",
      dataType: "json",
      data: { thread_id: threadId, message: response },
    })
      .done(function (payload) {
        if (!payload || payload.success !== true) {
          const errorMessage =
            payload && payload.error
              ? payload.error
              : "Unable to send reply right now.";
          $("#replyError").removeClass("hidden").text(errorMessage);
          return;
        }
        hideModal("replyInquiryModal");
        $("#replyResponseText").val("");
        if (activeReplyButton) {
          const $card = activeReplyButton.closest(".inquiry-card");
          var newStatus =
            payload.thread && payload.thread.status
              ? payload.thread.status
              : "responded";
          var updatedAt =
            payload.thread && payload.thread.last_message_at
              ? payload.thread.last_message_at
              : null;
          applyThreadStatus($card, newStatus, updatedAt);
          if (updatedAt) {
            activeReplyButton.data("date", formatDateTime(updatedAt));
          }
          activeReplyButton = null;
        }
        alert("Reply sent successfully.");
      })
      .fail(function (xhr) {
        let message = "Failed to send reply. Please try again.";
        if (xhr.responseJSON && xhr.responseJSON.error) {
          message = xhr.responseJSON.error;
        }
        $("#replyError").removeClass("hidden").text(message);
      })
      .always(function () {
        isSendingReply = false;
        $sendBtn.prop("disabled", false).text("Send Reply");
      });
  });
  $("#cancelReply").on("click", function (e) {
    e.preventDefault();
    hideModal("replyInquiryModal");
    $("#replyResponseText").val("");
    $("#replyError").addClass("hidden").text("");
    activeReplyButton = null;
  });
  $(".confirm-ban").on("click", function () {
    alert("User has been deleted successfully");
    hideModal("banConfirmModal");
  });
  $(document).on("click", ".mark-thread-done", function (e) {
    e.preventDefault();
    const $button = $(this);
    const threadId = parseInt($button.data("thread-id"), 10);
    if (!Number.isInteger(threadId) || threadId <= 0) {
      alert("Invalid thread reference.");
      return;
    }
    $button.prop("disabled", true).text("Marking…");
    $.ajax({
      url: "/COFFEE_ST/public/api/thread-status.php",
      method: "POST",
      dataType: "json",
      data: { thread_id: threadId, status: "done" },
    })
      .done(function (payload) {
        if (!payload || payload.success !== true) {
          const errorMessage =
            payload && payload.error
              ? payload.error
              : "Unable to update status.";
          alert(errorMessage);
          return;
        }
        const $card = $button.closest(".inquiry-card");
        var updatedAt =
          payload.thread && payload.thread.last_message_at
            ? payload.thread.last_message_at
            : null;
        applyThreadStatus($card, "done", updatedAt);
      })
      .fail(function (xhr) {
        let message = "Failed to update thread status.";
        if (xhr.responseJSON && xhr.responseJSON.error) {
          message = xhr.responseJSON.error;
        }
        alert(message);
      })
      .always(function () {
        $button.prop("disabled", false).text("Mark Done");
      });
  });
  $("#addStaffForm").on("submit", function (e) {
    e.preventDefault();
    const name = $("#addStaffName").val();
    const email = $("#addStaffEmail").val();
    const phone = $("#addStaffPhone").val();
    const role = $("#addStaffRole").val();
    const password = $("#addStaffPassword").val();
    const retypePassword = $("#addStaffRetypePassword").val();
    if (!name || !email || !phone || !role || !password || !retypePassword) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== retypePassword) {
      alert("Passwords do not match");
      return;
    }
    alert(`Staff member ${name} has been added successfully`);
    hideModal("addStaffModal");
    $("#addStaffForm")[0].reset();
  });
  $("#editStaffForm").on("submit", function (e) {
    e.preventDefault();
    const name = $("#editStaffName").val();
    const email = $("#editStaffEmail").val();
    const phone = $("#editStaffPhone").val();
    const role = $("#editStaffRole").val();
    if (!name || !email || !phone || !role) {
      alert("Please fill in all fields");
      return;
    }
    alert(`Staff member ${name} has been updated successfully`);
    hideModal("editStaffModal");
  });
  $("#showPassword").on("change", function () {
    const passwordFields = $("#addStaffPassword, #addStaffRetypePassword");
    if ($(this).is(":checked")) passwordFields.attr("type", "text");
    else passwordFields.attr("type", "password");
  });
  $(".close-modal, .cancel-ban").on("click", function (e) {
    e.preventDefault();
    hideModal("userDetailsModal");
    hideModal("banConfirmModal");
    hideModal("editStaffModal");
    hideModal("addStaffModal");
    hideModal("replyInquiryModal");
    $("#replyError").addClass("hidden").text("");
    $("#replyResponseText").val("");
    activeReplyButton = null;
  });
  $(window).on("click", function (event) {
    if (
      $(event.target).hasClass("fixed") &&
      $(event.target).hasClass("bg-gray-900\/50")
    ) {
      hideModal("userDetailsModal");
      hideModal("banConfirmModal");
      hideModal("editStaffModal");
      hideModal("addStaffModal");
      hideModal("replyInquiryModal");
      $("#replyResponseText").val("");
      $("#replyError").addClass("hidden").text("");
      activeReplyButton = null;
    }
  });
  $(".fixed > div").on("click", function (e) {
    e.stopPropagation();
  });
  $("#searchInput").on("input", function () {
    const searchQuery = $(this).val().toLowerCase();
    $(".tab-content:visible tbody tr").each(function () {
      const name = $(this)
        .find(".font-medium.text-gray-800")
        .text()
        .toLowerCase();
      const email = $(this).find("td:nth-child(2) p").text().toLowerCase();
      const phone = $(this).find(".text-gray-500.text-xs").text().toLowerCase();
      if (
        name.includes(searchQuery) ||
        email.includes(searchQuery) ||
        phone.includes(searchQuery)
      )
        $(this).show();
      else $(this).hide();
    });
  });
  $("#statusFilter").on("change", function () {
    const selectedStatus = $(this).val().toLowerCase();
    if (selectedStatus === "all status") {
      $(".tab-content:visible tbody tr").show();
      return;
    }
    $(".tab-content:visible tbody tr").each(function () {
      const status = $(this).find(".rounded-full").text().trim().toLowerCase();
      $(this).toggle(status === selectedStatus);
    });
  });
});

// ===== Admin Catalog =====
$(document).ready(function () {
  function initModal(modalId, backdropId, contentId) {
    const $modal = $(`#${modalId}`);
    const $backdrop = $(`#${backdropId}`);
    const $content = $(`#${contentId}`);
    return {
      open: () => {
        $modal.removeClass("hidden");
        // ensure starting state is hidden then transition to visible
        requestAnimationFrame(() => {
          $backdrop.removeClass("opacity-0").addClass("opacity-100");
          $content
            .removeClass("opacity-0 translate-y-4 scale-95")
            .addClass("opacity-100 translate-y-0 scale-100");
        });
      },
      close: () => {
        $backdrop.removeClass("opacity-100").addClass("opacity-0");
        $content
          .removeClass("opacity-100 translate-y-0 scale-100")
          .addClass("opacity-0 translate-y-4 scale-95");
        setTimeout(() => {
          $modal.addClass("hidden");
        }, 300);
      },
    };
  }
  const modals = {
    add: initModal("addProductModal", "modalBackdrop", "modalContent"),
    edit: initModal(
      "editProductModal",
      "editModalBackdrop",
      "editModalContent",
    ),
    unavailable: initModal(
      "unavailableModal",
      "unavailableModalBackdrop",
      "unavailableModalContent",
    ),
    history: initModal(
      "historyModal",
      "historyModalBackdrop",
      "historyModalContent",
    ),
  };
  $(document).on(
    "click",
    '.open-modal, button[data-action="add-product"]',
    function (e) {
      e.preventDefault();
      modals.add.open();
    },
  );
  $(document).on("click", ".close-modal, #modalBackdrop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    modals.add.close();
  });
  $(document).on("click", "#modalContent", function (e) {
    e.stopPropagation();
  });
  $(document).on("click", "#editModalContent", function (e) {
    e.stopPropagation();
  });
  // Close when clicking wrapper (outside content area)
  $(document).on("click", "#addModalWrapper", function (e) {
    // If clicking directly on wrapper, not inside the modal card, close
    if ($(e.target).is("#addModalWrapper")) {
      modals.add.close();
    }
  });
  $(document).on("click", "#historyModalContent", function (e) {
    e.stopPropagation();
  });
  $(document).on("click", "#unavailableModalContent", function (e) {
    $(document).on("click", "#editModalWrapper", function (e) {
      if ($(e.target).is("#editModalWrapper")) {
        modals.edit.close();
      }
    });
    e.stopPropagation();
  });
  $(document).on("click", "#modalBackdrop", function (e) {
    e.preventDefault();
    $(document).on("click", "#historyModalWrapper", function (e) {
      if ($(e.target).is("#historyModalWrapper")) {
        modals.history.close();
      }
    });
    modals.add.close();
  });
  $(document).on("click", "#editModalBackdrop", function (e) {
    e.preventDefault();
    $(document).on("click", "#unavailableModalWrapper", function (e) {
      if ($(e.target).is("#unavailableModalWrapper")) {
        modals.unavailable.close();
      }
    });
    modals.edit.close();
  });
  $(document).on("click", "#historyModalBackdrop", function (e) {
    e.preventDefault();
    modals.history.close();
  });
  $(document).on("click", "#unavailableModalBackdrop", function (e) {
    e.preventDefault();
    modals.unavailable.close();
  });

  const $dropZone = $(".border-dashed");
  const $fileInput = $("#productImage");
  $dropZone
    .on(
      "drag dragstart dragend dragover dragenter dragleave drop",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      },
    )
    .on("dragover dragenter", function () {
      $(this).addClass("border-[#30442B] bg-gray-50");
    })
    .on("dragleave dragend drop", function () {
      $(this).removeClass("border-[#30442B] bg-gray-50");
    })
    .on("drop", function (e) {
      const file = e.originalEvent.dataTransfer.files[0];
      if (file) handleFile(file);
    });
  $fileInput.change(function (e) {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });
  function handleFile(file) {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $("#imagePreview").attr("src", e.target.result);
        $("#previewContainer").removeClass("hidden");
        $("#uploadIcon").addClass("hidden");
      };
      reader.readAsDataURL(file);
    }
  }

  $("#addProductForm").submit(function (e) {
    e.preventDefault();
    const fd = new FormData();
    const name = $("#productName").val();
    const price = $("#productPrice").val();
    const category = $("#productCategory").val();
    const description = $("#productDescription").val();
    const fileEl = document.getElementById("productImage");
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;
    fd.append("productName", name);
    fd.append("productPrice", price);
    fd.append("productCategory", category);
    fd.append("productDescription", description);
    if (file) fd.append("product_image", file);
    $.ajax({
      url: "/COFFEE_ST/public/api/admin/add-product.php",
      method: "POST",
      data: fd,
      processData: false,
      contentType: false,
      dataType: "json",
    })
      .done(function (resp) {
        if (resp && resp.ok) {
          location.reload();
        } else {
          alert((resp && resp.error) || "Failed to add product");
        }
      })
      .fail(function (xhr) {
        const msg =
          (xhr.responseJSON && xhr.responseJSON.error) ||
          xhr.statusText ||
          "Failed to add product";
        alert(msg);
      })
      .always(function () {
        modals.add.close();
      });
  });
  $(document).on("click", ".edit-product", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const productId = $(this).data("id");
    $("#editProductForm").data("product-id", productId);
    $.getJSON("/COFFEE_ST/public/api/admin/get-product.php", { id: productId })
      .done(function (resp) {
        if (!resp || !resp.ok) {
          alert((resp && resp.error) || "Unable to load product");
          return;
        }
        const p = resp.product || {};
        $("#editProductName").val(p.name || "");
        $("#editProductPrice").val(p.price || "");
        $("#editProductCategory").val(p.category || "");
        $("#editProductDescription").val(p.description || "");
        if (p.image_url) {
          $("#editImagePreview").attr("src", p.image_url);
          $("#editPreviewContainer").removeClass("hidden");
        } else {
          $("#editImagePreview").attr("src", "");
          $("#editPreviewContainer").addClass("hidden");
        }
        modals.edit.open();
      })
      .fail(function () {
        alert("Failed to load product");
      });
  });
  $(document).on("click", ".close-edit-modal, #editModalBackdrop", function () {
    modals.edit.close();
  });
  // Preview selected image in Edit modal
  $(document).on("change", "#editProductImage", function (e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      $("#editImagePreview").attr("src", ev.target.result);
      $("#editPreviewContainer").removeClass("hidden");
    };
    reader.readAsDataURL(file);
  });
  $("#editProductForm").submit(function (e) {
    e.preventDefault();
    const productId = $(this).data("product-id");
    const fd = new FormData();
    fd.append("product_id", productId);
    fd.append("productName", $("#editProductName").val());
    fd.append("productPrice", $("#editProductPrice").val());
    fd.append("productCategory", $("#editProductCategory").val());
    fd.append("productDescription", $("#editProductDescription").val());
    const fileInput = document.getElementById("editProductImage");
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;
    if (file) fd.append("product_image", file);
    $.ajax({
      url: "/COFFEE_ST/public/api/admin/edit-product.php",
      method: "POST",
      data: fd,
      processData: false,
      contentType: false,
      dataType: "json",
    })
      .done(function (resp) {
        if (resp && resp.ok) {
          location.reload();
        } else {
          alert((resp && resp.error) || "Failed to update product");
        }
      })
      .fail(function (xhr) {
        const msg =
          (xhr.responseJSON && xhr.responseJSON.error) ||
          xhr.statusText ||
          "Failed to update product";
        alert(msg);
      })
      .always(function () {
        modals.edit.close();
      });
  });

  // Toggle availability
  $(document).on("change", ".toggle-available", function () {
    const productId = $(this).data("id");
    const available = $(this).is(":checked") ? 1 : 0;
    $.ajax({
      url: "/COFFEE_ST/public/api/admin/mark-unavailable.php",
      method: "POST",
      dataType: "json",
      data: { product_id: productId, available: available },
    }).fail(function () {
      alert("Failed to update availability");
    });
  });
  $(document).on("click", ".mark-unavailable", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $("#unavailableReason").val("");
    modals.unavailable.open();
  });
  $(document).on("click", ".close-unavailable-modal", function (e) {
    e.preventDefault();
    e.stopPropagation();
    modals.unavailable.close();
  });
  $("#unavailableForm").submit(function (e) {
    e.preventDefault();
    const reason = $("#unavailableReason").val();
    if (!reason) {
      alert("Please provide a reason");
      return;
    }
    modals.unavailable.close();
  });
  $(document).on("click", ".view-history", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const productId = $(this).data("id");
    const mockData = {
      name: "Latte",
      category: "Coffee",
      price: "$4.50",
      description: "Smooth espresso with steamed milk",
      image: "/path/to/image.jpg",
      createdBy: "Sarah Manager",
      createdOn: "January 15, 2024 at 04:30 PM",
      totalRevenue: "$5625.00",
      unitsSold: "1250",
      editHistory: [
        {
          user: "Admin User",
          action: "Updated price from $3.00 to $3.50",
          date: "February 20, 2024 at 06:15 PM",
        },
        {
          user: "Admin User",
          action: "Updated price from $3.50 to $4.50",
          date: "February 20, 2024 at 06:15 PM",
        },
      ],
    };
    $("#historyProductName").text(mockData.name);
    $("#historyProductImage").attr("src", mockData.image);
    $("#historyProductTitle").text(mockData.name);
    $("#historyProductCategory").text(mockData.category);
    $("#historyProductPrice").text(mockData.price);
    $("#historyProductDescription").text(mockData.description);
    $("#historyCreatedBy").text(mockData.createdBy);
    $("#historyCreatedOn").text(mockData.createdOn);
    $("#historyTotalRevenue").text(mockData.totalRevenue);
    $("#historyUnitsSold").text(mockData.unitsSold);
    const editListHtml = mockData.editHistory
      .map(
        (edit) =>
          `<div class="bg-gray-50 rounded-lg p-4"><div class="flex justify-between items-start"><div><span class="text-sm font-medium text-gray-900">${edit.user}</span><p class="text-sm text-gray-500">${edit.action}</p></div><span class="text-xs text-gray-400">${edit.date}</span></div></div>`,
      )
      .join("");
    $("#historyEditList").html(editListHtml);
    modals.history.open();
  });
  $(document).on("click", ".close-history-modal", function (e) {
    e.preventDefault();
    e.stopPropagation();
    modals.history.close();
  });
  $(document).on("click", ".delete-product", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const productId = $(this).data("id");
    const productName = $(this).closest("tr").find("td:nth-child(2)").text();
    if (
      confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      )
    ) {
      $(this)
        .closest("tr")
        .fadeOut(300, function () {
          $(this).remove();
        });
    }
  });

  // Close any open catalog modal on Escape
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      if (!$("#addProductModal").hasClass("hidden")) {
        modals.add.close();
      }
      if (!$("#editProductModal").hasClass("hidden")) {
        modals.edit.close();
      }
      if (!$("#unavailableModal").hasClass("hidden")) {
        modals.unavailable.close();
      }
      if (!$("#historyModal").hasClass("hidden")) {
        modals.history.close();
      }
    }
  });
});

// ===== Admin Orders =====
// Duplicate top-level helpers retained here (could be moved to utils later)
function getStatusStyles(status) {
  const styles = {
    pending: "bg-yellow-50 text-yellow-700",
    confirmed: "bg-blue-50 text-blue-700",
    processing: "bg-blue-50 text-blue-700",
    "out for delivery": "bg-purple-50 text-purple-700",
    cancelled: "bg-red-50 text-red-700",
    failed: "bg-red-50 text-red-700",
  };
  return styles[status.toLowerCase()] || styles["pending"];
}
function getStatusOptions(currentSection, currentStatus) {
  switch (currentSection.toLowerCase()) {
    case "all":
      return [
        { value: "Pending", label: "Pending" },
        { value: "Confirmed", label: "Confirmed" },
        { value: "Cancelled", label: "Cancelled" },
      ];
    case "processing":
      return [
        { value: "Pending", label: "Pending" },
        { value: "Out for Delivery", label: "Out for Delivery" },
        { value: "Cancelled", label: "Cancelled" },
      ];
    default:
      return [{ value: currentStatus, label: currentStatus }];
  }
}
function getDisplayStatus(status, newStatus) {
  const statusMap = { confirmed: "processing", cancelled: "failed" };
  return statusMap[newStatus.toLowerCase()] || status.toLowerCase();
}
function showSuccessNotification(message) {
  const notification = $(
    `<div class="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg transition-all duration-500 transform translate-x-full"><div class="flex items-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><p class="font-medium">${message}</p></div></div>`,
  ).appendTo("body");
  setTimeout(() => notification.removeClass("translate-x-full"), 100);
  setTimeout(() => {
    notification.addClass("translate-x-full");
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

$(document).ready(function () {
  const statusColors = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", count: 0 },
    processing: { bg: "bg-blue-100", text: "text-blue-800", count: 0 },
    "out-for-delivery": {
      bg: "bg-purple-100",
      text: "text-purple-800",
      count: 0,
    },
    completed: { bg: "bg-green-100", text: "text-green-800", count: 0 },
    failed: { bg: "bg-red-100", text: "text-red-800", count: 0 },
  };
  function updateOrderCounts() {
    Object.keys(statusColors).forEach((s) => {
      statusColors[s].count = 0;
    });
    $(".order-item").each(function () {
      const status = $(this).data("status").toLowerCase();
      if (statusColors[status]) statusColors[status].count++;
    });
    Object.keys(statusColors).forEach((s) => {
      $(`#${s}-count`).text(statusColors[s].count);
    });
    const totalOrders = $(".order-item").length;
    $("#total-orders").text(totalOrders);
  }
  const orders = {
    "ORD-1234": {
      status: "Pending",
      customer: {
        name: "Bob Johnson",
        email: "bob@email.com",
        phone: "+1-234-567-8902",
        address: "456 Oak Ave, Brooklyn, NY 11201",
      },
      items: [
        {
          name: "Cafe latte",
          quantity: 1,
          options: ["Iced", "Espresso shot", "Oat"],
          price: 10.5,
        },
        {
          name: "Salted Caramel latte",
          quantity: 2,
          options: ["Hot", "Caramel Drizzle", "Oat"],
          price: 7.5,
        },
      ],
      total: 18.0,
      activity: [
        { action: "Order created", timestamp: "2024-01-15 08:45 AM" },
        {
          action: "Last updated by Admin User",
          timestamp: "10/15/2025, 7:53:53 PM",
        },
      ],
    },
  };
  function updateStatusBadge(status) {
    const badge = $("#statusBadge");
    badge
      .removeClass()
      .addClass("px-4 py-1.5 rounded-full text-sm font-medium");
    switch (status.toLowerCase()) {
      case "pending":
        badge.addClass("bg-yellow-100 text-yellow-800");
        break;
      case "confirmed":
      case "processing":
        badge.addClass("bg-blue-100 text-blue-800");
        break;
      case "out-for-delivery":
        badge.addClass("bg-purple-100 text-purple-800");
        break;
      case "completed":
        badge.addClass("bg-green-100 text-green-800");
        break;
      case "failed":
      case "cancelled":
        badge.addClass("bg-red-100 text-red-800");
        break;
      default:
        badge.addClass("bg-gray-100 text-gray-800");
    }
    badge.text(status);
  }
  function showStatusConfirmModal(orderId, oldStatus, newStatus) {
    const modal = $("#statusConfirmModal");
    $("#oldStatus").text(oldStatus);
    $("#newStatus").text(newStatus);
    modal.data("orderId", orderId);
    modal.data("oldStatus", oldStatus);
    modal.data("newStatus", newStatus);
    const isCancelling = newStatus.toLowerCase() === "cancelled";
    const reasonContainer = $("#cancellationReasonContainer");
    if (isCancelling) {
      reasonContainer.removeClass("hidden").addClass("animate-fade-in");
      $("#cancellationReason").val("").focus();
      $("#reasonError").addClass("hidden");
    } else {
      reasonContainer.addClass("hidden");
      $("#cancellationReason").val("");
    }
    modal.removeClass("hidden");
    setTimeout(() => {
      modal
        .find(".transform")
        .removeClass("scale-95 opacity-0")
        .addClass("scale-100 opacity-100");
    }, 10);
  }
  function closeStatusConfirmModal() {
    const modal = $("#statusConfirmModal");
    modal
      .find(".transform")
      .removeClass("scale-100 opacity-100")
      .addClass("scale-95 opacity-0");
    setTimeout(() => {
      modal.addClass("hidden");
    }, 300);
  }
  function processStatusChange(orderId, newStatus) {
    const orderItem = $(`.order-item[data-order-id="${orderId}"]`);
    const oldStatus = orderItem.data("status");
    const currentSection =
      $(".status-card")
        .filter(function () {
          return (
            $(this).find(".status-indicator").css("transform") ===
            "matrix(1, 0, 0, 1, 0, 0)"
          );
        })
        .data("status") || "all";
    const displayStatus = getDisplayStatus(currentSection, newStatus);
    let message = "";
    switch (newStatus.toLowerCase()) {
      case "confirmed":
        message = "Order has been confirmed and moved to Processing!";
        break;
      case "out for delivery":
        message = "Order is now out for delivery!";
        break;
      case "cancelled":
        message = "Order has been cancelled and moved to Failed Orders.";
        break;
      default:
        message = `Order status changed to ${newStatus}`;
    }
    showSuccessNotification(message);
    orderItem.data("status", newStatus.toLowerCase());
    orderItem.data("display-status", displayStatus);
    orderItem
      .find(".status-badge")
      .removeClass()
      .addClass(
        "status-badge px-3 py-1 text-sm font-medium rounded-full " +
        getStatusStyles(newStatus),
      )
      .text(newStatus);
    if ($("#orderDetailsModal").is(":visible")) {
      updateStatusBadge(newStatus);
      $("#orderStatus").val(newStatus);
    }
    updateOrderCounts();
    const currentStatus =
      $(".status-card")
        .filter(function () {
          return (
            $(this).find(".status-indicator").css("transform") ===
            "matrix(1, 0, 0, 1, 0, 0)"
          );
        })
        .data("status") || "all";
    filterOrders(currentStatus);
    updateStatusCardStyles(currentStatus);
    const timestamp = new Date().toLocaleString();
    let activityText = `Status changed from ${oldStatus} to ${newStatus}`;
    if (newStatus.toLowerCase() === "cancelled") {
      const reason = $("#statusConfirmModal").data("cancellationReason");
      activityText += `<br><span class="text-red-600 text-xs mt-1 block">Reason: ${reason}</span>`;
      const noteContainer = orderItem.find(".note-container");
      if (noteContainer.length === 0) {
        orderItem
          .find(".mb-4")
          .after(
            `<div class="note-container bg-red-50/50 p-4 rounded-xl mt-4 mb-4 border border-red-100"><p class="text-red-700"><span class="font-medium">Cancellation Reason:</span> ${reason}</p></div>`,
          );
      }
    }
    $("#activityLog").prepend(
      `<div class="flex justify-between items-center py-1 text-gray-600"><div class="flex-1">${activityText}</div><span class="text-gray-400 ml-4">${timestamp}</span></div>`,
    );
  }
  function closeOrderDetails() {
    const modal = $("#orderDetailsModal");
    modal
      .find(".transform")
      .removeClass("scale-100 opacity-100")
      .addClass("scale-95 opacity-0");
    setTimeout(() => {
      modal.addClass("hidden");
    }, 300);
  }
  function openOrderDetails(orderId) {
    const order = orders[orderId];
    if (!order) return;
    $("#orderNumber").text(orderId);
    $("#customerName").text(order.customer.name);
    $("#customerEmail").text(order.customer.email);
    $("#customerPhone").text(order.customer.phone);
    $("#customerAddress").text(order.customer.address);
    $("#orderStatus").val(order.status);
    updateStatusBadge(order.status);
    const itemsHTML = order.items
      .map(
        (item) =>
          `<div class="py-3"><div class="flex justify-between items-start"><div><div class="flex items-center gap-2"><p class="font-medium text-gray-800">${item.quantity}x ${item.name}</p><span class="text-sm text-gray-500">($${item.price.toFixed(2)} each)</span></div><p class="text-sm text-gray-500 mt-1">${item.options.join(" • ")}</p></div><span class="font-medium">$${(item.quantity * item.price).toFixed(2)}</span></div></div>`,
      )
      .join("");
    $("#orderItems").html(itemsHTML);
    $("#orderTotal").text(`$${order.total.toFixed(2)}`);
    const activityHTML = order.activity
      .map(
        (a) =>
          `<div class="flex justify-between items-center py-1 text-gray-600"><span>${a.action}</span><span class="text-gray-400">${a.timestamp}</span></div>`,
      )
      .join("");
    $("#activityLog").html(activityHTML);
    const modal = $("#orderDetailsModal");
    modal.removeClass("hidden");
    setTimeout(() => {
      modal
        .find(".transform")
        .removeClass("scale-95 opacity-0")
        .addClass("scale-100 opacity-100");
    }, 10);
  }
  function filterOrders(status) {
    if (status === "all") {
      $(".order-item").fadeIn(300);
    } else {
      $(".order-item").each(function () {
        const orderItem = $(this);
        const orderStatus = orderItem.data("status").toLowerCase();
        const displayStatus = orderItem.data("display-status") || orderStatus;
        if (displayStatus === status) {
          orderItem.fadeIn(300);
        } else {
          orderItem.fadeOut(300);
        }
      });
    }
  }
  function updateStatusOptions(currentStatus) {
    const options = [currentStatus];
    switch (currentStatus.toLowerCase()) {
      case "pending":
        options.push("Confirmed", "Cancelled");
        break;
      case "confirmed":
      case "processing":
        options.push("Cancelled");
        break;
    }
    return options;
  }
  function updateStatusCardStyles(activeStatus) {
    $(".status-card").each(function () {
      const card = $(this);
      const status = card.data("status");
      let activeClass = "";
      let textClass = "";
      card.removeClass(
        "bg-[#30442B] bg-blue-50 bg-purple-50 bg-green-50 bg-red-50 text-white",
      );
      card
        .find("div:not(.status-indicator)")
        .removeClass(
          "text-white text-blue-600 text-purple-600 text-green-600 text-red-600",
        );
      card.find(".status-indicator").css("transform", "scaleX(0)");
      if (status === activeStatus) {
        switch (status) {
          case "all":
            activeClass = "bg-[#30442B]";
            textClass = "text-white";
            break;
          case "processing":
            activeClass = "bg-blue-50";
            textClass = "text-blue-600";
            break;
          case "out-for-delivery":
            activeClass = "bg-purple-50";
            textClass = "text-purple-600";
            break;
          case "completed":
            activeClass = "bg-green-50";
            textClass = "text-green-600";
            break;
          case "failed":
            activeClass = "bg-red-50";
            textClass = "text-red-600";
            break;
        }
        card.addClass(activeClass);
        card.find("div:not(.status-indicator)").addClass(textClass);
        card.find(".status-indicator").css("transform", "scaleX(1)");
      }
    });
  }

  $(".status-card").on("click", function () {
    const status = $(this).data("status");
    updateStatusCardStyles(status);
    const statusText =
      status === "all"
        ? "All Orders"
        : status
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") + " Orders";
    $("#orders-header-text").text(statusText);
    $(".order-item select").each(function () {
      updateStatusDropdown($(this), status);
    });
    if ($("#orderDetailsModal").is(":visible")) {
      updateStatusDropdown($("#orderStatus"), status);
    }
    filterOrders(status);
  });
  $(document).on("click", ".order-item", function (e) {
    if (!$(e.target).is("select")) {
      const orderId = $(this).data("order-id");
      openOrderDetails(orderId);
    }
  });
  $("#orderDetailsModal").on("click", function (e) {
    if (e.target === this) {
      closeOrderDetails();
    }
  });
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      closeOrderDetails();
    }
  });
  $(document).on("change", "#orderStatus", function () {
    const newStatus = $(this).val();
    updateStatusBadge(newStatus);
  });
  function updateStatusDropdown(select, section) {
    const currentStatus = select.val();
    const options = getStatusOptions(section, currentStatus);
    select.empty();
    options.forEach((option) => {
      select.append(
        `<option value="${option.value}" ${currentStatus === option.value ? "selected" : ""}>${option.label}</option>`,
      );
    });
  }
  $(document).on("change", ".order-item select, #orderStatus", function (e) {
    e.stopPropagation();
    const select = $(this);
    const orderId =
      select.closest(".order-item").data("order-id") ||
      $("#orderNumber").text();
    const newStatus = select.val();
    const oldStatus = $(`.order-item[data-order-id="${orderId}"]`).data(
      "status",
    );
    const currentSection =
      $(".status-card")
        .filter(function () {
          return (
            $(this).find(".status-indicator").css("transform") ===
            "matrix(1, 0, 0, 1, 0, 0)"
          );
        })
        .data("status") || "all";
    showStatusConfirmModal(orderId, oldStatus, newStatus);
    select.val(oldStatus);
  });
  $("#confirmStatusChange").on("click", function () {
    const modal = $("#statusConfirmModal");
    const orderId = modal.data("orderId");
    const newStatus = modal.data("newStatus");
    if (newStatus.toLowerCase() === "cancelled") {
      const reason = $("#cancellationReason").val().trim();
      if (!reason) {
        $("#reasonError").removeClass("hidden");
        $("#cancellationReason").focus();
        return;
      }
      modal.data("cancellationReason", reason);
    }
    processStatusChange(orderId, newStatus);
    $(`.order-item[data-order-id="${orderId}"] select, #orderStatus`).val(
      newStatus,
    );
    closeStatusConfirmModal();
  });
  $("#cancelStatusChange").on("click", closeStatusConfirmModal);
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      closeStatusConfirmModal();
    }
  });
  function updateFilteredCount() {
    const visibleOrders = $(".order-item:visible").length;
    $("#filtered-count").text(visibleOrders);
  }
  updateOrderCounts();
  updateFilteredCount();
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === "style") {
        updateFilteredCount();
      }
    });
  });
  $(".order-item").each(function () {
    observer.observe(this, { attributes: true });
  });
});
