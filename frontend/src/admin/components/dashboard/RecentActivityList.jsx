export default function RecentActivityList({ orders = [], maxItems = 4 }) {
  const displayedOrders = orders.slice(0, maxItems);
  const hasOrders = displayedOrders.length > 0;

  return (
    <div className="rounded-xl bg-white p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <h3 className="mb-3 text-xl font-semibold text-gray-800">Recent Activity</h3>
      <p className="mb-6 text-sm text-gray-500">Latest system events and updates</p>

      <ul className="space-y-6">
        {hasOrders ? (
          displayedOrders.map((order, index) => (
            <ActivityItem key={order.id} title={index === 0 ? "New order placed" : "Order completed"} description={`Order #${order.order_number} — ₱${order.total} — ${order.status}`} />
          ))
        ) : (
          <ActivityItem title="No recent activity" description="System is ready for new orders" />
        )}
      </ul>
    </div>
  );
}

/**
 * Individual activity item component
 * @param {{ title: string, description: string }} props
 */
function ActivityItem({ title, description }) {
  return (
    <li className="border-l-2 border-[#30442B] pl-6 transition-all duration-200 hover:border-l-4">
      <div className="text-sm font-medium text-gray-700">{title}</div>
      <div className="mt-1 text-sm text-gray-500">{description}</div>
    </li>
  );
}
