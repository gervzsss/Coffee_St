import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import OrderCard from '../components/OrderCard';
import OrderDetailModal from '../components/OrderDetailModal';

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

  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Compact Orders Header */}
        <div className="w-full bg-[#30442B] pb-8 pt-12">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              My Orders
            </h1>
            <p className="text-gray-200 text-sm md:text-base mt-1">
              Track your order history and current deliveries
            </p>
          </div>
        </div>

        {/* Orders Content */}
        <section className="relative pb-24">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 mt-8">
            {loading ? (
              <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#30442B]"></div>
              </div>
            ) : error ? (
              <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="space-y-6">
                <EmptyState
                  icon={
                    <svg
                      className="w-24 h-24 mx-auto mb-4 text-gray-300"
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
              <div className="space-y-6">
                {/* Filter Buttons */}
                <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleFilterChange('all')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          statusFilter === 'all'
                            ? 'bg-[#30442B] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        All Orders
                      </button>
                      <button
                        onClick={() => handleFilterChange('pending')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          statusFilter === 'pending'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => handleFilterChange('paid')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          statusFilter === 'paid'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        Completed
                      </button>
                      <button
                        onClick={() => handleFilterChange('cancelled')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          statusFilter === 'cancelled'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        Cancelled
                      </button>
                    </div>
                  </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                  <div className="rounded-3xl bg-white p-12 shadow-lg ring-1 ring-gray-900/5 text-center">
                    <p className="text-gray-600">No orders found with the selected filter.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onViewDetails={handleViewDetails}
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
      />
    </>
  );
}
