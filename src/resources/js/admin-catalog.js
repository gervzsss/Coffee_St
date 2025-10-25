// Admin Catalog: Add Product loading overlay and double-submit guard
// Requires jQuery to be loaded before this script.
(function ($) {
  $(function () {
    var inProgress = false;
    var $overlay = $("#add-product-spinner");
    var $btn = $("#add-product-btn");

    function showOverlay() {
      if ($overlay.length) {
        $overlay.removeClass("hidden").addClass("flex");
      }
    }
    function hideOverlay() {
      if ($overlay.length) {
        $overlay.removeClass("flex").addClass("hidden");
      }
    }
    function disableButton() {
      if ($btn.length) {
        $btn.prop("disabled", true);
        // Optional: keep width by adding a spinner inside the button in the future
      }
    }
    function enableButton() {
      if ($btn.length) {
        $btn.prop("disabled", false);
      }
    }

    // Guard: only act if the Add Product form exists on the page
    var $form = $("#addProductForm");
    if (!$form.length) return;

    // On submit, show overlay and disable the button. Let existing handlers do the AJAX.
    $form.on("submit", function () {
      if (inProgress) {
        // Prevent accidental double submits in case another script triggers submit again
        return false;
      }
      inProgress = true;
      showOverlay();
      disableButton();
      // We don't preventDefault here; other handlers (e.g. admin.js) already handle it.
    });

    // When any AJAX completes or errors, if it was triggered after our submit, hide overlay and re-enable.
    $(document).on("ajaxComplete ajaxError", function () {
      if (!inProgress) return;
      inProgress = false;
      hideOverlay();
      enableButton();
    });

    // Also hide overlay if the modal is closed manually for any reason
    $(document).on("click", ".close-modal, #modalBackdrop, #addModalWrapper", function () {
      inProgress = false;
      hideOverlay();
      enableButton();
    });
  });
})(jQuery);
