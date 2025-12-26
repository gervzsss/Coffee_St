import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Calendar, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import adminApi from "../../services/apiClient";

const StockHistoryModal = ({ isOpen, onClose, product }) => {
  const [stockLogs, setStockLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    reason: "all",
    admin_user_id: "all",
    date_from: "",
    date_to: "",
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  useEffect(() => {
    if (isOpen && product) {
      fetchStockHistory();
    }
  }, [isOpen, product, filters, pagination.current_page]);

  const fetchStockHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current_page,
        per_page: pagination.per_page,
        ...filters,
      });

      const response = await adminApi.get(`/products/${product.id}/stock-history?${params}`);
      setStockLogs(response.data.stock_logs.data);
      setPagination({
        current_page: response.data.stock_logs.current_page,
        last_page: response.data.stock_logs.last_page,
        per_page: response.data.stock_logs.per_page,
        total: response.data.stock_logs.total,
      });
    } catch (error) {
      console.error("Error fetching stock history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current_page: newPage }));
  };

  const getReasonLabel = (reason) => {
    const labels = {
      sale: "Sale",
      restock: "Restock",
      adjustment: "Adjustment",
      damaged: "Damaged",
      expired: "Expired",
      returned: "Returned",
      order_cancelled: "Order Cancelled",
      order_failed: "Order Failed",
    };
    return labels[reason] || reason;
  };

  const getReasonColor = (reason) => {
    const colors = {
      sale: "text-blue-700 bg-blue-50",
      restock: "text-green-700 bg-green-50",
      adjustment: "text-purple-700 bg-purple-50",
      damaged: "text-red-700 bg-red-50",
      expired: "text-orange-700 bg-orange-50",
      returned: "text-yellow-700 bg-yellow-50",
      order_cancelled: "text-gray-700 bg-gray-50",
      order_failed: "text-red-700 bg-red-50",
    };
    return colors[reason] || "text-gray-700 bg-gray-50";
  };

  const exportToCSV = () => {
    const headers = ["Date", "Action", "Change", "Before", "After", "Admin/Order", "Notes"];
    const rows = stockLogs.map((log) => [
      format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss"),
      getReasonLabel(log.reason),
      log.quantity_change,
      log.quantity_before,
      log.quantity_after,
      log.admin_user ? `${log.admin_user.first_name} ${log.admin_user.last_name}` : log.order ? `Order #${log.order.order_number}` : "System",
      log.notes || "",
    ]);

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock_history_${product.name}_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/50" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative mx-auto flex max-h-[90vh] w-full max-w-6xl flex-col rounded-2xl bg-white shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Stock History</h2>
              <p className="mt-1 text-sm text-gray-600">{product.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                disabled={stockLogs.length === 0}
                className="flex items-center gap-2 rounded-lg bg-[#30442B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#22301e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button onClick={onClose} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="border-b border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Filter className="h-4 w-4" />
                Filters:
              </div>

              <select
                value={filters.reason}
                onChange={(e) => handleFilterChange("reason", e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-[#30442B] focus:outline-none"
              >
                <option value="all">All Reasons</option>
                <option value="sale">Sale</option>
                <option value="restock">Restock</option>
                <option value="adjustment">Adjustment</option>
                <option value="damaged">Damaged</option>
                <option value="expired">Expired</option>
                <option value="returned">Returned</option>
                <option value="order_cancelled">Order Cancelled</option>
                <option value="order_failed">Order Failed</option>
              </select>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => handleFilterChange("date_from", e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-[#30442B] focus:outline-none"
                  placeholder="From"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => handleFilterChange("date_to", e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-[#30442B] focus:outline-none"
                  placeholder="To"
                />
              </div>

              {(filters.reason !== "all" || filters.date_from || filters.date_to) && (
                <button onClick={() => setFilters({ reason: "all", admin_user_id: "all", date_from: "", date_to: "" })} className="ml-auto text-sm font-medium text-[#30442B] hover:text-[#5d7f52]">
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#30442B]"></div>
              </div>
            ) : stockLogs.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">No stock history found</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">Date & Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">Action</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-600 uppercase">Change</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-600 uppercase">Before</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-600 uppercase">After</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">By</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {stockLogs.map((log) => (
                      <tr key={log.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900">{format(new Date(log.created_at), "MMM dd, yyyy HH:mm")}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getReasonColor(log.reason)}`}>{getReasonLabel(log.reason)}</span>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className={`font-semibold ${log.quantity_change > 0 ? "text-green-600" : "text-red-600"}`}>
                            {log.quantity_change > 0 ? "+" : ""}
                            {log.quantity_change}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-sm whitespace-nowrap text-gray-600">{log.quantity_before}</td>
                        <td className="px-4 py-3 text-center text-sm font-medium whitespace-nowrap text-gray-900">{log.quantity_after}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {log.admin_user ? (
                            <div>
                              <div className="font-medium">
                                {log.admin_user.first_name} {log.admin_user.last_name}
                              </div>
                              <div className="text-xs text-gray-500">{log.admin_user.email}</div>
                            </div>
                          ) : log.order ? (
                            <div>
                              <div className="font-medium">Order #{log.order.order_number}</div>
                              <div className="text-xs text-gray-500">Automated</div>
                            </div>
                          ) : (
                            <span className="text-gray-500">System</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{log.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.current_page - 1) * pagination.per_page + 1}</span> to{" "}
                <span className="font-medium">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(pagination.last_page)].map((_, i) => {
                    const page = i + 1;
                    if (page === 1 || page === pagination.last_page || (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                            page === pagination.current_page ? "bg-[#30442B] text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === pagination.current_page - 2 || page === pagination.current_page + 2) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StockHistoryModal;
