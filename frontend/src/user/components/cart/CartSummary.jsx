export default function CartSummary({
  selectedCount,
  subtotal,
  tax,
  taxRate,
  total,
  onCheckout,
  disabled = false,
}) {
  return (
    <div className="rounded-lg border bg-white p-4 sm:p-5 lg:p-6 shadow-sm sticky top-24 sm:top-28 space-y-3 sm:space-y-4">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-[#30442B]">
          Order Summary
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500">
          {selectedCount === 0
            ? 'No items selected.'
            : `${selectedCount} item${selectedCount > 1 ? 's' : ''} selected.`}
        </p>
      </div>
      <dl className="space-y-2 text-xs sm:text-sm text-neutral-700">
        <div className="flex justify-between py-1.5 sm:py-2 border-b border-neutral-100">
          <dt>Subtotal</dt>
          <dd>₱{subtotal.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between py-1.5 sm:py-2 border-b border-neutral-100">
          <dt>Tax ({taxRate}%)</dt>
          <dd>₱{tax.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between items-center text-base sm:text-lg font-semibold text-[#30442B] pt-1.5 sm:pt-2">
          <dt>Total</dt>
          <dd>₱{total.toFixed(2)}</dd>
        </div>
      </dl>
      <button
        onClick={onCheckout}
        disabled={disabled}
        className={`w-full py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-colors ${
          disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#30442B] cursor-pointer text-white hover:bg-[#405939]'
        }`}
      >
        Proceed to Checkout
      </button>
      <p className="text-xs text-neutral-500 text-center">
        Estimated delivery: 25-35 minutes
      </p>
    </div>
  );
}
