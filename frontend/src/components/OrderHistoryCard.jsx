import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle } from 'lucide-react';
import api from '../services/apiClient';

export default function OrderHistoryCard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const response = await api.get('/user/recent-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch recent orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      placed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order History Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-outfit text-lg font-semibold text-gray-900">Order History</h3>
            <p className="text-sm text-gray-500">Latest system events and updates</p>
          </div>
          <Link
            to="/orders"
            className="text-gray-400 hover:text-[#30442B] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No orders yet</p>
            </div>
          ) : (
            orders.map((order) => (
              <Link
                key={order.id}
                to="/orders"
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {order.status === 'placed' ? 'New order placed' : `Order ${order.order_number} ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.items_summary}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-xs text-gray-500">{order.created_at}</p>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Clean Record Badge */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Clean record</h3>
              <p className="text-sm text-gray-600">
                No scam warnings or fraudulent activity reported
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
