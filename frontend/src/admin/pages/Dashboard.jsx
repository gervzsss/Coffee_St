import { AdminLayout } from "../components/layout";
import { AdminAnimatedPage } from "../components/common";
import { StatCard, StatCardSkeleton, DashboardHeader, RecentActivityList, RecentActivitySkeleton } from "../components/dashboard";
import { SalesOverviewChart, TopSellingChart, ChartSkeleton } from "../components/charts";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useDashboardStats } from "../hooks/useDashboardStats";

export default function Dashboard() {
  const { admin } = useAdminAuth();
  const { stats, loading } = useDashboardStats();

  return (
    <AdminLayout>
      <AdminAnimatedPage className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <DashboardHeader adminName={admin?.first_name || "Admin"} />

        {/* Title */}
        <div className="mx-auto mb-4 max-w-screen-2xl sm:mb-6">
          <h2 className="text-xl font-bold text-[#30442B] sm:text-2xl">DASHBOARD</h2>
          <p className="text-xs text-gray-600 sm:text-sm">Overview of system activity and quick insights</p>
        </div>

        {/* Stat Cards */}
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 xl:gap-8">
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard title="Menu Items" value={stats?.totalProducts || 0} change="+3 from last month" trend="up" />
                <StatCard title="Active Users" value={stats?.totalUsers || 0} change="+12% from last month" trend="up" />
                <StatCard title="Current Orders" value={stats?.totalOrders || 0} change="+3 from last month" trend="up" />
                <StatCard title="Unread Messages" value={stats?.pendingInquiriesCount || 0} change="+3 from last month" trend="up" />
              </>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-2 lg:gap-8">
            {loading ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : (
              <>
                <SalesOverviewChart data={stats?.salesOverview} />
                <TopSellingChart data={stats?.topSelling} />
              </>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mx-auto max-w-screen-2xl">{loading ? <RecentActivitySkeleton /> : <RecentActivityList orders={stats?.recentOrders || []} />}</div>
      </AdminAnimatedPage>
    </AdminLayout>
  );
}
