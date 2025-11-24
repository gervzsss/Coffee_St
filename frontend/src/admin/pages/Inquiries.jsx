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

  const messageCounts = {
    total: threads.reduce((sum, t) => sum + (t.messages_count || 0), 0),
    unread: threads.filter((t) => t.status === 'pending' || t.status === 'open').length,
    archived: threads.filter((t) => t.status === 'closed' || t.status === 'archived').length,
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

          {/* Statistics Cards - 3 Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Total Messages
              </div>
              <p className="text-4xl font-bold text-gray-900">
                {messageCounts.total}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Unread
              </div>
              <p className="text-4xl font-bold text-gray-900">
                {messageCounts.unread}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Archived
              </div>
              <p className="text-4xl font-bold text-gray-900">
                {messageCounts.archived}
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
                <div className="space-y-4">
                  {filteredThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer relative"
                    >
                      {/* Reply Icon - Top Right */}
                      <div className="absolute top-6 right-6">
                        <svg 
                          className="w-5 h-5 text-gray-400 hover:text-[#30442B] transition-colors"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" 
                          />
                        </svg>
                      </div>

                      {/* Message Title */}
                      <h3 className="font-bold text-gray-900 text-lg mb-3 pr-8">
                        {thread.subject || 'No Subject'}
                      </h3>

                      {/* User Info Row */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="font-medium">
                          {thread.user_name || thread.guest_name || 'Guest'}
                        </span>
                        <span className="text-gray-400">
                          {thread.user_email || thread.guest_email}
                        </span>
                        <span className="text-gray-400">
                          {new Date(thread.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>

                      {/* Message Content */}
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {thread.message || thread.latest_message || 'No message content'}
                      </p>
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
