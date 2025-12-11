export default function ProductCardSkeleton() {
  return (
    <div className="group flex h-full animate-pulse flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Image Skeleton */}
      <div className="relative h-72 overflow-hidden bg-gray-200">
        <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200"></div>
      </div>

      {/* Product Details Skeleton */}
      <div className="flex flex-1 flex-col bg-white p-6">
        {/* Title Skeleton */}
        <div className="mb-2">
          <div className="h-7 w-3/4 rounded bg-gray-200"></div>
        </div>

        {/* Description Skeleton */}
        <div className="mb-4 space-y-2">
          <div className="h-4 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-5/6 rounded bg-gray-200"></div>
        </div>

        {/* Price and Button Skeleton */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="h-7 w-24 rounded bg-gray-200"></div>
          <div className="h-10 w-32 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
