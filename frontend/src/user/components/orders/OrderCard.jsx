import { Package, Calendar, Clock, Truck, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const DEFAULT_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
  confirmed: {
    label: "Confirmed",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
  preparing: {
    label: "Preparing",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-800",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
  },
  delivered: {
    label: "Delivered",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  failed: { label: "Failed", bgColor: "bg-red-100", textColor: "text-red-800" },
  cancelled: {
    label: "Cancelled",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
  },
};

export default function OrderCard({ order, onViewDetails, statusConfig = DEFAULT_STATUS_CONFIG }) {
  const getStatusConfig = (status) => {
    return statusConfig[status] || statusConfig.pending || DEFAULT_STATUS_CONFIG.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "out_for_delivery":
        return <Truck className="h-4 w-4" />;
      case "failed":
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "preparing":
      case "confirmed":
        return <Package className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getItemsSummary = () => {
    if (!order.items || order.items.length === 0) return "No items";

    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const firstTwo = order.items.slice(0, 2);

    const summary = firstTwo.map((item) => `${item.quantity}x ${item.product_name}`).join(", ");

    const remaining = order.items.length - 2;

    if (remaining > 0) {
      return `${summary} + ${remaining} more`;
    }

    return summary;
  };

  const getPaymentMethodLabel = (method) => {
    return method === "cash" ? "Cash on Delivery" : "GCash";
  };

  const config = getStatusConfig(order.status);
  const isActive = ["pending", "confirmed", "preparing", "out_for_delivery"].includes(order.status);

  return (
    <div className={`rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-900/5 transition-shadow hover:shadow-xl sm:rounded-3xl sm:p-6 ${isActive ? "border-l-4 border-l-[#30442B]" : ""}`}>
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3 sm:mb-4 sm:gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-2 sm:mb-2 sm:gap-3">
            <Package className="h-4 w-4 text-[#30442B] sm:h-5 sm:w-5" />
            <h3 className="font-outfit text-base font-semibold text-gray-900 sm:text-lg">{order.order_number}</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600 sm:gap-2 sm:text-sm">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{formatOrderDate(order.created_at)}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 sm:mt-1 sm:gap-2 sm:text-sm">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{getRelativeTime(order.created_at)}</span>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold tracking-wide uppercase sm:gap-1.5 sm:px-3 sm:py-1.5 ${config.bgColor} ${config.textColor}`}>
          {getStatusIcon(order.status)}
          <span className="hidden sm:inline">{config.label}</span>
        </span>
      </div>

      {/* Progress indicator for active orders */}
      {isActive && (
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center gap-1">
            {["pending", "confirmed", "preparing", "out_for_delivery"].map((status, index) => {
              const statusOrder = ["pending", "confirmed", "preparing", "out_for_delivery"];
              const currentIndex = statusOrder.indexOf(order.status);
              const isCompleted = index <= currentIndex;
              const isCurrent = status === order.status;

              return (
                <div key={status} className="flex flex-1 items-center">
                  <div className={`h-1 w-full rounded-full transition-colors sm:h-1.5 ${isCompleted ? "bg-[#30442B]" : "bg-gray-200"}`} />
                </div>
              );
            })}
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span className="hidden sm:inline">Placed</span>
            <span className="sm:hidden">📝</span>
            <span className="hidden sm:inline">Confirmed</span>
            <span className="sm:hidden">✓</span>
            <span className="hidden sm:inline">Preparing</span>
            <span className="sm:hidden">🍳</span>
            <span className="hidden sm:inline">Delivery</span>
            <span className="sm:hidden">🚗</span>
          </div>
        </div>
      )}

      {/* Items Summary */}
      <div className="mb-3 rounded-lg bg-gray-50 p-3 sm:mb-4 sm:rounded-xl sm:p-4">
        <p className="mb-0.5 text-xs font-medium text-gray-700 sm:mb-1 sm:text-sm">Order Items</p>
        <p className="line-clamp-2 text-sm text-gray-900 sm:text-base">{getItemsSummary()}</p>
        <p className="mt-1 text-xs text-gray-500">Payment: {getPaymentMethodLabel(order.payment_method)}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 sm:pt-4">
        <div>
          <p className="mb-0.5 text-xs text-gray-600 sm:mb-1 sm:text-sm">Total Amount</p>
          <p className="text-xl font-bold text-[#30442B] sm:text-2xl">₱{Number(order.total || order.total_amount || 0).toFixed(2)}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(order)}
            className="rounded-lg bg-[#30442B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#405939] active:scale-95 sm:px-6 sm:py-2.5 sm:text-base"
          >
            {isActive ? "Track" : "Details"}
          </button>
        </div>
      </div>
    </div>
  );
}
