export default function OrderTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">Order</th>
            <th className="hidden px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:table-cell sm:px-6 sm:py-4">Date</th>
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">Status</th>
            <th className="hidden px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:table-cell sm:px-6 sm:py-4">Total</th>
            <th className="hidden px-3 py-3 text-center text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4 md:table-cell">Items</th>
            <th className="px-3 py-3 text-center text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6 sm:py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="transition-colors hover:bg-gray-50">
              <td className="px-3 py-3 sm:px-6 sm:py-4">
                <div className="min-w-0">
                  <div className="mb-1 h-4 w-28 animate-pulse rounded bg-gray-200 sm:h-5 sm:w-32"></div>
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-28"></div>
                </div>
              </td>
              <td className="hidden px-3 py-3 sm:table-cell sm:px-6 sm:py-4">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td className="px-3 py-3 sm:px-6 sm:py-4">
                <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200 sm:w-24"></div>
              </td>
              <td className="hidden px-3 py-3 sm:table-cell sm:px-6 sm:py-4">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200 sm:w-20"></div>
              </td>
              <td className="hidden px-3 py-3 text-center sm:px-6 sm:py-4 md:table-cell">
                <div className="mx-auto h-4 w-8 animate-pulse rounded bg-gray-200"></div>
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
