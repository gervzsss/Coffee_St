import { Link } from "react-router-dom";

export default function EmptyState({ icon, title, description, actionText, actionTo, onAction }) {
  return (
    <div className="rounded-xl border bg-white p-6 text-center shadow-sm sm:rounded-2xl sm:p-8 lg:p-12">
      {icon || (
        <svg className="mx-auto mb-3 h-16 w-16 text-gray-300 sm:mb-4 sm:h-20 sm:w-20 lg:h-24 lg:w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )}
      <h2 className="mb-1.5 text-xl font-bold text-gray-800 sm:mb-2 sm:text-2xl lg:text-2xl">{title}</h2>
      <p className="mb-4 text-sm text-gray-600 sm:mb-5 sm:text-base lg:mb-6">{description}</p>
      {actionTo ? (
        <Link to={actionTo} className="inline-flex items-center rounded-lg bg-[#30442B] px-4 py-2.5 text-sm text-white transition-colors hover:bg-[#405939] sm:px-5 sm:py-3 sm:text-base lg:px-6">
          {actionText}
        </Link>
      ) : (
        onAction && (
          <button onClick={onAction} className="cursor-pointer rounded-lg bg-[#30442B] px-4 py-2.5 text-sm text-white transition-colors hover:bg-[#405939] sm:px-5 sm:py-3 sm:text-base lg:px-6">
            {actionText}
          </button>
        )
      )}
    </div>
  );
}
