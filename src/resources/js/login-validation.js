$(document).ready(function () {
  function initializeModalLogic() {
    let formSubmitted = false;

    $(document).on("click", ".password-toggle", function (e) {
      e.preventDefault();
      var $btn = $(this);
      var targetSelector = $btn.attr("data-target");
      var $input = $(targetSelector);
      if (!$input.length) return;
      var isPassword = $input.attr("type") === "password";
      $input.attr("type", isPassword ? "text" : "password");
      var $svg = $btn.find("svg");
      if (isPassword) {
        $svg.html(
          '<path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18M10.73 6.73A9.77 9.77 0 0 1 12 6c4.477 0 8.268 2.943 9.542 7a9.77 9.77 0 0 1-1.566 2.566M17.94 17.94A9.77 9.77 0 0 1 12 19c-4.477 0-8.268-2.943-9.542-7a9.77 9.77 0 0 1 1.566-2.566" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 0 1-6 0" />',
        );
      } else {
        $svg.html(
          '<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />',
        );
      }
    });

    const nameRegex = /^[A-Za-z\s.\-']+$/;
    const emailRegex = /^[A-Za-z0-9._\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\+?\d+$/;

    function setFieldError($field, message) {
      const id = $field.attr("id");
      const $err = $('[data-error-for="' + id + '"]');
      if (message) {
        $err.text(message).removeClass("hidden");
        $field.addClass(
          "border-red-400 focus:border-red-400 focus:ring-red-400",
        );
      } else {
        $err.text("").addClass("hidden");
        $field.removeClass(
          "border-red-400 focus:border-red-400 focus:ring-red-400",
        );
      }
    }

    function validateLoginEmail() {
      const $f = $("#login-email");
      const v = $.trim($f.val());
      if (!v) return (setFieldError($f, "Email is required."), false);
      if (!emailRegex.test(v))
        return (setFieldError($f, "Enter a valid email."), false);
      setFieldError($f, null);
      return true;
    }
    function validateLoginPassword() {
      const $f = $("#login-password");
      const v = $.trim($f.val());
      if (!v) return (setFieldError($f, "Password is required."), false);
      if (v.length < 6)
        return (setFieldError($f, "Minimum 6 characters."), false);
      setFieldError($f, null);
      return true;
    }

    function validateFirst() {
      const $f = $("#reg-first");
      const v = $.trim($f.val());
      if (!v) return (setFieldError($f, "First name required."), false);
      if (!nameRegex.test(v))
        return (setFieldError($f, "Invalid characters."), false);
      setFieldError($f, null);
      return true;
    }
    function validateLast() {
      const $f = $("#reg-last");
      const v = $.trim($f.val());
      if (!v) return (setFieldError($f, "Last name required."), false);
      if (!nameRegex.test(v))
        return (setFieldError($f, "Invalid characters."), false);
      setFieldError($f, null);
      return true;
    }
    function validateAddress() {
      const $f = $("#reg-address");
      const v = $.trim($f.val());
      if (!v) return (setFieldError($f, "Address required."), false);
      setFieldError($f, null);
      return true;
    }
    function validateEmail() {
      const $f = $("#reg-email");
      const v = $.trim($f.val());
      if (!v) return (setFieldError($f, "Email required."), false);
      if (!emailRegex.test(v))
        return (setFieldError($f, "Enter a valid email."), false);
      setFieldError($f, null);
      return true;
    }
    function validatePhone() {
      const $f = $("#reg-phone");
      const v = $.trim($f.val());
      if (!v) return (setFieldError($f, "Contact number required."), false);
      if (!phoneRegex.test(v))
        return (setFieldError($f, "Digits only (optional +)."), false);
      setFieldError($f, null);
      return true;
    }
    function validatePass() {
      const $f = $("#reg-pass");
      const v = $.trim($f.val());
      if (!v) return (setFieldError($f, "Password required."), false);
      if (v.length < 6)
        return (setFieldError($f, "Minimum 6 characters."), false);
      setFieldError($f, null);
      validatePassConfirm();
      return true;
    }
    function validatePassConfirm() {
      const $f = $("#reg-pass-confirm");
      const v = $.trim($f.val());
      const p = $.trim($("#reg-pass").val());
      if (!v) return (setFieldError($f, "Please confirm password."), false);
      if (v !== p) return (setFieldError($f, "Passwords do not match."), false);
      setFieldError($f, null);
      return true;
    }

    function animateIn($m) {
      $m.show();
      requestAnimationFrame(() => {
        $m.removeClass("opacity-0 scale-95").addClass("opacity-100 scale-100");
      });
    }
    function animateOut($m) {
      $m.addClass("opacity-0 scale-95").removeClass("opacity-100 scale-100");
      setTimeout(() => {
        $m.hide();
      }, 180);
    }

    function openModal(modalId) {
      const $overlay = $("#modal-overlay");
      $overlay.removeClass("hidden");
      $overlay.css("display", "flex");
      $("body").addClass("overflow-hidden");
      $(".modal-panel").each(function () {
        $(this).hide();
      });
      const $m = $(modalId);
      $m.addClass("opacity-0 scale-95");
      animateIn($m);
      $m.find("input").first().focus();
      updateScrollShadows($m);
      $m.off("scroll.__shadow").on("scroll.__shadow", function () {
        updateScrollShadows($(this));
      });
    }

    function closeModals() {
      const $overlay = $("#modal-overlay");
      $(".modal-panel:visible").each(function () {
        $(this).off("scroll.__shadow");
        animateOut($(this));
      });
      setTimeout(() => {
        $overlay.addClass("hidden").hide();
        $("body").removeClass("overflow-hidden");
        formSubmitted = false;
        $overlay.find("input").val("");
        $overlay.find("[data-error-for]").text("").addClass("hidden");
        $overlay
          .find("input")
          .removeClass(
            "border-red-400 focus:border-red-400 focus:ring-red-400",
          );
      }, 200);
    }

    function updateScrollShadows($el) {
      const top = $el.scrollTop();
      const max = $el.prop("scrollHeight") - $el.innerHeight() - 1;
      const atTop = top <= 0;
      const atBottom = top >= max;
      const $top = $el.find(".shadow-top");
      const $bottom = $el.find(".shadow-bottom");
      $top.toggleClass("opacity-0", atTop).toggleClass("opacity-100", !atTop);
      $bottom
        .toggleClass("opacity-0", atBottom)
        .toggleClass("opacity-100", !atBottom);
    }

    $(document).on("click", "#open-login, [data-open-login='login']", function (e) {
      e.preventDefault();
      $("#signup-modal").hide();
      openModal("#login-modal");
    });

    $(document).on("click", "#open-signup", function (e) {
      e.preventDefault();
      $("#login-modal").hide();
      openModal("#signup-modal");
    });

    $(document).on("click", "#close-login, #close-signup", function (e) {
      e.preventDefault();
      closeModals();
    });

    $(document).on("click", "#switch-to-signup", function (e) {
      e.preventDefault();
      $("#login-modal").hide();
      openModal("#signup-modal");
    });
    $(document).on("click", "#switch-to-login", function (e) {
      e.preventDefault();
      $("#signup-modal").hide();
      openModal("#login-modal");
    });

    $(document).on("keydown", function (e) {
      if (e.key === "Escape") closeModals();
    });

    $(document).on("input", "#login-email", validateLoginEmail);
    $(document).on("input", "#login-password", validateLoginPassword);

    $(document).on("input", "#reg-first", validateFirst);
    $(document).on("input", "#reg-last", validateLast);
    $(document).on("input", "#reg-address", validateAddress);
    $(document).on("input", "#reg-email", validateEmail);
    $(document).on("input", "#reg-phone", validatePhone);
    $(document).on("input", "#reg-pass", validatePass);
    $(document).on("input", "#reg-pass-confirm", validatePassConfirm);

    $(document).on("blur", "input", function () {
      if (formSubmitted) {
        const id = $(this).attr("id");
        switch (id) {
          case "login-email":
            validateLoginEmail();
            break;
          case "login-password":
            validateLoginPassword();
            break;
          case "reg-first":
            validateFirst();
            break;
          case "reg-last":
            validateLast();
            break;
          case "reg-address":
            validateAddress();
            break;
          case "reg-email":
            validateEmail();
            break;
          case "reg-phone":
            validatePhone();
            break;
          case "reg-pass":
            validatePass();
            break;
          case "reg-pass-confirm":
            validatePassConfirm();
            break;
        }
      }
    });

    $(document).on("submit", "#login-form", function (e) {
      e.preventDefault();
      formSubmitted = true;
      const ok = validateLoginEmail() & validateLoginPassword();
      if (!ok) return;
      closeModals();
      if (typeof window.showToast === "function") window.showToast("Logged in successfully!");
      $("#login-email, #login-password").val("");
    });

    $(document).on("submit", "#signup-form", function (e) {
      e.preventDefault();
      formSubmitted = true;
      const ok =
        validateFirst() &
        validateLast() &
        validateAddress() &
        validateEmail() &
        validatePhone() &
        validatePass() &
        validatePassConfirm();
      if (!ok) return;
      closeModals();
      if (typeof window.showToast === "function") window.showToast("Account created successfully!");
      $(
        "#reg-first, #reg-last, #reg-address, #reg-email, #reg-phone, #reg-pass, #reg-pass-confirm",
      ).val("");
    });
  }
  initializeModalLogic();
});