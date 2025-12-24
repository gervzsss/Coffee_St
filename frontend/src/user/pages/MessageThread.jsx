import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Header, Footer } from "../components/layout";
import { getThread, sendReply } from "../services/inquiryService";
import { useToast } from "../hooks/useToast";

export default function MessageThread() {
  const { id } = useParams();
  const navigate = useNavigate();
  useAuth();
  const { showToast } = useToast();

  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);

  const fetchThread = useCallback(async () => {
    setLoading(true);
    const result = await getThread(id);
    if (result.success) {
      setThread(result.data);
    } else {
      showToast("Failed to load conversation", { type: "error" });
      navigate("/messages");
    }
    setLoading(false);
  }, [id, navigate, showToast]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  const handleSendReply = async (e) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      showToast("Please enter a message", { type: "error" });
      return;
    }

    setSending(true);
    const result = await sendReply(id, replyMessage);

    if (result.success) {
      setThread((prev) => ({
        ...prev,
        messages: [...prev.messages, result.data],
      }));
      setReplyMessage("");
      showToast("Reply sent successfully", { type: "success" });
    } else {
      showToast(result.error || "Failed to send reply", { type: "error" });
    }

    setSending(false);
  };

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

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#30442B]"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!thread) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Thread Header */}
        <div className="w-full bg-[#30442B] pt-12 pb-6">
          <div className="container mx-auto px-4">
            <button onClick={() => navigate("/messages")} className="mb-4 flex items-center gap-2 text-white/80 transition-colors hover:text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Messages
            </button>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">{thread.subject}</h1>
                <p className="text-sm text-gray-200">
                  Started on{" "}
                  {new Date(thread.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              {getStatusBadge(thread.status)}
            </div>
          </div>
        </div>

        {/* Messages Content */}
        <section className="relative pb-24">
          <div className="mx-auto mt-8 max-w-4xl px-6 sm:px-10">
            {/* Messages List */}
            <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="max-h-[600px] space-y-6 overflow-y-auto p-6">
                {thread.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.is_admin ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[70%] ${message.is_admin ? "" : "flex flex-col items-end"}`}>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{message.sender_name}</span>
                        {message.is_admin && <span className="rounded-full bg-[#30442B] px-2 py-0.5 text-xs text-white">Support</span>}
                      </div>

                      <div className={`rounded-2xl p-4 ${message.is_admin ? "bg-gray-100 text-gray-900" : "bg-[#30442B] text-white"}`}>
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      </div>

                      <span className="mt-1 text-xs text-gray-500">{formatMessageTime(message.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Form */}
            {thread.status !== "closed" && thread.status !== "done" && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-900">Send a Reply</h3>
                <form onSubmit={handleSendReply}>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="4"
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-[#30442B] focus:ring-1 focus:ring-[#30442B]"
                    disabled={sending}
                  />

                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={sending || !replyMessage.trim()}
                      className="rounded-full bg-[#30442B] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#22301e] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sending ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {(thread.status === "closed" || thread.status === "done") && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-gray-600">This conversation has been {thread.status === "closed" ? "closed" : "resolved"}.</p>
                <p className="mt-2 text-sm text-gray-500">
                  If you need further assistance, please create a new inquiry from the{" "}
                  <a href="/contact" className="font-semibold text-[#30442B] hover:underline">
                    Contact page
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
