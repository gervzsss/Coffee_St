import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { AdminLayout } from "../components/layout";
import { ThreadModal, InquiryCard, InquiryCardSkeleton } from "../components/inquiries";
import { PageHeader, MetricCard, AdminAnimatedPage } from "../components/common";
import { useInquiries } from "../hooks/useInquiries";

export default function Inquiries() {
  const { filteredThreads, loading, filterStatus, setFilterStatus, messageCounts, refetch } = useInquiries();

  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

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
      <AdminAnimatedPage className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">Customer Inquiries</h1>
                <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">Manage and respond to customer messages</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                aria-label="Refresh inquiries"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2.5"
              >
                <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${refreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-3 sm:gap-5 lg:gap-6">
            <MetricCard title="Total Messages" value={messageCounts.total} />
            <MetricCard title="Unread" value={messageCounts.unread} />
            <MetricCard title="Archived" value={messageCounts.archived} />
          </div>

          {/* Filter Section */}
          <div className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm sm:mb-8 sm:rounded-2xl">
            <div className="border-b border-gray-100 bg-[#30442B]/5 p-4 sm:p-6 lg:p-8">
              <div className="flex gap-3 sm:gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2.5 text-xs focus:border-[#30442B] focus:ring-1 focus:ring-[#30442B] sm:px-4 sm:py-3 sm:text-sm"
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
              <div className="mb-4 flex flex-col justify-between gap-2 sm:mb-6 sm:flex-row sm:items-center sm:gap-4">
                <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">Inquiry Messages ({filteredThreads.length})</h2>
              </div>

              {loading ? (
                <div className="space-y-3 sm:space-y-4">
                  <InquiryCardSkeleton />
                  <InquiryCardSkeleton />
                  <InquiryCardSkeleton />
                </div>
              ) : filteredThreads.length === 0 ? (
                <div className="py-8 text-center sm:py-12">
                  <p className="text-sm text-gray-500 sm:text-base">No inquiries found</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {filteredThreads.map((thread) => (
                    <InquiryCard key={thread.id} thread={thread} onClick={() => handleOpenThread(thread.id)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminAnimatedPage>

      {/* Thread Modal */}
      <ThreadModal threadId={selectedThreadId} isOpen={isModalOpen} onClose={handleCloseModal} onUpdate={handleThreadUpdate} />
    </AdminLayout>
  );
}
