import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getAllOrders, updateOrderStatus } from '../services/orderService';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getAllOrders();
    if (result.success) {
      setOrders(result.data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    'out-for-delivery': orders.filter((o) => o.status === 'out-for-delivery')
      .length,
    completed: orders.filter((o) => o.status === 'completed').length,
    failed: orders.filter(
      (o) => o.status === 'failed' || o.status === 'cancelled'
    ).length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-50 text-blue-700';
      case 'out-for-delivery':
        return 'bg-purple-50 text-purple-700';
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'cancelled':
      case 'failed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header Section */}
          <div className="bg-[#30442B] text-white rounded-2xl p-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              ORDERS & TRACKING
            </h1>
            <p className="text-sm text-white/80 mt-2">
              Manage customer orders and track their progress
            </p>
          </div>

          {/* Order Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            {/* All Orders */}
            <div
              onClick={() => setFilterStatus('all')}
              className={`bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105 group ${
                filterStatus === 'all'
                  ? 'border-[#30442B] bg-[#30442B]/5'
                  : 'border-gray-100'
              }`}
            >
              <div className="text-4xl font-bold mb-2 text-gray-800 group-hover:text-[#30442B]">
                {statusCounts.all}
              </div>
              <div className="text-sm font-medium text-gray-500 group-hover:text-[#30442B]">
                All Orders
              </div>
            </div>

            {/* Processing Orders */}
            <div
              onClick={() => setFilterStatus('processing')}
              className={`bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105 group ${
                filterStatus === 'processing'
                  ? 'border-blue-600 bg-blue-50/50'
                  : 'border-gray-100 hover:bg-blue-50/50'
              }`}
            >
              <div className="text-4xl font-bold mb-2 text-gray-800 group-hover:text-blue-600">
                {statusCounts.processing}
              </div>
              <div className="text-sm font-medium text-gray-500 group-hover:text-blue-600">
                Processing Orders
              </div>
            </div>

            {/* Out for Delivery */}
            <div
              onClick={() => setFilterStatus('out-for-delivery')}
              className={`bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105 group ${
                filterStatus === 'out-for-delivery'
                  ? 'border-purple-600 bg-purple-50/50'
                  : 'border-gray-100 hover:bg-purple-50/50'
              }`}
            >
              <div className="text-4xl font-bold mb-2 text-gray-800 group-hover:text-purple-600">
                {statusCounts['out-for-delivery']}
              </div>
              <div className="text-sm font-medium text-gray-500 group-hover:text-purple-600">
                Out for Delivery
              </div>
            </div>

            {/* Completed Orders */}
            <div
              onClick={() => setFilterStatus('completed')}
              className={`bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105 group ${
                filterStatus === 'completed'
                  ? 'border-green-600 bg-green-50/50'
                  : 'border-gray-100 hover:bg-green-50/50'
              }`}
            >
              <div className="text-4xl font-bold mb-2 text-gray-800 group-hover:text-green-600">
                {statusCounts.completed}
              </div>
              <div className="text-sm font-medium text-gray-500 group-hover:text-green-600">
                Completed Orders
              </div>
            </div>

            {/* Failed Orders */}
            <div
              onClick={() => setFilterStatus('failed')}
              className={`bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105 group ${
                filterStatus === 'failed'
                  ? 'border-red-600 bg-red-50/50'
                  : 'border-gray-100 hover:bg-red-50/50'
              }`}
            >
              <div className="text-4xl font-bold mb-2 text-gray-800 group-hover:text-red-600">
                {statusCounts.failed}
              </div>
              <div className="text-sm font-medium text-gray-500 group-hover:text-red-600">
                Failed Orders
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-[#30442B] rounded-2xl p-4 mb-8">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-2xl">
                <input
                  type="text"
                  placeholder="Search by order number or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-lg border border-[#415536] bg-white focus:border-[#415536] focus:ring-1 focus:ring-[#415536] placeholder-gray-400 text-gray-800 text-sm"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute right-3 top-3.5"
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
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                {filterStatus === 'all'
                  ? 'All Orders'
                  : `${
                      filterStatus.charAt(0).toUpperCase() +
                      filterStatus.slice(1)
                    } Orders`}{' '}
                ({filteredOrders.length})
              </h2>
            </div>

            {/* Order Items */}
            <div className="p-8 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30442B]"></div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="group bg-white rounded-xl border border-gray-100 p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-lg text-gray-900">
                            Order #{order.order_number}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status?.charAt(0).toUpperCase() +
                              order.status?.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="text-sm">{order.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">
                          ₱{Number(order.total_amount).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {order.items_count || 0} items
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B]/20 hover:bg-gray-50/80 transition-colors cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="out-for-delivery">
                          Out for Delivery
                        </option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
