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

  function showOk(msg) {
    if (window.Toast && typeof window.Toast.success === "function") {
      window.Toast.success(msg);
    } else {
      alert(msg);
    }
  }
  function showErr(msg) {
    if (window.Toast && typeof window.Toast.error === "function") {
      window.Toast.error(msg);
    } else {
      alert(msg);
    }
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

  function validateField(id) {
    var v = $.trim($("#" + id).val());
    switch (id) {
      case "contact-name":
        if (!v) return "Name is required.";
        if (window.Validators && !window.Validators.name(v))
          return "Please enter a valid name.";
        return null;
      case "contact-email":
        if (!v) return "Email is required.";
        if (window.Validators && !window.Validators.email(v))
          return "Please enter a valid email address.";
        return null;
      case "contact-subject":
        if (!v) return "Subject is required.";
        return null;
      case "contact-message":
        if (!v) return "Message is required.";
        return null;
    }
    return null;
  }

  var fieldSelector =
    "#contact-name, #contact-email, #contact-subject, #contact-message";
  var formSubmitted = false;
  var fieldInteraction = {};

  $contactForm.on("input", fieldSelector, function () {
    var id = $(this).attr("id");
    fieldInteraction[id] = true;
    var error = validateField(id);
    setFieldError($(this), error);
  });
  $contactForm.on("blur", fieldSelector, function () {
    var id = $(this).attr("id");
    if (!formSubmitted && !fieldInteraction[id]) return;
    var error = validateField(id);
    setFieldError($(this), error);
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
    $(fieldSelector).each(function () {
      var id = (this && this.id) ? this.id : $(this).attr("id");
      id = $.trim(id || "");
      var $f = $("#" + id);
      var err = validateField(id);
      setFieldError($f, err);
      if (err) allValid = false;
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
        showOk("Message submitted successfully!");
        $contactForm.trigger("reset");
        $contactForm.find(".contact-error").text("").addClass("hidden");
        $contactForm
          .find("input, textarea")
          .removeClass(
            "border-red-400 focus:border-red-400 focus:ring-red-400",
          );
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
            var $f = $("#contact-" + field);
            setFieldError($f, msg);
          });
        } else {
          showErr("Failed to submit message. Please try again later.");
        }
      });
  });
});
