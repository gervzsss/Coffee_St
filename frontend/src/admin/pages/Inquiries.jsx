import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getAllThreads, updateThreadStatus } from '../services/inquiryService';

export default function Inquiries() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    setLoading(true);
    const result = await getAllThreads();
    if (result.success) {
      setThreads(result.data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (threadId, newStatus) => {
    const result = await updateThreadStatus(threadId, newStatus);
    if (result.success) {
      setThreads(
        threads.map((thread) =>
          thread.id === threadId ? { ...thread, status: newStatus } : thread
        )
      );
    }
  };

  const filteredThreads = threads.filter((thread) => {
    return filterStatus === 'all' || thread.status === filterStatus;
  });

  const statusCounts = {
    total: threads.length,
    pending: threads.filter((t) => t.status === 'pending').length,
    responded: threads.filter((t) => t.status === 'responded').length,
    done: threads.filter((t) => t.status === 'done' || t.status === 'resolved')
      .length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'responded':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header */}
          <div className="bg-[#30442B] text-white rounded-2xl p-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Customer Inquiries
            </h1>
            <p className="text-sm text-white/80 mt-2">
              Manage and respond to customer messages
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Total Inquiries
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {statusCounts.total}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Pending
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {statusCounts.pending}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Responded
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {statusCounts.responded}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Resolved
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {statusCounts.done}
              </p>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-8 border-b border-gray-100 bg-[#30442B]/5">
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:border-[#30442B] focus:ring-1 focus:ring-[#30442B] text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="responded">Responded</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Inquiries List */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Inquiry Messages ({filteredThreads.length})
                </h2>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30442B]"></div>
                </div>
              ) : filteredThreads.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No inquiries found</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#30442B]/10 flex items-center justify-center font-bold text-[#30442B]">
                            {getInitials(thread.user_name || thread.guest_name)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {thread.user_name || thread.guest_name || 'Guest'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {thread.user_email || thread.guest_email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">
                            {new Date(thread.created_at).toLocaleDateString()}
                          </span>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              thread.status
                            )}`}
                          >
                            {thread.status?.charAt(0).toUpperCase() +
                              thread.status?.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Subject: {thread.subject || 'No Subject'}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {thread.message ||
                            thread.latest_message ||
                            'No message content'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                          {thread.messages_count || 0} message
                          {(thread.messages_count || 0) !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={thread.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusChange(thread.id, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:border-[#30442B] focus:ring-1 focus:ring-[#30442B]"
                          >
                            <option value="pending">Pending</option>
                            <option value="responded">Responded</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                          <button className="px-4 py-1.5 bg-[#30442B] text-white text-sm rounded-lg hover:bg-[#22301e] transition-colors">
                            View Thread
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
