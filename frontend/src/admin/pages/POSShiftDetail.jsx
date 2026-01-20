import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getShiftDetail } from "../services/shiftService";
import { formatCurrency } from "../utils/formatCurrency";

export default function POSShiftDetail() {
  const { id } = useParams();
  const [shift, setShift] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShift = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getShiftDetail(id);
      if (response.success) {
        setShift(response.data);
      } else {
        setError(response.error || "Failed to load shift details");
      }
    } catch (err) {
      setError(err.message || "Failed to load shift details");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchShift();
  }, [fetchShift]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleTimeString("en-US", {
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

  const getVarianceBg = (variance) => {
    if (variance === null || variance === undefined) return "bg-gray-50";
    if (variance === 0) return "bg-green-50";
    if (Math.abs(variance) <= 100) return "bg-yellow-50";
    return "bg-red-50";
  };

  const getOrderStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      preparing: "bg-purple-100 text-purple-700",
      ready: "bg-green-100 text-green-700",
      completed: "bg-gray-100 text-gray-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h2 className="text-lg font-medium text-red-700">{error}</h2>
          <Link to="/admin/pos/shifts" className="mt-4 inline-block text-sm text-red-600 underline hover:text-red-700">
            Back to Shift History
          </Link>
        </div>
      </div>
    );
  }

  if (!shift) return null;

  const duration = shift.closed_at ? Math.round((new Date(shift.closed_at) - new Date(shift.opened_at)) / (1000 * 60)) : Math.round((new Date() - new Date(shift.opened_at)) / (1000 * 60));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/admin/pos" className="hover:text-gray-700">
            POS
          </Link>
          <span>/</span>
          <Link to="/admin/pos/shifts" className="hover:text-gray-700">
            Shift History
          </Link>
          <span>/</span>
          <span className="text-gray-900">Shift #{shift.id}</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Shift #{shift.id}</h1>
          {shift.status === "active" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">Closed</span>
          )}
          {shift.is_discrepant && <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">⚠️ Discrepancy</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Shift Details Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Shift Details</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-sm text-gray-500">Opened</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{formatDateTime(shift.opened_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Opened By</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{shift.opened_by_user?.name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Closed</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{shift.closed_at ? formatDateTime(shift.closed_at) : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Closed By</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{shift.closed_by_user?.name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : `${duration}m`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Orders</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{shift.orders?.length || 0}</p>
              </div>
            </div>

            {shift.notes && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500">Closing Notes</p>
                <p className="mt-1 text-sm text-gray-900">{shift.notes}</p>
              </div>
            )}
          </div>

          {/* Cash Summary Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Cash Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">Opening Float</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(shift.opening_cash_float || 0)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">Cash Sales</span>
                <span className="text-sm font-medium text-green-600">+{formatCurrency(shift.total_cash_sales || 0)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3">
                <span className="text-sm font-medium text-gray-900">Expected Cash</span>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(shift.expected_cash || 0)}</span>
              </div>

              {shift.status === "closed" && (
                <>
                  <div className="my-2 border-t border-gray-200" />
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-600">Actual Cash Count</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(shift.actual_cash_count || 0)}</span>
                  </div>
                  <div className={`flex items-center justify-between rounded-lg px-4 py-3 ${getVarianceBg(shift.variance)}`}>
                    <span className="text-sm font-medium text-gray-900">Variance</span>
                    <span className={`text-sm font-bold ${getVarianceColor(shift.variance)}`}>
                      {shift.variance >= 0 ? "+" : ""}
                      {formatCurrency(shift.variance || 0)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Orders ({shift.orders?.length || 0})</h2>
            </div>
            {shift.orders && shift.orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {shift.orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={`/admin/orders/${order.id}`} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                            #{order.order_number}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{formatTime(order.created_at)}</td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{order.order_items?.length || 0} items</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                              order.payment_method === "cash" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {order.payment_method}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getOrderStatusBadge(order.status)}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap text-gray-900">{formatCurrency(order.total_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="mt-4">No orders in this shift</p>
              </div>
            )}
          </div>
        </div>

        {/* Side Summary */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Sales Summary</h2>
            <div className="space-y-4">
              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-sm text-emerald-600">Total Sales</p>
                <p className="mt-1 text-2xl font-bold text-emerald-700">{formatCurrency(shift.total_sales || 0)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Cash</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(shift.total_cash_sales || 0)}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Non-Cash</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(shift.total_non_cash_sales || 0)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <Link to="/admin/pos/shifts" className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Shift History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
