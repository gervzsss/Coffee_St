export default function ProductTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Available</th>
            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="transition-colors hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200"></div>
                  <div>
                    <div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-3 w-48 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
              </td>
              <td className="px-6 py-4">
                <div className="mx-auto h-6 w-11 animate-pulse rounded-full bg-gray-200"></div>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200"></div>
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
