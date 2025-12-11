import { formatDateTime } from "../../utils/formatDate";

function ReplyIcon() {
  return (
    <svg className="h-5 w-5 text-gray-400 transition-colors hover:text-[#30442B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  );
}

export default function InquiryCard({ thread, onClick }) {
  const userName = thread.user_name || thread.guest_name || "Guest";
  const userEmail = thread.user_email || thread.guest_email;
  const message = thread.message || thread.latest_message || "No message content";

  return (
    <div onClick={onClick} className="relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-lg sm:rounded-xl sm:p-5 lg:p-6">
      {/* Reply Icon - Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ReplyIcon />
      </div>

      {/* Message Title */}
      <h3 className="mb-2 pr-8 text-base font-bold text-gray-900 sm:mb-3 sm:text-lg">{thread.subject || "No Subject"}</h3>

      {/* User Info Row */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-600 sm:mb-4 sm:gap-4 sm:text-sm">
        <span className="font-medium">{userName}</span>
        <span className="max-w-[150px] truncate text-gray-400 sm:max-w-none">{userEmail}</span>
        <span className="text-gray-400">{formatDateTime(thread.created_at)}</span>
      </div>

      {/* Message Content */}
      <p className="line-clamp-2 text-xs leading-relaxed text-gray-700 sm:text-sm">{message}</p>
    </div>
  );
}
