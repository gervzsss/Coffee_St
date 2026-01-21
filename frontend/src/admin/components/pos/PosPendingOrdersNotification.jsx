import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePendingPosOrdersAlert } from "../../hooks/usePendingPosOrdersAlert";

/**
 * POS Pending Orders Notification Component
 * Displays a bell icon with badge showing pending POS orders count
 * Includes a dropdown panel with order details and quick actions
 */
export default function PosPendingOrdersNotification() {
  const navigate = useNavigate();
  const { pendingCount, latestOrder, isLoading } = usePendingPosOrdersAlert();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleViewOrders = () => {
    setIsOpen(false);
    navigate("/admin/pos/orders");
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50"
        aria-label={`Pending orders: ${pendingCount}`}
      >
        {/* Bell Icon */}
        <svg className={`h-4 w-4 ${pendingCount > 0 ? "text-amber-600" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge */}
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">{pendingCount > 9 ? "9+" : pendingCount}</span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-gray-200">
          {/* Header */}
          <div className="border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">Pending POS Orders</h3>
            <p className="text-xs text-gray-500">{pendingCount === 0 ? "No orders awaiting action" : `${pendingCount} order${pendingCount !== 1 ? "s" : ""} awaiting action`}</p>
          </div>

          {/* Content */}
          <div className="p-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              </div>
            ) : pendingCount === 0 ? (
              <div className="py-4 text-center">
                <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">All caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Latest Order Card */}
                {latestOrder && (
                  <div className="rounded-lg bg-amber-50 p-3 ring-1 ring-amber-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-amber-900">{latestOrder.order_number}</p>
                        <p className="text-xs text-amber-700">{formatTimeAgo(latestOrder.created_at)}</p>
                      </div>
                      <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-800">Confirmed</span>
                    </div>
                  </div>
                )}

                {/* Show more indicator */}
                {pendingCount > 1 && (
                  <p className="text-center text-xs text-gray-500">
                    +{pendingCount - 1} more order{pendingCount > 2 ? "s" : ""}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 p-3">
            <div className="flex gap-2">
              <button onClick={handleViewOrders} className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
                View Orders
              </button>
              <button onClick={() => setIsOpen(false)} className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
