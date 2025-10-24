$(function () {
  if (window.IS_AUTH) {
    $.get("/COFFEE_ST/public/api/cart.php?action=get")
      .done(function (resp) {
        if (resp && resp.success) {
          $(".cart-count").text(resp.summary.count || 0);
        }
      })
      .fail(function () {
      });
  }
  $("#menuToggle").on("click", function () {
    $("#menu").toggleClass("hidden");
  });

  $("#mobile-menu-button").on("click", function () {
    $("#mobile-menu").slideToggle();
  });

  $(document).on("click", "#mobile-menu a", function () {
    if ($(window).width() < 768) {
      $("#mobile-menu").slideUp();
    }
  });

  $(window).on("resize", function () {
    if ($(window).width() >= 768) {
      $("#mobile-menu").hide();
    }
  });

  $(window).on("scroll", function () {
    var scrollTop = $(window).scrollTop();
    var docHeight = $(document).height() - $(window).height();
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    $("#scroll-progress").css("width", progress + "%");
  });

  $(document).on("click", "#inbox-link", function (e) {
    if (!window.IS_AUTH) {
      e.preventDefault();
      var sel = window.__openLoginSelector || '[data-open-login="login"]';
      var $trigger = $(sel).first();
      if ($trigger.length) {
        $trigger.trigger("click");
      } else {
        $(document).trigger("open:login");
      }
    }
  });
});
