import { useMemo } from 'react';

export default function SalesOverviewChart({
  data = [],
  title = 'Sales Overview',
  subtitle = 'Daily sales for the past week',
}) {
  const chartData =
    data && data.length > 0
      ? data
      : [
          { date: 'Mon', total: 0 },
          { date: 'Tue', total: 0 },
          { date: 'Wed', total: 0 },
          { date: 'Thu', total: 0 },
          { date: 'Fri', total: 0 },
          { date: 'Sat', total: 0 },
          { date: 'Sun', total: 0 },
        ];

  const { points, labels } = useMemo(() => {
    if (!chartData.length) return { points: '', labels: [] };

    const width = 600;
    const height = 200;
    const paddingX = 20;
    const paddingY = 20;
    const effectiveWidth = width - paddingX * 2;
    const effectiveHeight = height - paddingY * 2;

    const maxVal = Math.max(...chartData.map((d) => Number(d.total)));
    const scaleMax = maxVal === 0 ? 100 : maxVal;
    const scaleY = effectiveHeight / scaleMax;
    const stepX = effectiveWidth / (chartData.length - 1);

    const pts = chartData
      .map((d, i) => {
        const x = paddingX + i * stepX;
        const val = Number(d.total);
        const y = height - paddingY - val * scaleY;
        return `${x},${y}`;
      })
      .join(' ');

    return { points: pts, labels: chartData.map((d) => d.date) };
  }, [chartData]);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 mb-6">{subtitle}</p>

      <div className="flex-1 min-h-[200px] relative">
        {/* Chart Area */}
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 w-full relative">
            <svg
              viewBox="0 0 600 200"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              {/* Grid lines (optional) */}
              <line
                x1="20"
                y1="180"
                x2="580"
                y2="180"
                stroke="#e5e7eb"
                strokeWidth="1"
              />

              {/* The Line */}
              <polyline
                fill="none"
                stroke="#30442B"
                strokeWidth="3"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* Data Points */}
              {points.split(' ').map((point, i) => {
                const [cx, cy] = point.split(',');
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="#30442B"
                    className="hover:r-6 transition-all duration-200 cursor-pointer"
                  >
                    <title>${Number(chartData[i].total).toFixed(2)}</title>
                  </circle>
                );
              })}
            </svg>
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-between mt-2 px-2 text-xs text-gray-500">
            {labels.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
