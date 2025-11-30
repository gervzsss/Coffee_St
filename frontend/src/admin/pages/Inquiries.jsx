import { useState } from 'react';
import { AdminLayout } from '../components/layout';
import { ThreadModal, InquiryCard } from '../components/inquiries';
import { PageHeader, MetricCard, LoadingSpinner } from '../components/common';
import { useInquiries } from '../hooks/useInquiries';

export default function Inquiries() {
  const {
    filteredThreads,
    loading,
    filterStatus,
    setFilterStatus,
    messageCounts,
    refetch,
  } = useInquiries();

  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenThread = (threadId) => {
    setSelectedThreadId(threadId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedThreadId(null);
  };

  const handleThreadUpdate = () => {
    refetch();
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header */}
          <PageHeader
            title="Customer Inquiries"
            subtitle="Manage and respond to customer messages"
          />

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
            <MetricCard title="Total Messages" value={messageCounts.total} />
            <MetricCard title="Unread" value={messageCounts.unread} />
            <MetricCard title="Archived" value={messageCounts.archived} />
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 sm:mb-8">
            <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100 bg-[#30442B]/5">
              <div className="flex gap-3 sm:gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-[#30442B] focus:ring-1 focus:ring-[#30442B] text-xs sm:text-sm"
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
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Inquiry Messages ({filteredThreads.length})
                </h2>
              </div>

              {loading ? (
                <LoadingSpinner className="py-8 sm:py-12" />
              ) : filteredThreads.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-sm sm:text-base text-gray-500">
                    No inquiries found
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {filteredThreads.map((thread) => (
                    <InquiryCard
                      key={thread.id}
                      thread={thread}
                      onClick={() => handleOpenThread(thread.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thread Modal */}
      <ThreadModal
        threadId={selectedThreadId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleThreadUpdate}
      />
    </AdminLayout>
  );
}
