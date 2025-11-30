export default function SalesOverviewChart({
  data = null,
  title = 'Sales Overview',
  subtitle = 'Daily sales for the past week',
}) {
  const points = data
    ? data.map((point) => `${point.x},${point.y}`).join(' ')
    : '20,140 100,120 180,130 260,110 340,150 420,120 500,100';

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        {subtitle}
      </p>
      <div className="h-48 sm:h-56 lg:h-64 bg-linear-to-b from-white to-gray-50 rounded-lg flex items-end p-3 sm:p-4">
        <svg viewBox="0 0 600 200" className="w-full h-full">
          <polyline
            fill="none"
            stroke="#30442B"
            strokeWidth="4"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
