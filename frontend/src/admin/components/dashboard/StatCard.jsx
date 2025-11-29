export default function StatCard({ title, value, change, trend = 'up' }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
        {title}
      </div>
      <div className="mt-3 text-3xl font-bold text-[#30442B]">{value}</div>
      {change && (
        <div className="text-sm text-gray-400 mt-2 flex items-center">
          <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
          <span className="ml-1">{change}</span>
        </div>
      )}
    </div>
  );
}
