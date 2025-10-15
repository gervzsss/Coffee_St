// jQuery-only filtering and search for products page (strictly jQuery, no vanilla DOM)
$(function () {
  var currentCategory = "all";
  var currentSearch = "";

  // Cache product cards and grid
  var $grid = $("#products-grid");
  if (!$grid.length) return;
  var $allCards = $grid.children(".product-card");

  // Create or reuse a full-width no-results element inside the grid
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

  // Prevent flash by hiding grid until the first render pass completes
  $grid.css("visibility", "hidden");

  // Activate a category: uses data-active attribute (for CSS styling)
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
    // Start by showing all cards
    $allCards.show();

    // Category filter
    if (currentCategory && currentCategory !== "all") {
      $allCards.each(function () {
        var $c = $(this);
        if ($c.data("category") !== currentCategory) {
          $c.hide();
        }
      });
    }

    // Search filter
    if (currentSearch) {
      var q = normalize(currentSearch);
      $allCards.each(function () {
        var $c = $(this);
        if (!$c.is(":visible")) return; // already hidden by category
        var name = normalize($c.find("h3").text());
        var description = normalize($c.find("p").text());
        if (name.indexOf(q) === -1 && description.indexOf(q) === -1) {
          $c.hide();
        }
      });
    }

    // No-results visibility
    var visibleCount = $allCards.filter(":visible").length;
    if (visibleCount === 0) {
      $noResults.removeClass("hidden");
    } else {
      $noResults.addClass("hidden");
    }

    // Reveal grid after first pass
    $grid.css("visibility", "visible");
  }

  // Category button click handler
  $(document).on("click", ".category-btn", function () {
    currentCategory = $(this).data("category") || "all";
    activateCategory(currentCategory);
    filterProducts();
  });

  // Search input handler
  $(document).on("input", "#product-search", function () {
    currentSearch = $(this).val();
    filterProducts();
  });

  // Initial state
  activateCategory("all");
  filterProducts();
});
