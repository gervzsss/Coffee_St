export default function OrderSummaryCheckout({
  items,
  deliveryFee = 50,
  taxRate = 0.12,
  onConfirmCheckout,
  disabled = false,
  loading = false,
}) {
  const subtotal = items.reduce((sum, item) => sum + (item.line_total || 0), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax + deliveryFee;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 sticky top-28">
      <h2 className="font-outfit text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        {/* Items Count */}
        <div className="flex justify-between text-gray-600">
          <span>Items ({items.length})</span>
          <span>₱{subtotal.toFixed(2)}</span>
        </div>

        {/* Delivery Fee */}
        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span>₱{deliveryFee.toFixed(2)}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-gray-600 pb-3 border-b border-gray-200">
          <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
          <span>₱{tax.toFixed(2)}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center text-lg font-bold text-[#30442B] pt-2">
          <span>Total</span>
          <span>₱{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirmCheckout}
        disabled={disabled || loading}
        className={`mt-6 w-full py-3.5 rounded-lg font-semibold transition-all ${
          disabled || loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#30442B] text-white hover:bg-[#405939] active:scale-[0.98]'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          'Confirm Checkout'
        )}
      </button>

      {/* Estimated Delivery */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Estimated delivery: 25-35 minutes
      </p>

      {/* Security Note */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          🔒 Your information is secure and encrypted
        </p>
      </div>
    </div>
  );
}
