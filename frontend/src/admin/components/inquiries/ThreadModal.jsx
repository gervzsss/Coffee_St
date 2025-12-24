import { useState, useEffect, useRef, useCallback } from "react";
import { getThread, sendMessage } from "../../services/inquiryService";

export default function ThreadModal({ threadId, isOpen, onClose, onUpdate }) {
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchThread = useCallback(async () => {
    setLoading(true);
    const result = await getThread(threadId);
    if (result.success) {
      setThread(result.data);
    }
    setLoading(false);
  }, [threadId]);

  useEffect(() => {
    if (isOpen && threadId) {
      fetchThread();
    }
  }, [isOpen, threadId, fetchThread]);

  useEffect(() => {
    if (thread) {
      scrollToBottom();
    }
  }, [thread, scrollToBottom]);

  const handleSendReply = async (e) => {
    e.preventDefault();

    if (!replyMessage.trim()) return;

    setSending(true);
    setSuccessMessage(false);
    const result = await sendMessage(threadId, replyMessage);

    if (result.success) {
      setThread((prev) => ({
        ...prev,
        messages: [...prev.messages, result.data],
      }));
      setReplyMessage("");
      setSuccessMessage(true);

      setTimeout(() => {
        scrollToBottom();
      }, 100);

      setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);

      if (onUpdate) onUpdate();
    }

    setSending(false);
  };

  const formatMessageTime = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Just now";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">{loading ? "Loading..." : thread?.subject}</h2>
              {!loading && thread && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium">{thread.user_name || thread.guest_name}</span>
                  <span>{thread.user_email || thread.guest_email}</span>
                  <span className="text-gray-400">{new Date(thread.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#30442B]"></div>
            </div>
          ) : (
            <>
              {thread?.messages
                ?.filter((msg) => msg && msg.message)
                .map((message, index) => (
                  <div key={message.id || `temp-${index}`} className={`flex ${message.is_admin ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] ${message.is_admin ? "flex flex-col items-end" : ""}`}>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{message.sender_name}</span>
                        {message.is_admin && <span className="rounded-full bg-[#30442B] px-2 py-0.5 text-xs text-white">Admin</span>}
                      </div>

                      <div className={`rounded-2xl p-4 ${message.is_admin ? "bg-[#30442B] text-white" : "bg-gray-100 text-gray-900"}`}>
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      </div>

                      <span className="mt-1 text-xs text-gray-500">{formatMessageTime(message.created_at)}</span>
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Reply Form */}
        <div className="border-t border-gray-200 p-6">
          {successMessage && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">Reply sent successfully</div>}

          <form onSubmit={handleSendReply}>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
              rows="3"
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-[#30442B] focus:ring-1 focus:ring-[#30442B]"
              disabled={sending || loading}
            />

            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                Close
              </button>
              <button
                type="submit"
                disabled={sending || !replyMessage.trim() || loading}
                className="rounded-lg bg-[#30442B] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#22301e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
