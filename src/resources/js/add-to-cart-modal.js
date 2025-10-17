// Add-to-Cart modal flow (jQuery only). Matches site aesthetics.
// Requires: auth-modals (for guest login), VariantRepository API, cart API.
$(function () {
  // Attach modal into DOM if not present
  if (!$("#atc-overlay").length) {
    // If page didn't include the PHP modal, don't bind
    return;
  }

  var $overlay = $("#atc-overlay");
  var $modal = $("#atc-modal");

  function money(n) {
    return (Math.round((n + Number.EPSILON) * 100) / 100).toFixed(2);
  }

  function openATC(product) {
    // Show overlay and modal, lock body scroll
    $overlay.removeClass("hidden").css("display", "flex");
    $("body").addClass("overflow-hidden");
    $modal.show();
    // product: {id, name, price, image, category, description}
    $modal.find('[data-atc="product-id"]').val(product.id);
    $modal
      .find('[data-atc="image"]')
      .attr("src", product.image || "")
      .attr("alt", product.name || "");
    $modal.find('[data-atc="name"]').text(product.name || "");
    $modal.find('[data-atc="category"]').text(product.category || "");
    $modal.find('[data-atc="description"]').text(product.description || "");
    $modal.find('[data-atc="qty"]').val(1);
    $modal.find('[data-atc="base-price"]').val(product.price || 0);
  $modal.find('[data-atc="price"]').text("₱" + money(product.price || 0));

    // Load variants/add-ons
    var addonsWrap = $modal
      .find('[data-atc="addons-wrap"]')
      .prop("hidden", true);
    var addonsGrid = $modal.find('[data-atc="addons"]').empty();
    $.get("/COFFEE_ST/public/api/variants.php", { product_id: product.id })
      .done(function (vres) {
        if (vres && vres.success && vres.variants && vres.variants.length) {
          addonsWrap.prop("hidden", false);
          $.each(vres.variants, function (_, v) {
            var id = "addon-" + v.id;
            var delta = parseFloat(v.price_delta || 0);
            var $opt = $(
              '<label class="flex items-center gap-3 rounded-2xl border border-neutral-200 p-3 cursor-pointer hover:border-[#30442B]/60 transition"></label>',
            );
            var $cb = $('<input type="checkbox" class="h-5 w-5 rounded" />')
              .attr("data-vid", v.id)
              .attr("data-delta", delta);
            var title = (v.group_name ? v.group_name + ": " : "") + v.name;
            var priceTag =
              delta !== 0
                ? delta > 0
                  ? "+₱" + money(delta)
                  : "-₱" + money(Math.abs(delta))
                : "";
            var $txt = $(
              '<div class="flex-1">' +
              title +
              (priceTag
                ? ' <span class="text-xs text-neutral-500">(' +
                priceTag +
                ")</span>"
                : "") +
              "</div>",
            );
            $opt.append($cb).append($txt);
            addonsGrid.append($opt);
          });
        }
      });
  }

  function closeATC() {
    $modal.hide();
    $overlay.addClass("hidden").css("display", "none");
    $("body").removeClass("overflow-hidden");
    // Reset modal content
    $modal.find('[data-atc="product-id"]').val("");
    $modal.find('[data-atc="image"]').attr("src", "").attr("alt", "");
    $modal.find('[data-atc="name"]').text("");
    $modal.find('[data-atc="category"]').text("");
    $modal.find('[data-atc="description"]').text("");
    $modal.find('[data-atc="qty"]').val(1);
    $modal.find('[data-atc="base-price"]').val(0);
    $modal.find('[data-atc="price"]').text("$0.00");
    $modal.find('[data-atc="addons-wrap"]').prop("hidden", true);
    $modal.find('[data-atc="addons"]').empty();
  }

  // Price recalculation when add-ons or qty change
  function recomputePrice() {
    var base = parseFloat($modal.find('[data-atc="base-price"]').val() || "0");
    var qty = Math.max(
      1,
      parseInt($modal.find('[data-atc="qty"]').val(), 10) || 1,
    );
    var delta = 0;
    $modal.find('[data-atc="addons"] input[type="checkbox"]').each(function () {
      if ($(this).is(":checked"))
        delta += parseFloat($(this).attr("data-delta") || "0");
    });
    var unit = base + delta;
    $modal.find('[data-atc="price"]').text("$" + money(unit));
    return { unit: unit, qty: qty };
  }


  // Open modal from any .add-to-cart button, pulling product data from card markup
  $(document).on("click", ".add-to-cart", function () {
    var $card = $(this).closest(".product-card");
    var product = {
      id: parseInt($(this).data("product-id") || $card.data("id"), 10),
      name: $.trim($card.find("h3").first().text()),
      price: (function () {
        var t = $.trim($card.find("span.font-bold").first().text()).replace(/[^0-9.]/g, "");
        var n = parseFloat(t);
        return isNaN(n) ? 0 : n;
      })(),
      image: $card.find("img").attr("src") || "",
      category: $.trim($card.data("category") || ""),
      description: $.trim($card.find("p").first().text()),
    };
    if (!product.id) return;

    // Only open modal if user is authenticated
    if (window.IS_AUTH) {
      openATC(product);
    } else {
      // Not logged in: trigger login/signup modal
      var sel = window.__openLoginSelector || '[data-open-login="login"]';
      $(sel).first().trigger("click");
    }
  });

  // Qty controls
  $(document).on("click", '[data-atc="qty-inc"]', function () {
    var $q = $modal.find('[data-atc="qty"]');
    var v = parseInt($q.val(), 10) || 1;
    $q.val(v + 1);
    recomputePrice();
  });
  $(document).on("click", '[data-atc="qty-dec"]', function () {
    var $q = $modal.find('[data-atc="qty"]');
    var v = Math.max(1, (parseInt($q.val(), 10) || 1) - 1);
    $q.val(v);
    recomputePrice();
  });
  $(document).on("input", '[data-atc="qty"]', recomputePrice);
  $(document).on(
    "change",
    '[data-atc="addons"] input[type="checkbox"]',
    recomputePrice,
  );

  // Close/Cancel
  $(document).on(
    "click",
    '[data-atc="close"],[data-atc="cancel"]',
    function () {
      closeATC();
    },
  );

  // ESC key closes modal and overlay
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $overlay.is(":visible")) {
      closeATC();
    }
  });
  $(document).on("click", "#atc-overlay", function (e) {
    if ($(e.target).is("#atc-overlay")) closeATC();
  });

  function collectPayload() {
    var pid = parseInt($modal.find('[data-atc="product-id"]').val(), 10);
    var qty = Math.max(
      1,
      parseInt($modal.find('[data-atc="qty"]').val(), 10) || 1,
    );
    var vids = [];
    $modal.find('[data-atc="addons"] input[type="checkbox"]').each(function () {
      if ($(this).is(":checked")) {
        vids.push(parseInt($(this).attr("data-vid"), 10));
      }
    });
    // Backend currently supports single variant_id. We'll send the first selected; future: extend API for multiple.
    return {
      product_id: pid,
      quantity: qty,
      variant_id: vids.length ? vids[0] : null,
    };
  }

  function updateCartCount(n) {
    $(".cart-count").text(n || 0);
  }

  function doAddToCart(payload, thenRedirect) {
    // If guest, queue and open login
    if (!window.IS_AUTH) {
      try {
        sessionStorage.setItem("queuedAddToCart", JSON.stringify(payload));
      } catch (e) { }
      var sel = window.__openLoginSelector || '[data-open-login="login"]';
      $(sel).first().trigger("click");
      return;
    }
    $.post("/COFFEE_ST/public/api/cart.php?action=add", payload)
      .done(function (resp) {
        if (resp && resp.success) {
          updateCartCount(
            resp.summary && resp.summary.count ? resp.summary.count : 0,
          );
          if (thenRedirect === "checkout") {
            window.location.href = "/COFFEE_ST/public/pages/checkout.php";
          } else {
            closeATC();
          }
        } else if (resp && resp.error) {
          if (/login/i.test(resp.error)) {
            try {
              sessionStorage.setItem(
                "queuedAddToCart",
                JSON.stringify(payload),
              );
            } catch (e) { }
            $('[data-open-login="login"]').first().trigger("click");
          } else {
            alert(resp.error);
          }
        }
      })
      .fail(function (xhr) {
        if (xhr && xhr.status === 401) {
          try {
            sessionStorage.setItem("queuedAddToCart", JSON.stringify(payload));
          } catch (e) { }
          $('[data-open-login="login"]').first().trigger("click");
        } else {
          alert("Unable to add to cart.");
        }
      });
  }

  // Add to Cart
  $(document).on("click", '[data-atc="add"]', function () {
    var payload = collectPayload();
    doAddToCart(payload, null);
  });

  // Direct Checkout
  $(document).on("click", '[data-atc="checkout"]', function () {
    var payload = collectPayload();
    // Add only this product to cart, then redirect to checkout
    $.post("/COFFEE_ST/public/api/cart.php?action=add", payload)
      .done(function (resp) {
        if (resp && resp.success) {
          updateCartCount(resp.summary && resp.summary.count ? resp.summary.count : 0);
          // Redirect to checkout with only this product
          window.location.href = "/COFFEE_ST/public/pages/checkout.php?single=" + encodeURIComponent(payload.product_id);
        } else if (resp && resp.error) {
          if (/login/i.test(resp.error)) {
            try {
              sessionStorage.setItem("queuedAddToCart", JSON.stringify(payload));
            } catch (e) { }
            $('[data-open-login="login"]').first().trigger("click");
          } else {
            alert(resp.error);
          }
        }
      })
      .fail(function (xhr) {
        if (xhr && xhr.status === 401) {
          try {
            sessionStorage.setItem("queuedAddToCart", JSON.stringify(payload));
          } catch (e) { }
          $('[data-open-login="login"]').first().trigger("click");
        } else {
          alert("Unable to add to cart.");
        }
      });
    closeATC();
  });

  // Replay on login success (optional custom event)
  $(document).on("user:login-success", function () {
    var queued = null;
    try {
      queued = sessionStorage.getItem("queuedAddToCart");
    } catch (e) { }
    if (queued) {
      try {
        var payload = JSON.parse(queued);
        sessionStorage.removeItem("queuedAddToCart");
        doAddToCart(payload, null);
      } catch (e) { }
    }
  });
});
