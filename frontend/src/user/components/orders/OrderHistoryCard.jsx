import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import api from "../../services/apiClient";
import { AccountStatusCard } from "../profile";

export default function OrderHistoryCard({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const response = await api.get("/user/recent-orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch recent orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      placed: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/3 rounded bg-gray-200"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded bg-gray-100"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Order History Card */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-4 lg:px-6">
          <div>
            <h3 className="font-outfit text-base font-semibold text-gray-900 sm:text-lg">Order History</h3>
            <p className="text-xs text-gray-500 sm:text-sm">Latest system events and updates</p>
          </div>
          <Link to="/orders" className="text-gray-400 transition-colors hover:text-[#30442B]">
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500 sm:px-6 sm:py-8">
              <p className="text-sm sm:text-base">No orders yet</p>
            </div>
          ) : (
            orders.map((order) => (
              <Link key={order.id} to="/orders" className="block px-4 py-3 transition-colors hover:bg-gray-50 sm:px-5 sm:py-4 lg:px-6">
                <div className="mb-1.5 flex items-start justify-between sm:mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 sm:text-base">
                      {order.status === "placed" ? "New order placed" : `Order ${order.order_number} ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{order.items_summary}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-xs text-gray-500">{order.created_at}</p>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Account Status Card */}
      {user && <AccountStatusCard user={user} />}
    </div>
  );
}
