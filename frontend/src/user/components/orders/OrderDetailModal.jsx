import {
  X,
  Package,
  MapPin,
  Phone,
  CreditCard,
  Clock,
  Calendar,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
  ChefHat,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../services/apiClient';

const DEFAULT_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-500',
  },
  confirmed: {
    label: 'Confirmed',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-500',
  },
  preparing: {
    label: 'Preparing',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-500',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-500',
  },
  delivered: {
    label: 'Delivered',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-500',
  },
  failed: {
    label: 'Failed',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-500',
  },
  cancelled: {
    label: 'Cancelled',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-500',
  },
};

export default function OrderDetailModal({
  isOpen,
  onClose,
  order: initialOrder,
  statusConfig = DEFAULT_STATUS_CONFIG,
}) {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && initialOrder) {
      fetchOrderDetails();
    } else {
      setOrder(initialOrder);
    }
  }, [isOpen, initialOrder?.id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/orders/${initialOrder.id}`);
      setOrder(response.data.order || response.data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    return (
      statusConfig[status] ||
      statusConfig.pending ||
      DEFAULT_STATUS_CONFIG.pending
    );
  };

  const getStatusIcon = (status, size = 'w-5 h-5') => {
    const iconClass = size;
    switch (status) {
      case 'delivered':
        return <CheckCircle className={iconClass} />;
      case 'out_for_delivery':
        return <Truck className={iconClass} />;
      case 'preparing':
        return <ChefHat className={iconClass} />;
      case 'confirmed':
        return <Package className={iconClass} />;
      case 'failed':
      case 'cancelled':
        return <XCircle className={iconClass} />;
      default:
        return <AlertCircle className={iconClass} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentMethodLabel = (method) => {
    return method === 'cash' ? 'Cash on Delivery' : 'GCash';
  };

  const buildTimeline = () => {
    if (!order) return [];

    if (order.timeline && order.timeline.length > 0) {
      return order.timeline;
    }

    const timeline = [];

    timeline.push({
      status: 'pending',
      label: 'Order Placed',
      description: 'Your order has been received',
      time: order.created_at,
      completed: true,
    });

    if (order.confirmed_at) {
      timeline.push({
        status: 'confirmed',
        label: 'Order Confirmed',
        description: 'Your order has been confirmed',
        time: order.confirmed_at,
        completed: true,
      });
    }

    if (order.preparing_at) {
      timeline.push({
        status: 'preparing',
        label: 'Preparing Order',
        description: 'Your order is being prepared',
        time: order.preparing_at,
        completed: true,
      });
    }

    if (order.out_for_delivery_at) {
      timeline.push({
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        description: 'Your order is on its way',
        time: order.out_for_delivery_at,
        completed: true,
      });
    }

    if (order.delivered_at) {
      timeline.push({
        status: 'delivered',
        label: 'Delivered',
        description: 'Your order has been delivered',
        time: order.delivered_at,
        completed: true,
      });
    }

    if (order.failed_at) {
      timeline.push({
        status: 'failed',
        label: 'Delivery Failed',
        description: order.failure_reason || 'Delivery was unsuccessful',
        time: order.failed_at,
        completed: true,
      });
    }

    return timeline;
  };

  if (!isOpen) return null;

  const config = order
    ? getStatusConfig(order.status)
    : DEFAULT_STATUS_CONFIG.pending;
  const timeline = buildTimeline();
  const isActive =
    order &&
    ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(
      order.status
    );

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
              <div className="mb-6">
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
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${config.bgColor} ${config.textColor}`}
                  >
                    {getStatusIcon(order.status, 'w-4 h-4')}
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Order Timeline - Show for active orders */}
              {timeline.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-outfit text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#30442B]" />
                    Order Tracking
                  </h3>
                  <div className="relative">
                    {/* Timeline */}
                    <div className="space-y-0">
                      {timeline.map((item, index) => {
                        const itemConfig = getStatusConfig(item.status);
                        const isLast = index === timeline.length - 1;

                        return (
                          <div key={index} className="flex gap-4">
                            {/* Timeline indicator */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  item.completed
                                    ? `${itemConfig.bgColor} ${itemConfig.textColor}`
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {getStatusIcon(item.status, 'w-5 h-5')}
                              </div>
                              {!isLast && (
                                <div
                                  className={`w-0.5 h-12 ${
                                    item.completed
                                      ? 'bg-[#30442B]'
                                      : 'bg-gray-200'
                                  }`}
                                />
                              )}
                            </div>

                            {/* Content */}
                            <div
                              className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}
                            >
                              <div className="flex items-center justify-between">
                                <p
                                  className={`font-semibold ${
                                    item.completed
                                      ? 'text-gray-900'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {item.label}
                                </p>
                                {item.time && (
                                  <span className="text-sm text-gray-500">
                                    {formatShortDate(item.time)}
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-sm mt-1 ${
                                  item.completed
                                    ? 'text-gray-600'
                                    : 'text-gray-400'
                                }`}
                              >
                                {item.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

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
                            ₱{Number(item.line_total || 0).toFixed(2)}
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
                    <span>₱{Number(order.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₱{Number(order.delivery_fee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Tax ({((order.tax_rate || 0) * 100).toFixed(0)}%)
                    </span>
                    <span>₱{Number(order.tax_amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-[#30442B] pt-2 border-t border-gray-300">
                    <span>Total</span>
                    <span>
                      ₱
                      {Number(order.total || order.total_amount || 0).toFixed(
                        2
                      )}
                    </span>
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
                </div>
              </div>

              {/* Status Messages */}
              {order.status === 'delivered' && (
                <div className="rounded-xl bg-green-50 border border-green-200 p-4 flex items-start gap-3 mb-6">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">
                      Order Delivered!
                    </p>
                    <p className="text-sm text-green-700">
                      Your order was delivered on{' '}
                      {formatDate(order.delivered_at)}.
                    </p>
                  </div>
                </div>
              )}

              {order.status === 'failed' && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 mb-6">
                  <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">
                      Delivery Failed
                    </p>
                    <p className="text-sm text-red-700">
                      {order.failure_reason ||
                        'The delivery was unsuccessful. Please contact support for assistance.'}
                    </p>
                  </div>
                </div>
              )}

              {order.status === 'cancelled' && (
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 flex items-start gap-3 mb-6">
                  <XCircle className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Order Cancelled
                    </p>
                    <p className="text-sm text-gray-700">
                      This order has been cancelled.
                    </p>
                  </div>
                </div>
              )}

              {isActive && (
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 flex items-start gap-3 mb-6">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <p className="font-semibold text-blue-900">
                      Order in Progress
                    </p>
                    <p className="text-sm text-blue-700">
                      {order.status === 'pending' &&
                        'Your order is waiting to be confirmed.'}
                      {order.status === 'confirmed' &&
                        'Your order has been confirmed and will be prepared soon.'}
                      {order.status === 'preparing' &&
                        'Your order is being prepared with care.'}
                      {order.status === 'out_for_delivery' &&
                        'Your order is on its way! Get ready!'}
                    </p>
                  </div>
                </div>
              )}

              {/* Delivery Proof */}
              {order.delivery_proof_url && (
                <div className="mb-6">
                  <h3 className="font-outfit text-xl font-semibold text-gray-900 mb-4">
                    Delivery Proof
                  </h3>
                  <img
                    src={order.delivery_proof_url}
                    alt="Delivery proof"
                    className="w-full max-w-md rounded-xl border border-gray-200"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#30442B] text-white rounded-lg font-semibold hover:bg-[#405939] transition-colors"
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
