import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useOrders } from "../hooks/useOrders";
import { Header, Footer } from "../components/layout";
import { EmptyState, AnimatedPage } from "../components/common";
import { OrderCard, OrderDetailModal } from "../components/orders";

// Status configuration matching admin
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "yellow",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
  confirmed: {
    label: "Confirmed",
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
  preparing: {
    label: "Preparing",
    color: "indigo",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-800",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
  },
  delivered: {
    label: "Delivered",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  failed: {
    label: "Failed",
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
  },
  cancelled: {
    label: "Cancelled",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
  },
};

export default function Orders() {
  useAuth();
  const { orders, loading, error, refetchOrders } = useOrders();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchOrders();
    setRefreshing(false);
  };

  const statusFilter = searchParams.get("status") || "all";

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOrderUpdated = async () => {
    await refetchOrders();
  };

  const handleFilterChange = (status) => {
    if (status === "all") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", status);
    }
    setSearchParams(searchParams);
  };

  // Group filter logic
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") {
      return ["pending", "confirmed", "preparing", "out_for_delivery"].includes(order.status);
    }
    if (statusFilter === "completed") {
      return order.status === "delivered";
    }
    if (statusFilter === "cancelled") {
      return ["cancelled", "failed"].includes(order.status);
    }
    return order.status === statusFilter;
  });

  // Count orders by category
  const activeCount = orders.filter((o) => ["pending", "confirmed", "preparing", "out_for_delivery"].includes(o.status)).length;
  const completedCount = orders.filter((o) => o.status === "delivered").length;
  const cancelledCount = orders.filter((o) => ["cancelled", "failed"].includes(o.status)).length;

  return (
    <>
      <Header />
      <AnimatedPage className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
        {/* Compact Orders Header */}
        <div className="w-full bg-[#30442B] pt-8 pb-6 sm:pt-12 sm:pb-8">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">My Orders</h1>
                <p className="mt-1 text-xs text-gray-200 sm:text-sm lg:text-base">Track your order history and current deliveries</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                aria-label="Refresh orders"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2.5"
              >
                <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${refreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Orders Content */}
        <section className="relative pb-16 sm:pb-24">
          <div className="mx-auto mt-6 max-w-6xl px-4 sm:mt-8 sm:px-6 lg:px-10">
            {loading ? (
              <div className="flex items-center justify-center py-20 sm:py-32">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#30442B] sm:h-16 sm:w-16"></div>
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-900/5 sm:rounded-3xl sm:p-6 lg:p-8">
                <div className="rounded border border-red-400 bg-red-100 px-3 py-2 text-sm text-red-700 sm:px-4 sm:py-3 sm:text-base">{error}</div>
              </div>
            ) : orders.length === 0 ? (
              <div className="space-y-4 sm:space-y-6">
                <EmptyState
                  icon={
                    <svg className="mx-auto mb-3 h-16 w-16 text-gray-300 sm:mb-4 sm:h-20 sm:w-20 lg:h-24 lg:w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  }
                  title="No Orders Yet"
                  description="You haven't placed any orders yet. Start exploring our menu and place your first order!"
                  actionText="Browse Menu"
                  actionTo="/products"
                />
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Filter Buttons */}
                <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-900/5 sm:rounded-3xl sm:p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                    <span className="text-xs font-medium text-gray-700 sm:text-sm">Filter by status:</span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <button
                        onClick={() => handleFilterChange("all")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm ${
                          statusFilter === "all" ? "bg-[#30442B] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        All ({orders.length})
                      </button>
                      <button
                        onClick={() => handleFilterChange("active")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm ${
                          statusFilter === "active" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        Active ({activeCount})
                      </button>
                      <button
                        onClick={() => handleFilterChange("completed")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm ${
                          statusFilter === "completed" ? "bg-green-600 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        Completed ({completedCount})
                      </button>
                      <button
                        onClick={() => handleFilterChange("cancelled")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm ${
                          statusFilter === "cancelled" ? "bg-red-600 text-white" : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        Cancelled ({cancelledCount})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                  <div className="rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-gray-900/5 sm:rounded-3xl sm:p-12">
                    <p className="text-sm text-gray-600 sm:text-base">No orders found with the selected filter.</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {filteredOrders.map((order) => (
                      <OrderCard key={order.id} order={order} onViewDetails={handleViewDetails} statusConfig={STATUS_CONFIG} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </AnimatedPage>
      <Footer />

      {/* Order Detail Modal */}
      <OrderDetailModal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal} order={selectedOrder} statusConfig={STATUS_CONFIG} onOrderUpdated={handleOrderUpdated} />
    </>
  );
}
