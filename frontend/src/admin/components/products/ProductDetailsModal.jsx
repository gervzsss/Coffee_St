export default function ProductDetailsModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-5 lg:p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 sm:mb-5 lg:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Product Details
              </h2>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                View product information and history
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Product Info */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 sm:mb-5 lg:mb-6">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl object-cover"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {product.name}
              </h3>
              <p className="text-[#30442B] font-semibold text-base sm:text-lg mt-1">
                ₱{Number(product.price).toFixed(2)}
              </p>
              <span className="inline-block mt-2 px-2.5 sm:px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm text-gray-600 capitalize">
                {product.category?.replace('-', ' ')}
              </span>
              <div className="flex gap-2 mt-2">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    product.is_available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.is_available ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4 sm:mb-5 lg:mb-6">
            <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1.5 sm:mb-2">
              Description
            </h4>
            <p className="text-sm sm:text-base text-gray-600">
              {product.description}
            </p>
          </div>

          {/* Unavailable Reason */}
          {product.unavailable_reason && (
            <div className="mb-4 sm:mb-5 lg:mb-6 p-3 sm:p-4 bg-red-50 rounded-lg sm:rounded-xl">
              <h4 className="font-semibold text-sm sm:text-base text-red-800 mb-1">
                Unavailable Reason
              </h4>
              <p className="text-sm sm:text-base text-red-600">
                {product.unavailable_reason}
              </p>
            </div>
          )}

          {/* Variants */}
          {product.variant_groups && product.variant_groups.length > 0 && (
            <div className="mb-4 sm:mb-5 lg:mb-6">
              <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">
                Variants & Add-ons
              </h4>
              <div className="space-y-2 sm:space-y-3">
                {product.variant_groups.map((group) => (
                  <div
                    key={group.id}
                    className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl"
                  >
                    <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                      <span className="font-medium text-sm sm:text-base text-gray-900">
                        {group.name}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {group.selection_type} selection
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.variants?.map((variant) => (
                        <span
                          key={variant.id}
                          className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200"
                        >
                          {variant.name}{' '}
                          {variant.price_delta > 0 &&
                            `(+₱${variant.price_delta})`}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-5 lg:mb-6">
            <div className="p-3 sm:p-4 bg-[#30442B]/5 rounded-lg sm:rounded-xl text-center">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#30442B]">
                {product.stats?.total_orders || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="p-3 sm:p-4 bg-[#30442B]/5 rounded-lg sm:rounded-xl text-center">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#30442B]">
                ₱{Number(product.stats?.total_revenue || 0).toFixed(2)}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="p-3 sm:p-4 bg-[#30442B]/5 rounded-lg sm:rounded-xl text-center">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#30442B]">
                {product.stats?.total_quantity_sold || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Items Sold</p>
            </div>
          </div>

          {/* Recent Orders */}
          {product.recent_orders && product.recent_orders.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Recent Orders
              </h4>
              <div className="border rounded-xl overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500">
                        Order #
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500">
                        Qty
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500">
                        Amount
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {product.recent_orders.map((order, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-4 text-sm">
                          {order.order_number || `#${order.order_id}`}
                        </td>
                        <td className="py-2 px-4 text-sm">{order.quantity}</td>
                        <td className="py-2 px-4 text-sm">
                          ₱{Number(order.line_total).toFixed(2)}
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="mt-6 pt-4 border-t text-sm text-gray-500">
            <p>Created: {new Date(product.created_at).toLocaleString()}</p>
            {product.updated_at && (
              <p>
                Last Updated: {new Date(product.updated_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
