import { useMemo } from "react";

export default function SalesOverviewChart({ data = [], title = "Sales Overview", subtitle = "Daily sales for the past week" }) {
  const chartData =
    data && data.length > 0
      ? data
      : [
          { date: "Mon", total: 0 },
          { date: "Tue", total: 0 },
          { date: "Wed", total: 0 },
          { date: "Thu", total: 0 },
          { date: "Fri", total: 0 },
          { date: "Sat", total: 0 },
          { date: "Sun", total: 0 },
        ];

  const { points, labels } = useMemo(() => {
    if (!chartData.length) return { points: "", labels: [] };

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
      .join(" ");

    return { points: pts, labels: chartData.map((d) => d.date) };
  }, [chartData]);

  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl sm:rounded-2xl sm:p-6 lg:p-8">
      <h3 className="mb-1 text-lg font-semibold text-gray-800 sm:text-xl">{title}</h3>
      <p className="mb-6 text-xs text-gray-500 sm:text-sm">{subtitle}</p>

      <div className="relative min-h-[200px] flex-1">
        {/* Chart Area */}
        <div className="absolute inset-0 flex flex-col">
          <div className="relative w-full flex-1">
            <svg viewBox="0 0 600 200" className="h-full w-full overflow-visible" preserveAspectRatio="none">
              {/* Grid lines (optional) */}
              <line x1="20" y1="180" x2="580" y2="180" stroke="#e5e7eb" strokeWidth="1" />

              {/* The Line */}
              <polyline fill="none" stroke="#30442B" strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

              {/* Data Points */}
              {points.split(" ").map((point, i) => {
                const [cx, cy] = point.split(",");
                return (
                  <circle key={i} cx={cx} cy={cy} r="4" fill="#30442B" className="hover:r-6 cursor-pointer transition-all duration-200">
                    <title>${Number(chartData[i].total).toFixed(2)}</title>
                  </circle>
                );
              })}
            </svg>
          </div>

          {/* X-Axis Labels */}
          <div className="mt-2 flex justify-between px-2 text-xs text-gray-500">
            {labels.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
