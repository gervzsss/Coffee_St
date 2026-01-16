import { Archive, RotateCcw, Eye } from "lucide-react";
import { STATUS_CONFIG } from "../../constants/orderStatus";
import StatusDropdown from "./StatusDropdown";

export default function OrderCard({ order, onViewDetails, onQuickStatusChange, onArchive, viewMode }) {
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  const getEstimatedPrepTime = () => {
    const itemCount = order.items_count || order.items?.length || 0;
    const minutes = itemCount * 5 + 10;
    return `~${minutes} min prep`;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-lg sm:p-5 lg:p-6">
      {/* Header Row */}
      <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:mb-4 sm:flex-row sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h3 className="text-base font-bold text-gray-900 sm:text-lg">{order.order_number}</h3>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>{statusConfig.label}</span>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-800 sm:text-2xl">₱{Number(order.total || 0).toFixed(2)}</div>
          <div className="text-xs text-gray-500 sm:text-sm">{order.items_count || order.items?.length || 0} items</div>
        </div>
      </div>

      {/* Customer & Order Info */}
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-600 sm:mb-4 sm:gap-x-4 sm:gap-y-2 sm:text-sm">
        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{order.customer?.name || "Unknown"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{order.time_ago || new Date(order.created_at).toLocaleDateString()}</span>
        </div>
        {order.status === "pending" && (
          <div className="flex items-center gap-1.5 text-orange-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{getEstimatedPrepTime()}</span>
          </div>
        )}
      </div>

      {/* Address */}
      <div className="mb-3 flex items-start gap-1.5 text-xs text-gray-600 sm:mb-4 sm:text-sm">
        <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{order.delivery_address || "No address provided"}</span>
      </div>

      {/* Order Items with Variants */}
      {order.items && order.items.length > 0 && (
        <div className="mb-3 overflow-hidden rounded-lg border border-gray-200 sm:mb-4">
          <div className="border-b border-gray-200 bg-gray-50 px-3 py-1.5 sm:px-4 sm:py-2">
            <span className="text-xs font-medium text-gray-700 sm:text-sm">Order Items</span>
          </div>
          <div className="divide-y divide-gray-100">
            {order.items.map((item, index) => (
              <div key={index} className="px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {item.quantity}x {item.product_name}
                    </p>
                    {item.variants && item.variants.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {item.variants.map((v, i) => (
                          <p key={i} className="flex items-center gap-1 text-sm text-gray-500">
                            <span className="text-orange-500">+</span>
                            <span className="text-gray-400">{v.group_name}:</span>
                            <span className="text-gray-600">{v.name}</span>
                            {v.price_delta > 0 && <span className="text-xs text-gray-400">(+₱{Number(v.price_delta).toFixed(2)})</span>}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">₱{Number(item.line_total).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 sm:mb-4 sm:px-4 sm:py-3">
          <p className="text-xs text-amber-800 sm:text-sm">
            <span className="font-medium">📝 Note:</span> {order.notes}
          </p>
        </div>
      )}

      {/* Status Dropdown */}
      <StatusDropdown order={order} onStatusChange={onQuickStatusChange} />

      {/* Action Buttons */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onViewDetails(order.id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#30442B] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3d5637]"
        >
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </button>
        {onArchive &&
          (viewMode === "archived" ? (
            <button
              onClick={() => onArchive(order.id, order.order_number, "unarchive")}
              className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Restore</span>
            </button>
          ) : order.can_archive ? (
            <button
              onClick={() => onArchive(order.id, order.order_number, "archive")}
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
            >
              <Archive className="h-4 w-4" />
              <span className="hidden sm:inline">Archive</span>
            </button>
          ) : null)}
      </div>
    </div>
  );
}
