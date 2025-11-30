import { AdminLayout } from '../components/layout';
import { LoadingSpinner } from '../components/common';
import {
  OrderCard,
  OrderDetailModal,
  ConfirmStatusModal,
  FailureReasonModal,
} from '../components/orders';
import { useOrders } from '../hooks/useOrders';

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
  } = useOrders();

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
              ORDERS & TRACKING
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Manage customer orders and track their progress
            </p>
          </div>

          {/* Order Status Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
            {statusCards.map((card) => (
              <div
                key={card.key}
                onClick={() => setFilterStatus(card.key)}
                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  filterStatus === card.key
                    ? 'bg-[#30442B] text-white border-[#30442B]'
                    : 'bg-white text-gray-800 border-gray-200 hover:border-[#30442B]/30'
                }`}
              >
                <div
                  className={`text-xs sm:text-sm font-medium ${
                    filterStatus === card.key
                      ? 'text-white/80'
                      : 'text-gray-500'
                  }`}
                >
                  {card.label}
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold mt-0.5 sm:mt-1">
                  {card.count}
                </div>
              </div>
            ))}
          </div>

          {/* Search Section */}
          <div className="bg-[#30442B] rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
              <div className="relative flex-1 max-w-2xl">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-4 top-3 sm:top-3.5"
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
                  placeholder="Search by Order number or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg border-0 bg-white focus:ring-2 focus:ring-white/50 placeholder-gray-400 text-gray-800 text-xs sm:text-sm"
                />
              </div>
              <div className="relative">
                <select
                  className="appearance-none w-full md:w-auto px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer text-sm font-medium"
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
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white absolute right-2 sm:right-3 top-3 sm:top-3.5 pointer-events-none"
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
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              All Orders ({filteredOrders.length})
            </h2>
          </div>

          {/* Orders List */}
          <div className="space-y-3 sm:space-y-4">
            {loading ? (
              <LoadingSpinner className="py-8 sm:py-12" />
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-white rounded-xl border border-gray-200">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4"
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
                <p className="text-sm sm:text-base text-gray-500">
                  No orders found
                </p>
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
          onClose={closeOrderDetail}
          onStatusUpdate={handleStatusUpdate}
          onMarkFailed={handleMarkFailed}
        />
      )}

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
      <FailureReasonModal
        isOpen={failModal.isOpen}
        onClose={closeFailModal}
        onConfirm={confirmFailure}
        loading={updating}
      />

      {/* Loading overlay for detail */}
      {detailLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6">
            <LoadingSpinner size="sm" />
            <p className="text-gray-600 mt-3">Loading order details...</p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
