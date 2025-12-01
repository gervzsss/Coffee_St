import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Header, Footer } from '../components/layout';
import { getThread, sendReply } from '../services/inquiryService';
import { useToast } from '../hooks/useToast';

export default function MessageThread() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchThread();
  }, [id]);

  const fetchThread = async () => {
    setLoading(true);
    const result = await getThread(id);
    if (result.success) {
      setThread(result.data);
    } else {
      showToast('Failed to load conversation', { type: 'error' });
      navigate('/messages');
    }
    setLoading(false);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      showToast('Please enter a message', { type: 'error' });
      return;
    }

    setSending(true);
    const result = await sendReply(id, replyMessage);

    if (result.success) {
      setThread((prev) => ({
        ...prev,
        messages: [...prev.messages, result.data],
      }));
      setReplyMessage('');
      showToast('Reply sent successfully', { type: 'success' });
    } else {
      showToast(result.error || 'Failed to send reply', { type: 'error' });
    }

    setSending(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending' },
      responded: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Responded',
      },
      done: { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
      closed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30442B]"></div>
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
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Thread Header */}
        <div className="w-full bg-[#30442B] pb-6 pt-12">
          <div className="container mx-auto px-4">
            <button
              onClick={() => navigate('/messages')}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
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
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Messages
            </button>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {thread.subject}
                </h1>
                <p className="text-gray-200 text-sm">
                  Started on{' '}
                  {new Date(thread.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {getStatusBadge(thread.status)}
            </div>
          </div>
        </div>

        {/* Messages Content */}
        <section className="relative pb-24">
          <div className="mx-auto max-w-4xl px-6 sm:px-10 mt-8">
            {/* Messages List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                {thread.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.is_admin ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.is_admin ? '' : 'flex flex-col items-end'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {message.sender_name}
                        </span>
                        {message.is_admin && (
                          <span className="px-2 py-0.5 bg-[#30442B] text-white text-xs rounded-full">
                            Support
                          </span>
                        )}
                      </div>

                      <div
                        className={`rounded-2xl p-4 ${
                          message.is_admin
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-[#30442B] text-white'
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
              </div>
            </div>

            {/* Reply Form */}
            {thread.status !== 'closed' && thread.status !== 'done' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Send a Reply
                </h3>
                <form onSubmit={handleSendReply}>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#30442B] focus:ring-1 focus:ring-[#30442B] resize-none"
                    disabled={sending}
                  />

                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      disabled={sending || !replyMessage.trim()}
                      className="px-6 py-2.5 bg-[#30442B] text-white rounded-full font-semibold hover:bg-[#22301e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {(thread.status === 'closed' || thread.status === 'done') && (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
                <p className="text-gray-600">
                  This conversation has been{' '}
                  {thread.status === 'closed' ? 'closed' : 'resolved'}.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  If you need further assistance, please create a new inquiry
                  from the{' '}
                  <a
                    href="/contact"
                    className="text-[#30442B] font-semibold hover:underline"
                  >
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
