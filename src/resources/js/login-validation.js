$(document).ready(function () {
  // --- login/signup ---
  function initializeModalLogic() {
    let formSubmitted = false;

    function ensureToastContainer() {
      let $c = $("#toast-container");
      if (!$c.length) {
        $c = $(
          '<div id="toast-container" class="fixed top-4 right-4 z-50 flex flex-col gap-3"></div>',
        );
        $("body").append($c);
      }
      return $c;
    }
    function showToast(message) {
      if (typeof window.showToast === "function")
        return window.showToast(message);
      const $c = ensureToastContainer();
      const $toast = $(
        '<div class="pointer-events-auto select-none rounded-2xl bg-[#30442B] px-5 py-3 text-sm font-medium text-white shadow-xl shadow-[#30442B]/20 ring-1 ring-white/15 opacity-0 -translate-y-2 transition duration-300"></div>',
      ).html(
        '<div class="flex items-center gap-3"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white"><svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span><span class="leading-tight">' +
        message +
        "</span></div>",
      );
      $c.append($toast);
      requestAnimationFrame(() => {
        $toast
          .removeClass("opacity-0 -translate-y-2")
          .addClass("opacity-100 translate-y-0");
      });
      setTimeout(() => {
        $toast.addClass("opacity-0 -translate-y-2");
        setTimeout(() => $toast.remove(), 300);
      }, 2800);
    }

    function showErrorToast(message) {
      const $c = ensureToastContainer();
      const $toast = $(
        '<div class="pointer-events-auto select-none rounded-2xl bg-red-500 px-5 py-3 text-sm font-medium text-white shadow-xl shadow-red-800/20 ring-1 ring-white/15 opacity-0 -translate-y-2 transition duration-300"></div>',
      ).text(message);
      $c.append($toast);
      requestAnimationFrame(() => {
        $toast
          .removeClass("opacity-0 -translate-y-2")
          .addClass("opacity-100 translate-y-0");
      });
      setTimeout(() => {
        $toast.addClass("opacity-0 -translate-y-2");
        setTimeout(() => $toast.remove(), 300);
      }, 3200);
    }

    const routes = {
      login: "/COFFEE_ST/public/auth/login.php",
      register: "/COFFEE_ST/public/auth/register.php",
      logout: "/COFFEE_ST/public/auth/logout.php",
    };

    // --- password visibility toggle ---
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

    // --- validation regex ---
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

    // --- field validators ---
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

    // --- animations ---
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
      updateScrollShadows($m[0]);
      $m.off("scroll.__shadow").on("scroll.__shadow", function () {
        updateScrollShadows(this);
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

    // --- scroll shadow  ---
    function updateScrollShadows(el) {
      const $el = $(el);
      const top = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight - 1;
      const atTop = top <= 0;
      const atBottom = top >= max;
      const $top = $el.find(".shadow-top");
      const $bottom = $el.find(".shadow-bottom");
      $top.toggleClass("opacity-0", atTop).toggleClass("opacity-100", !atTop);
      $bottom
        .toggleClass("opacity-0", atBottom)
        .toggleClass("opacity-100", !atBottom);
    }

    function applyBackendErrors(errors, map) {
      $.each(map, function (field, selector) {
        if (errors && errors[field]) {
          setFieldError($(selector), errors[field]);
        }
      });
    }

    function toggleSubmitting($form, isSubmitting) {
      const $btn = $form.find('button[type="submit"]');
      $btn.prop("disabled", isSubmitting);
      $btn.toggleClass("opacity-70", isSubmitting);
    }

    // open login
    $(document).on(
      "click",
      "#open-login, [data-open-login='login']",
      function (e) {
        e.preventDefault();
        $("#signup-modal").hide();
        openModal("#login-modal");
      },
    );

    // open signup
    $(document).on("click", "#open-signup", function (e) {
      e.preventDefault();
      $("#login-modal").hide();
      openModal("#signup-modal");
    });

    // close buttons
    $(document).on("click", "#close-login, #close-signup", function (e) {
      e.preventDefault();
      closeModals();
    });

    // switch login/signup
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

    // close on overlay click intentionally disabled to avoid accidental dismissals

    // close on escape
    $(document).on("keydown", function (e) {
      if (e.key === "Escape") closeModals();
    });

    // --- real-time validation while typing ---
    $(document).on("input", "#login-email", validateLoginEmail);
    $(document).on("input", "#login-password", validateLoginPassword);

    $(document).on("input", "#reg-first", validateFirst);
    $(document).on("input", "#reg-last", validateLast);
    $(document).on("input", "#reg-address", validateAddress);
    $(document).on("input", "#reg-email", validateEmail);
    $(document).on("input", "#reg-phone", validatePhone);
    $(document).on("input", "#reg-pass", validatePass);
    $(document).on("input", "#reg-pass-confirm", validatePassConfirm);

    // --- validate on blur after first submit ---
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

    // form submissions
    $(document).on("submit", "#login-form", function (e) {
      e.preventDefault();
      formSubmitted = true;
      const ok = validateLoginEmail() & validateLoginPassword();
      if (!ok) return;

      const $form = $(this);
      toggleSubmitting($form, true);

      $.ajax({
        url: routes.login,
        method: "POST",
        dataType: "json",
        data: {
          email: $.trim($("#login-email").val()),
          password: $.trim($("#login-password").val()),
        },
      })
        .done(function (res) {
          $("#login-email, #login-password").each(function () {
            setFieldError($(this), null);
          });

          if (res.success) {
            // Mark that login just succeeded so other scripts can replay queued actions after reload
            try {
              sessionStorage.setItem("loginJustSucceeded", "1");
            } catch (e) { }
            $(document).trigger("user:login-success");
            closeModals();
            showToast(res.message || "Login successful!");
            setTimeout(function () {
              window.location.reload();
            }, 600);
          } else {
            if (res.errors) {
              applyBackendErrors(res.errors, {
                email: "#login-email",
                password: "#login-password",
              });
            }
            if (res.error) {
              showErrorToast(res.error);
            }
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.error("Login request failed", {
            status: jqXHR.status,
            textStatus,
            errorThrown,
            responseText: jqXHR.responseText,
          });

          let res = jqXHR.responseJSON;
          if (!res && jqXHR.responseText) {
            try {
              res = JSON.parse(jqXHR.responseText);
            } catch (err) {
              res = null;
            }
          }

          if (res && res.errors) {
            applyBackendErrors(res.errors, {
              email: "#login-email",
              password: "#login-password",
            });
          }

          const msg =
            (res && res.error) ||
            "Unable to log in right now. Please try again.";
          showErrorToast(msg);
        })
        .always(function () {
          toggleSubmitting($form, false);
        });
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

      const $form = $(this);
      toggleSubmitting($form, true);

      $.ajax({
        url: routes.register,
        method: "POST",
        dataType: "json",
        data: {
          first_name: $.trim($("#reg-first").val()),
          last_name: $.trim($("#reg-last").val()),
          address: $.trim($("#reg-address").val()),
          email: $.trim($("#reg-email").val()),
          phone: $.trim($("#reg-phone").val()),
          password: $.trim($("#reg-pass").val()),
          password_confirmation: $.trim($("#reg-pass-confirm").val()),
        },
      })
        .done(function (res) {
          const map = {
            first_name: "#reg-first",
            last_name: "#reg-last",
            address: "#reg-address",
            email: "#reg-email",
            phone: "#reg-phone",
            password: "#reg-pass",
            password_confirmation: "#reg-pass-confirm",
          };

          $.each(map, function (_, selector) {
            setFieldError($(selector), null);
          });

          if (res.success) {
            closeModals();
            showToast(res.message || "Account created successfully!");
            setTimeout(function () {
              window.location.reload();
            }, 700);
          } else if (res.errors) {
            applyBackendErrors(res.errors, map);
          }

          if (res.error) {
            showErrorToast(res.error);
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.error("Registration request failed", {
            status: jqXHR.status,
            textStatus,
            errorThrown,
            responseText: jqXHR.responseText,
          });

          let res = jqXHR.responseJSON;
          if (!res && jqXHR.responseText) {
            try {
              res = JSON.parse(jqXHR.responseText);
            } catch (err) {
              res = null;
            }
          }

          const map = {
            first_name: "#reg-first",
            last_name: "#reg-last",
            address: "#reg-address",
            email: "#reg-email",
            phone: "#reg-phone",
            password: "#reg-pass",
            password_confirmation: "#reg-pass-confirm",
          };

          if (res && res.errors) {
            applyBackendErrors(res.errors, map);
          }

          const msg =
            (res && res.error) ||
            "Unable to sign up right now. Please try again.";
          showErrorToast(msg);
        })
        .always(function () {
          toggleSubmitting($form, false);
        });
    });

    $(document).on(
      "click",
      "#logout-button, #logout-button-mobile",
      function (e) {
        e.preventDefault();
        $.ajax({
          url: routes.logout,
          method: "POST",
          dataType: "json",
        })
          .done(function () {
            showToast("Logged out successfully!");
            setTimeout(function () {
              window.location.reload();
            }, 500);
          })
          .fail(function () {
            showErrorToast("Unable to logout right now. Please try again.");
          });
      },
    );
  }
  initializeModalLogic();
});
