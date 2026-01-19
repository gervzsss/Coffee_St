import { Eye, RotateCcw } from "lucide-react";
import { STATUS_CONFIG } from "../../constants/orderStatus";

export default function OrderTable({ orders, onViewDetails, onRestore }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">Order</th>
            <th className="hidden px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:table-cell sm:px-6 sm:py-4">Date</th>
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">Status</th>
            <th className="hidden px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:table-cell sm:px-6 sm:py-4">Total</th>
            <th className="hidden px-3 py-3 text-center text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4 md:table-cell">Items</th>
            <th className="px-3 py-3 text-center text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const itemsCount = order.items_count || order.items?.length || 0;

            return (
              <tr key={order.id} className="transition-colors hover:bg-gray-50">
                <td className="px-3 py-3 sm:px-6 sm:py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 sm:text-base">{order.order_number}</p>
                    <p className="truncate text-xs text-gray-500 sm:text-sm">{order.customer?.name || "Unknown"}</p>
                  </div>
                </td>
                <td className="hidden px-3 py-3 sm:table-cell sm:px-6 sm:py-4">
                  <div>
                    <p className="text-sm text-gray-900">{formatDate(order.created_at)}</p>
                    {order.time_ago && <p className="text-xs text-gray-500">{order.time_ago}</p>}
                  </div>
                </td>
                <td className="px-3 py-3 sm:px-6 sm:py-4">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>{statusConfig.label}</span>
                </td>
                <td className="hidden px-3 py-3 sm:table-cell sm:px-6 sm:py-4">
                  <p className="font-medium text-gray-900">₱{Number(order.total || 0).toFixed(2)}</p>
                </td>
                <td className="hidden px-3 py-3 text-center sm:px-6 sm:py-4 md:table-cell">
                  <span className="text-sm text-gray-900">{itemsCount}</span>
                </td>
                <td className="px-3 py-3 sm:px-6 sm:py-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onViewDetails(order.id)} className="rounded-lg p-2 text-[#30442B] transition-colors hover:bg-gray-100" title="View Details" aria-label="View order details">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onRestore(order.id, order.order_number, "unarchive")}
                      className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50"
                      title="Restore Order"
                      aria-label="Restore order"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
