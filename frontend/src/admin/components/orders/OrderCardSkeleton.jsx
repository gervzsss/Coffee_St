export default function OrderCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-lg sm:p-5 lg:p-6">
      {/* Header Section */}
      <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:mb-4 sm:flex-row sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200 sm:h-6 sm:w-36"></div>
          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
        </div>
        <div className="text-right">
          <div className="h-7 w-24 animate-pulse rounded bg-gray-200 sm:h-8 sm:w-28"></div>
          <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200 sm:h-4"></div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:mb-4 sm:gap-x-4 sm:gap-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200 sm:h-5 sm:w-28"></div>
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200 sm:h-5 sm:w-24"></div>
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200 sm:h-5 sm:w-24"></div>
      </div>

      {/* Address Section */}
      <div className="mb-3 h-4 w-full animate-pulse rounded bg-gray-200 sm:mb-4 sm:h-5"></div>

      {/* Order Items Section */}
      <div className="mb-3 overflow-hidden rounded-lg border border-gray-200 sm:mb-4">
        <div className="border-b border-gray-200 bg-gray-50 px-3 py-1.5 sm:px-4 sm:py-2">
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-24"></div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="px-3 py-2 sm:px-4 sm:py-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200 sm:h-5 sm:w-28"></div>
                <div className="mt-2 space-y-1">
                  <div className="h-3 w-32 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-36"></div>
                  <div className="h-3 w-28 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-32"></div>
                </div>
              </div>
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200 sm:h-5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Button */}
      <div className="relative">
        <div className="h-11 w-full animate-pulse rounded-lg bg-gray-200 sm:h-12"></div>
      </div>

      {/* View Details Link */}
      <div className="mt-3 h-4 w-32 animate-pulse rounded bg-gray-200 sm:h-5 sm:w-36"></div>
    </div>
  );
}
