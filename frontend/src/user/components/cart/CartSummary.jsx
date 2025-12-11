export default function CartSummary({ selectedCount, subtotal, tax, taxRate, total, onCheckout, disabled = false }) {
  return (
    <div className="sticky top-24 space-y-3 rounded-lg border bg-white p-4 shadow-sm sm:top-28 sm:space-y-4 sm:p-5 lg:p-6">
      <div>
        <h2 className="text-base font-semibold text-[#30442B] sm:text-lg">Order Summary</h2>
        <p className="text-xs text-neutral-500 sm:text-sm">{selectedCount === 0 ? "No items selected." : `${selectedCount} item${selectedCount > 1 ? "s" : ""} selected.`}</p>
      </div>
      <dl className="space-y-2 text-xs text-neutral-700 sm:text-sm">
        <div className="flex justify-between border-b border-neutral-100 py-1.5 sm:py-2">
          <dt>Subtotal</dt>
          <dd>₱{subtotal.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between border-b border-neutral-100 py-1.5 sm:py-2">
          <dt>Tax ({taxRate}%)</dt>
          <dd>₱{tax.toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between pt-1.5 text-base font-semibold text-[#30442B] sm:pt-2 sm:text-lg">
          <dt>Total</dt>
          <dd>₱{total.toFixed(2)}</dd>
        </div>
      </dl>
      <button
        onClick={onCheckout}
        disabled={disabled}
        className={`w-full rounded-lg py-2.5 text-sm transition-colors sm:py-3 sm:text-base ${
          disabled ? "cursor-not-allowed bg-gray-300 text-gray-500" : "cursor-pointer bg-[#30442B] text-white hover:bg-[#405939]"
        }`}
      >
        Proceed to Checkout
      </button>
      <p className="text-center text-xs text-neutral-500">Estimated delivery: 25-35 minutes</p>
    </div>
  );
}
