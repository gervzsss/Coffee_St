import {
  X,
  Package,
  MapPin,
  Phone,
  CreditCard,
  Clock,
  Calendar,
  ShoppingCart,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiClient';
import { useReorder } from '../hooks/useReorder';

export default function OrderDetailModal({
  isOpen,
  onClose,
  order: initialOrder,
}) {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { reorderItems, reordering } = useReorder();

  useEffect(() => {
    if (
      isOpen &&
      initialOrder &&
      (!initialOrder.items || initialOrder.items.length === 0)
    ) {
      fetchOrderDetails();
    } else {
      setOrder(initialOrder);
    }
  }, [isOpen, initialOrder]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/orders/${initialOrder.id}`);
      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentMethodLabel = (method) => {
    return method === 'cash' ? 'Cash on Delivery' : 'GCash';
  };

  const handleReorder = async () => {
    if (!order || !order.items || order.items.length === 0) {
      return;
    }

    const result = await reorderItems(order.items);

    if (result.success) {
      onClose();
      navigate('/cart');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl ring-1 ring-gray-900/5 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#30442B]"></div>
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            </div>
          ) : order ? (
            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-outfit text-3xl font-bold text-gray-900">
                      {order.order_number}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-600 mt-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-outfit text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#30442B]" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.product_name}
                          </p>
                          {item.variant_name && (
                            <p className="text-sm text-gray-600">
                              {item.variant_name}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            x{item.quantity}
                          </p>
                          <p className="font-semibold text-[#30442B]">
                            ₱{item.line_total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No items found
                    </p>
                  )}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₱{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₱{order.delivery_fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({(order.tax_rate * 100).toFixed(0)}%)</span>
                    <span>₱{order.tax_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-[#30442B] pt-2 border-t border-gray-300">
                    <span>Total</span>
                    <span>₱{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="mb-6">
                <h3 className="font-outfit text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#30442B]" />
                  Delivery Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Delivery Address
                      </p>
                      <p className="text-gray-900">{order.delivery_address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </p>
                      <p className="text-gray-900">{order.delivery_contact}</p>
                    </div>
                  </div>

                  {order.delivery_instructions && (
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Delivery Instructions
                        </p>
                        <p className="text-gray-900">
                          {order.delivery_instructions}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </p>
                      <p className="text-gray-900">
                        {getPaymentMethodLabel(order.payment_method)}
                      </p>
                    </div>
                  </div>

                  {order.status === 'pending' && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Estimated Delivery
                        </p>
                        <p className="text-gray-900">25-35 minutes</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Note */}
              {order.status === 'paid' && (
                <div className="rounded-xl bg-green-50 border border-green-200 p-4 flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-green-900">
                      Order Completed
                    </p>
                    <p className="text-sm text-green-700">
                      This order has been successfully delivered.
                    </p>
                  </div>
                </div>
              )}

              {order.status === 'cancelled' && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-900">
                      Order Cancelled
                    </p>
                    <p className="text-sm text-red-700">
                      This order has been cancelled.
                    </p>
                  </div>
                </div>
              )}

              {order.status === 'pending' && (
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-blue-900">
                      Order Processing
                    </p>
                    <p className="text-sm text-blue-700">
                      Your order is being prepared and will be delivered soon.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleReorder}
                  disabled={
                    reordering || !order.items || order.items.length === 0
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#30442B] text-white rounded-lg font-semibold hover:bg-[#405939] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reordering ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding to Cart...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Reorder</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
