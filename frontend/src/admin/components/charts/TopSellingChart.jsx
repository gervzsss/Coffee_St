const BAR_COLORS = ['#30442B', '#4b6a4f', '#7ea37b', '#a9c7a8'];

const DEFAULT_DATA = [
  { name: 'macchiato', value: 40 },
  { name: 'latte', value: 48 },
  { name: 'white mocha', value: 32 },
  { name: 'americano', value: 28 },
];

export default function TopSellingChart({
  data = null,
  title = 'Top Selling',
  subtitle = 'Latest products trends this week',
}) {
  const chartData = data || DEFAULT_DATA;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        {subtitle}
      </p>
      <div className="h-48 sm:h-56 lg:h-64 flex items-end gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4">
        {chartData.map((item, index) => (
          <BarItem
            key={item.name}
            name={item.name}
            height={item.value}
            color={BAR_COLORS[index % BAR_COLORS.length]}
          />
        ))}
      </div>
    </div>
  );
}

function BarItem({ name, height, color }) {
  const barHeight = `h-${height}`;
  const hoverHeight = `group-hover:h-${height + 4}`;

  return (
    <div className="flex-1 h-full flex flex-col justify-end group">
      <div
        className="mx-auto w-16 rounded-t-lg transition-all duration-300"
        style={{
          backgroundColor: color,
          height: `${height * 4}px`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.height = `${height * 4 + 16}px`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.height = `${height * 4}px`;
        }}
      />
      <div className="text-center text-sm mt-3 font-medium">{name}</div>
    </div>
  );
}
