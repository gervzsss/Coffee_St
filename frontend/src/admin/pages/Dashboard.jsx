import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import { getDashboardStats } from '../services/dashboardService';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function Dashboard() {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30442B]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header - Dark Olive Rounded Box */}
        <div className="bg-[#30442B] text-white rounded-2xl p-8 mb-8 max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">
                Welcome, {admin?.first_name || 'Admin'}!
              </h1>
              <p className="text-sm text-white/80 mt-2">
                {currentDate} — Welcome back to your coffee shop management
                dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6 max-w-screen-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[#30442B]">DASHBOARD</h2>
          <p className="text-sm text-gray-600">
            Overview of system activity and quick insights
          </p>
        </div>

        {/* Stat Cards */}
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Menu Items"
              value={stats?.totalProducts || 0}
              change="+3 from last month"
              trend="up"
            />
            <StatCard
              title="Active Users"
              value={stats?.totalUsers || 0}
              change="+12% from last month"
              trend="up"
            />
            <StatCard
              title="Current Orders"
              value={stats?.totalOrders || 0}
              change="+3 from last month"
              trend="up"
            />
            <StatCard
              title="Unread Messages"
              value={stats?.pendingInquiriesCount || 0}
              change="+3 from last month"
              trend="up"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales Overview (line) */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Sales Overview
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Daily sales for the past week
              </p>
              <div className="h-64 bg-linear-to-b from-white to-gray-50 rounded-lg flex items-end p-4">
                <svg viewBox="0 0 600 200" className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke="#30442B"
                    strokeWidth="4"
                    points="20,140 100,120 180,130 260,110 340,150 420,120 500,100"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Top Selling (bar) */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Top Selling
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Latest products trends this week
              </p>
              <div className="h-64 flex items-end gap-8 px-4">
                <div className="flex-1 h-full flex flex-col justify-end group">
                  <div className="mx-auto w-16 bg-[#30442B] rounded-t-lg h-40 transition-all duration-300 group-hover:h-44"></div>
                  <div className="text-center text-sm mt-3 font-medium">
                    macchiato
                  </div>
                </div>
                <div className="flex-1 h-full flex flex-col justify-end group">
                  <div className="mx-auto w-16 bg-[#4b6a4f] rounded-t-lg h-48 transition-all duration-300 group-hover:h-52"></div>
                  <div className="text-center text-sm mt-3 font-medium">
                    latte
                  </div>
                </div>
                <div className="flex-1 h-full flex flex-col justify-end group">
                  <div className="mx-auto w-16 bg-[#7ea37b] rounded-t-lg h-32 transition-all duration-300 group-hover:h-36"></div>
                  <div className="text-center text-sm mt-3 font-medium">
                    white mocha
                  </div>
                </div>
                <div className="flex-1 h-full flex flex-col justify-end group">
                  <div className="mx-auto w-16 bg-[#a9c7a8] rounded-t-lg h-28 transition-all duration-300 group-hover:h-32"></div>
                  <div className="text-center text-sm mt-3 font-medium">
                    americano
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="max-w-screen-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Latest system events and updates
            </p>

            <ul className="space-y-6">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.slice(0, 4).map((order, index) => (
                  <li
                    key={order.id}
                    className="border-l-2 border-[#30442B] pl-6 hover:border-l-4 transition-all duration-200"
                  >
                    <div className="text-sm text-gray-700 font-medium">
                      {index === 0 ? 'New order placed' : 'Order completed'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Order #{order.order_number} — ${order.total_amount} —{' '}
                      {order.status}
                    </div>
                  </li>
                ))
              ) : (
                <li className="border-l-2 border-[#30442B] pl-6 hover:border-l-4 transition-all duration-200">
                  <div className="text-sm text-gray-700 font-medium">
                    No recent activity
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    System is ready for new orders
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
