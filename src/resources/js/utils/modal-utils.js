(function ($, win) {
  function create(modalId, backdropId, contentId) {
    var $modal = $("#" + modalId);
    var $backdrop = $("#" + backdropId);
    var $content = $("#" + contentId);
    return {
      open: function () {
        $modal.removeClass("hidden");
        requestAnimationFrame(function () {
          $backdrop.addClass("opacity-100");
          $content
            .addClass("opacity-100")
            .removeClass("translate-y-4 scale-95")
            .addClass("translate-y-0 scale-100");
        });
      },
      close: function () {
        $backdrop.removeClass("opacity-100");
        $content
          .removeClass("opacity-100 translate-y-0 scale-100")
          .addClass("translate-y-4 scale-95");
        setTimeout(function () {
          $modal.addClass("hidden");
        }, 300);
      },
    };
  }
  win.Modals = { create: create };
})(jQuery, window);
