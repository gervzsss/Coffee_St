export default function ProductDetailsModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Product Details
              </h2>
              <p className="text-gray-500 mt-1">
                View product information and history
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
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
          <div className="flex gap-6 mb-6">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-32 h-32 rounded-xl object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-xl bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
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
              <h3 className="text-xl font-bold text-gray-900">
                {product.name}
              </h3>
              <p className="text-[#30442B] font-semibold text-lg mt-1">
                ₱{Number(product.price).toFixed(2)}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 capitalize">
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
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Unavailable Reason */}
          {product.unavailable_reason && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl">
              <h4 className="font-semibold text-red-800 mb-1">
                Unavailable Reason
              </h4>
              <p className="text-red-600">{product.unavailable_reason}</p>
            </div>
          )}

          {/* Variants */}
          {product.variant_groups && product.variant_groups.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Variants & Add-ons
              </h4>
              <div className="space-y-3">
                {product.variant_groups.map((group) => (
                  <div key={group.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">
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
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-[#30442B]/5 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#30442B]">
                {product.stats?.total_orders || 0}
              </p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="p-4 bg-[#30442B]/5 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#30442B]">
                ₱{Number(product.stats?.total_revenue || 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="p-4 bg-[#30442B]/5 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#30442B]">
                {product.stats?.total_quantity_sold || 0}
              </p>
              <p className="text-sm text-gray-600">Items Sold</p>
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
