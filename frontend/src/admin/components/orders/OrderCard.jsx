import { STATUS_CONFIG } from '../../constants/orderStatus';
import StatusDropdown from './StatusDropdown';

export default function OrderCard({
  order,
  onViewDetails,
  onQuickStatusChange,
}) {
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  const getEstimatedPrepTime = () => {
    const itemCount = order.items_count || order.items?.length || 0;
    const minutes = itemCount * 5 + 10;
    return `~${minutes} min prep`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-bold text-lg text-gray-900">
            {order.order_number}
          </h3>
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}
          >
            {statusConfig.label}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">
            ₱{Number(order.total || 0).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            {order.items_count || order.items?.length || 0} items
          </div>
        </div>
      </div>

      {/* Customer & Order Info */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1.5">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>{order.customer?.name || 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            {order.time_ago || new Date(order.created_at).toLocaleDateString()}
          </span>
        </div>
        {order.status === 'pending' && (
          <div className="flex items-center gap-1.5 text-orange-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{getEstimatedPrepTime()}</span>
          </div>
        )}
      </div>

      {/* Address */}
      <div className="flex items-start gap-1.5 text-sm text-gray-600 mb-4">
        <svg
          className="w-4 h-4 text-gray-400 mt-0.5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>{order.delivery_address || 'No address provided'}</span>
      </div>

      {/* Order Items with Variants */}
      {order.items && order.items.length > 0 && (
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              Order Items
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {order.items.map((item, index) => (
              <div key={index} className="px-4 py-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {item.quantity}x {item.product_name}
                    </p>
                    {item.variants && item.variants.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {item.variants.map((v, i) => (
                          <p
                            key={i}
                            className="text-sm text-gray-500 flex items-center gap-1"
                          >
                            <span className="text-orange-500">+</span>
                            <span className="text-gray-400">
                              {v.group_name}:
                            </span>
                            <span className="text-gray-600">{v.name}</span>
                            {v.price_delta > 0 && (
                              <span className="text-gray-400 text-xs">
                                (+₱{Number(v.price_delta).toFixed(2)})
                              </span>
                            )}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    ₱{Number(item.line_total).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
          <p className="text-sm text-amber-800">
            <span className="font-medium">📝 Note:</span> {order.notes}
          </p>
        </div>
      )}

      {/* Status Dropdown */}
      <StatusDropdown order={order} onStatusChange={onQuickStatusChange} />

      {/* View Details Button */}
      <button
        onClick={() => onViewDetails(order.id)}
        className="w-full mt-3 text-sm text-[#30442B] font-medium hover:underline text-center"
      >
        View Full Details →
      </button>
    </div>
  );
}
