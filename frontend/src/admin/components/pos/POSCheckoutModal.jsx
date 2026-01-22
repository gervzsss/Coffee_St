import { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import { ButtonSpinner } from "../common";

const DISCOUNT_PRESETS = [
  { label: "Senior/PWD 20%", value: 20 },
  { label: "Employee 10%", value: 10 },
  { label: "Custom", value: null },
];

export default function POSCheckoutModal({ isOpen, onClose, subtotal, itemCount, onSubmit, isSubmitting }) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountReason, setDiscountReason] = useState("");
  const [showCustomDiscount, setShowCustomDiscount] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentMethod("cash");
      setCustomerName("");
      setCustomerPhone("");
      setNotes("");
      setDiscountPercent(0);
      setDiscountReason("");
      setShowCustomDiscount(false);
    }
  }, [isOpen]);

  // Calculate discount and total
  const { discountAmount, total } = useMemo(() => {
    const discount = discountPercent > 0 ? Math.round(((subtotal * discountPercent) / 100) * 100) / 100 : 0;
    return {
      discountAmount: discount,
      total: subtotal - discount,
    };
  }, [subtotal, discountPercent]);

  if (!isOpen) return null;

  const handlePresetClick = (preset) => {
    if (preset.value === null) {
      setShowCustomDiscount(true);
    } else {
      setDiscountPercent(preset.value);
      setDiscountReason(preset.label);
      setShowCustomDiscount(false);
    }
  };

  const handleCustomDiscountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDiscountPercent(Math.min(100, Math.max(0, value)));
  };

  const handleClearDiscount = () => {
    setDiscountPercent(0);
    setDiscountReason("");
    setShowCustomDiscount(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      paymentMethod,
      customerName: customerName.trim() || null,
      customerPhone: customerPhone.trim() || null,
      notes: notes.trim() || null,
      discountPercent: discountPercent > 0 ? discountPercent : null,
      discountReason: discountPercent > 0 ? discountReason.trim() || `${discountPercent}% discount` : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-emerald-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Complete Order</h2>
              <p className="text-sm text-emerald-100">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </p>
            </div>
            <button onClick={onClose} disabled={isSubmitting} className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-50">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Content */}
          <div className="p-6">
            {/* Payment Method */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Payment Method *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-medium transition-all ${
                    paymentMethod === "cash" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Cash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("gcash")}
                  className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-medium transition-all ${
                    paymentMethod === "gcash" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  GCash
                </button>
              </div>
            </div>

            {/* Discount Section */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Discount (Optional)</label>

              {/* Preset Buttons */}
              <div className="mb-3 grid grid-cols-3 gap-2">
                {DISCOUNT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={`rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all ${
                      (preset.value === discountPercent && discountReason === preset.label) || (preset.value === null && showCustomDiscount)
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Discount Input */}
              {showCustomDiscount && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={discountPercent || ""}
                        onChange={handleCustomDiscountChange}
                        placeholder="0"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-8 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                      />
                      <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                    placeholder="Reason for discount (optional)"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                  />
                </div>
              )}

              {/* Applied Discount Display */}
              {discountPercent > 0 && !showCustomDiscount && (
                <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2">
                  <span className="text-sm font-medium text-amber-800">{discountReason || `${discountPercent}% discount`} applied</span>
                  <button type="button" onClick={handleClearDiscount} className="rounded p-1 text-amber-600 hover:bg-amber-100">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Customer Info (Optional) */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">Customer Name (Optional)</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g., John Doe"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g., 09123456789"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests..."
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer with Totals */}
          <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-amber-600">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2 text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-emerald-600 py-3.5 text-base font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <ButtonSpinner />
                  Processing...
                </span>
              ) : (
                `Confirm Payment - ${formatCurrency(total)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
