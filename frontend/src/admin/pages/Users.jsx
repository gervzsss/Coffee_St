import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getAllUsers, deleteUser } from '../services/userService';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('customer'); // customer, staff, inquiries

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await deleteUser(id);
      if (result.success) {
        setUsers(users.filter((u) => u.id !== id));
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const totalCustomers = users.filter((u) => !u.is_admin).length;
  const activeUsers = users.filter((u) => !u.is_admin && u.is_active).length;
  const totalStaff = users.filter((u) => u.is_admin).length;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header */}
          <div className="bg-[#30442B] text-white rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                Account Management
              </h1>
              <p className="text-base text-white/90">
                Control access, manage users, and handle communications
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveTab('customer')}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 ${
                    activeTab === 'customer'
                      ? 'bg-white text-[#30442B] shadow-lg'
                      : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  Customers
                </button>
                <button
                  onClick={() => setActiveTab('staff')}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 ${
                    activeTab === 'staff'
                      ? 'bg-white text-[#30442B] shadow-lg'
                      : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  Staff Members
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards - Customer */}
          {activeTab === 'customer' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Total Customers
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {totalCustomers}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Active Users
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {activeUsers}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Banned Users
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-800">0</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Unread Messages
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-800">0</p>
              </div>
            </div>
          )}

          {/* Statistics Cards - Staff */}
          {activeTab === 'staff' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Total Staff
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{totalStaff}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Active Staff
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{totalStaff}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Inactive
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-800">0</p>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Search and Filter */}
            <div className="p-8 border-b border-gray-100 bg-[#30442B]/5">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 focus:border-[#30442B] focus:ring-1 focus:ring-[#30442B] text-sm"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute right-3 top-3.5"
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
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {activeTab === 'customer' ? 'Customer' : 'Staff'} List (
                  {filteredUsers.length})
                </h2>
                <button className="px-6 py-2.5 bg-[#30442B] text-white rounded-lg hover:bg-[#22301e] transition-all duration-300 flex items-center gap-2">
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add {activeTab === 'customer' ? 'Customer' : 'Staff Member'}
                </button>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30442B]"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No users found</p>
                  </div>
                ) : (
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-4 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="shrink-0 h-10 w-10 bg-[#30442B]/10 rounded-full flex items-center justify-center">
                                <span className="text-[#30442B] font-semibold">
                                  {user.first_name?.charAt(0).toUpperCase() ||
                                    user.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.first_name && user.last_name
                                    ? `${user.first_name} ${user.last_name}`
                                    : 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-900">
                              {user.email}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-900">
                              {user.phone || 'N/A'}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-900">
                              {new Date(user.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-center gap-2">
                              <button className="p-2 text-[#30442B] hover:bg-[#30442B]/10 rounded-lg transition-colors">
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
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
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
      </div>
    </AdminLayout>
  );
}
