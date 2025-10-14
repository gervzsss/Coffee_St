// jQuery-only interactions for Coffee_St.
// Keep this file free of frameworks; use Tailwind classes for state (e.g., 'hidden').

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
});
