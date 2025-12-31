import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { AdminLayout } from "../components/layout";
import { AdminAnimatedPage, LoadingSpinner } from "../components/common";
import { OrderCard, OrderDetailModal, ConfirmStatusModal, FailureReasonModal, OrderStatusCardSkeleton, OrderCardSkeleton } from "../components/orders";
import { useOrders } from "../hooks/useOrders";

export default function Orders() {
  const {
    filteredOrders,
    loading,
    filterStatus,
    searchTerm,
    selectedOrder,
    detailLoading,
    confirmModal,
    failModal,
    updating,
    statusCards,
    setFilterStatus,
    setSearchTerm,
    handleViewOrder,
    closeOrderDetail,
    handleQuickStatusChange,
    confirmStatusUpdate,
    handleStatusUpdate,
    handleMarkFailed,
    confirmFailure,
    closeConfirmModal,
    closeFailModal,
    refetch,
  } = useOrders();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <AdminLayout>
      <AdminAnimatedPage className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">ORDERS & TRACKING</h1>
                <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">Manage customer orders and track their progress</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                aria-label="Refresh orders"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2.5"
              >
                <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${refreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Order Status Cards */}
          <div className="mb-6 grid grid-cols-2 gap-2 sm:mb-8 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5 lg:gap-4">
            {statusCards.map((card) => (
              <div
                key={card.key}
                onClick={() => setFilterStatus(card.key)}
                className={`cursor-pointer rounded-lg border-2 p-3 transition-all duration-300 sm:rounded-xl sm:p-4 ${
                  filterStatus === card.key ? "border-[#30442B] bg-[#30442B] text-white" : "border-gray-200 bg-white text-gray-800 hover:border-[#30442B]/30"
                }`}
              >
                <div className={`text-xs font-medium sm:text-sm ${filterStatus === card.key ? "text-white/80" : "text-gray-500"}`}>{card.label}</div>
                <div className="mt-0.5 text-xl font-bold sm:mt-1 sm:text-2xl lg:text-3xl">{card.count}</div>
              </div>
            ))}
          </div>

          {/* Search Section */}
          <div className="mb-6 rounded-xl bg-[#30442B] p-3 sm:mb-8 sm:rounded-2xl sm:p-4">
            <div className="flex flex-col items-stretch justify-between gap-3 sm:gap-4 md:flex-row md:items-center">
              <div className="relative max-w-2xl flex-1">
                <svg className="absolute top-3 left-3 h-4 w-4 text-gray-400 sm:top-3.5 sm:left-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by Order number or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border-0 bg-white py-2.5 pr-4 pl-10 text-xs text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-white/50 sm:py-3 sm:pl-12 sm:text-sm"
                />
              </div>
              <div className="relative">
                <select
                  className="w-full cursor-pointer appearance-none rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 pr-8 text-sm font-medium text-white transition-colors hover:bg-white/20 sm:px-4 sm:py-3 sm:pr-10 md:w-auto"
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
                <svg className="pointer-events-none absolute top-3 right-2 h-4 w-4 text-white sm:top-3.5 sm:right-3 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Orders List Header */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">All Orders ({filteredOrders.length})</h2>
          </div>

          {/* Orders List */}
          <div className="space-y-3 sm:space-y-4">
            {loading ? (
              <>
                <OrderCardSkeleton />
                <OrderCardSkeleton />
                <OrderCardSkeleton />
              </>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white py-8 text-center sm:py-12">
                <svg className="mx-auto mb-3 h-12 w-12 text-gray-300 sm:mb-4 sm:h-16 sm:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-sm text-gray-500 sm:text-base">No orders found</p>
              </div>
            ) : (
              filteredOrders.map((order) => <OrderCard key={order.id} order={order} onViewDetails={handleViewOrder} onQuickStatusChange={handleQuickStatusChange} />)
            )}
          </div>
        </div>
      </AdminAnimatedPage>

      {/* Order Detail Modal */}
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={closeOrderDetail} onStatusUpdate={handleStatusUpdate} onMarkFailed={handleMarkFailed} />}

      {/* Quick Status Change Confirmation Modal */}
      <ConfirmStatusModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmStatusUpdate}
        fromStatus={confirmModal.fromStatus}
        toStatus={confirmModal.toStatus}
        loading={updating}
      />

      {/* Quick Failure Modal */}
      <FailureReasonModal isOpen={failModal.isOpen} onClose={closeFailModal} onConfirm={confirmFailure} loading={updating} />

      {/* Loading overlay for detail */}
      {detailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="rounded-xl bg-white p-6">
            <LoadingSpinner size="sm" />
            <p className="mt-3 text-gray-600">Loading order details...</p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
