export default function MetricCard({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:rounded-2xl sm:p-5 lg:p-6">
      <div className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase sm:mb-3 sm:text-sm">{title}</div>
      <p className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">{value}</p>
    </div>
  );
}
