(function ($, win) {
  var containerId = "toast-container";
  function ensureContainer() {
    var $c = $("#" + containerId);
    if (!$c.length) {
      $c = $(
        '<div id="' +
        containerId +
        '" class="fixed top-4 right-4 z-50 flex flex-col gap-3"></div>',
      );
      $("body").append($c);
    }
    return $c;
  }
  function createToast(html, classes, ttl) {
    var $c = ensureContainer();
    var $t = $(
      '<div class="pointer-events-auto select-none rounded-2xl px-5 py-3 text-sm font-medium text-white shadow-xl ring-1 opacity-0 -translate-y-2 transition duration-300 ' +
      classes +
      '"></div>',
    ).html(html);
    $c.append($t);
    requestAnimationFrame(function () {
      $t.removeClass("opacity-0 -translate-y-2").addClass(
        "opacity-100 translate-y-0",
      );
    });
    setTimeout(
      function () {
        $t.addClass("opacity-0 -translate-y-2");
        setTimeout(function () {
          $t.remove();
        }, 300);
      },
      Math.max(1200, ttl || 2800),
    );
  }
  function escapeHTML(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  win.Toast = {
    success: function (msg) {
      createToast(
        '<div class="flex items-center gap-3"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white">\
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span><span class="leading-tight">' +
        escapeHTML(msg) +
        "</span></div>",
        "bg-[#30442B] shadow-[#30442B]/20 ring-white/15",
        2800,
      );
    },
    error: function (msg) {
      createToast(
        '<div class="flex items-center gap-3"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white">\
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></span><span class="leading-tight">' +
        escapeHTML(msg) +
        "</span></div>",
        "bg-red-500 shadow-red-800/20 ring-white/15",
        3200,
      );
    },
  };
})(jQuery, window);
