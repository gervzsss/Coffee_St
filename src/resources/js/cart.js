$(function () {
  function updateCartCount(count) {
    $(".cart-count").text(count || 0);
  }

  function updateItemLineTotal($item) {
    var unit = parseFloat($item.attr('data-unit-price')) || 0;
    var delta = parseFloat($item.attr('data-price-delta')) || 0;
    var qty = parseInt($item.find('.qty-input').val(), 10) || 1;
    qty = Math.max(1, qty);
    var total = (unit + delta) * qty;
    $item.find('.line-total').text(total.toFixed(2));
  }

  function setRemoveSelectedEnabled() {
    var hasSel = $(".item-select:checked").length > 0;
    $("#remove-selected").prop("disabled", !hasSel);
  }

  // Compute and update summary values based on currently selected items on the cart page
  function updateSelectedSummary() {
    var $items = $(".cart-item");
    if (!$items.length) {
      return;
    }
    var subtotal = 0;
    $(".item-select:checked").each(function () {
      var $item = $(this).closest(".cart-item");
      var unit = parseFloat($item.attr("data-unit-price")) || 0;
      var delta = parseFloat($item.attr("data-price-delta")) || 0;
      var qty = parseInt($item.find(".qty-input").val(), 10) || 0;
      subtotal += (unit + delta) * qty;
    });
    // read delivery fee from DOM and compute tax at 8% (same as server)
    var delivery = parseFloat($("#summary-delivery").text()) || 0;
    var tax = Math.round(subtotal * 0.08 * 100) / 100;
    $("#summary-subtotal").text(subtotal.toFixed(2));
    $("#summary-tax").text(tax.toFixed(2));
    $("#summary-total").text((subtotal + delivery + tax).toFixed(2));
  }

  try {
    if (sessionStorage.getItem("loginJustSucceeded") === "1") {
      sessionStorage.removeItem("loginJustSucceeded");
      var queued = sessionStorage.getItem("queuedAddToCart");
      if (queued) {
        var payload = JSON.parse(queued);
        sessionStorage.removeItem("queuedAddToCart");
        $.post("/COFFEE_ST/public/api/cart.php?action=add", payload).done(
          function (resp) {
            if (resp && resp.success)
              updateCartCount(
                resp.summary && resp.summary.count ? resp.summary.count : 0,
              );
          },
        );
      }
    }
  } catch (e) { }

  (function ensureModals() {
    if (!$("#cart-modal").length) {
      var $modal = $(
        '<div id="cart-modal" class="fixed inset-0 z-[60] hidden" role="dialog" aria-modal="true" aria-labelledby="cartModalTitle">' +
        '<div class="absolute inset-0 bg-black/40"></div>' +
        '<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[92%] max-w-md p-5">' +
        '<div class="flex justify-between items-center mb-3"><h3 id="cartModalTitle" class="text-lg font-semibold text-[#30442B]">Added to cart</h3><button id="cartModalCloseBtn" class="text-gray-500" aria-label="Close cart modal">\u2715</button></div>' +
        '<div class="space-y-3">' +
        '<div class="flex items-center gap-3"><div class="flex-1">' +
        '<div class="font-medium product-name"></div>' +
        '<div class="text-sm text-gray-500">Update quantity below</div>' +
        "</div></div>" +
        '<div class="flex items-center gap-3" data-product-id="">' +
        '<button class="decrease-qty h-9 w-9 rounded-full border flex items-center justify-center">\u2212</button>' +
        '<input type="text" class="qty-input w-14 text-center border rounded" value="1" />' +
        '<button class="increase-qty h-9 w-9 rounded-full border flex items-center justify-center">+</button>' +
        '<button class="remove-item ml-auto text-red-600">Remove</button>' +
        "</div>" +
        '<div class="flex gap-3 pt-1">' +
        '<a href="/COFFEE_ST/public/pages/cart.php" class="inline-flex justify-center flex-1 px-4 py-2 rounded border border-[#30442B] text-[#30442B]">View Cart</a>' +
        '<a href="/COFFEE_ST/public/pages/checkout.php" id="cartModalCheckoutLink" class="inline-flex justify-center flex-1 px-4 py-2 rounded bg-[#30442B] text-white">Checkout</a>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>",
      );
      $("body").append($modal);
    }
    if (!$("#variant-modal").length) {
      var $vModal = $(
        '<div id="variant-modal" class="fixed inset-0 z-[61] hidden" role="dialog" aria-modal="true" aria-labelledby="variantModalTitle">' +
        '  <div class="absolute inset-0 bg-black/40"></div>' +
        '  <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[92%] max-w-md p-5">' +
        '    <div class="flex justify-between items-center mb-3"><h3 id="variantModalTitle" class="text-lg font-semibold text-[#30442B]">Choose an option</h3><button id="variantModalCloseBtn" class="text-gray-500" aria-label="Close variant modal">\u2715</button></div>' +
        '    <div class="space-y-3">' +
        '       <div class="text-sm text-gray-700">Please select a variant to continue</div>' +
        '       <select id="variantSelect" class="w-full border rounded px-3 py-2"></select>' +
        '       <div class="flex gap-3 pt-1">' +
        '         <button id="variantCancelBtn" class="inline-flex justify-center flex-1 px-4 py-2 rounded border border-gray-300 text-gray-700">Cancel</button>' +
        '         <button id="variantConfirmBtn" class="inline-flex justify-center flex-1 px-4 py-2 rounded bg-[#30442B] text-white">Add</button>' +
        "       </div>" +
        "    </div>" +
        "  </div>" +
        "</div>",
      );
      $("body").append($vModal);
    }
  })();

  function openCartModal(productId, productName, qty) {
    var $m = $("#cart-modal");
    $m.find(".product-name").text(productName || "");
    $m.find("[data-product-id]").attr("data-product-id", productId);
    $m.find(".qty-input").val(qty || 1);
    // Point the Checkout CTA to single-product checkout
    $m.find('#cartModalCheckoutLink').attr('href', '/COFFEE_ST/public/pages/checkout.php?single=' + encodeURIComponent(productId));
    $m.fadeIn(150);
  }
  function closeCartModal() {
    $("#cart-modal").fadeOut(150);
  }
  $(document).on("click", "#cartModalCloseBtn", closeCartModal);
  $(document).on("click", "#cart-modal", function (e) {
    if ($(e.target).is("#cart-modal")) closeCartModal();
  });

  function openVariantModal(options) {
    var $m = $("#variant-modal");
    var $sel = $m.find("#variantSelect");
    $sel.empty();
    $.each(options, function (_, v) {
      var label = (v.group_name ? v.group_name + ": " : "") + v.name;
      if (v.price_delta && v.price_delta !== 0)
        label +=
          (v.price_delta > 0 ? " (+" : " (") +
          Number(v.price_delta).toFixed(2) +
          ")";
      $("<option></option>").val(v.id).text(label).appendTo($sel);
    });
    $m.fadeIn(120);
  }
  function closeVariantModal() {
    $("#variant-modal").fadeOut(120);
  }
  $(document).on("click", "#variantModalCloseBtn, #variantCancelBtn", closeVariantModal);
  $(document).on("click", "#variant-modal", function (e) {
    if ($(e.target).is("#variant-modal")) closeVariantModal();
  });

  $(document).on("click", ".add-to-cart", function () {
    var $card = $(this).closest(".product-card");
    var productName = $.trim($card.find("h3").text());
    var productId =
      $card.data("product-id") ||
      $card.data("id") ||
      $(this).data("product-id");
    if (!productId) {
      console.warn("Missing product id for add-to-cart");
      return;
    }

    function queueAndLogin(payload) {
      window.__queuedAddToCart = payload;
      try {
        sessionStorage.setItem("queuedAddToCart", JSON.stringify(payload));
      } catch (e) { }
      var sel = window.__openLoginSelector || '[data-open-login="login"]';
      $(sel).first().trigger("click");
    }

    if (!window.IS_AUTH) {
      $.get("/COFFEE_ST/public/api/variants.php", { product_id: productId })
        .done(function (vres) {
          var hasVariants =
            vres && vres.success && vres.variants && vres.variants.length;
          if (hasVariants) {
            openVariantModal(vres.variants);
            $(document)
              .off("click.__vconfirm")
              .on(
                "click.__vconfirm",
                "#variantConfirmBtn",
                function () {
                  var vid =
                    parseInt($("#variantSelect").val(), 10) ||
                    null;
                  closeVariantModal();
                  queueAndLogin({
                    product_id: productId,
                    quantity: 1,
                    variant_id: vid,
                  });
                },
              );
          } else {
            queueAndLogin({ product_id: productId, quantity: 1 });
          }
        })
        .fail(function () {
          queueAndLogin({ product_id: productId, quantity: 1 });
        });
      return;
    }

    $.get("/COFFEE_ST/public/api/variants.php", { product_id: productId })
      .done(function (vres) {
        var hasVariants =
          vres && vres.success && vres.variants && vres.variants.length;
        function doAdd(payload) {
          $.post("/COFFEE_ST/public/api/cart.php?action=add", payload)
            .done(function (resp) {
              if (resp && resp.success) {
                updateCartCount(
                  resp.summary && resp.summary.count ? resp.summary.count : 0,
                );
                openCartModal(
                  productId,
                  productName,
                  resp.item && resp.item.quantity ? resp.item.quantity : 1,
                );
              } else if (resp && resp.error) {
                if (/login/i.test(resp.error)) queueAndLogin(payload);
                else alert(resp.error);
              }
            })
            .fail(function (xhr) {
              if (xhr && xhr.status === 401) queueAndLogin(payload);
              else alert("Unable to add to cart.");
            });
        }
        if (hasVariants) {
          openVariantModal(vres.variants);
          $(document)
            .off("click.__vconfirm")
            .on(
              "click.__vconfirm",
              "#variantConfirmBtn",
              function () {
                var vid =
                  parseInt($("#variantSelect").val(), 10) ||
                  null;
                closeVariantModal();
                doAdd({ product_id: productId, quantity: 1, variant_id: vid });
              },
            );
        } else {
          doAdd({ product_id: productId, quantity: 1 });
        }
      })
      .fail(function () {
        $.post("/COFFEE_ST/public/api/cart.php?action=add", {
          product_id: productId,
          quantity: 1,
        })
          .done(function (resp) {
            if (resp && resp.success) {
              updateCartCount(
                resp.summary && resp.summary.count ? resp.summary.count : 0,
              );
              openCartModal(
                productId,
                productName,
                resp.item && resp.item.quantity ? resp.item.quantity : 1,
              );
            } else if (resp && resp.error) {
              if (/login/i.test(resp.error))
                queueAndLogin({ product_id: productId, quantity: 1 });
              else alert(resp.error);
            }
          })
          .fail(function (xhr) {
            if (xhr && xhr.status === 401)
              queueAndLogin({ product_id: productId, quantity: 1 });
            else alert("Unable to add to cart.");
          });
      });
  });

  function recalc(summary) {
    if (!summary) return;
    var subtotal = summary.subtotal || 0;
    var delivery = parseFloat($("#summary-delivery").text()) || 0;
    var tax = Math.round(subtotal * 0.08 * 100) / 100;
    $("#summary-subtotal").text(subtotal.toFixed(2));
    $("#summary-tax").text(tax.toFixed(2));
    $("#summary-total").text((subtotal + delivery + tax).toFixed(2));
    updateCartCount(summary.count || 0);
  }

  $(document).on(
    "click",
    "#cart-modal .increase-qty, #cart-modal .decrease-qty",
    function () {
      var $wrap = $(this).closest("[data-product-id]");
      var pid = parseInt($wrap.attr("data-product-id"), 10);
      var $input = $wrap.find(".qty-input");
      var current = parseInt($input.val(), 10) || 1;
      current = $(this).hasClass("increase-qty")
        ? current + 1
        : Math.max(0, current - 1);
      $input.val(current);
      $.post("/COFFEE_ST/public/api/cart.php?action=setQty", {
        product_id: pid,
        quantity: current,
      }).done(function (resp) {
        if (resp && resp.success) updateCartCount(resp.summary.count || 0);
        // If on cart page, also refresh selected summary to reflect latest qty
        updateSelectedSummary();
      });
    },
  );

  $(document).on("input", "#cart-modal .qty-input", function () {
    var $wrap = $(this).closest("[data-product-id]");
    var pid = parseInt($wrap.attr("data-product-id"), 10);
    var val = parseInt($(this).val(), 10) || 0;
    $.post("/COFFEE_ST/public/api/cart.php?action=setQty", {
      product_id: pid,
      quantity: val,
    }).done(function (resp) {
      if (resp && resp.success) updateCartCount(resp.summary.count || 0);
      updateSelectedSummary();
    });
  });

  $(document).on("click", "#cart-modal .remove-item", function () {
    var $wrap = $(this).closest("[data-product-id]");
    var pid = parseInt($wrap.attr("data-product-id"), 10);
    $.post("/COFFEE_ST/public/api/cart.php?action=remove", {
      product_id: pid,
    }).done(function (resp) {
      if (resp && resp.success) {
        updateCartCount(resp.summary.count || 0);
        closeCartModal();
        updateSelectedSummary();
      }
    });
  });

  $(document).on("click", ".increase-qty, .decrease-qty", function () {
    // avoid conflict with modal buttons by ensuring not inside #cart-modal
    if ($(this).closest("#cart-modal").length) return;
    var $wrap = $(this).closest("[data-product-id]");
    var pid = parseInt($wrap.attr("data-product-id"), 10);
    var $input = $wrap.find(".qty-input");
    var q = parseInt($input.val(), 10) || 1;
    q = $(this).hasClass("increase-qty") ? q + 1 : Math.max(1, q - 1);
    $input.val(q);
    // Update line total immediately
    updateItemLineTotal($wrap.closest('.cart-item'));
    $.post("/COFFEE_ST/public/api/cart.php?action=setQty", {
      product_id: pid,
      quantity: q,
    }).done(function (resp) {
      if (resp && resp.success) {
        recalc(resp.summary);
        // Override with selected subset totals
        updateSelectedSummary();
        // No reload: keep UI live
      }
    });
  });

  // Direct quantity input change on cart page
  $(document).on('input change', '.cart-item .qty-input', function () {
    // Skip modal input handler
    if ($(this).closest('#cart-modal').length) return;
    var $wrap = $(this).closest('[data-product-id]');
    var pid = parseInt($wrap.attr('data-product-id'), 10);
    var val = parseInt($(this).val(), 10);
    if (!val || val < 1) { val = 1; $(this).val(val); }
    updateItemLineTotal($wrap.closest('.cart-item'));
    $.post('/COFFEE_ST/public/api/cart.php?action=setQty', { product_id: pid, quantity: val })
      .done(function (resp) {
        if (resp && resp.success) {
          recalc(resp.summary);
          updateSelectedSummary();
        }
      });
  });

  $(document).on("click", ".remove-item", function () {
    if ($(this).closest("#cart-modal").length) return;
    var $wrap = $(this).closest("[data-product-id]");
    var pid = parseInt($wrap.attr("data-product-id"), 10);
    $.post("/COFFEE_ST/public/api/cart.php?action=remove", {
      product_id: pid,
    }).done(function (resp) {
      if (resp && resp.success) {
        recalc(resp.summary);
        // Remove top-level cart item block
        var $item = $wrap.closest(".cart-item");
        var wasChecked = $item.find(".item-select").prop("checked");
        $item.remove();
        // Update select-all state and summary
        var total = $(".item-select").length;
        var checked = $(".item-select:checked").length;
        $("#select-all").prop("checked", total > 0 && total === checked);
        updateSelectedSummary();
        setRemoveSelectedEnabled();
        // Also remove from persisted selection
        try {
          var store = JSON.parse(sessionStorage.getItem("cartSelectedIds") || "[]");
          var idx = store.indexOf(pid);
          if (idx >= 0) { store.splice(idx, 1); sessionStorage.setItem("cartSelectedIds", JSON.stringify(store)); }
        } catch (e) { }
      }
    });
  });

  $(document).on("click", "#proceed-checkout", function () {
    var selected = $(".item-select:checked").map(function () {
      var $item = $(this).closest(".cart-item");
      return parseInt($item.attr("data-product-id"), 10) || null;
    }).get().filter(function (x) { return x !== null; });
    if (!selected.length) {
      if (window.Toast && typeof window.Toast.error === 'function') {
        window.Toast.error('Please select at least one item to checkout.');
      } else {
        alert('Please select at least one item to checkout.');
      }
      return;
    }
    // Persist for navigation if needed
    try { sessionStorage.setItem("cartSelectedIds", JSON.stringify(selected)); } catch (e) { }
    // Navigate to checkout page for review with selection respected
    var qs = encodeURIComponent(selected.join(","));
    window.location.href = "/COFFEE_ST/public/pages/checkout.php?selected=" + qs;
  });

  $(document).on("user:login-success", function () {
    if (window.__queuedAddToCart) {
      var p = window.__queuedAddToCart;
      delete window.__queuedAddToCart;
      $.post("/COFFEE_ST/public/api/cart.php?action=add", p).done(
        function (resp) {
          if (resp && resp.success) updateCartCount(resp.summary.count || 0);
        },
      );
    }
  });

  // Selection handling on cart page
  $(document).on("change", "#select-all", function () {
    var checked = $(this).prop("checked");
    $(".item-select").prop("checked", checked);
    updateSelectedSummary();
    setRemoveSelectedEnabled();
    try {
      var ids = checked ? $(".cart-item").map(function () { return parseInt($(this).attr("data-product-id"), 10) || null; }).get().filter(Boolean) : [];
      sessionStorage.setItem("cartSelectedIds", JSON.stringify(ids));
    } catch (e) { }
  });

  $(document).on("change", ".item-select", function () {
    var total = $(".item-select").length;
    var checked = $(".item-select:checked").length;
    $("#select-all").prop("checked", total === checked);
    updateSelectedSummary();
    setRemoveSelectedEnabled();
    try {
      var store = JSON.parse(sessionStorage.getItem("cartSelectedIds") || "[]");
      var $item = $(this).closest(".cart-item");
      var pid = parseInt($item.attr("data-product-id"), 10) || null;
      if (pid !== null) {
        var idx = store.indexOf(pid);
        if ($(this).prop("checked")) {
          if (idx < 0) store.push(pid);
        } else {
          if (idx >= 0) store.splice(idx, 1);
        }
        sessionStorage.setItem("cartSelectedIds", JSON.stringify(store));
      }
    } catch (e) { }
  });

  // Restore selection from sessionStorage and recalc once on load
  try {
    var saved = JSON.parse(sessionStorage.getItem("cartSelectedIds") || "[]");
    if (Array.isArray(saved) && saved.length) {
      $(".cart-item").each(function () {
        var pid = parseInt($(this).attr("data-product-id"), 10) || null;
        if (pid !== null) {
          $(this).find(".item-select").prop("checked", saved.indexOf(pid) >= 0);
        }
      });
      var total = $(".item-select").length;
      var checked = $(".item-select:checked").length;
      $("#select-all").prop("checked", total > 0 && total === checked);
    }
  } catch (e) { }
  updateSelectedSummary();
  setRemoveSelectedEnabled();

  // Bulk remove selected items
  $(document).on('click', '#remove-selected', function () {
    var ids = $(".item-select:checked").map(function () {
      return parseInt($(this).closest('.cart-item').attr('data-product-id'), 10) || null;
    }).get().filter(function (x) { return x !== null; });
    if (!ids.length) {
      if (window.Toast && typeof window.Toast.error === 'function') {
        window.Toast.error('No items selected to remove.');
      }
      return;
    }
    var requests = [];
    var lastSummary = null;
    ids.forEach(function (pid) {
      requests.push($.post('/COFFEE_ST/public/api/cart.php?action=remove', { product_id: pid })
        .done(function (resp) { if (resp && resp.success) { lastSummary = resp.summary || lastSummary; } }));
    });
    $.when.apply($, requests).always(function () {
      // Remove items from DOM
      ids.forEach(function (pid) {
        $(".cart-item[data-product-id='" + pid + "']").remove();
      });
      // Update selection state and summary
      var total = $(".item-select").length;
      var checked = $(".item-select:checked").length;
      $("#select-all").prop("checked", total > 0 && total === checked);
      if (lastSummary) recalc(lastSummary);
      updateSelectedSummary();
      setRemoveSelectedEnabled();
      // Clean persisted selection
      try {
        var store = JSON.parse(sessionStorage.getItem('cartSelectedIds') || '[]');
        ids.forEach(function (pid) { var i = store.indexOf(pid); if (i >= 0) store.splice(i, 1); });
        sessionStorage.setItem('cartSelectedIds', JSON.stringify(store));
      } catch (e) { }
    });
  });

  // Display any queued toast message from sessionStorage (e.g., redirect from checkout)
  try {
    var toastMsg = sessionStorage.getItem('toastMessage');
    if (toastMsg) {
      sessionStorage.removeItem('toastMessage');
      if (window.Toast && typeof window.Toast.error === 'function') {
        window.Toast.error(toastMsg);
      } else {
        // Fallback alert if toast util not yet loaded
        alert(toastMsg);
      }
    }
  } catch (e) { }
});
