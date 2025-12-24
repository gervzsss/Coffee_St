import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Header, Footer } from "../components/layout";
import { EmptyState, AnimatedPage } from "../components/common";
import { getUserThreads } from "../services/inquiryService";

export default function Messages() {
  useAuth();
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    const result = await getUserThreads();
    if (result.success) {
      console.log("Threads fetched:", result.data);
      setThreads(result.data);
    } else {
      console.error("Failed to fetch threads:", result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-amber-100", text: "text-amber-800", label: "Pending" },
      responded: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Responded",
      },
      done: { bg: "bg-green-100", text: "text-green-800", label: "Resolved" },
      closed: { bg: "bg-gray-100", text: "text-gray-800", label: "Closed" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  return (
    <>
      <Header />
      <AnimatedPage className="min-h-screen bg-gray-50 pt-20">
        {/* Compact Messages Header */}
        <div className="w-full bg-[#30442B] pt-12 pb-8">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-white md:text-3xl">Messages</h1>
            <p className="mt-1 text-sm text-gray-200 md:text-base">View and manage your conversations with our team</p>
          </div>
        </div>

        {/* Messages Content */}
        <section className="relative pb-24">
          <div className="mx-auto mt-8 max-w-6xl px-6 sm:px-10">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#30442B]"></div>
              </div>
            ) : threads.length === 0 ? (
              <div className="space-y-6">
                <EmptyState
                  icon={
                    <svg className="mx-auto mb-4 h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                  title="No Messages Yet"
                  description="You don't have any messages at the moment. Our support team will reach out here if needed."
                  actionText="Contact Support"
                  actionTo="/contact"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {threads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => navigate(`/messages/${thread.id}`)}
                    className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#30442B]/20 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-gray-900">{thread.subject}</h3>
                        <p className="line-clamp-2 text-sm text-gray-600">{thread.latest_message || "No messages yet"}</p>
                      </div>
                      <div className="ml-4 flex flex-col items-end gap-2">
                        {getStatusBadge(thread.status)}
                        <span className="text-xs text-gray-500">{formatDate(thread.latest_message_at || thread.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        <span>
                          {thread.messages_count} {thread.messages_count === 1 ? "message" : "messages"}
                        </span>
                      </div>

                      <span className="text-sm font-medium text-[#30442B] hover:underline">View conversation →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </AnimatedPage>
      <Footer />
    </>
  );
}
