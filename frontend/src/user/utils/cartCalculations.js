export function calculateSelectedSubtotal(cartItems, selectedItems) {
  return cartItems
    .filter((item) => selectedItems.has(item.id))
    .reduce((total, item) => total + (item.line_total || 0), 0);
}

export function calculateTotal(cartItems, selectedItems) {
  return calculateSelectedSubtotal(cartItems, selectedItems);
}
