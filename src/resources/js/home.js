$(function () {
  (function () {
    var $container = $("#featured-carousel");
    var $track = $container.find(".featured-track");
    if (!$track.length) return;

    var TRANSITION = "transform 450ms cubic-bezier(0.22, 0.61, 0.36, 1)";
    $track.css({ willChange: "transform" });

    var $baseSlides = $track.children(".featured-slide").clone();
    var COUNT = $baseSlides.length;
    if (COUNT < 2) return;

    var index = 0;
    var visible = 1;
    var isAnimating = false;
    var auto = null;

    function computeStep($contextTrack) {
      var g = parseInt($contextTrack.css("gap"), 10);
      if (isNaN(g)) g = parseInt($contextTrack.css("column-gap"), 10);
      if (isNaN(g)) g = 32;
      var slideW =
        $contextTrack.children(".featured-slide").first().outerWidth() || 0;
      return slideW + g;
    }

    function setTransformInstant(offsetPx) {
      $track.css("transition", "none");
      $track.css("transform", "translateX(" + -offsetPx + "px)");
      void $track.width();
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

    function initCarousel() {
      stopAutoplay();
      $track.empty().append($baseSlides.clone());
      COUNT = $baseSlides.length;

      var step = computeStep($track);
      var containerW = $container.innerWidth();
      visible = Math.max(1, Math.round(containerW / (step || 1)));
      if (COUNT <= visible) {
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

      for (var i = COUNT - visible; i < COUNT; i++) {
        $track.prepend($baseSlides.eq(i).clone(true).addClass("is-clone"));
      }
      for (var j = 0; j < visible; j++) {
        $track.append($baseSlides.eq(j).clone(true).addClass("is-clone"));
      }

      index = visible;
      goToIndex(true);
      startAutoplay();
    }

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

  $(document).on("click", ".add-to-cart", function () {
    var $btn = $(this);
    $btn.addClass("scale-95");
    setTimeout(function () {
      $btn.removeClass("scale-95");
    }, 150);
  });

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
    if ($section.data("revealed")) return;
    if (isInViewportJQPartial($section, 0.5)) {
      $section.data("revealed", true);
      $section.animate({ opacity: 1 }, 800);
      $section.css("transform", "translateY(0)");
      $(window).off("scroll", handleSplitScreenAnimation);
    }
  }

  handleSplitScreenAnimation();
  $(window).on("scroll", handleSplitScreenAnimation);

  function isInViewportJQPartial($el, ratio) {
    if (!$el || !$el.length) return false;
    ratio = typeof ratio === "number" ? ratio : 0.6;
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
