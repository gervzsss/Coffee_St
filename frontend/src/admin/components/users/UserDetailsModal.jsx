export default function UserDetailsModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white sm:rounded-2xl lg:max-w-xl">
        <div className="p-4 sm:p-5 lg:p-6">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between sm:mb-5 lg:mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">User Details – {user.name}</h2>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">Complete user information and activity history</p>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 transition-colors hover:text-gray-600">
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info Grid */}
          <div className="mb-4 rounded-lg border border-gray-200 p-3 sm:mb-5 sm:rounded-xl sm:p-4 lg:mb-6 lg:p-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              <div>
                <p className="text-xs text-gray-500 sm:text-sm">Email</p>
                <p className="truncate text-sm font-medium text-gray-900 sm:text-base">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 sm:text-sm">Phone</p>
                <p className="text-sm font-medium text-gray-900 sm:text-base">{user.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 sm:text-sm">Status</p>
                <p className={`text-sm font-medium capitalize sm:text-base ${user.status === "active" ? "text-[#30442B]" : "text-red-600"}`}>{user.status}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 sm:text-sm">Total Orders</p>
                <p className="text-sm font-medium text-gray-900 sm:text-base">{user.orders_count}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 sm:text-sm">Total Spent</p>
                <p className="text-sm font-medium text-gray-900 sm:text-base">₱{Number(user.total_spent || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 sm:text-sm">Joined</p>
                <p className="text-sm font-medium text-gray-900 sm:text-base">{new Date(user.created_at).toLocaleDateString("en-CA")}</p>
              </div>
            </div>
          </div>

          {/* Warnings Section */}
          <div className="rounded-lg border border-gray-200 p-4 text-center sm:rounded-xl sm:p-5 lg:p-6">
            {user.has_warnings ? (
              <>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 sm:mb-3 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                  <svg className="h-6 w-6 text-yellow-600 sm:h-7 sm:w-7 lg:h-8 lg:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Warning</h3>
                <p className="text-sm text-gray-500 sm:text-base">{user.warnings}</p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:mb-3 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                  <svg className="h-6 w-6 text-gray-400 sm:h-7 sm:w-7 lg:h-8 lg:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Clean record</h3>
                <p className="text-sm text-gray-500 sm:text-base">No scam warnings or fraudulent activity reported</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
