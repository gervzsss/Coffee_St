$(function () {
  var currentCategory = "all";
  var currentSearch = "";

  var $grid = $("#products-grid");
  if (!$grid.length) return;
  var $allCards = $grid.children(".product-card");

  var $noResults = $("#no-results");
  if (!$noResults.length) {
    $noResults = $(
      '<div id="no-results" class="text-center py-16 w-full hidden col-span-full">' +
      '<p class="text-gray-500 text-xl mb-2">No products found</p>' +
      '<p class="text-gray-400">Try adjusting your search or selecting a different category</p>' +
      "</div>",
    );
    $grid.append($noResults);
  }

  $grid.css("visibility", "hidden");

  function activateCategory(category) {
    $(".category-btn").attr("data-active", "false");
    $(".category-btn[data-category='" + category + "']").attr(
      "data-active",
      "true",
    );
  }

  function normalize(s) {
    return (s || "").toString().toLowerCase().trim();
  }

  function filterProducts() {
    $allCards.show();

    if (currentCategory && currentCategory !== "all") {
      $allCards.each(function () {
        var $c = $(this);
        if ($c.data("category") !== currentCategory) {
          $c.hide();
        }
      });
    }

    if (currentSearch) {
      var q = normalize(currentSearch);
      $allCards.each(function () {
        var $c = $(this);
        if (!$c.is(":visible")) return;
        var name = normalize($c.find("h3").text());
        var description = normalize($c.find("p").text());
        if (name.indexOf(q) === -1 && description.indexOf(q) === -1) {
          $c.hide();
        }
      });
    }

    var visibleCount = $allCards.filter(":visible").length;
    if (visibleCount === 0) {
      $noResults.removeClass("hidden");
    } else {
      $noResults.addClass("hidden");
    }

    $grid.css("visibility", "visible");
  }

  $(document).on("click", ".category-btn", function () {
    currentCategory = $(this).data("category") || "all";
    activateCategory(currentCategory);
    filterProducts();
  });

  $(document).on("input", "#product-search", function () {
    currentSearch = $(this).val();
    filterProducts();
  });

  activateCategory("all");
  filterProducts();
});
