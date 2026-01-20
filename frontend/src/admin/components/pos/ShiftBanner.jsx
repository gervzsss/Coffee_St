import { formatCurrency } from "../../utils/formatCurrency";

export default function ShiftBanner({ shift, onCloseShift }) {
  if (!shift) return null;

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="mb-4 flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-emerald-800">Shift Active</span>
            <span className="text-xs text-emerald-600">• Started {formatTime(shift.opened_at)}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-emerald-700">
            <span>Float: {formatCurrency(shift.opening_cash_float)}</span>
            <span>•</span>
            <span className="text-emerald-500">({shift.orders_count || 0} orders)</span>
          </div>
        </div>
      </div>
      <button onClick={onCloseShift} className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-300 transition-colors hover:bg-slate-50">
        Close Shift
      </button>
    </div>
  );
}
