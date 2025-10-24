$(function () {
  $(document).on('click', '#place-order', function () {
    var $btn = $(this).prop('disabled', true);
    $('#place-order-status').removeClass('hidden').text('Processing your order...');

    var deliveryFee = parseFloat($btn.data('deliveryFee')) || 0;
    var tax = parseFloat($btn.data('tax')) || 0;
    var singleId = parseInt($btn.data('singleProductId'), 10);
    if (isNaN(singleId)) singleId = null;

    var payload = { delivery_fee: deliveryFee, tax: tax };
    if (singleId) {
      payload.single_product_id = singleId;
    }

    $.post('/COFFEE_ST/public/api/checkout.php', payload)
      .done(function (resp) {
        if (resp && resp.success) {
          $('#place-order-status').text('Order placed! Redirecting...');
          setTimeout(function () {
            window.location.href = '/COFFEE_ST/public/pages/orders.php';
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
