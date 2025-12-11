export default function StatCard({ title, value, change, trend = "up" }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-xl sm:rounded-xl sm:p-5 sm:shadow-lg lg:p-6">
      <div className="text-xs font-medium tracking-wide text-gray-500 uppercase sm:text-sm">{title}</div>
      <div className="mt-2 text-2xl font-bold text-[#30442B] sm:mt-3 sm:text-3xl lg:text-4xl">{value}</div>
      {change && (
        <div className="mt-1.5 flex items-center text-xs text-gray-400 sm:mt-2 sm:text-sm">
          <span className={trend === "up" ? "text-green-500" : "text-red-500"}>{trend === "up" ? "↑" : "↓"}</span>
          <span className="ml-1">{change}</span>
        </div>
      )}
    </div>
  );
}
