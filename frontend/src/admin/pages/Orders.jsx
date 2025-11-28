import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  getOrderMetrics,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  markOrderFailed,
} from '../services/orderService';

// Status configuration
const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'yellow',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-400',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-400',
  },
  preparing: {
    label: 'Preparing',
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-400',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-400',
  },
  delivered: {
    label: 'Delivered',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-400',
  },
  failed: {
    label: 'Failed',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-400',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-400',
  },
};

// Status flow - what status can transition to what
const STATUS_FLOW = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['out_for_delivery', 'failed'],
  out_for_delivery: ['delivered', 'failed'],
  delivered: [],
  failed: [],
  cancelled: [],
};

// Confirmation Modal Component
function ConfirmStatusModal({
  isOpen,
  onClose,
  onConfirm,
  fromStatus,
  toStatus,
  loading,
}) {
  if (!isOpen) return null;

  const fromConfig = STATUS_CONFIG[fromStatus];
  const toConfig = STATUS_CONFIG[toStatus];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Confirm Status Change
        </h3>
        <p className="text-gray-700 mb-2">
          Change order status from{' '}
          <span className="font-semibold">{fromConfig?.label}</span> to{' '}
          <span className="font-semibold">{toConfig?.label}</span>?
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to change the order status? This action will be
          logged.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 px-4 bg-[#30442B] text-white rounded-full font-medium hover:bg-[#3d5a35] transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Failure Reason Modal Component
function FailureReasonModal({ isOpen, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Mark Order as Failed
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Please provide a reason for marking this order as failed.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter failure reason..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] resize-none"
          rows={3}
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              onClose();
              setReason('');
            }}
            disabled={loading}
            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim() || loading}
            className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Order Detail Modal Component
function OrderDetailModal({ order, onClose, onStatusUpdate, onMarkFailed }) {
  const [updating, setUpdating] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  if (!order) return null;

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const nextStatuses = STATUS_FLOW[order.status] || [];

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'failed') {
      setShowFailModal(true);
    } else {
      setPendingStatus(newStatus);
      setShowConfirmModal(true);
    }
  };

  const confirmStatusUpdate = async () => {
    if (!pendingStatus) return;
    setUpdating(true);
    await onStatusUpdate(order.id, pendingStatus);
    setUpdating(false);
    setShowConfirmModal(false);
    setPendingStatus(null);
  };

  const handleMarkFailed = async (reason) => {
    setUpdating(true);
    await onMarkFailed(order.id, reason);
    setUpdating(false);
    setShowFailModal(false);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Build timeline from order data
  const buildTimeline = () => {
    const timeline = [];

    if (order.created_at) {
      timeline.push({
        status: 'pending',
        label: 'Order Placed',
        time: order.created_at,
        completed: true,
      });
    }
    if (order.confirmed_at) {
      timeline.push({
        status: 'confirmed',
        label: 'Order Confirmed',
        time: order.confirmed_at,
        completed: true,
      });
    }
    if (order.preparing_at) {
      timeline.push({
        status: 'preparing',
        label: 'Preparing Order',
        time: order.preparing_at,
        completed: true,
      });
    }
    if (order.out_for_delivery_at) {
      timeline.push({
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        time: order.out_for_delivery_at,
        completed: true,
      });
    }
    if (order.delivered_at) {
      timeline.push({
        status: 'delivered',
        label: 'Delivered',
        time: order.delivered_at,
        completed: true,
      });
    }
    if (order.failed_at) {
      timeline.push({
        status: 'failed',
        label: 'Failed',
        time: order.failed_at,
        completed: true,
        reason: order.failure_reason,
      });
    }

    return timeline;
  };

  const timeline = buildTimeline();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#30442B] text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">
                Order #{order.order_number}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Placed on {formatDateTime(order.created_at)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
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
          <div className="mt-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Order Details */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
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
                    <span className="text-gray-700">
                      {order.customer?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-gray-700">
                      {order.customer?.email || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400 mt-0.5"
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
                    <span className="text-gray-700">
                      {order.delivery_address || 'No address provided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="py-2 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {item.product_name ||
                              item.product?.name ||
                              'Unknown Product'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × ₱
                            {Number(item.unit_price || 0).toFixed(2)}
                          </p>
                        </div>
                        <span className="font-medium text-gray-800">
                          ₱
                          {Number(
                            item.line_total ||
                              item.subtotal ||
                              item.unit_price * item.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                      {/* Variants/Add-ons */}
                      {item.variants?.length > 0 && (
                        <div className="mt-2 ml-2 space-y-1">
                          {item.variants.map((v, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-sm text-gray-600"
                            >
                              <span className="flex items-center gap-1">
                                <span className="text-gray-400">+</span>
                                <span className="text-gray-500">
                                  {v.group_name}:
                                </span>
                                <span>{v.name || v.variant_name}</span>
                              </span>
                              {v.price_delta > 0 && (
                                <span className="text-gray-500">
                                  +₱{Number(v.price_delta).toFixed(2)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-300 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₱{Number(order.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₱{Number(order.delivery_fee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                    <span>Total</span>
                    <span>₱{Number(order.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Order Notes
                  </h3>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Right Column - Timeline & Actions */}
            <div className="space-y-6">
              {/* Status Timeline */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Order Timeline
                </h3>
                <div className="space-y-4">
                  {timeline.map((item, index) => {
                    const config = STATUS_CONFIG[item.status];
                    return (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              config?.bgColor || 'bg-gray-200'
                            } ${
                              config?.borderColor || 'border-gray-400'
                            } border-2`}
                          ></div>
                          {index < timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p
                            className={`font-medium ${
                              config?.textColor || 'text-gray-700'
                            }`}
                          >
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(item.time)}
                          </p>
                          {item.reason && (
                            <p className="text-sm text-red-600 mt-1">
                              Reason: {item.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Actions */}
              {nextStatuses.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Update Status
                  </h3>
                  <div className="space-y-2">
                    {nextStatuses.map((status) => {
                      const config = STATUS_CONFIG[status];
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          disabled={updating}
                          className={`w-full py-2.5 px-4 ${config.bgColor} ${config.textColor} rounded-lg font-medium hover:opacity-80 transition-colors disabled:opacity-50`}
                        >
                          {status === 'failed'
                            ? 'Mark as Failed'
                            : `Move to ${config.label}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery Proof */}
              {order.delivery_proof_url && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Delivery Proof
                  </h3>
                  <img
                    src={order.delivery_proof_url}
                    alt="Delivery proof"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmStatusModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setPendingStatus(null);
        }}
        onConfirm={confirmStatusUpdate}
        fromStatus={order.status}
        toStatus={pendingStatus}
        loading={updating}
      />

      {/* Failure Reason Modal */}
      <FailureReasonModal
        isOpen={showFailModal}
        onClose={() => setShowFailModal(false)}
        onConfirm={handleMarkFailed}
        loading={updating}
      />
    </div>
  );
}

// Status Dropdown Component for quick status change
function StatusDropdown({ order, onStatusChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const nextStatuses = STATUS_FLOW[order.status] || [];

  const handleSelect = (status) => {
    setIsOpen(false);
    onStatusChange(order.id, order.status, status);
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (nextStatuses.length > 0) {
            setIsOpen(!isOpen);
          }
        }}
        disabled={disabled || nextStatuses.length === 0}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg ${
          nextStatuses.length > 0
            ? 'bg-[#30442B] text-white hover:bg-[#3d5a35]'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        } transition-colors font-medium`}
      >
        <span>{currentConfig.label}</span>
        {nextStatuses.length > 0 && (
          <svg
            className={`w-5 h-5 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
            {nextStatuses.map((status) => {
              const config = STATUS_CONFIG[status];
              return (
                <button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(status);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className={`font-medium ${config.textColor}`}>
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Order Card Component
function OrderCard({ order, onViewDetails, onQuickStatusChange }) {
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  // Calculate estimated prep time
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
                    {/* Variants/Add-ons */}
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

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    all: 0,
    processing: 0,
    out_for_delivery: 0,
    completed: 0,
    failed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    orderId: null,
    fromStatus: null,
    toStatus: null,
  });
  const [failModal, setFailModal] = useState({
    isOpen: false,
    orderId: null,
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [ordersResult, metricsResult] = await Promise.all([
      getAllOrders(),
      getOrderMetrics(),
    ]);

    if (ordersResult.success) {
      setOrders(ordersResult.data);
    }
    if (metricsResult.success) {
      const data = metricsResult.data;
      setMetrics({
        all: data.all || 0,
        processing:
          (data.pending || 0) + (data.confirmed || 0) + (data.preparing || 0),
        out_for_delivery: data.out_for_delivery || 0,
        completed: data.delivered || 0,
        failed: (data.failed || 0) + (data.cancelled || 0),
      });
    }
    setLoading(false);
  };

  const handleViewOrder = async (orderId) => {
    setDetailLoading(true);
    const result = await getOrder(orderId);
    if (result.success) {
      setSelectedOrder(result.data);
    }
    setDetailLoading(false);
  };

  // Quick status change handler (from dropdown)
  const handleQuickStatusChange = (orderId, fromStatus, toStatus) => {
    if (toStatus === 'failed') {
      setFailModal({ isOpen: true, orderId });
    } else {
      setConfirmModal({
        isOpen: true,
        orderId,
        fromStatus,
        toStatus,
      });
    }
  };

  // Confirm status update
  const confirmStatusUpdate = async () => {
    const { orderId, toStatus } = confirmModal;
    setUpdating(true);
    const result = await updateOrderStatus(orderId, { status: toStatus });
    if (result.success) {
      await fetchData();
      if (selectedOrder?.id === orderId) {
        const orderResult = await getOrder(orderId);
        if (orderResult.success) {
          setSelectedOrder(orderResult.data);
        }
      }
    }
    setUpdating(false);
    setConfirmModal({
      isOpen: false,
      orderId: null,
      fromStatus: null,
      toStatus: null,
    });
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, { status: newStatus });
    if (result.success) {
      await fetchData();
      if (selectedOrder?.id === orderId) {
        const orderResult = await getOrder(orderId);
        if (orderResult.success) {
          setSelectedOrder(orderResult.data);
        }
      }
    }
    return result;
  };

  const handleMarkFailed = async (orderId, reason) => {
    setUpdating(true);
    const result = await markOrderFailed(orderId, reason);
    if (result.success) {
      await fetchData();
      if (selectedOrder?.id === orderId) {
        const orderResult = await getOrder(orderId);
        if (orderResult.success) {
          setSelectedOrder(orderResult.data);
        }
      }
    }
    setUpdating(false);
    setFailModal({ isOpen: false, orderId: null });
    return result;
  };

  const confirmFailure = async (reason) => {
    await handleMarkFailed(failModal.orderId, reason);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (filterStatus === 'processing') {
      matchesStatus = ['pending', 'confirmed', 'preparing'].includes(
        order.status
      );
    } else if (filterStatus === 'completed') {
      matchesStatus = order.status === 'delivered';
    } else if (filterStatus === 'failed') {
      matchesStatus = ['failed', 'cancelled'].includes(order.status);
    } else if (filterStatus !== 'all') {
      matchesStatus = order.status === filterStatus;
    }

    return matchesSearch && matchesStatus;
  });

  const statusCards = [
    { key: 'all', label: 'All Orders', count: metrics.all },
    {
      key: 'processing',
      label: 'Processing Orders',
      count: metrics.processing,
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      count: metrics.out_for_delivery,
    },
    { key: 'completed', label: 'Completed Orders', count: metrics.completed },
    { key: 'failed', label: 'Failed Orders', count: metrics.failed },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              ORDERS & TRACKING
            </h1>
            <p className="text-gray-600 mt-2">
              Manage customer orders and track their progress
            </p>
          </div>

          {/* Order Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {statusCards.map((card) => (
              <div
                key={card.key}
                onClick={() => setFilterStatus(card.key)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  filterStatus === card.key
                    ? 'bg-[#30442B] text-white border-[#30442B]'
                    : 'bg-white text-gray-800 border-gray-200 hover:border-[#30442B]/30'
                }`}
              >
                <div
                  className={`text-sm font-medium ${
                    filterStatus === card.key
                      ? 'text-white/80'
                      : 'text-gray-500'
                  }`}
                >
                  {card.label}
                </div>
                <div className="text-3xl font-bold mt-1">{card.count}</div>
              </div>
            ))}
          </div>

          {/* Search Section */}
          <div className="bg-[#30442B] rounded-2xl p-4 mb-8">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-2xl">
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-4 top-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by Order number or customer name........."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-0 bg-white focus:ring-2 focus:ring-white/50 placeholder-gray-400 text-gray-800 text-sm"
                />
              </div>
              <div className="relative">
                <select
                  className="appearance-none px-4 py-3 pr-10 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer font-medium"
                  defaultValue=""
                >
                  <option value="" disabled className="text-gray-800">
                    CATEGORIES
                  </option>
                  <option value="all" className="text-gray-800">
                    All
                  </option>
                  <option value="coffee" className="text-gray-800">
                    Coffee
                  </option>
                  <option value="food" className="text-gray-800">
                    Food
                  </option>
                </select>
                <svg
                  className="w-5 h-5 text-white absolute right-3 top-3.5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Orders List Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              All Orders ({filteredOrders.length})
            </h2>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30442B]"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewOrder}
                  onQuickStatusChange={handleQuickStatusChange}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
          onMarkFailed={(orderId, reason) => handleMarkFailed(orderId, reason)}
        />
      )}

      {/* Quick Status Change Confirmation Modal */}
      <ConfirmStatusModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({
            isOpen: false,
            orderId: null,
            fromStatus: null,
            toStatus: null,
          })
        }
        onConfirm={confirmStatusUpdate}
        fromStatus={confirmModal.fromStatus}
        toStatus={confirmModal.toStatus}
        loading={updating}
      />

      {/* Quick Failure Modal */}
      <FailureReasonModal
        isOpen={failModal.isOpen}
        onClose={() => setFailModal({ isOpen: false, orderId: null })}
        onConfirm={confirmFailure}
        loading={updating}
      />

      {/* Loading overlay for detail */}
      {detailLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#30442B] mx-auto"></div>
            <p className="text-gray-600 mt-3">Loading order details...</p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
