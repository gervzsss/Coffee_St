export default function AdminHeader({ title, action, onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile menu button - only shown if onMenuClick is provided */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
            {title}
          </h2>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
