import { useMemo } from "react";

const BAR_COLORS = ["#30442B", "#4b6a4f", "#7ea37b", "#a9c7a8"];

const DEFAULT_DATA = [{ name: "No Data", value: 0 }];

export default function TopSellingChart({ data = [], title = "Top Selling", subtitle = "Latest products trends this week" }) {
  const chartData = data && data.length > 0 ? data : DEFAULT_DATA;

  const maxVal = useMemo(() => {
    return Math.max(...chartData.map((d) => d.value), 1);
  }, [chartData]);

  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl sm:rounded-2xl sm:p-6 lg:p-8">
      <h3 className="mb-1 text-lg font-semibold text-gray-800 sm:text-xl">{title}</h3>
      <p className="mb-6 text-xs text-gray-500 sm:text-sm">{subtitle}</p>

      <div className="flex min-h-[200px] flex-1 items-end gap-2 sm:gap-4">
        {chartData.map((item, index) => (
          <BarItem key={index} name={item.name} value={item.value} maxValue={maxVal} color={BAR_COLORS[index % BAR_COLORS.length]} />
        ))}
      </div>
    </div>
  );
}

function BarItem({ name, value, maxValue, color }) {
  const heightPercentage = (value / maxValue) * 100;

  return (
    <div className="group flex h-full flex-1 flex-col justify-end">
      <div className="relative flex w-full flex-1 items-end justify-center">
        <div
          className="relative w-full max-w-[60px] rounded-t-lg transition-all duration-500 ease-out"
          style={{
            backgroundColor: color,
            height: `${heightPercentage}%`,
            minHeight: "4px",
          }}
        >
          {/* Tooltip / Value Label on Hover */}
          <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 transform rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {value} sold
          </div>
        </div>
      </div>
      <div className="mt-3 w-full truncate px-1 text-center text-xs font-medium text-gray-600 sm:text-sm" title={name}>
        {name}
      </div>
    </div>
  );
}
