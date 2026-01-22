export default function ProductDetailsModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white sm:rounded-2xl lg:max-w-2xl">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-5 sm:py-4 lg:px-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Product Details</h2>
            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">View product information and history</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          {/* Product Info */}
          <div className="mb-4 flex flex-col gap-4 sm:mb-5 sm:flex-row sm:gap-6 lg:mb-6">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-24 w-24 rounded-lg object-cover sm:h-32 sm:w-32 sm:rounded-xl" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-200 sm:h-32 sm:w-32 sm:rounded-xl">
                <svg className="h-8 w-8 text-gray-400 sm:h-12 sm:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{product.name}</h3>
              <p className="mt-1 text-base font-semibold text-[#30442B] sm:text-lg">₱{Number(product.price).toFixed(2)}</p>
              <span className="mt-2 inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 capitalize sm:px-3 sm:text-sm">{product.category?.replace("-", " ")}</span>
              <div className="mt-2 flex gap-2">
                <span className={`rounded-full px-3 py-1 text-sm ${product.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {product.is_available ? "Available" : "Not Available"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4 sm:mb-5 lg:mb-6">
            <h4 className="mb-1.5 text-sm font-semibold text-gray-900 sm:mb-2 sm:text-base">Description</h4>
            <p className="text-sm text-gray-600 sm:text-base">{product.description}</p>
          </div>

          {/* Unavailable Reason */}
          {product.unavailable_reason && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 sm:mb-5 sm:rounded-xl sm:p-4 lg:mb-6">
              <h4 className="mb-1 text-sm font-semibold text-red-800 sm:text-base">Unavailable Reason</h4>
              <p className="text-sm text-red-600 sm:text-base">{product.unavailable_reason}</p>
            </div>
          )}

          {/* Variants */}
          {product.variant_groups && product.variant_groups.length > 0 && (
            <div className="mb-4 sm:mb-5 lg:mb-6">
              <h4 className="mb-2 text-sm font-semibold text-gray-900 sm:mb-3 sm:text-base">Variants & Add-ons</h4>
              <div className="space-y-2 sm:space-y-3">
                {product.variant_groups.map((group) => (
                  <div key={group.id} className="rounded-lg bg-gray-50 p-3 sm:rounded-xl sm:p-4">
                    <div className="mb-1.5 flex items-center justify-between sm:mb-2">
                      <span className="text-sm font-medium text-gray-900 sm:text-base">{group.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{group.selection_type} selection</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.variants?.map((variant) => (
                        <span key={variant.id} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm">
                          {variant.name} {variant.price_delta > 0 && `(+₱${variant.price_delta})`}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="mb-4 grid grid-cols-3 gap-2 sm:mb-5 sm:gap-3 lg:mb-6 lg:gap-4">
            <div className="rounded-lg bg-[#30442B]/5 p-3 text-center sm:rounded-xl sm:p-4">
              <p className="text-lg font-bold text-[#30442B] sm:text-xl lg:text-2xl">{product.stats?.total_orders || 0}</p>
              <p className="text-xs text-gray-600 sm:text-sm">Total Orders</p>
            </div>
            <div className="rounded-lg bg-[#30442B]/5 p-3 text-center sm:rounded-xl sm:p-4">
              <p className="text-lg font-bold text-[#30442B] sm:text-xl lg:text-2xl">₱{Number(product.stats?.total_revenue || 0).toFixed(2)}</p>
              <p className="text-xs text-gray-600 sm:text-sm">Total Revenue</p>
            </div>
            <div className="rounded-lg bg-[#30442B]/5 p-3 text-center sm:rounded-xl sm:p-4">
              <p className="text-lg font-bold text-[#30442B] sm:text-xl lg:text-2xl">{product.stats?.total_quantity_sold || 0}</p>
              <p className="text-xs text-gray-600 sm:text-sm">Items Sold</p>
            </div>
          </div>

          {/* Recent Orders */}
          {product.recent_orders && product.recent_orders.length > 0 && (
            <div>
              <h4 className="mb-3 font-semibold text-gray-900">Recent Orders</h4>
              <div className="overflow-hidden rounded-xl border">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Order #</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {product.recent_orders.map((order, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 text-sm">{order.order_number || `#${order.order_id}`}</td>
                        <td className="px-4 py-2 text-sm">{order.quantity}</td>
                        <td className="px-4 py-2 text-sm">₱{Number(order.line_total).toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="mt-6 border-t pt-4 text-sm text-gray-500">
            <p>Created: {new Date(product.created_at).toLocaleString()}</p>
            {product.updated_at && <p>Last Updated: {new Date(product.updated_at).toLocaleString()}</p>}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-3 sm:px-5 sm:py-4 lg:px-6">
          <div className="flex justify-end">
            <button onClick={onClose} className="rounded-lg bg-[#30442B] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#405939] sm:px-6 sm:py-3 sm:text-base">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
