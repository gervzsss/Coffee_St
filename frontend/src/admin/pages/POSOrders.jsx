import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout, AdminHeader } from "../components/layout";
import { usePosMode } from "../context/PosModeContext";
import { usePendingPosOrders } from "../context/PendingPosOrdersContext";
import { useAdminToast } from "../hooks/useAdminToast";
import { getPosOrders, updatePosOrderStatus } from "../services/posService";
import { formatCurrency } from "../utils/formatCurrency";
import { LoadingSpinner } from "../components/common";
import { getPosStatusConfig, getPosNextStatuses } from "../constants/posStatus";
import { POSOrderCardSkeleton } from "../components/pos";

export default function POSOrders() {
  const navigate = useNavigate();
  const { isPosMode } = usePosMode();
  const { refresh: refreshPendingOrders } = usePendingPosOrders();
  const { showToast } = useAdminToast();

  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("confirmed");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Redirect if not in POS mode
  useEffect(() => {
    if (!isPosMode) {
      navigate("/admin/dashboard");
    }
  }, [isPosMode, navigate]);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);

    // Fetch all orders for counts
    const allResult = await getPosOrders({});
    if (allResult.success) {
      setAllOrders(allResult.data);
    }

    // Fetch filtered orders for display
    const result = await getPosOrders({
      status: statusFilter === "all" ? undefined : statusFilter,
      search: searchQuery || undefined,
    });

    if (result.success) {
      setOrders(result.data);
    } else {
      showToast(result.error, { type: "error" });
    }
    setIsLoading(false);
  }, [statusFilter, searchQuery, showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    const result = await updatePosOrderStatus(orderId, { status: newStatus });

    if (result.success) {
      showToast("Order status updated", { type: "success" });
      fetchOrders();
      // Refresh pending orders count in sidebar
      refreshPendingOrders();
    } else {
      showToast(result.error, { type: "error" });
    }
    setUpdatingOrderId(null);
  };

  const statusCounts = {
    all: allOrders.length,
    confirmed: allOrders.filter((o) => o.status === "confirmed").length,
    preparing: allOrders.filter((o) => o.status === "preparing").length,
    delivered: allOrders.filter((o) => o.status === "delivered").length,
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="POS Orders"
        action={
          <button
            onClick={() => navigate("/admin/pos")}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Sale
          </button>
        }
      />

      <div className="p-4 lg:p-6">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "confirmed", label: "Confirmed" },
              { key: "preparing", label: "Preparing" },
              { key: "delivered", label: "Completed" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  statusFilter === tab.key ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">{statusCounts[tab.key]}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none sm:w-64"
            />
            <svg className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <POSOrderCardSkeleton key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white text-gray-500 ring-1 ring-gray-200">
            <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm">Create a new sale to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => {
              const statusConfig = getPosStatusConfig(order.status);
              const nextStatuses = order.valid_transitions || getPosNextStatuses(order.status);
              const isUpdating = updatingOrderId === order.id;

              return (
                <div key={order.id} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md">
                  {/* Header */}
                  <div className="border-b border-gray-100 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{order.order_number}</p>
                        <p className="text-sm text-gray-500">{order.time_ago}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>{statusConfig.label}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Customer */}
                    <div className="mb-3 flex items-center gap-2">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm text-gray-600">{order.customer_name}</span>
                    </div>

                    {/* Items Preview */}
                    <div className="mb-3 text-sm text-gray-600">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <p key={idx} className="truncate">
                          {item.quantity}× {item.product_name}
                        </p>
                      ))}
                      {order.items.length > 2 && <p className="text-gray-400">+{order.items.length - 2} more items</p>}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-sm text-gray-500">{order.items_count} items</span>
                      <span className="text-lg font-bold text-emerald-600">{formatCurrency(order.total)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {nextStatuses.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50 p-3">
                      <div className="flex gap-2">
                        {nextStatuses.map((status) => {
                          const nextConfig = getPosStatusConfig(status);
                          const isPrimary = status === "preparing" || status === "delivered";
                          return (
                            <button
                              key={status}
                              onClick={() => handleStatusUpdate(order.id, status)}
                              disabled={isUpdating}
                              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                                isPrimary
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                  : status === "cancelled"
                                    ? "bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                                    : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100"
                              }`}
                            >
                              {isUpdating ? "..." : status === "delivered" ? "Complete" : nextConfig.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
