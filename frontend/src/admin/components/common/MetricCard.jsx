/**
 * Simple metric card for displaying a single statistic
 * @param {{ title: string, value: number | string }} props
 */
export default function MetricCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
        {title}
      </div>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
