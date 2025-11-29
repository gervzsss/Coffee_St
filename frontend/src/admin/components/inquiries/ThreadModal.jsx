import { useState, useEffect, useRef } from 'react';
import { getThread, sendMessage } from '../../services/inquiryService';

export default function ThreadModal({ threadId, isOpen, onClose, onUpdate }) {
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && threadId) {
      fetchThread();
    }
  }, [isOpen, threadId]);

  useEffect(() => {
    if (thread) {
      scrollToBottom();
    }
  }, [thread]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchThread = async () => {
    setLoading(true);
    const result = await getThread(threadId);
    if (result.success) {
      setThread(result.data);
    }
    setLoading(false);
  };

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
      setReplyMessage('');
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
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Just now';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {loading ? 'Loading...' : thread?.subject}
              </h2>
              {!loading && thread && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium">
                    {thread.user_name || thread.guest_name}
                  </span>
                  <span>{thread.user_email || thread.guest_email}</span>
                  <span className="text-gray-400">
                    {new Date(thread.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30442B]"></div>
            </div>
          ) : (
            <>
              {thread?.messages
                ?.filter((msg) => msg && msg.message)
                .map((message, index) => (
                  <div
                    key={message.id || `temp-${index}`}
                    className={`flex ${
                      message.is_admin ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.is_admin ? 'flex flex-col items-end' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {message.sender_name}
                        </span>
                        {message.is_admin && (
                          <span className="px-2 py-0.5 bg-[#30442B] text-white text-xs rounded-full">
                            Admin
                          </span>
                        )}
                      </div>

                      <div
                        className={`rounded-2xl p-4 ${
                          message.is_admin
                            ? 'bg-[#30442B] text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>

                      <span className="text-xs text-gray-500 mt-1">
                        {formatMessageTime(message.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Reply Form */}
        <div className="p-6 border-t border-gray-200">
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm">
              Reply sent successfully
            </div>
          )}

          <form onSubmit={handleSendReply}>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
              rows="3"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#30442B] focus:ring-1 focus:ring-[#30442B] resize-none"
              disabled={sending || loading}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={sending || !replyMessage.trim() || loading}
                className="px-6 py-2.5 bg-[#30442B] text-white rounded-lg font-semibold hover:bg-[#22301e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
