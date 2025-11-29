export default function ProductCardSkeleton() {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-72 overflow-hidden bg-gray-200">
        <div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
      </div>

      {/* Product Details Skeleton */}
      <div className="flex flex-1 flex-col bg-white p-6">
        {/* Title Skeleton */}
        <div className="mb-2">
          <div className="h-7 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Description Skeleton */}
        <div className="mb-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Price and Button Skeleton */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="h-7 w-24 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
