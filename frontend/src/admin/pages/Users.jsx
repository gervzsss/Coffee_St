import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  getAllUsers,
  getCustomerMetrics,
  getUser,
  updateUserStatus,
} from '../services/userService';

function UserDetailsModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                User Details – {user.name}
              </h2>
              <p className="text-gray-500 mt-1">
                Complete user information and activity history
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="border border-gray-200 rounded-xl p-5 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{user.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium capitalize ${user.status === 'active' ? 'text-[#30442B]' : 'text-red-600'}`}>
                  {user.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="font-medium text-gray-900">{user.orders_count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="font-medium text-gray-900">
                  ${Number(user.total_spent || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p className="font-medium text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('en-CA')}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 text-center">
            {user.has_warnings ? (
              <>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Warning</h3>
                <p className="text-gray-500">{user.warnings}</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Clean record</h3>
                <p className="text-gray-500">No scam warnings or fraudulent activity reported</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmStatusModal({ user, action, onConfirm, onCancel, isLoading }) {
  if (!user) return null;

  const isBlocking = action === 'block';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Confirm Status Change
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to {isBlocking ? 'block' : 'unblock'} this user? This action will be logged.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#30442B] text-white rounded-lg font-medium hover:bg-[#22301e] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBlocked, setShowBlocked] = useState(false);
  const [metrics, setMetrics] = useState({
    total_customers: 0,
    active_users: 0,
    banned_users: 0,
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [debouncedSearch]);

  const fetchData = async () => {
    setLoading(true);
    
    const metricsResult = await getCustomerMetrics();
    if (metricsResult.success) {
      setMetrics(metricsResult.data);
    }

    const filters = {};
    if (debouncedSearch) filters.search = debouncedSearch;

    const usersResult = await getAllUsers(filters);
    if (usersResult.success) {
      setUsers(usersResult.data);
    }
    
    setLoading(false);
  };

  const handleViewDetails = async (userId) => {
    const result = await getUser(userId);
    if (result.success) {
      setSelectedUser(result.data);
      setShowDetailsModal(true);
    }
  };

  const handleStatusChange = (user, action) => {
    setSelectedUser(user);
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedUser || !confirmAction) return;

    setActionLoading(true);
    const newStatus = confirmAction === 'block' ? 'restricted' : 'active';
    const result = await updateUserStatus(selectedUser.id, newStatus);
    
    if (result.success) {
      await fetchData();
    }
    
    setActionLoading(false);
    setShowConfirmModal(false);
    setSelectedUser(null);
    setConfirmAction(null);
  };

  const displayedUsers = users.filter((user) => {
    if (showBlocked) {
      return user.status === 'restricted';
    }
    return user.status === 'active';
  });

  const getWarningText = (user) => {
    if (user.failed_orders_count > 0) {
      return `${user.failed_orders_count} Failed Orders`;
    }
    return 'NONE';
  };

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
              onClick={() => setShowBlocked(!showBlocked)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#30442B] text-white rounded-full font-medium hover:bg-[#22301e] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
              <p className="text-4xl font-bold text-gray-900">{metrics.total_customers}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Active</p>
              <p className="text-4xl font-bold text-gray-900">{metrics.active_users}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Banned</p>
              <p className="text-4xl font-bold text-gray-900">{metrics.banned_users}</p>
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
              {showBlocked ? 'Blocked' : 'Active'} Accounts ({displayedUsers.length})
            </h2>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30442B]"></div>
                </div>
              ) : displayedUsers.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500">No {showBlocked ? 'blocked' : 'active'} accounts found</p>
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
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm text-gray-900">{user.email}</p>
                            <p className="text-sm text-gray-500">{user.phone || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-sm font-medium capitalize ${
                            user.status === 'active' ? 'text-[#30442B]' : 'text-red-600'
                          }`}>
                            {user.status === 'restricted' ? 'restricted' : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-sm text-gray-900">{user.orders_count}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-sm ${
                            user.failed_orders_count > 0 ? 'text-red-600' : 'text-gray-500'
                          }`}>
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
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </button>
                            {user.status === 'active' ? (
                              <button
                                onClick={() => handleStatusChange(user, 'block')}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Block User"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusChange(user, 'unblock')}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Unblock User"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showConfirmModal && (
        <ConfirmStatusModal
          user={selectedUser}
          action={confirmAction}
          onConfirm={confirmStatusChange}
          onCancel={() => {
            setShowConfirmModal(false);
            setSelectedUser(null);
            setConfirmAction(null);
          }}
          isLoading={actionLoading}
        />
      )}
    </AdminLayout>
  );
}
