export default function POSProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Image */}
      <div className="aspect-square w-full animate-pulse bg-gray-200"></div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        {/* Category */}
        <div className="mb-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
        {/* Product Name - 2 lines */}
        <div className="mb-1 h-4 w-full animate-pulse rounded bg-gray-200"></div>
        <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
        {/* Price */}
        <div className="mt-auto h-5 w-20 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  );
}
