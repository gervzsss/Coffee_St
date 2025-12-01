import { useMemo } from 'react';

const BAR_COLORS = ['#30442B', '#4b6a4f', '#7ea37b', '#a9c7a8'];

const DEFAULT_DATA = [{ name: 'No Data', value: 0 }];

export default function TopSellingChart({
  data = [],
  title = 'Top Selling',
  subtitle = 'Latest products trends this week',
}) {
  const chartData = data && data.length > 0 ? data : DEFAULT_DATA;

  const maxVal = useMemo(() => {
    return Math.max(...chartData.map((d) => d.value), 1);
  }, [chartData]);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 mb-6">{subtitle}</p>

      <div className="flex-1 flex items-end gap-2 sm:gap-4 min-h-[200px]">
        {chartData.map((item, index) => (
          <BarItem
            key={index}
            name={item.name}
            value={item.value}
            maxValue={maxVal}
            color={BAR_COLORS[index % BAR_COLORS.length]}
          />
        ))}
      </div>
    </div>
  );
}

function BarItem({ name, value, maxValue, color }) {
  const heightPercentage = (value / maxValue) * 100;

  return (
    <div className="flex-1 h-full flex flex-col justify-end group">
      <div className="relative w-full flex justify-center items-end flex-1">
        <div
          className="w-full max-w-[60px] rounded-t-lg transition-all duration-500 ease-out relative"
          style={{
            backgroundColor: color,
            height: `${heightPercentage}%`,
            minHeight: '4px',
          }}
        >
          {/* Tooltip / Value Label on Hover */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
            {value} sold
          </div>
        </div>
      </div>
      <div
        className="text-center text-xs sm:text-sm mt-3 font-medium text-gray-600 truncate w-full px-1"
        title={name}
      >
        {name}
      </div>
    </div>
  );
}
