import { formatDateTime } from '../../utils/formatDate';

/**
 * Reply icon component
 */
function ReplyIcon() {
  return (
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
  );
}

/**
 * Inquiry card component for displaying a thread preview
 * @param {{ thread: object, onClick: () => void }} props
 */
export default function InquiryCard({ thread, onClick }) {
  const userName = thread.user_name || thread.guest_name || 'Guest';
  const userEmail = thread.user_email || thread.guest_email;
  const message = thread.message || thread.latest_message || 'No message content';

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer relative"
    >
      {/* Reply Icon - Top Right */}
      <div className="absolute top-6 right-6">
        <ReplyIcon />
      </div>

      {/* Message Title */}
      <h3 className="font-bold text-gray-900 text-lg mb-3 pr-8">
        {thread.subject || 'No Subject'}
      </h3>

      {/* User Info Row */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <span className="font-medium">{userName}</span>
        <span className="text-gray-400">{userEmail}</span>
        <span className="text-gray-400">
          {formatDateTime(thread.created_at)}
        </span>
      </div>

      {/* Message Content */}
      <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
    </div>
  );
}
