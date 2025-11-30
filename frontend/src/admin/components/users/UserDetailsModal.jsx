export default function UserDetailsModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-5 lg:p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 sm:mb-5 lg:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                User Details – {user.name}
              </h2>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Complete user information and activity history
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User Info Grid */}
          <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 mb-4 sm:mb-5 lg:mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Email</p>
                <p className="font-medium text-sm sm:text-base text-gray-900 truncate">
                  {user.email}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                <p className="font-medium text-sm sm:text-base text-gray-900">
                  {user.phone || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Status</p>
                <p
                  className={`font-medium text-sm sm:text-base capitalize ${
                    user.status === 'active' ? 'text-[#30442B]' : 'text-red-600'
                  }`}
                >
                  {user.status}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Orders</p>
                <p className="font-medium text-sm sm:text-base text-gray-900">
                  {user.orders_count}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Spent</p>
                <p className="font-medium text-sm sm:text-base text-gray-900">
                  ₱{Number(user.total_spent || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Joined</p>
                <p className="font-medium text-sm sm:text-base text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('en-CA')}
                </p>
              </div>
            </div>
          </div>

          {/* Warnings Section */}
          <div className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 text-center">
            {user.has_warnings ? (
              <>
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-3 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Warning
                </h3>
                <p className="text-sm sm:text-base text-gray-500">
                  {user.warnings}
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Clean record
                </h3>
                <p className="text-sm sm:text-base text-gray-500">
                  No scam warnings or fraudulent activity reported
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
