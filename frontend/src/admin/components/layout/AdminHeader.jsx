export default function AdminHeader({ title, action, onMenuClick }) {
  return (
    <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile menu button - only shown if onMenuClick is provided */}
          {onMenuClick && (
            <button onClick={onMenuClick} className="-ml-2 rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden" aria-label="Toggle menu">
              <svg className="h-5 w-5 text-gray-700 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <h2 className="truncate text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">{title}</h2>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
