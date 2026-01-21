export default function POSOrderDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Status Card */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
                <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200"></div>
              </div>
            </div>
            <div className="bg-gray-50 p-4">
              <div className="mb-3 h-5 w-28 animate-pulse rounded bg-gray-200"></div>
              <div className="flex gap-2">
                <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200"></div>
                <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"></div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-100 p-4">
              <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="divide-y divide-gray-100">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-5 w-40 animate-pulse rounded bg-gray-200"></div>
                      <div className="mt-2 space-y-1">
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                      </div>
                    </div>
                    <div className="h-5 w-20 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-100 p-4">
              <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="space-y-3 p-4">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-100 p-4">
              <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="space-y-3 p-4">
              <div className="flex justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-100 p-4">
              <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="space-y-3 p-4">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
