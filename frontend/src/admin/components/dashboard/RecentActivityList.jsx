export default function RecentActivityList({ orders = [], maxItems = 4 }) {
  const displayedOrders = orders.slice(0, maxItems);
  const hasOrders = displayedOrders.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        Recent Activity
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Latest system events and updates
      </p>

      <ul className="space-y-6">
        {hasOrders ? (
          displayedOrders.map((order, index) => (
            <ActivityItem
              key={order.id}
              title={index === 0 ? 'New order placed' : 'Order completed'}
              description={`Order #${order.order_number} — $${order.total_amount} — ${order.status}`}
            />
          ))
        ) : (
          <ActivityItem
            title="No recent activity"
            description="System is ready for new orders"
          />
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
    <li className="border-l-2 border-[#30442B] pl-6 hover:border-l-4 transition-all duration-200">
      <div className="text-sm text-gray-700 font-medium">{title}</div>
      <div className="text-sm text-gray-500 mt-1">{description}</div>
    </li>
  );
}
