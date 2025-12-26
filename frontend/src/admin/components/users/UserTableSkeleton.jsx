export default function UserTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">User</th>
            <th className="hidden px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:table-cell sm:px-6 sm:py-4">Contact</th>
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">Status</th>
            <th className="hidden px-3 py-3 text-center text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4 md:table-cell">Orders</th>
            <th className="hidden px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4 lg:table-cell">Warnings</th>
            <th className="px-3 py-3 text-center text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="transition-colors hover:bg-gray-50">
              <td className="px-3 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-200 sm:h-10 sm:w-10"></div>
                  <div className="min-w-0">
                    <div className="mb-1 h-4 w-32 animate-pulse rounded bg-gray-200 sm:h-5 sm:w-36"></div>
                    <div className="h-3 w-28 animate-pulse rounded bg-gray-200 sm:hidden"></div>
                  </div>
                </div>
              </td>
              <td className="hidden px-3 py-3 sm:table-cell sm:px-6 sm:py-4">
                <div className="mb-1 h-4 w-40 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-28 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td className="px-3 py-3 sm:px-6 sm:py-4">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200 sm:h-5"></div>
              </td>
              <td className="hidden px-3 py-3 text-center sm:px-6 sm:py-4 md:table-cell">
                <div className="mx-auto h-4 w-8 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td className="hidden px-3 py-3 sm:px-6 sm:py-4 lg:table-cell">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td className="px-3 py-3 sm:px-6 sm:py-4">
                <div className="flex justify-center gap-2">
                  <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200"></div>
                  <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
