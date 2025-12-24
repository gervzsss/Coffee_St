import { AdminLayout } from "../components/layout";
import { AdminAnimatedPage } from "../components/common";
import { UserDetailsModal, ConfirmStatusModal } from "../components/users";
import { useUsers } from "../hooks";

export default function Users() {
  const {
    displayedUsers,
    loading,
    metrics,
    searchTerm,
    setSearchTerm,
    showBlocked,
    toggleBlockedView,
    selectedUser,
    showDetailsModal,
    showConfirmModal,
    confirmAction,
    actionLoading,
    handleViewDetails,
    closeDetailsModal,
    handleStatusChange,
    confirmStatusChange,
    closeConfirmModal,
    getWarningText,
  } = useUsers();

  return (
    <AdminLayout>
      <AdminAnimatedPage className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-gray-900 sm:mb-2 sm:text-3xl lg:text-4xl">Account Management</h1>
              <p className="text-sm text-gray-600 sm:text-base">Control access, manage users, and handle communications</p>
            </div>
            <button
              onClick={toggleBlockedView}
              className="flex items-center gap-2 rounded-full bg-[#30442B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#22301e] sm:px-5 sm:py-2.5 sm:text-base"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {showBlocked ? "Active Accounts" : "Blocked Accounts"}
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
              <p className="mb-1 text-xs text-gray-500 sm:mb-2 sm:text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">{metrics.total_customers}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
              <p className="mb-1 text-xs text-gray-500 sm:mb-2 sm:text-sm">Active</p>
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">{metrics.active_users}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
              <p className="mb-1 text-xs text-gray-500 sm:mb-2 sm:text-sm">Banned</p>
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">{metrics.banned_users}</p>
            </div>
          </div>

          <div className="mb-6 rounded-xl bg-[#30442B] p-3 sm:mb-8 sm:rounded-2xl sm:p-4 lg:p-5">
            <div className="relative">
              <svg className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="customer name........."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border-2 border-gray-200 bg-white py-3 pr-4 pl-12 text-sm text-gray-700 placeholder-gray-400 focus:border-[#30442B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl">
              {showBlocked ? "Blocked" : "Active"} Accounts ({displayedUsers.length})
            </h2>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white sm:rounded-2xl">
              {loading ? (
                <div className="flex items-center justify-center py-12 sm:py-16">
                  <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#30442B] sm:h-12 sm:w-12"></div>
                </div>
              ) : displayedUsers.length === 0 ? (
                <div className="py-12 text-center sm:py-16">
                  <p className="text-sm text-gray-500 sm:text-base">No {showBlocked ? "blocked" : "active"} accounts found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">User</th>
                        <th className="hidden px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:table-cell sm:px-6 sm:py-4">Contact</th>
                        <th className="px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">Status</th>
                        <th className="hidden px-3 py-3 text-center text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4 md:table-cell">Orders</th>
                        <th className="hidden px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4 lg:table-cell">Warnings</th>
                        <th className="px-3 py-3 text-center text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayedUsers.map((user) => (
                        <tr key={user.id} className="transition-colors hover:bg-gray-50">
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 sm:h-10 sm:w-10">
                                <svg className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <span className="block truncate text-sm font-medium text-gray-900 sm:text-base">{user.name}</span>
                                {/* Show email on mobile since Contact column is hidden */}
                                <span className="block truncate text-xs text-gray-500 sm:hidden">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="hidden px-3 py-3 sm:table-cell sm:px-6 sm:py-4">
                            <div>
                              <p className="max-w-[200px] truncate text-sm text-gray-900">{user.email}</p>
                              <p className="text-sm text-gray-500">{user.phone || "N/A"}</p>
                            </div>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <span className={`text-xs font-medium capitalize sm:text-sm ${user.status === "active" ? "text-[#30442B]" : "text-red-600"}`}>
                              {user.status === "restricted" ? "restricted" : "Active"}
                            </span>
                          </td>
                          <td className="hidden px-3 py-3 text-center sm:px-6 sm:py-4 md:table-cell">
                            <span className="text-sm text-gray-900">{user.orders_count}</span>
                          </td>
                          <td className="hidden px-3 py-3 sm:px-6 sm:py-4 lg:table-cell">
                            <span className={`text-sm ${user.failed_orders_count > 0 ? "text-red-600" : "text-gray-500"}`}>{getWarningText(user)}</span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleViewDetails(user.id)} className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100" title="View Details">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </button>
                              {user.status === "active" ? (
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
    </AdminLayout>
  );
}
