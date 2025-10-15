// jQuery-only interactions for Coffee_St.
// Keep this file free of frameworks; use Tailwind classes for state (e.g., 'hidden').

$(function () {
  // Featured products minimal carousel (no external libs)
  (function () {
    var $container = $("#featured-carousel");
    var $track = $container.find(".featured-track");
    if (!$track.length) return;

    // Smooth transform
    var TRANSITION = "transform 450ms cubic-bezier(0.22, 0.61, 0.36, 1)"; // ease-out with better momentum
    $track.css({ willChange: "transform" });

    var $baseSlides = $track.children(".featured-slide").clone();
    var COUNT = $baseSlides.length;
    if (COUNT < 2) return; // nothing to loop

    var index = 0;
    var visible = 1;
    var isAnimating = false;
    var auto = null;

    function computeStep($contextTrack) {
      var g = parseInt($contextTrack.css("gap"), 10);
      if (isNaN(g)) g = parseInt($contextTrack.css("column-gap"), 10);
      if (isNaN(g)) g = 32; // gap-8 fallback
      var slideW =
        $contextTrack.children(".featured-slide").first().outerWidth() || 0;
      return slideW + g;
    }

    function setTransformInstant(offsetPx) {
      $track.css("transition", "none");
      $track.css("transform", "translateX(" + -offsetPx + "px)");
      void $track.width(); // force reflow via jQuery
      $track.css("transition", TRANSITION).css("will-change", "transform");
    }

    function stepSize() {
      return computeStep($track);
    }

    function goToIndex(instant) {
      var offset = index * stepSize();
      if (instant) {
        setTransformInstant(offset);
        isAnimating = false;
      } else {
        isAnimating = true;
        $track.css("transition", TRANSITION);
        $track.css("transform", "translateX(" + -offset + "px)");
      }
    }

    function startAutoplay() {
      if (auto) clearInterval(auto);
      auto = setInterval(function () {
        if (!isAnimating) $(".featured-next").trigger("click");
      }, 3500);
    }

    function stopAutoplay() {
      if (auto) {
        clearInterval(auto);
        auto = null;
      }
    }

    // Build clones equal to visible count at both ends
    function initCarousel() {
      stopAutoplay();
      // reset track to originals only
      $track.empty().append($baseSlides.clone());
      COUNT = $baseSlides.length;

      // determine visible
      var step = computeStep($track);
      var containerW = $container.innerWidth();
      visible = Math.max(1, Math.round(containerW / (step || 1)));
      if (COUNT <= visible) {
        // not enough slides; disable nav and autoplay
        $(".featured-prev, .featured-next").addClass(
          "opacity-0 pointer-events-none",
        );
        index = 0;
        goToIndex(true);
        return;
      } else {
        $(".featured-prev, .featured-next").removeClass(
          "opacity-0 pointer-events-none",
        );
      }

      // prepend last 'visible' slides
      for (var i = COUNT - visible; i < COUNT; i++) {
        $track.prepend($baseSlides.eq(i).clone(true).addClass("is-clone"));
      }
      // append first 'visible' slides
      for (var j = 0; j < visible; j++) {
        $track.append($baseSlides.eq(j).clone(true).addClass("is-clone"));
      }

      index = visible; // start at first real slide
      goToIndex(true);
      startAutoplay();
    }

    // Bind controls once
    $(".featured-next")
      .off("click.fc")
      .on("click.fc", function () {
        if (isAnimating) return;
        index += 1;
        goToIndex(false);
      });
    $(".featured-prev")
      .off("click.fc")
      .on("click.fc", function () {
        if (isAnimating) return;
        index -= 1;
        goToIndex(false);
      });

    $container.on("mouseenter", stopAutoplay);
    $container.on("mouseleave", startAutoplay);

    // Snap logic for variable visible
    $track
      .off("transitionend.fc webkitTransitionEnd.fc oTransitionEnd.fc")
      .on(
        "transitionend.fc webkitTransitionEnd.fc oTransitionEnd.fc",
        function (e) {
          if (e.originalEvent && e.originalEvent.propertyName !== "transform")
            return;
          isAnimating = false;
          var maxIndex = COUNT + visible - 1;
          if (index > maxIndex) {
            index -= COUNT;
            goToIndex(true);
          } else if (index < visible) {
            index += COUNT;
            goToIndex(true);
          }
        },
      );

    // Init now and on resize (debounced)
    var resizeTimer = null;
    function reinit() {
      initCarousel();
    }
    $(window).on("load", reinit);
    setTimeout(reinit, 120);
    $container.find("img").on("load", reinit);
    $(window).on("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(reinit, 150);
    });
  })();

  // Add to Cart button feedback + cart badge increment
  $(document).on("click", ".add-to-cart", function () {
    var $btn = $(this);
    $btn.addClass("scale-95");
    setTimeout(function () {
      $btn.removeClass("scale-95");
    }, 150);

    var $badge = $(".cart-count");
    if ($badge.length) {
      var n = parseInt($badge.text(), 10) || 0;
      $badge.text(n + 1);
    }
  });

  // Split-screen section reveal on viewport
  function isInViewportJQ($el) {
    if (!$el || !$el.length) return false;
    var winTop = $(window).scrollTop();
    var winLeft = $(window).scrollLeft();
    var winBottom = winTop + $(window).height();
    var winRight = winLeft + $(window).width();
    var off = $el.offset();
    if (!off) return false;
    var elTop = off.top;
    var elLeft = off.left;
    var elBottom = elTop + $el.outerHeight();
    var elRight = elLeft + $el.outerWidth();
    return (
      elTop >= winTop &&
      elLeft >= winLeft &&
      elBottom <= winBottom &&
      elRight <= winRight
    );
  }

  function handleSplitScreenAnimation() {
    var $section = $("#split-screen-section");
    if (!$section.length) return;
    if (!$section.hasClass("animated") && isInViewportJQ($section)) {
      $section.addClass("animated");
      $section.animate({ opacity: 1 }, 800).css("transform", "translateY(0)");
      // Remove scroll listener after animation completes
      $(window).off("scroll", handleSplitScreenAnimation);
    }
  }

  // Initial check and bind
  handleSplitScreenAnimation();
  $(window).on("scroll", handleSplitScreenAnimation);

  // Benefits grid reveal
  function isInViewportJQPartial($el, ratio) {
    // Trigger when a certain ratio of element is within viewport (0..1)
    if (!$el || !$el.length) return false;
    ratio = typeof ratio === "number" ? ratio : 0.6; // default 60% visible
    var winTop = $(window).scrollTop();
    var winBottom = winTop + $(window).height();
    var off = $el.offset();
    if (!off) return false;
    var elTop = off.top;
    var elHeight = $el.outerHeight();
    var elVisibleTop = Math.max(elTop, winTop);
    var elVisibleBottom = Math.min(elTop + elHeight, winBottom);
    var visible = Math.max(0, elVisibleBottom - elVisibleTop);
    return visible >= elHeight * ratio;
  }

  function handleBenefitsAnimation() {
    var $cards = $(".benefit-card");
    if (!$cards.length) return;
    $cards.each(function (i) {
      var $card = $(this);
      if ($card.data("revealed")) return;
      if (isInViewportJQPartial($card, 0.5)) {
        $card.data("revealed", true);
        $card.delay(i * 150).animate({ opacity: 1 }, 800);
      }
    });
  }

  handleBenefitsAnimation();
  $(window).on("scroll", handleBenefitsAnimation);
});
