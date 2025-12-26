export default function StatCardSkeleton() {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md sm:rounded-xl sm:p-5 sm:shadow-lg lg:p-6">
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200 sm:h-5"></div>
      <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-300 sm:mt-3 sm:h-10 lg:h-12"></div>
      <div className="mt-1.5 h-3 w-32 animate-pulse rounded bg-gray-200 sm:mt-2 sm:h-4"></div>
    </div>
  );
}
