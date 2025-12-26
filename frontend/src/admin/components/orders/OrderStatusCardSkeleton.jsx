export default function OrderStatusCardSkeleton() {
  return (
    <div className="rounded-lg border-2 border-gray-200 bg-white p-3 sm:rounded-xl sm:p-4">
      <div className="h-3 w-20 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-24"></div>
      <div className="mt-0.5 h-7 w-12 animate-pulse rounded bg-gray-200 sm:mt-1 sm:h-8 sm:w-14 lg:h-9"></div>
    </div>
  );
}
