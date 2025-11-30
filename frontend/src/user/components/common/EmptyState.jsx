import { Link } from 'react-router-dom';

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionTo,
  onAction,
}) {
  return (
    <div className="rounded-xl sm:rounded-2xl border bg-white p-6 sm:p-8 lg:p-12 shadow-sm text-center">
      {icon || (
        <svg
          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      )}
      <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-800 mb-1.5 sm:mb-2">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-5 lg:mb-6">
        {description}
      </p>
      {actionTo ? (
        <Link
          to={actionTo}
          className="inline-flex items-center px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 bg-[#30442B] text-sm sm:text-base text-white rounded-lg hover:bg-[#405939] transition-colors"
        >
          {actionText}
        </Link>
      ) : (
        onAction && (
          <button
            onClick={onAction}
            className="bg-[#30442B] text-sm sm:text-base text-white px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 cursor-pointer rounded-lg hover:bg-[#405939] transition-colors"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
}
