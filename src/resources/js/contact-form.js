$(function () {
  var $contactForm = $("#contact-form");
  if (!$contactForm.length) return;

  var $subjectField = $("#contact-subject");
  var subjectLocked = !!$subjectField.data("subjectLocked");
  var lockedSubjectValue = $.trim(
    $subjectField.data("originalSubject") || $subjectField.val() || "",
  );

  if (subjectLocked && lockedSubjectValue) {
    $subjectField.prop("readonly", true).val(lockedSubjectValue);
    setTimeout(function () {
      $("#contact-message").trigger("focus");
    }, 50);
  }

  function ensureToastContainer() {
    var $container = $("#toast-container");
    if (!$container.length) {
      $container = $(
        '<div id="toast-container" class="fixed top-4 right-4 z-50 flex flex-col gap-3"></div>',
      );
      $("body").append($container);
    }
    return $container;
  }

  function showToast(message) {
    var $container = ensureToastContainer();
    var $toast = $(
      '<div class="pointer-events-auto select-none rounded-2xl bg-[#30442B] px-5 py-3 text-sm font-medium text-white shadow-xl shadow-[#30442B]/20 ring-1 ring-white/15 opacity-0 -translate-y-2 transition duration-300"></div>',
    ).html(
      '<div class="flex items-center gap-3"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white"><svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span><span class="leading-tight">' +
      message +
      "</span></div>",
    );
    $container.append($toast);
    setTimeout(function () {
      $toast
        .removeClass("opacity-0 -translate-y-2")
        .addClass("opacity-100 translate-y-0");
    }, 16);
    setTimeout(function () {
      $toast.addClass("opacity-0 -translate-y-2");
      setTimeout(function () {
        $toast.remove();
      }, 300);
    }, 3000);
  }

  function setFieldError($field, message) {
    var id = $field.attr("id");
    var $error = $('.contact-error[data-error-for="' + id + '"]');
    if (!$error.length) return;

    if (message) {
      $error.text(message).removeClass("hidden");
      $field.addClass("border-red-400 focus:border-red-400 focus:ring-red-400");
    } else {
      $error.text("").addClass("hidden");
      $field.removeClass(
        "border-red-400 focus:border-red-400 focus:ring-red-400",
      );
    }
  }

  var nameRegex = /^[A-Za-z\s.\-']+$/;
  var emailRegex = /^[A-Za-z0-9._\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;

  var validators = {
    "contact-name": function () {
      var value = $.trim($("#contact-name").val());
      if (!value) return "Name is required.";
      if (!nameRegex.test(value)) return "Please enter a valid name.";
      return null;
    },
    "contact-email": function () {
      var value = $.trim($("#contact-email").val());
      if (!value) return "Email is required.";
      if (!emailRegex.test(value)) return "Please enter a valid email address.";
      return null;
    },
    "contact-subject": function () {
      var value = $.trim($("#contact-subject").val());
      if (!value) return "Subject is required.";
      if (value.length < 3) return "Subject should be at least 3 characters.";
      return null;
    },
    "contact-message": function () {
      var value = $.trim($("#contact-message").val());
      if (!value) return "Message is required.";
      if (value.length < 10) return "Message should be at least 10 characters.";
      return null;
    },
  };

  var fieldSelector =
    "#contact-name, #contact-email, #contact-subject, #contact-message";

  var formSubmitted = false;
  var fieldInteraction = {};

  $contactForm.on("input", fieldSelector, function () {
    var $field = $(this);
    var id = $field.attr("id");
    fieldInteraction[id] = true;
    var validator = validators[id];
    if (validator) {
      var error = validator();
      setFieldError($field, error);
    }
  });

  $contactForm.on("blur", fieldSelector, function () {
    var $field = $(this);
    var id = $field.attr("id");
    if (!formSubmitted && !fieldInteraction[id]) return;
    var validator = validators[id];
    if (validator) {
      var error = validator();
      setFieldError($field, error);
    }
  });

  $contactForm.on("keydown", "input, textarea", function (e) {
    var tagName = $(this).prop("tagName");
    if (e.key === "Enter" && tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  });

  $contactForm.on("submit", function (e) {
    e.preventDefault();
    formSubmitted = true;

    var allValid = true;
    $.each(validators, function (id, validator) {
      var $field = $("#" + id);
      var error = validator();
      setFieldError($field, error);
      if (error) {
        allValid = false;
      }
    });

    if (!allValid) return;

    var formData = {
      name: $("#contact-name").val(),
      email: $("#contact-email").val(),
      subject: $("#contact-subject").val(),
      message: $("#contact-message").val(),
    };
    $.post("/COFFEE_ST/public/api/inquiry.php", formData)
      .done(function (resp) {
        showToast("Message submitted successfully!");
        $contactForm.trigger("reset");
        $contactForm.find(".contact-error").text("").addClass("hidden");
        $contactForm
          .find("input, textarea")
          .removeClass("border-red-400 focus:border-red-400 focus:ring-red-400");
        formSubmitted = false;
        $.each(fieldInteraction, function (key) {
          fieldInteraction[key] = false;
        });
        if (subjectLocked && lockedSubjectValue) {
          $subjectField.val(lockedSubjectValue).prop("readonly", true);
          setTimeout(function () {
            $("#contact-message").trigger("focus");
          }, 50);
        }
      })
      .fail(function (xhr) {
        var resp = xhr.responseJSON || {};
        if (resp.errors) {
          $.each(resp.errors, function (field, msg) {
            var $field = $("#contact-" + field);
            setFieldError($field, msg);
          });
        } else {
          showToast("Failed to submit message. Please try again later.");
        }
      });
  });
});
