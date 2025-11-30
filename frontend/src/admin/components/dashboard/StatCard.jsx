export default function StatCard({ title, value, change, trend = 'up' }) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-5 lg:p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">
        {title}
      </div>
      <div className="mt-2 sm:mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#30442B]">
        {value}
      </div>
      {change && (
        <div className="text-xs sm:text-sm text-gray-400 mt-1.5 sm:mt-2 flex items-center">
          <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
          <span className="ml-1">{change}</span>
        </div>
      )}
    </div>
  );
}
