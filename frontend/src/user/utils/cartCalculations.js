const TAX_RATE = 0.12; // 12% tax

export function calculateSelectedSubtotal(cartItems, selectedItems) {
  return cartItems
    .filter((item) => selectedItems.has(item.id))
    .reduce((total, item) => total + (item.line_total || 0), 0);
}

export function calculateTax(cartItems, selectedItems) {
  return calculateSelectedSubtotal(cartItems, selectedItems) * TAX_RATE;
}

export function calculateTotal(cartItems, selectedItems) {
  return calculateSelectedSubtotal(cartItems, selectedItems) + calculateTax(cartItems, selectedItems);
}

export function getTaxRatePercentage() {
  return (TAX_RATE * 100).toFixed(0);
}
