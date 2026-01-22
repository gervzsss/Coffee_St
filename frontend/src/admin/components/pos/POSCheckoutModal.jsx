import { useState } from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import { ButtonSpinner } from "../common";

export default function POSCheckoutModal({ isOpen, onClose, subtotal, total, itemCount, onSubmit, isSubmitting }) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      paymentMethod,
      customerName: customerName.trim() || null,
      customerPhone: customerPhone.trim() || null,
      notes: notes.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 bg-emerald-600 px-6 py-4">
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
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
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
