$(function(){
  function recalc(summary){
    if(!summary) return;
    var subtotal = summary.subtotal || 0;
    var delivery = parseFloat($('#summary-delivery').text()) || 0;
    var tax = Math.round(subtotal * 0.08 * 100)/100;
    $('#summary-subtotal').text(subtotal.toFixed(2));
    $('#summary-tax').text(tax.toFixed(2));
    $('#summary-total').text((subtotal + delivery + tax).toFixed(2));
    $('.cart-count').text(summary.count || 0);
  }

  $(document).on('click', '.increase-qty, .decrease-qty', function(){
    var $wrap = $(this).closest('[data-product-id]');
    var pid = parseInt($wrap.attr('data-product-id'), 10);
    var $input = $wrap.find('.qty-input');
    var q = parseInt($input.val(),10)||1;
    if($(this).hasClass('increase-qty')) q+=1; else q = Math.max(0, q-1);
    $input.val(q);
    $.post('/COFFEE_ST/public/api/cart.php?action=setQty', {product_id: pid, quantity: q})
      .done(function(resp){ if(resp && resp.success){ recalc(resp.summary); location.reload(); } });
  });

  $(document).on('click', '.remove-item', function(){
    var $wrap = $(this).closest('[data-product-id]');
    var pid = parseInt($wrap.attr('data-product-id'), 10);
    $.post('/COFFEE_ST/public/api/cart.php?action=remove', {product_id: pid})
      .done(function(resp){ if(resp && resp.success){ recalc(resp.summary); location.reload(); } });
  });

  $('#proceed-checkout').on('click', function(){
    window.location.href = '/COFFEE_ST/public/pages/checkout.php';
  });
});
