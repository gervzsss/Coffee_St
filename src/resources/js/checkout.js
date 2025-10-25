$(function () {
  // On load: ensure selections exist; if not (and not single mode), redirect to cart with toast
  (function enforceSelectionOrRedirect() {
    try {
      var params = new URLSearchParams(window.location.search);
      var hasSingle = params.has('single') && !!parseInt(params.get('single'), 10);
      var selectedParam = params.get('selected') || '';
      var selectedIds = [];
      if (selectedParam) {
        selectedIds = selectedParam.split(',').map(function (s) { return parseInt(s, 10) || null; }).filter(function (x) { return x !== null; });
      }
      // Persist selection to sessionStorage so Back to Cart can restore
      if (selectedIds.length) {
        sessionStorage.setItem('cartSelectedIds', JSON.stringify(selectedIds));
      }
      if (!hasSingle && (!selectedIds.length)) {
        // No selection context — redirect to cart with toast
        sessionStorage.setItem('toastMessage', 'Please select items to checkout.');
        window.location.href = '/COFFEE_ST/public/pages/cart.php';
      }
    } catch (e) { /* ignore */ }
  })();

  // --- Live quantity, line total, and summary updates ---
  function clampQty(val) {
    val = parseInt(val, 10);
    if (isNaN(val) || val < 1) return 1;
    return val;
  }

  function formatMoney(n) {
    var num = parseFloat(n || 0) || 0;
    return num.toFixed(2);
  }

  function recalcItem($li) {
    var unit = parseFloat($li.attr('data-unit-price')) || 0;
    var delta = parseFloat($li.attr('data-price-delta')) || 0;
    var qty = clampQty($li.find('.qty-input').val());
    var line = (unit + delta) * qty;
    $li.find('.line-total').text('₱' + formatMoney(line));
    return line;
  }

  function recalcSummary() {
    var subtotal = 0;
    $('.ci-item').each(function () { subtotal += recalcItem($(this)); });
    var $sum = $('#checkout-summary');
    var delivery = parseFloat($sum.data('deliveryFee')) || 0;
    var taxRate = parseFloat($sum.data('taxRate'));
    if (!(taxRate >= 0)) taxRate = 0.08; // default
    var tax = Math.round(subtotal * taxRate * 100) / 100;
    $('#summary-subtotal').text(formatMoney(subtotal));
    $('#summary-tax').text(formatMoney(tax));
    $('#summary-total').text(formatMoney(subtotal + delivery + tax));
  }

  // Increase / Decrease buttons
  $(document).on('click', '.ci-increase, .ci-decrease', function () {
    var $li = $(this).closest('.ci-item');
    var $input = $li.find('.qty-input');
    var q = clampQty($input.val());
    q = $(this).hasClass('ci-increase') ? q + 1 : Math.max(1, q - 1);
    $input.val(q);
    // Persist to backend
    var pid = parseInt($li.attr('data-product-id'), 10);
    $.post('/COFFEE_ST/public/api/cart.php?action=setQty', { product_id: pid, quantity: q });
    recalcSummary();
  });

  // Manual input change
  $(document).on('input change', '.qty-input', function () {
    var $li = $(this).closest('.ci-item');
    var q = clampQty($(this).val());
    $(this).val(q);
    var pid = parseInt($li.attr('data-product-id'), 10);
    $.post('/COFFEE_ST/public/api/cart.php?action=setQty', { product_id: pid, quantity: q });
    recalcSummary();
  });

  // --- Select All + Bulk remove ---
  function syncRemoveButtonState() {
    var anyChecked = $('.ci-select:checked').length > 0;
    $('#ci-remove-selected').prop('disabled', !anyChecked);
  }

  $(document).on('change', '#ci-select-all', function () {
    var checked = $(this).prop('checked');
    $('.ci-select').prop('checked', checked);
    syncRemoveButtonState();
  });

  $(document).on('change', '.ci-select', function () {
    var total = $('.ci-select').length;
    var checked = $('.ci-select:checked').length;
    $('#ci-select-all').prop('checked', total > 0 && total === checked);
    syncRemoveButtonState();
  });

  $(document).on('click', '#ci-remove-selected', function () {
    var ids = $('.ci-select:checked').map(function () {
      var $li = $(this).closest('.ci-item');
      return parseInt($li.attr('data-product-id'), 10) || null;
    }).get().filter(function (x) { return x !== null; });
    if (!ids.length) return;
    var reqs = [];
    $.each(ids, function (_, pid) {
      reqs.push($.post('/COFFEE_ST/public/api/cart.php?action=remove', { product_id: pid }));
    });
    $.when.apply($, reqs).always(function () {
      // Remove from DOM
      $('.ci-select:checked').each(function () { $(this).closest('.ci-item').remove(); });
      recalcSummary();
      syncRemoveButtonState();
      // If no items left, show empty state or navigate to cart
      if (!$('.ci-item').length) {
        if (window.Toast && Toast.success) Toast.success('All items removed.');
        setTimeout(function () { window.location.href = '/COFFEE_ST/public/pages/cart.php'; }, 400);
      }
    });
  });

  // Initial compute
  recalcSummary();

  $(document).on('click', '#place-order', function () {
    var $btn = $(this).prop('disabled', true);
    $('#place-order-status').removeClass('hidden').text('Processing your order...');

    var deliveryFee = parseFloat($btn.data('deliveryFee')) || 0;
    var tax = parseFloat($btn.data('tax')) || 0;
    var singleId = parseInt($btn.data('singleProductId'), 10);
    var selectedCsv = ($btn.data('selected') || '').toString();
    if (isNaN(singleId)) singleId = null;

    var payload = { delivery_fee: deliveryFee, tax: tax };
    if (singleId) {
      payload.single_product_id = singleId;
    }
    if (selectedCsv && selectedCsv.length) {
      var ids = selectedCsv.split(',').map(function (s) { return parseInt(s, 10) || null; }).filter(function (x) { return x !== null; });
      if (ids.length) {
        payload.selected_product_ids = JSON.stringify(ids);
      }
    }

    $.post('/COFFEE_ST/public/api/checkout.php', payload)
      .done(function (resp) {
        if (resp && resp.success && resp.order_id) {
          $('#place-order-status').text('Order placed! Redirecting...');
          setTimeout(function () {
            window.location.href = '/COFFEE_ST/public/pages/order-view.php?id=' + resp.order_id;
          }, 800);
        } else {
          $('#place-order-status').text('Unable to place order.');
          $btn.prop('disabled', false);
        }
      })
      .fail(function () {
        $('#place-order-status').text('Checkout failed. Please try again.');
        $btn.prop('disabled', false);
      });
  });
});
