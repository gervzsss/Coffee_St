import { formatCurrency } from "../../utils/formatCurrency";

export default function CloseShiftResultModal({ isOpen, onClose, result }) {
  if (!isOpen || !result) return null;

  const { shift } = result;
  const isShort = shift.variance < 0;
  const isOver = shift.variance > 0;
  const isBalanced = shift.variance === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className={`px-6 py-6 ${isBalanced ? "bg-emerald-600" : shift.is_discrepant ? "bg-amber-500" : "bg-emerald-600"}`}>
          <div className="flex flex-col items-center text-center">
            <div className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full ${isBalanced ? "bg-white/20" : shift.is_discrepant ? "bg-white/30" : "bg-white/20"}`}>
              {isBalanced ? (
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white">Shift Closed</h2>
            <p className="mt-1 text-white/90">{isBalanced ? "Cash balanced perfectly!" : isShort ? "Cash shortage detected" : "Cash overage detected"}</p>
          </div>
        </div>

        <div className="p-6">
          {/* Variance Display */}
          <div className={`mb-6 rounded-xl p-4 text-center ${isBalanced ? "bg-emerald-50" : isShort ? "bg-red-50" : "bg-amber-50"}`}>
            <p className="text-sm font-medium text-gray-600">Variance</p>
            <p className={`text-3xl font-bold ${isBalanced ? "text-emerald-600" : isShort ? "text-red-600" : "text-amber-600"}`}>
              {isShort ? "-" : isOver ? "+" : ""}
              {formatCurrency(Math.abs(shift.variance))}
            </p>
            {shift.is_discrepant && <p className={`mt-1 text-sm ${isShort ? "text-red-600" : "text-amber-600"}`}>⚠️ Discrepancy flagged for review</p>}
          </div>

          {/* Reconciliation Details */}
          <div className="space-y-3 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Opening Float</span>
              <span className="font-medium text-gray-900">{formatCurrency(shift.opening_cash_float)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">+ Cash Sales</span>
              <span className="font-medium text-emerald-600">{formatCurrency(shift.cash_sales_total)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-sm">
              <span className="font-medium text-gray-700">Expected Cash</span>
              <span className="font-semibold text-gray-900">{formatCurrency(shift.expected_cash)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Actual Count</span>
              <span className="font-semibold text-gray-900">{formatCurrency(shift.actual_cash_count)}</span>
            </div>
          </div>

          {/* Sales Summary */}
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">GCash Sales</span>
              <span className="font-medium text-blue-600">{formatCurrency(shift.ewallet_sales_total)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="font-medium text-gray-700">Total Sales</span>
              <span className="font-bold text-gray-900">{formatCurrency(shift.gross_sales_total)}</span>
            </div>
          </div>

          {/* Notes */}
          {shift.notes && (
            <div className="mt-4 rounded-lg bg-gray-100 p-3">
              <p className="text-xs font-medium text-gray-500">Notes</p>
              <p className="mt-1 text-sm text-gray-700">{shift.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button onClick={onClose} className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
