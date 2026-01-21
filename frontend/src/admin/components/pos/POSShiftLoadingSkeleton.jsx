export default function POSShiftLoadingSkeleton() {
  return (
    <div className="flex h-[calc(100vh-80px)] flex-col gap-4 p-4 lg:p-6">
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Products Section */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          {/* Search and Filter */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200"></div>
              <div className="h-10 w-40 animate-pulse rounded-lg bg-gray-200"></div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                  <div className="aspect-square w-full animate-pulse bg-gray-200"></div>
                  <div className="p-4">
                    <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
                    <div className="mb-3 h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-9 w-full animate-pulse rounded-lg bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div className="flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 lg:w-96">
          <div className="border-b border-gray-200 p-4">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-gray-400">
            <div className="mb-4 h-16 w-16 animate-pulse rounded-full bg-gray-200"></div>
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="border-t border-gray-200 p-4">
            <div className="mb-4 space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
            <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
