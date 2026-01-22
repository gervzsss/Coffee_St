import { X, Package, MapPin, Phone, CreditCard, Clock, Calendar, CheckCircle, Truck, XCircle, AlertCircle, ChefHat, MessageCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/apiClient";
import { cancelOrder } from "../../services/orderService";
import { useToast } from "../../hooks/useToast";

const DEFAULT_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-500",
  },
  confirmed: {
    label: "Confirmed",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-500",
  },
  preparing: {
    label: "Preparing",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-800",
    borderColor: "border-indigo-500",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    borderColor: "border-purple-500",
  },
  delivered: {
    label: "Delivered",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-500",
  },
  failed: {
    label: "Failed",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-500",
  },
  cancelled: {
    label: "Cancelled",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    borderColor: "border-gray-500",
  },
};

export default function OrderDetailModal({ isOpen, onClose, order: initialOrder, statusConfig = DEFAULT_STATUS_CONFIG, onOrderUpdated }) {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/orders/${initialOrder.id}`);
      setOrder(response.data.order || response.data);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  }, [initialOrder]);

  const handleCancelOrder = async () => {
    setCancelLoading(true);
    setError(null);
    try {
      const result = await cancelOrder(order.id);
      if (result.success) {
        showToast("Order cancelled successfully", { type: "success" });
        setOrder(result.data);
        setShowCancelConfirm(false);

        // Close modal after a brief delay
        setTimeout(() => {
          onClose();
          // Trigger parent refresh if callback provided
          if (onOrderUpdated) {
            onOrderUpdated();
          }
        }, 1000);
      } else {
        const errorMessage = result.error || "Failed to cancel order";
        setError(errorMessage);
        showToast(errorMessage, { type: "error" });
      }
    } catch {
      const errorMessage = "An error occurred while cancelling the order";
      setError(errorMessage);
      showToast(errorMessage, { type: "error" });
    } finally {
      setCancelLoading(false);
    }
  };

  const handleGoToContact = () => {
    onClose();
    navigate("/contact");
  };

  useEffect(() => {
    if (isOpen && initialOrder) {
      fetchOrderDetails();
    } else {
      setOrder(initialOrder);
    }
  }, [isOpen, initialOrder, fetchOrderDetails]);

  const getStatusConfig = (status) => {
    return statusConfig[status] || statusConfig.pending || DEFAULT_STATUS_CONFIG.pending;
  };

  const getStatusIcon = (status, size = "w-5 h-5") => {
    const iconClass = size;
    switch (status) {
      case "delivered":
        return <CheckCircle className={iconClass} />;
      case "out_for_delivery":
        return <Truck className={iconClass} />;
      case "preparing":
        return <ChefHat className={iconClass} />;
      case "confirmed":
        return <Package className={iconClass} />;
      case "failed":
      case "cancelled":
        return <XCircle className={iconClass} />;
      default:
        return <AlertCircle className={iconClass} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodLabel = (method) => {
    return method === "cash" ? "Cash on Delivery" : "GCash";
  };

  const buildTimeline = () => {
    if (!order) return [];

    if (order.timeline && order.timeline.length > 0) {
      return order.timeline;
    }

    const timeline = [];

    timeline.push({
      status: "pending",
      label: "Order Placed",
      description: "Your order has been received",
      time: order.created_at,
      completed: true,
    });

    if (order.confirmed_at) {
      timeline.push({
        status: "confirmed",
        label: "Order Confirmed",
        description: "Your order has been confirmed",
        time: order.confirmed_at,
        completed: true,
      });
    }

    if (order.preparing_at) {
      timeline.push({
        status: "preparing",
        label: "Preparing Order",
        description: "Your order is being prepared",
        time: order.preparing_at,
        completed: true,
      });
    }

    if (order.out_for_delivery_at) {
      timeline.push({
        status: "out_for_delivery",
        label: "Out for Delivery",
        description: "Your order is on its way",
        time: order.out_for_delivery_at,
        completed: true,
      });
    }

    if (order.delivered_at) {
      timeline.push({
        status: "delivered",
        label: "Delivered",
        description: "Your order has been delivered",
        time: order.delivered_at,
        completed: true,
      });
    }

    if (order.failed_at) {
      timeline.push({
        status: "failed",
        label: "Delivery Failed",
        description: order.failure_reason || "Delivery was unsuccessful",
        time: order.failed_at,
        completed: true,
      });
    }

    return timeline;
  };

  if (!isOpen) return null;

  const config = order ? getStatusConfig(order.status) : DEFAULT_STATUS_CONFIG.pending;
  const timeline = buildTimeline();
  const isActive = order && ["pending", "confirmed", "preparing", "out_for_delivery"].includes(order.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5 sm:rounded-3xl lg:max-w-3xl">
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-3 right-3 z-10 rounded-full p-1.5 transition-colors hover:bg-gray-100 sm:top-4 sm:right-4 sm:p-2">
            <X className="h-5 w-5 text-gray-600 sm:h-6 sm:w-6" />
          </button>

          {loading ? (
            <div className="flex items-center justify-center py-24 sm:py-32">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#30442B] sm:h-16 sm:w-16"></div>
            </div>
          ) : error ? (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">{error}</div>
            </div>
          ) : order ? (
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Header */}
              <div className="mb-4 sm:mb-5 lg:mb-6">
                <div className="mb-3 flex flex-col justify-between gap-3 sm:mb-4 sm:flex-row sm:items-center sm:gap-4">
                  <div>
                    <h2 className="font-outfit text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">{order.order_number}</h2>
                    <div className="mt-1.5 flex items-center gap-1.5 text-gray-600 sm:mt-2 sm:gap-2">
                      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide uppercase sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm ${config.bgColor} ${config.textColor}`}
                  >
                    {getStatusIcon(order.status, "w-3.5 h-3.5 sm:w-4 sm:h-4")}
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Order Timeline - Show for active orders */}
              {timeline.length > 0 && (
                <div className="mb-4 sm:mb-5 lg:mb-6">
                  <h3 className="font-outfit mb-3 flex items-center gap-1.5 text-lg font-semibold text-gray-900 sm:mb-4 sm:gap-2 sm:text-xl">
                    <Clock className="h-4 w-4 text-[#30442B] sm:h-5 sm:w-5" />
                    Order Tracking
                  </h3>
                  <div className="relative">
                    {/* Timeline */}
                    <div className="space-y-0">
                      {timeline.map((item, index) => {
                        const itemConfig = getStatusConfig(item.status);
                        const isLast = index === timeline.length - 1;

                        return (
                          <div key={index} className="flex gap-3 sm:gap-4">
                            {/* Timeline indicator */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10 ${
                                  item.completed ? `${itemConfig.bgColor} ${itemConfig.textColor}` : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {getStatusIcon(item.status, "w-4 h-4 sm:w-5 sm:h-5")}
                              </div>
                              {!isLast && <div className={`h-10 w-0.5 sm:h-12 ${item.completed ? "bg-[#30442B]" : "bg-gray-200"}`} />}
                            </div>

                            {/* Content */}
                            <div className={`flex-1 pb-4 sm:pb-6 ${isLast ? "pb-0" : ""}`}>
                              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center sm:gap-2">
                                <p className={`text-sm font-semibold sm:text-base ${item.completed ? "text-gray-900" : "text-gray-400"}`}>{item.label}</p>
                                {item.time && <span className="text-sm text-gray-500">{formatShortDate(item.time)}</span>}
                              </div>
                              <p className={`mt-1 text-sm ${item.completed ? "text-gray-600" : "text-gray-400"}`}>{item.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="mb-4 sm:mb-5 lg:mb-6">
                <h3 className="font-outfit mb-3 flex items-center gap-1.5 text-lg font-semibold text-gray-900 sm:mb-4 sm:gap-2 sm:text-xl">
                  <Package className="h-4 w-4 text-[#30442B] sm:h-5 sm:w-5" />
                  Order Items
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:rounded-xl sm:p-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 sm:text-base">{item.product_name}</p>
                          {item.variant_name && <p className="text-sm text-gray-600">{item.variant_name}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">x{item.quantity}</p>
                          <p className="font-semibold text-[#30442B]">₱{Number(item.line_total || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-center text-gray-500">No items found</p>
                  )}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="mb-4 rounded-lg bg-gray-50 p-3 sm:mb-5 sm:rounded-xl sm:p-4 lg:mb-6">
                <div className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₱{Number(order.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₱{Number(order.delivery_fee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-300 pt-2 text-lg font-bold text-[#30442B]">
                    <span>Total</span>
                    <span>₱{Number(order.total || order.total_amount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="mb-4 sm:mb-5 lg:mb-6">
                <h3 className="font-outfit mb-3 flex items-center gap-1.5 text-lg font-semibold text-gray-900 sm:mb-4 sm:gap-2 sm:text-xl">
                  <MapPin className="h-4 w-4 text-[#30442B] sm:h-5 sm:w-5" />
                  Delivery Information
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 sm:h-5 sm:w-5" />
                    <div>
                      <p className="mb-0.5 text-xs font-medium text-gray-700 sm:mb-1 sm:text-sm">Delivery Address</p>
                      <p className="text-sm text-gray-900 sm:text-base">{order.delivery_address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 sm:h-5 sm:w-5" />
                    <div>
                      <p className="mb-0.5 text-xs font-medium text-gray-700 sm:mb-1 sm:text-sm">Contact Number</p>
                      <p className="text-sm text-gray-900 sm:text-base">{order.delivery_contact}</p>
                    </div>
                  </div>

                  {order.delivery_instructions && (
                    <div className="flex items-start gap-3">
                      <Package className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                      <div>
                        <p className="mb-1 text-sm font-medium text-gray-700">Delivery Instructions</p>
                        <p className="text-gray-900">{order.delivery_instructions}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                    <div>
                      <p className="mb-1 text-sm font-medium text-gray-700">Payment Method</p>
                      <p className="text-gray-900">{getPaymentMethodLabel(order.payment_method)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              {order.status === "delivered" && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Order Delivered!</p>
                    <p className="text-sm text-green-700">Your order was delivered on {formatDate(order.delivered_at)}.</p>
                  </div>
                </div>
              )}

              {order.status === "failed" && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">Delivery Failed</p>
                    <p className="text-sm text-red-700">{order.failure_reason || "The delivery was unsuccessful. Please contact support for assistance."}</p>
                  </div>
                </div>
              )}

              {order.status === "cancelled" && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Order Cancelled</p>
                    <p className="text-sm text-gray-700">This order has been cancelled.</p>
                  </div>
                </div>
              )}

              {isActive && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 animate-pulse text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Order in Progress</p>
                    <p className="text-sm text-blue-700">
                      {order.status === "pending" && "Your order is waiting to be confirmed."}
                      {order.status === "confirmed" && "Your order has been confirmed and will be prepared soon."}
                      {order.status === "preparing" && "Your order is being prepared with care."}
                      {order.status === "out_for_delivery" && "Your order is on its way! Get ready!"}
                    </p>
                  </div>
                </div>
              )}

              {/* Cancel Order Section - Show for pending/confirmed */}
              {(order.status === "pending" || order.status === "confirmed") && !showCancelConfirm && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-amber-900">Need to cancel?</p>
                    <p className="mb-3 text-sm text-amber-700">You can still cancel this order since it hasn't started preparation yet.</p>
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel Order
                    </button>
                  </div>
                </div>
              )}

              {/* Cancel Confirmation Dialog */}
              {showCancelConfirm && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-900">Confirm Cancellation</p>
                      <p className="mb-4 text-sm text-red-700">Are you sure you want to cancel this order? This action cannot be undone.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancelOrder}
                          disabled={cancelLoading}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {cancelLoading ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              Cancelling...
                            </>
                          ) : (
                            "Yes, Cancel Order"
                          )}
                        </button>
                        <button
                          onClick={() => setShowCancelConfirm(false)}
                          disabled={cancelLoading}
                          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Keep Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Store Section - Show for preparing and beyond */}
              {["preparing", "out_for_delivery"].includes(order.status) && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
                  <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-orange-900">Can't cancel this order?</p>
                    <p className="mb-3 text-sm text-orange-700">This order is already being prepared or is out for delivery. Please contact the store directly to request cancellation.</p>
                    <button
                      onClick={handleGoToContact}
                      className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Go to Contact
                    </button>
                  </div>
                </div>
              )}

              {/* Delivery Proof */}
              {order.delivery_proof_url && (
                <div className="mb-6">
                  <h3 className="font-outfit mb-4 text-xl font-semibold text-gray-900">Delivery Proof</h3>
                  <img src={order.delivery_proof_url} alt="Delivery proof" className="w-full max-w-md rounded-xl border border-gray-200" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex justify-end sm:mt-5 lg:mt-6">
                <button onClick={onClose} className="rounded-lg bg-[#30442B] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#405939] sm:px-6 sm:py-3 sm:text-base">
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
