import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { AdminLayout } from "../components/layout";
import { AdminAnimatedPage } from "../components/common";
import { UserDetailsModal, ConfirmStatusModal, RestoreConfirmModal, UserMetricSkeleton, UserTableSkeleton } from "../components/users";
import { useUsers } from "../hooks";

export default function Users() {
  const {
    displayedUsers,
    loading,
    metrics,
    searchTerm,
    setSearchTerm,
    viewMode,
    setView,
    selectedUser,
    showDetailsModal,
    showConfirmModal,
    showRestoreModal,
    confirmAction,
    actionLoading,
    handleViewDetails,
    closeDetailsModal,
    handleStatusChange,
    confirmStatusChange,
    closeConfirmModal,
    handleRestoreClick,
    confirmRestore,
    closeRestoreModal,
    getWarningText,
    refetch,
  } = useUsers();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getViewLabel = () => {
    switch (viewMode) {
      case "blocked":
        return "Blocked";
      case "deleted":
        return "Deleted";
      default:
        return "Active";
    }
  };

  const getEmptyMessage = () => {
    switch (viewMode) {
      case "blocked":
        return "No blocked accounts found";
      case "deleted":
        return "No deleted accounts found";
      default:
        return "No active accounts found";
    }
  };

  return (
    <AdminLayout>
      <AdminAnimatedPage className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-gray-900 sm:mb-2 sm:text-3xl lg:text-4xl">Account Management</h1>
              <p className="text-sm text-gray-600 sm:text-base">Control access, manage users, and handle communications</p>
            </div>
            {/* View Mode Segmented Control */}
            <div className="flex rounded-full bg-gray-100 p-1">
              <button
                onClick={() => setView("active")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all sm:px-5 sm:py-2.5 ${
                  viewMode === "active" ? "bg-[#30442B] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setView("blocked")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all sm:px-5 sm:py-2.5 ${
                  viewMode === "blocked" ? "bg-[#30442B] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Blocked
              </button>
              <button
                onClick={() => setView("deleted")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all sm:px-5 sm:py-2.5 ${
                  viewMode === "deleted" ? "bg-[#30442B] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Deleted
              </button>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
              <p className="mb-1 text-xs text-gray-500 sm:mb-2 sm:text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">{metrics.total_customers}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
              <p className="mb-1 text-xs text-gray-500 sm:mb-2 sm:text-sm">Active</p>
              <p className="text-2xl font-bold text-green-600 sm:text-3xl lg:text-4xl">{metrics.active_users}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
              <p className="mb-1 text-xs text-gray-500 sm:mb-2 sm:text-sm">Banned</p>
              <p className="text-2xl font-bold text-red-600 sm:text-3xl lg:text-4xl">{metrics.banned_users}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
              <p className="mb-1 text-xs text-gray-500 sm:mb-2 sm:text-sm">Deleted</p>
              <p className="text-2xl font-bold text-gray-500 sm:text-3xl lg:text-4xl">{metrics.deleted_users}</p>
            </div>
          </div>

          <div className="mb-6 rounded-xl bg-[#30442B] p-3 sm:mb-8 sm:rounded-2xl sm:p-4 lg:p-5">
            <div className="relative">
              <svg className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border-2 border-gray-200 bg-white py-3 pr-4 pl-12 text-sm text-gray-700 placeholder-gray-400 focus:border-[#30442B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                {getViewLabel()} Accounts ({displayedUsers.length})
              </h2>
              <button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                aria-label="Refresh users"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2.5"
              >
                <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${refreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white sm:rounded-2xl">
              {loading ? (
                <UserTableSkeleton />
              ) : displayedUsers.length === 0 ? (
                <div className="py-12 text-center sm:py-16">
                  <p className="text-sm text-gray-500 sm:text-base">{getEmptyMessage()}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">User</th>
                        <th className="hidden px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:table-cell sm:px-6 sm:py-4">Contact</th>
                        <th className="px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">
                          {viewMode === "deleted" ? "Deleted At" : "Status"}
                        </th>
                        <th className="hidden px-3 py-3 text-center text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4 md:table-cell">Orders</th>
                        {viewMode !== "deleted" && (
                          <th className="hidden px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4 lg:table-cell">Warnings</th>
                        )}
                        <th className="px-3 py-3 text-center text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayedUsers.map((user) => (
                        <tr key={user.id} className="transition-colors hover:bg-gray-50">
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${viewMode === "deleted" ? "bg-gray-200" : "bg-gray-100"}`}>
                                <svg className={`h-4 w-4 sm:h-5 sm:w-5 ${viewMode === "deleted" ? "text-gray-400" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <span className={`block truncate text-sm font-medium sm:text-base ${viewMode === "deleted" ? "text-gray-500" : "text-gray-900"}`}>{user.name}</span>
                                {/* Show email on mobile since Contact column is hidden */}
                                <span className="block truncate text-xs text-gray-500 sm:hidden">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="hidden px-3 py-3 sm:table-cell sm:px-6 sm:py-4">
                            <div>
                              <p className={`max-w-[200px] truncate text-sm ${viewMode === "deleted" ? "text-gray-500" : "text-gray-900"}`}>{user.email}</p>
                              <p className="text-sm text-gray-500">{user.phone || "N/A"}</p>
                            </div>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            {viewMode === "deleted" ? (
                              <span className="text-xs text-gray-500 sm:text-sm">{user.deleted_at ? new Date(user.deleted_at).toLocaleDateString() : "N/A"}</span>
                            ) : (
                              <span className={`text-xs font-medium capitalize sm:text-sm ${user.status === "active" ? "text-[#30442B]" : "text-red-600"}`}>
                                {user.status === "restricted" ? "Restricted" : "Active"}
                              </span>
                            )}
                          </td>
                          <td className="hidden px-3 py-3 text-center sm:px-6 sm:py-4 md:table-cell">
                            <span className="text-sm text-gray-900">{user.orders_count}</span>
                          </td>
                          {viewMode !== "deleted" && (
                            <td className="hidden px-3 py-3 sm:px-6 sm:py-4 lg:table-cell">
                              <span className={`text-sm ${user.failed_orders_count > 0 ? "text-red-600" : "text-gray-500"}`}>{getWarningText(user)}</span>
                            </td>
                          )}
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleViewDetails(user.id)} className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100" title="View Details">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </button>
                              {viewMode === "deleted" ? (
                                <button onClick={() => handleRestoreClick(user)} className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50" title="Restore Account">
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                  </svg>
                                </button>
                              ) : user.status === "active" ? (
                                <button onClick={() => handleStatusChange(user, "block")} className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50" title="Block User">
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  </svg>
                                </button>
                              ) : (
                                <button onClick={() => handleStatusChange(user, "unblock")} className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50" title="Unblock User">
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminAnimatedPage>

      {showDetailsModal && <UserDetailsModal user={selectedUser} onClose={closeDetailsModal} />}

      {showConfirmModal && <ConfirmStatusModal user={selectedUser} action={confirmAction} onConfirm={confirmStatusChange} onCancel={closeConfirmModal} isLoading={actionLoading} />}

      {showRestoreModal && <RestoreConfirmModal user={selectedUser} onConfirm={confirmRestore} onCancel={closeRestoreModal} isLoading={actionLoading} />}
    </AdminLayout>
  );
}
