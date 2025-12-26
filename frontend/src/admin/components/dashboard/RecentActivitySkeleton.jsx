export default function RecentActivitySkeleton() {
  return (
    <div className="rounded-xl bg-white p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <div className="mb-6 h-6 w-48 animate-pulse rounded bg-gray-200"></div>
      <ul className="space-y-6">
        {[1, 2, 3].map((item) => (
          <li key={item} className="border-l-2 border-gray-200 pl-6">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-2 h-4 w-full animate-pulse rounded bg-gray-100"></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
