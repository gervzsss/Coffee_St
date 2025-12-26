export default function ChartSkeleton() {
  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200"></div>
      <div className="space-y-3">
        <div className="h-48 w-full animate-pulse rounded bg-gray-100"></div>
        <div className="flex gap-2">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
