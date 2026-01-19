import { formatCurrency } from "../../utils/formatCurrency";

export default function POSOrderSuccessModal({ isOpen, onClose, order, onViewOrder, onNewSale }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Success Header */}
        <div className="bg-emerald-600 px-6 py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Order Confirmed!</h2>
          <p className="mt-1 text-emerald-100">Payment received successfully</p>
        </div>

        {/* Order Details */}
        <div className="p-6">
          {/* Order Number */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-2xl font-bold text-gray-900">{order.order_number}</p>
          </div>

          {/* Summary */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{order.status_label}</span>
            </div>

            {order.customer_name && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Customer</span>
                <span className="font-medium text-gray-900">{order.customer_name}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment</span>
              <span className="font-medium text-gray-900 capitalize">{order.payment_method}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Items</span>
              <span className="font-medium text-gray-900">{order.items?.length || 0} items</span>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900">Total Paid</span>
                <span className="text-emerald-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onViewOrder} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              View Order
            </button>
            <button onClick={onNewSale} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
              New Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
