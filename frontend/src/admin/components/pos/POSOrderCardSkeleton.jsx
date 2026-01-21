export default function POSOrderCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
      {/* Header */}
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="h-7 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-1 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Customer */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
        </div>

        {/* Items Preview */}
        <div className="mb-3 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
          <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-100 bg-gray-50 p-3">
        <div className="flex gap-2">
          <div className="h-9 flex-1 animate-pulse rounded-lg bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
