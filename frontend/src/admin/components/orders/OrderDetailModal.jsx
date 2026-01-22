import { useState } from "react";
import { Archive, RotateCcw } from "lucide-react";
import { STATUS_CONFIG, STATUS_FLOW } from "../../constants/orderStatus";
import ConfirmStatusModal from "./ConfirmStatusModal";
import FailureReasonModal from "./FailureReasonModal";

function formatDateTime(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function buildTimeline(order) {
  const timeline = [];

  if (order.created_at) {
    timeline.push({
      status: "pending",
      label: "Order Placed",
      time: order.created_at,
      completed: true,
    });
  }
  if (order.confirmed_at) {
    timeline.push({
      status: "confirmed",
      label: "Order Confirmed",
      time: order.confirmed_at,
      completed: true,
    });
  }
  if (order.preparing_at) {
    timeline.push({
      status: "preparing",
      label: "Preparing Order",
      time: order.preparing_at,
      completed: true,
    });
  }
  if (order.out_for_delivery_at) {
    timeline.push({
      status: "out_for_delivery",
      label: "Out for Delivery",
      time: order.out_for_delivery_at,
      completed: true,
    });
  }
  if (order.delivered_at) {
    timeline.push({
      status: "delivered",
      label: "Delivered",
      time: order.delivered_at,
      completed: true,
    });
  }
  if (order.failed_at) {
    timeline.push({
      status: "failed",
      label: "Failed",
      time: order.failed_at,
      completed: true,
      reason: order.failure_reason,
    });
  }

  return timeline;
}

export default function OrderDetailModal({ order, onClose, onStatusUpdate, onMarkFailed, onArchive }) {
  const [updating, setUpdating] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  if (!order) return null;

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const nextStatuses = STATUS_FLOW[order.status] || [];
  const timeline = buildTimeline(order);

  const handleStatusChange = (newStatus) => {
    if (newStatus === "failed") {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white sm:rounded-2xl lg:max-w-4xl">
        {/* Header */}
        <div className="bg-[#30442B] p-4 text-white sm:p-5 lg:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold sm:text-xl lg:text-2xl">Order #{order.order_number}</h2>
              <p className="mt-1 text-xs text-white/80 sm:text-sm">Placed on {formatDateTime(order.created_at)}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Archive/Restore button in header */}
              {onArchive &&
                (order.archived_at ? (
                  <button
                    onClick={() => onArchive(order.id, order.order_number, "unarchive")}
                    className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restore
                  </button>
                ) : order.can_archive ? (
                  <button
                    onClick={() => onArchive(order.id, order.order_number, "archive")}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-700"
                  >
                    <Archive className="h-3.5 w-3.5" />
                    Archive
                  </button>
                ) : null)}
              <button onClick={onClose} className="p-1 text-white/80 transition-colors hover:text-white">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 sm:text-sm ${statusConfig.bgColor} ${statusConfig.textColor}`}>{statusConfig.label}</span>
            {order.archived_at && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 sm:px-3 sm:text-sm">
                <Archive className="h-3 w-3" />
                Archived
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
            {/* Left Column - Order Details */}
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {/* Customer Info */}
              <div className="rounded-lg bg-gray-50 p-3 sm:rounded-xl sm:p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-800 sm:mb-3 sm:text-base">Customer Information</h3>
                <div className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <svg className="h-4 w-4 shrink-0 text-gray-400 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-700">{order.customer?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <svg className="h-4 w-4 shrink-0 text-gray-400 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{order.customer?.email || "N/A"}</span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{order.delivery_address || "No address provided"}</span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-gray-700">{order.delivery_contact || "No contact provided"}</span>
                  </div>
                  {order.delivery_instructions && (
                    <div className="flex items-start gap-2 sm:gap-3">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-xs font-medium text-gray-500 sm:text-sm">Delivery Instructions:</p>
                        <span className="text-gray-700">{order.delivery_instructions}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="rounded-lg bg-gray-50 p-3 sm:rounded-xl sm:p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-800 sm:mb-3 sm:text-base">Order Items</h3>
                <div className="space-y-2 sm:space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 py-2 last:border-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 sm:text-base">{item.product_name || item.product?.name || "Unknown Product"}</p>
                          <p className="text-xs text-gray-500 sm:text-sm">
                            Qty: {item.quantity} × ₱{Number(item.unit_price || 0).toFixed(2)}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-800 sm:text-base">₱{Number(item.line_total || item.subtotal || item.unit_price * item.quantity).toFixed(2)}</span>
                      </div>
                      {item.variants?.length > 0 && (
                        <div className="mt-2 ml-2 space-y-1">
                          {item.variants.map((v, i) => (
                            <div key={i} className="flex justify-between text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <span className="text-gray-400">+</span>
                                <span className="text-gray-500">{v.group_name}:</span>
                                <span>{v.name || v.variant_name}</span>
                              </span>
                              {v.price_delta > 0 && <span className="text-gray-500">+₱{Number(v.price_delta).toFixed(2)}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2 border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₱{Number(order.subtotal || 0).toFixed(2)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-amber-600">
                      <span>
                        Discount ({order.discount_percent}%)
                        {order.discount_reason && <span className="text-xs"> - {order.discount_reason}</span>}
                      </span>
                      <span>-₱{Number(order.discount_amount || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₱{Number(order.delivery_fee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>₱{Number(order.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="rounded-lg bg-gray-50 p-3 sm:rounded-xl sm:p-4">
                  <h3 className="mb-1.5 text-sm font-semibold text-gray-800 sm:mb-2 sm:text-base">Order Notes</h3>
                  <p className="text-xs text-gray-600 sm:text-sm">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Right Column - Timeline & Actions */}
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {/* Status Timeline */}
              <div className="rounded-lg bg-gray-50 p-3 sm:rounded-xl sm:p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-800 sm:mb-4 sm:text-base">Order Timeline</h3>
                <div className="space-y-3 sm:space-y-4">
                  {timeline.map((item, index) => {
                    const config = STATUS_CONFIG[item.status];
                    return (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`h-3 w-3 rounded-full ${config?.bgColor || "bg-gray-200"} ${config?.borderColor || "border-gray-400"} border-2`}></div>
                          {index < timeline.length - 1 && <div className="my-1 h-full w-0.5 bg-gray-200"></div>}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className={`font-medium ${config?.textColor || "text-gray-700"}`}>{item.label}</p>
                          <p className="text-xs text-gray-500">{formatDateTime(item.time)}</p>
                          {item.reason && <p className="mt-1 text-sm text-red-600">Reason: {item.reason}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Actions */}
              {nextStatuses.length > 0 && (
                <div className="rounded-lg bg-gray-50 p-3 sm:rounded-xl sm:p-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-800 sm:mb-3 sm:text-base">Update Status</h3>
                  <div className="space-y-1.5 sm:space-y-2">
                    {nextStatuses.map((status) => {
                      const config = STATUS_CONFIG[status];
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          disabled={updating}
                          className={`w-full px-3 py-2 text-sm sm:px-4 sm:py-2.5 sm:text-base ${config.bgColor} ${config.textColor} rounded-lg font-medium transition-colors hover:opacity-80 disabled:opacity-50`}
                        >
                          {status === "failed" ? "Mark as Failed" : `Move to ${config.label}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery Proof */}
              {order.delivery_proof_url && (
                <div className="rounded-lg bg-gray-50 p-3 sm:rounded-xl sm:p-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-800 sm:mb-3 sm:text-base">Delivery Proof</h3>
                  <img src={order.delivery_proof_url} alt="Delivery proof" className="w-full rounded-lg" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-3 sm:p-4">
          <button onClick={onClose} className="w-full rounded-lg bg-gray-200 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 sm:py-2.5 sm:text-base">
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
      <FailureReasonModal isOpen={showFailModal} onClose={() => setShowFailModal(false)} onConfirm={handleMarkFailed} loading={updating} />
    </div>
  );
}
