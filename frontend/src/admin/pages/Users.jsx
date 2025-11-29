import { AdminLayout } from '../components/layout';
import { UserDetailsModal, ConfirmStatusModal } from '../components/users';
import { useUsers } from '../hooks';

export default function Users() {
  const {
    // Data
    displayedUsers,
    loading,
    metrics,
    // Filters
    searchTerm,
    setSearchTerm,
    showBlocked,
    toggleBlockedView,
    // Modal state
    selectedUser,
    showDetailsModal,
    showConfirmModal,
    confirmAction,
    actionLoading,
    // Actions
    handleViewDetails,
    closeDetailsModal,
    handleStatusChange,
    confirmStatusChange,
    closeConfirmModal,
    // Helpers
    getWarningText,
  } = useUsers();

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Account Management
              </h1>
              <p className="text-gray-600">
                Control access, manage users, and handle communications
              </p>
            </div>
            <button
              onClick={toggleBlockedView}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#30442B] text-white rounded-full font-medium hover:bg-[#22301e] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {showBlocked ? 'Active Accounts' : 'Blocked Accounts'}
            </button>
          </div>

          <div className="mb-8">
            <div className="bg-white border border-gray-200 rounded-full p-1.5 inline-flex">
              <button className="px-8 py-3 bg-[#30442B] text-white rounded-full font-semibold text-sm">
                CUSTOMER ACCOUNTS ({metrics.total_customers})
              </button>
              <button className="px-8 py-3 text-gray-600 font-semibold text-sm hover:text-gray-900 transition-colors">
                STAFF ACCOUNTS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Total Customers</p>
              <p className="text-4xl font-bold text-gray-900">
                {metrics.total_customers}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Active</p>
              <p className="text-4xl font-bold text-gray-900">
                {metrics.active_users}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Banned</p>
              <p className="text-4xl font-bold text-gray-900">
                {metrics.banned_users}
              </p>
            </div>
          </div>

          <div className="bg-[#30442B] rounded-2xl p-5 mb-8">
            <div className="relative">
              <svg
                className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="customer name........."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 bg-white focus:outline-none focus:border-[#30442B] text-sm text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {showBlocked ? 'Blocked' : 'Active'} Accounts (
              {displayedUsers.length})
            </h2>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30442B]"></div>
                </div>
              ) : displayedUsers.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500">
                    No {showBlocked ? 'blocked' : 'active'} accounts found
                  </p>
                </div>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Warnings
                      </th>
                      <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <span className="font-medium text-gray-900">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm text-gray-900">
                              {user.email}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.phone || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-sm font-medium capitalize ${
                              user.status === 'active'
                                ? 'text-[#30442B]'
                                : 'text-red-600'
                            }`}
                          >
                            {user.status === 'restricted'
                              ? 'restricted'
                              : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-sm text-gray-900">
                            {user.orders_count}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-sm ${
                              user.failed_orders_count > 0
                                ? 'text-red-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {getWarningText(user)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(user.id)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </button>
                            {user.status === 'active' ? (
                              <button
                                onClick={() =>
                                  handleStatusChange(user, 'block')
                                }
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Block User"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                  />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleStatusChange(user, 'unblock')
                                }
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Unblock User"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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
              )}
            </div>
          </div>
        </div>
      </div>

      {showDetailsModal && (
        <UserDetailsModal user={selectedUser} onClose={closeDetailsModal} />
      )}

      {showConfirmModal && (
        <ConfirmStatusModal
          user={selectedUser}
          action={confirmAction}
          onConfirm={confirmStatusChange}
          onCancel={closeConfirmModal}
          isLoading={actionLoading}
        />
      )}
    </AdminLayout>
  );
}
