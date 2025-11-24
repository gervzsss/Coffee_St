import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminHeader from '../components/AdminHeader';
import StatCard from '../components/StatCard';
import { getDashboardStats } from '../services/dashboardService';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const result = await getDashboardStats();
      if (result.success) {
        setStats(result.data);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader title="Dashboard" />
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon="📦"
            color="blue"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats?.totalRevenue || 0}`}
            icon="💰"
            color="green"
          />
          <StatCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon="☕"
            color="amber"
          />
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon="👥"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.order_number}</p>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.total_amount}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Pending Inquiries</h3>
            <div className="space-y-3">
              {stats?.pendingInquiries && stats.pendingInquiries.length > 0 ? (
                stats.pendingInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{inquiry.subject}</p>
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{inquiry.user_name}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No pending inquiries</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
