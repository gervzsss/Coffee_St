import { AdminLayout } from '../components/layout';
import {
  StatCard,
  DashboardHeader,
  RecentActivityList,
} from '../components/dashboard';
import { SalesOverviewChart, TopSellingChart } from '../components/charts';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useDashboardStats } from '../hooks/useDashboardStats';

export default function Dashboard() {
  const { admin } = useAdminAuth();
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#30442B]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <DashboardHeader adminName={admin?.first_name || 'Admin'} />

        {/* Title */}
        <div className="mb-4 sm:mb-6 max-w-screen-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-[#30442B]">
            DASHBOARD
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Overview of system activity and quick insights
          </p>
        </div>

        {/* Stat Cards */}
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 xl:gap-8 mb-6 sm:mb-8">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            <SalesOverviewChart />
            <TopSellingChart />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="max-w-screen-2xl mx-auto">
          <RecentActivityList orders={stats?.recentOrders || []} />
        </div>
      </div>
    </AdminLayout>
  );
}
