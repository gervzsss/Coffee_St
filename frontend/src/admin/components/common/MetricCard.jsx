export default function MetricCard({ title, value }) {
  return (
    <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-2 sm:mb-3">
        {title}
      </div>
      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}
