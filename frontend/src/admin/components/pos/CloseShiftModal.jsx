import { useState } from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import { ButtonSpinner } from "../common";

export default function CloseShiftModal({ isOpen, onClose, shift, onCloseShift, isSubmitting, inFlightOrders }) {
  const [actualCashCount, setActualCashCount] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !shift) return null;

  const hasInFlightOrders = inFlightOrders && inFlightOrders.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const cashValue = parseFloat(actualCashCount);
    if (isNaN(cashValue) || cashValue < 0) {
      setError("Please enter a valid cash count (0 or greater)");
      return;
    }

    onCloseShift(cashValue, notes.trim() || null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-linear-to-r from-slate-700 to-slate-800 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Close Shift</h2>
                <p className="text-sm text-slate-300">Count your cash drawer</p>
              </div>
            </div>
            <button onClick={onClose} disabled={isSubmitting} className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-50">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {hasInFlightOrders ? (
          /* In-Flight Orders Warning */
          <div className="p-6">
            <div className="rounded-lg bg-red-50 p-4 ring-1 ring-red-200">
              <div className="flex gap-3">
                <svg className="h-5 w-5 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-red-800">Cannot close shift</p>
                  <p className="mt-1 text-sm text-red-700">There are {inFlightOrders.length} order(s) still in progress. Complete or cancel all orders before closing the shift.</p>
                </div>
              </div>
            </div>

            <div className="mt-4 max-h-48 overflow-y-auto rounded-lg border border-gray-200">
              {inFlightOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-gray-100 p-3 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{order.order_number}</p>
                    <p className="text-sm text-gray-500 capitalize">{order.status}</p>
                  </div>
                  <span className="font-medium text-gray-900">{formatCurrency(order.total)}</span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button onClick={onClose} className="w-full rounded-lg bg-gray-100 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200">
                Go Back to Complete Orders
              </button>
            </div>
          </div>
        ) : (
          /* Cash Count Form */
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {/* Shift Summary */}
              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-medium text-gray-700">Current Shift Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Opening Float</span>
                    <span className="font-medium text-gray-900">{formatCurrency(shift.opening_cash_float)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cash Sales</span>
                    <span className="font-medium text-emerald-600">+{formatCurrency(shift.cash_sales_total || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GCash Sales</span>
                    <span className="font-medium text-blue-600">{formatCurrency(shift.ewallet_sales_total || 0)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-600">Total Sales</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(shift.gross_sales_total || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Blind Count Info */}
              <div className="mb-4 rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200">
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Blind count:</span> Enter the physical cash in your drawer. The expected amount will be revealed after submission.
                </p>
              </div>

              {/* Cash Count Input */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Counted Cash Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 font-medium text-gray-500">₱</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={actualCashCount}
                    onChange={(e) => setActualCashCount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 text-lg font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                    autoFocus
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              {/* Notes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes about this shift close..."
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-white py-3 font-medium text-gray-700 ring-1 ring-gray-300 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !actualCashCount}
                  className="flex-1 rounded-lg bg-slate-700 py-3 font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <ButtonSpinner />
                      Closing...
                    </span>
                  ) : (
                    "Close Shift"
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
