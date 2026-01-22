import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout, AdminHeader } from "../components/layout";
import { usePosMode } from "../context/PosModeContext";
import { usePendingPosOrders } from "../context/PendingPosOrdersContext";
import { useAdminToast } from "../hooks/useAdminToast";
import { getPosOrder, updatePosOrderStatus } from "../services/posService";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDateTime } from "../utils/formatDate";
import { LoadingSpinner, ButtonSpinner } from "../components/common";
import { getPosStatusConfig, getPosNextStatuses } from "../constants/posStatus";
import { POSOrderDetailSkeleton } from "../components/pos";

export default function POSOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isPosMode } = usePosMode();
  const { refresh: refreshPendingOrders } = usePendingPosOrders();
  const { showToast } = useAdminToast();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Redirect if not in POS mode
  useEffect(() => {
    if (!isPosMode) {
      navigate("/admin/dashboard");
    }
  }, [isPosMode, navigate]);

  const fetchOrder = useCallback(async () => {
    setIsLoading(true);
    const result = await getPosOrder(id);

    if (result.success) {
      setOrder(result.data);
    } else {
      showToast(result.error, { type: "error" });
      navigate("/admin/pos/orders");
    }
    setIsLoading(false);
  }, [id, showToast, navigate]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    const result = await updatePosOrderStatus(id, { status: newStatus });

    if (result.success) {
      showToast("Order status updated", { type: "success" });
      fetchOrder();
      // Refresh pending orders count in sidebar
      refreshPendingOrders();
    } else {
      showToast(result.error, { type: "error" });
    }
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <AdminHeader
          title="Order Details"
          action={
            <button
              onClick={() => navigate("/admin/pos/orders")}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Orders
            </button>
          }
        />
        <div className="p-4 lg:p-6">
          <POSOrderDetailSkeleton />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-500">Order not found</p>
        </div>
      </AdminLayout>
    );
  }

  const statusConfig = getPosStatusConfig(order.status);
  const nextStatuses = order.valid_transitions || getPosNextStatuses(order.status);

  return (
    <AdminLayout>
      <AdminHeader
        title={`Order ${order.order_number}`}
        action={
          <button
            onClick={() => navigate("/admin/pos/orders")}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Orders
          </button>
        }
      />

      <div className="p-4 lg:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Status Card */}
              <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                <div className="border-b border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
                    <span className={`rounded-full px-4 py-1.5 text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>{statusConfig.label}</span>
                  </div>
                </div>

                {nextStatuses.length > 0 && (
                  <div className="bg-gray-50 p-4">
                    <p className="mb-3 text-sm font-medium text-gray-700">Update Status:</p>
                    <div className="flex flex-wrap gap-2">
                      {nextStatuses.map((status) => {
                        const nextConfig = getPosStatusConfig(status);
                        const isPrimary = status === "preparing" || status === "delivered";
                        return (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(status)}
                            disabled={isUpdating}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                              isPrimary
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : status === "cancelled"
                                  ? "bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                                  : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {isUpdating ? <ButtonSpinner /> : status === "delivered" ? "Mark Complete" : `Mark ${nextConfig.label}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                <div className="border-b border-gray-100 p-4">
                  <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                          {item.variants && item.variants.length > 0 && <p className="mt-1 text-sm text-gray-500">{item.variants.map((v) => `${v.group_name}: ${v.name}`).join(", ")}</p>}
                          <p className="mt-1 text-sm text-gray-600">
                            {formatCurrency(item.unit_price)} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-semibold text-gray-900">{formatCurrency(item.line_total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Timeline */}
              {order.status_logs && order.status_logs.length > 0 && (
                <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                  <div className="border-b border-gray-100 p-4">
                    <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {order.status_logs.map((log, idx) => {
                        const toConfig = getPosStatusConfig(log.to_status);
                        return (
                          <div key={log.id} className="flex gap-3">
                            <div className="relative flex flex-col items-center">
                              <div className={`h-3 w-3 rounded-full ${toConfig.bgColor} ring-4 ring-white`} />
                              {idx < order.status_logs.length - 1 && <div className="absolute top-3 h-full w-0.5 bg-gray-200" />}
                            </div>
                            <div className="flex-1 pb-4">
                              <p className="text-sm font-medium text-gray-900">
                                {log.from_status ? (
                                  <>
                                    {getPosStatusConfig(log.from_status).label} → {toConfig.label}
                                  </>
                                ) : (
                                  <>Order {toConfig.label}</>
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {log.changed_by} • {formatDateTime(log.created_at)}
                              </p>
                              {log.notes && <p className="mt-1 text-sm text-gray-600">{log.notes}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                <div className="border-b border-gray-100 p-4">
                  <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-600">
                        Discount ({order.discount_percent}%)
                        {order.discount_reason && <span className="text-xs"> - {order.discount_reason}</span>}
                      </span>
                      <span className="font-medium text-amber-600">-{formatCurrency(order.discount_amount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-emerald-600">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                <div className="border-b border-gray-100 p-4">
                  <h2 className="text-lg font-semibold text-gray-900">Customer</h2>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.customer_name}</p>
                      {order.customer_phone && <p className="text-sm text-gray-500">{order.customer_phone}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                <div className="border-b border-gray-100 p-4">
                  <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${order.payment_method === "gcash" ? "bg-blue-100" : "bg-green-100"}`}>
                      {order.payment_method === "gcash" ? (
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{order.payment_method}</p>
                      <p className="text-sm text-gray-500">Paid</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                  <div className="border-b border-gray-100 p-4">
                    <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
