import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getShifts } from "../services/shiftService";
import { formatCurrency } from "../utils/formatCurrency";

export default function POSShifts() {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    status: "",
    from: "",
    to: "",
    page: 1,
  });

  const fetchShifts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      params.page = filters.page;

      const response = await getShifts(params);
      if (response.success) {
        // Backend returns: { shifts: [...], pagination: {...} }
        const payload = response.data;
        setShifts(payload.shifts || []);
        setPagination({
          currentPage: payload.pagination?.current_page || 1,
          lastPage: payload.pagination?.last_page || 1,
          total: payload.pagination?.total || 0,
          perPage: payload.pagination?.per_page || 20,
        });
      } else {
        setError(response.error || "Failed to load shifts");
        setShifts([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load shifts");
      setShifts([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getVarianceColor = (variance) => {
    if (variance === null || variance === undefined) return "text-gray-500";
    if (variance === 0) return "text-green-600";
    if (Math.abs(variance) <= 100) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = (status) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Active
        </span>
      );
    }
    return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">Closed</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/pos")}
          className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to POS
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Shift History</h1>
        <p className="mt-1 text-sm text-gray-600">View and audit all POS shift records</p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[150px]">
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="min-w-[150px]">
            <label className="mb-1 block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => handleFilterChange("from", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="min-w-[150px]">
            <label className="mb-1 block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => handleFilterChange("to", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <button onClick={() => setFilters({ status: "", from: "", to: "", page: 1 })} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      ) : shifts.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No shifts found</h3>
          <p className="mt-1 text-sm text-gray-500">{filters.status || filters.from || filters.to ? "Try adjusting your filters" : "Shifts will appear here once created"}</p>
        </div>
      ) : (
        <>
          {/* Shifts Table */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Shift</th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Opened By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Sales</th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Variance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {shifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{shift.id}</div>
                      <div className="text-xs text-gray-500">{formatDateTime(shift.opened_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shift.opened_by?.name || "Unknown"}</div>
                      {shift.closed_by && <div className="text-xs text-gray-500">Closed by: {shift.closed_by.name}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shift.closed_at ? `${Math.round((new Date(shift.closed_at) - new Date(shift.opened_at)) / (1000 * 60))} min` : "In progress"}</div>
                      {shift.closed_at && <div className="text-xs text-gray-500">Closed: {formatDateTime(shift.closed_at)}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(shift.cash_sales_total || 0)}</div>
                      <div className="text-xs text-gray-500">{shift.orders_count || 0} orders</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {shift.variance !== null ? (
                        <div className={`text-sm font-medium ${getVarianceColor(shift.variance)}`}>
                          {shift.variance >= 0 ? "+" : ""}
                          {formatCurrency(shift.variance)}
                          {shift.is_discrepant && <span className="ml-1 text-xs">⚠️</span>}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(shift.status)}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link to={`/admin/pos/shifts/${shift.id}`} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.lastPage > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {(pagination.currentPage - 1) * pagination.perPage + 1} to {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of {pagination.total} shifts
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.lastPage}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
