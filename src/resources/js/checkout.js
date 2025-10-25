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
