import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import adminApi from "../../services/apiClient";
import { format } from "date-fns";

const NotificationModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/notifications");
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await adminApi.post(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, is_read: true, read_at: new Date() } : notif)));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await adminApi.post("/notifications/mark-all-read");
      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true, read_at: new Date() })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await adminApi.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "sold_out":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "low_stock":
        return <Package className="h-5 w-5 text-yellow-500" />;
      case "stock_restored":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type) => {
    switch (type) {
      case "sold_out":
        return "bg-red-50 border-red-200";
      case "low_stock":
        return "bg-yellow-50 border-yellow-200";
      case "stock_restored":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.is_read;
    if (filter === "read") return notif.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/50" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative mx-4 flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
                </p>
              )}
            </div>
            <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-4 border-b border-gray-200 bg-gray-50 px-6 py-3">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${filter === "all" ? "bg-[#30442B] text-white shadow-md" : "text-gray-600 hover:bg-gray-200"}`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${filter === "unread" ? "bg-[#30442B] text-white shadow-md" : "text-gray-600 hover:bg-gray-200"}`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${filter === "read" ? "bg-[#30442B] text-white shadow-md" : "text-gray-600 hover:bg-gray-200"}`}
            >
              Read ({notifications.length - unreadCount})
            </button>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="ml-auto text-sm font-medium text-[#30442B] hover:text-[#5d7f52]">
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="border-coffee h-12 w-12 animate-spin rounded-full border-b-2"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-12 text-center">
                <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <p className="text-lg text-gray-500">{filter === "unread" ? "No unread notifications" : filter === "read" ? "No read notifications" : "No notifications yet"}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`rounded-lg border p-4 ${getNotificationBgColor(notification.type)} ${notification.is_read ? "opacity-60" : ""} transition-opacity`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 shrink-0">{getNotificationIcon(notification.type)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            <p className="mt-1 text-sm text-gray-700">{notification.message}</p>
                            {notification.product && <p className="mt-2 text-xs text-gray-500">Product: {notification.product.name}</p>}
                            <p className="mt-2 text-xs text-gray-400">{format(new Date(notification.created_at), "MMM dd, yyyy hh:mm a")}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.is_read && (
                              <button onClick={() => markAsRead(notification.id)} className="text-xs font-medium text-[#30442B] hover:text-[#5d7f52]">
                                Mark read
                              </button>
                            )}
                            <button onClick={() => deleteNotification(notification.id)} className="text-gray-400 transition-colors hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationModal;
