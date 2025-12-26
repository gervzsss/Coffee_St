export default function InquiryCardSkeleton() {
  return (
    <div className="relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-lg sm:rounded-xl sm:p-5 lg:p-6">
      {/* Reply Icon Placeholder */}
      <div className="absolute top-4 right-4 h-5 w-5 animate-pulse rounded bg-gray-200 sm:top-6 sm:right-6"></div>

      {/* Title */}
      <div className="mb-2 h-5 w-48 animate-pulse rounded bg-gray-200 pr-8 sm:mb-3 sm:h-6 sm:w-56"></div>

      {/* Meta Info */}
      <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4 sm:gap-4">
        <div className="h-4 w-28 animate-pulse rounded bg-gray-200 sm:h-5 sm:w-32"></div>
        <div className="h-4 w-36 animate-pulse rounded bg-gray-200 sm:h-5 sm:w-40"></div>
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200 sm:h-5 sm:w-36"></div>
      </div>

      {/* Message Preview */}
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-gray-200 sm:h-4"></div>
        <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200 sm:h-4"></div>
      </div>
    </div>
  );
}
