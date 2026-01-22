export default function OrderSummaryCheckout({ items, deliveryFee = 50, onConfirmCheckout, disabled = false, loading = false }) {
  const subtotal = items.reduce((sum, item) => sum + (item.line_total || 0), 0);
  const total = subtotal + deliveryFee;

  return (
    <div className="sticky top-24 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-900/5 sm:top-28 sm:rounded-3xl sm:p-6">
      <h2 className="font-outfit mb-3 text-base font-semibold text-gray-900 sm:mb-4 sm:text-lg">Order Summary</h2>

      <div className="space-y-2 text-xs sm:space-y-3 sm:text-sm">
        {/* Items Count */}
        <div className="flex justify-between text-gray-600">
          <span>Items ({items.length})</span>
          <span>₱{subtotal.toFixed(2)}</span>
        </div>

        {/* Delivery Fee */}
        <div className="flex justify-between border-b border-gray-200 pb-2 text-gray-600 sm:pb-3">
          <span>Delivery Fee</span>
          <span>₱{deliveryFee.toFixed(2)}</span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-1.5 text-base font-bold text-[#30442B] sm:pt-2 sm:text-lg">
          <span>Total</span>
          <span>₱{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirmCheckout}
        disabled={disabled || loading}
        className={`mt-4 w-full rounded-lg py-2.5 text-sm font-semibold transition-all sm:mt-6 sm:py-3.5 sm:text-base ${
          disabled || loading ? "cursor-not-allowed bg-gray-300 text-gray-500" : "bg-[#30442B] text-white hover:bg-[#405939] active:scale-[0.98]"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin sm:h-5 sm:w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          "Confirm Checkout"
        )}
      </button>

      {/* Estimated Delivery */}
      <p className="mt-3 text-center text-xs text-gray-500 sm:mt-4">Estimated delivery: 25-35 minutes</p>

      {/* Security Note */}
      <div className="mt-3 rounded-lg bg-gray-50 p-2 sm:mt-4 sm:p-3">
        <p className="text-center text-xs text-gray-600">🔒 Your information is secure and encrypted</p>
      </div>
    </div>
  );
}
