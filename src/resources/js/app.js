$(function () {
  // Desktop dropdown menu (if present)
  $("#menuToggle").on("click", function () {
    $("#menu").toggleClass("hidden");
  });

  // Mobile menu toggle
  $("#mobile-menu-button").on("click", function () {
    $("#mobile-menu").slideToggle();
  });

  // Scroll progress bar
  $(window).on("scroll", function () {
    var scrollTop = $(window).scrollTop();
    var docHeight = $(document).height() - $(window).height();
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    $("#scroll-progress").css("width", progress + "%");
  });

  // Initialize cart count only if authenticated; ignore/silence 401s for guests
  if (window.IS_AUTH) {
    $.get("/COFFEE_ST/public/api/cart.php?action=get")
      .done(function (resp) {
        if (resp && resp.success) {
          $(".cart-count").text(resp.summary.count || 0);
        }
      })
      .fail(function (xhr) {
        /* guests or errors: do nothing to avoid console noise */
      });
  }

  // Inbox navigation fallback: if not authenticated, open login modal instead of navigating
  $(document).on('click', '#inbox-link', function (e) {
    if (!window.IS_AUTH) {
      e.preventDefault();
      var sel = window.__openLoginSelector || '[data-open-login="login"]';
      var $trigger = $(sel).first();
      if ($trigger.length) {
        $trigger.trigger('click');
      } else {
        // Fallback: emit event for login modal if scripts listen to it
        $(document).trigger('open:login');
      }
    }
  });
});
