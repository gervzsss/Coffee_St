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
});
