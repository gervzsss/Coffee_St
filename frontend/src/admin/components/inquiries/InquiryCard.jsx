import { formatDateTime } from '../../utils/formatDate';

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

export default function InquiryCard({ thread, onClick }) {
  const userName = thread.user_name || thread.guest_name || 'Guest';
  const userEmail = thread.user_email || thread.guest_email;
  const message =
    thread.message || thread.latest_message || 'No message content';

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer relative"
    >
      {/* Reply Icon - Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ReplyIcon />
      </div>

      {/* Message Title */}
      <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3 pr-8">
        {thread.subject || 'No Subject'}
      </h3>

      {/* User Info Row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
        <span className="font-medium">{userName}</span>
        <span className="text-gray-400 truncate max-w-[150px] sm:max-w-none">
          {userEmail}
        </span>
        <span className="text-gray-400">
          {formatDateTime(thread.created_at)}
        </span>
      </div>

      {/* Message Content */}
      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-2">
        {message}
      </p>
    </div>
  );
}
