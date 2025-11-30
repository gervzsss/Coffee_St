import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { Header, Footer } from '../components/layout';
import { EmptyState } from '../components/common';
import { OrderCard, OrderDetailModal } from '../components/orders';

// Status configuration matching admin
const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
  },
  preparing: {
    label: 'Preparing',
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
  },
  delivered: {
    label: 'Delivered',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  failed: {
    label: 'Failed',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  },
};

export default function Orders() {
  const { user } = useAuth();
  const { orders, loading, error } = useOrders();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const statusFilter = searchParams.get('status') || 'all';

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const handleFilterChange = (status) => {
    if (status === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams);
  };

  // Group filter logic
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') {
      return ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(
        order.status
      );
    }
    if (statusFilter === 'completed') {
      return order.status === 'delivered';
    }
    if (statusFilter === 'cancelled') {
      return ['cancelled', 'failed'].includes(order.status);
    }
    return order.status === statusFilter;
  });

  // Count orders by category
  const activeCount = orders.filter((o) =>
    ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status)
  ).length;
  const completedCount = orders.filter((o) => o.status === 'delivered').length;
  const cancelledCount = orders.filter((o) =>
    ['cancelled', 'failed'].includes(o.status)
  ).length;

  return (
    <>
      <Header />
      <main className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
        {/* Compact Orders Header */}
        <div className="w-full bg-[#30442B] pb-6 sm:pb-8 pt-8 sm:pt-12">
          <div className="container mx-auto px-4 sm:px-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              My Orders
            </h1>
            <p className="text-gray-200 text-xs sm:text-sm lg:text-base mt-1">
              Track your order history and current deliveries
            </p>
          </div>
        </div>

        {/* Orders Content */}
        <section className="relative pb-16 sm:pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 mt-6 sm:mt-8">
            {loading ? (
              <div className="flex justify-center items-center py-20 sm:py-32">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-[#30442B]"></div>
              </div>
            ) : error ? (
              <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 lg:p-8 shadow-lg ring-1 ring-gray-900/5">
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
                  {error}
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="space-y-4 sm:space-y-6">
                <EmptyState
                  icon={
                    <svg
                      className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-lg ring-1 ring-gray-900/5">
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      Filter by status:
                    </span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <button
                        onClick={() => handleFilterChange('all')}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                          statusFilter === 'all'
                            ? 'bg-[#30442B] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        All ({orders.length})
                      </button>
                      <button
                        onClick={() => handleFilterChange('active')}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                          statusFilter === 'active'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        Active ({activeCount})
                      </button>
                      <button
                        onClick={() => handleFilterChange('completed')}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                          statusFilter === 'completed'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        Completed ({completedCount})
                      </button>
                      <button
                        onClick={() => handleFilterChange('cancelled')}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                          statusFilter === 'cancelled'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        Cancelled ({cancelledCount})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                  <div className="rounded-2xl sm:rounded-3xl bg-white p-8 sm:p-12 shadow-lg ring-1 ring-gray-900/5 text-center">
                    <p className="text-sm sm:text-base text-gray-600">
                      No orders found with the selected filter.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {filteredOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onViewDetails={handleViewDetails}
                        statusConfig={STATUS_CONFIG}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        order={selectedOrder}
        statusConfig={STATUS_CONFIG}
      />
    </>
  );
}
