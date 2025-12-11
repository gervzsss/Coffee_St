import { formatCurrentDate } from "../../utils/formatDate";

export default function DashboardHeader({ adminName = "Admin" }) {
  const currentDate = formatCurrentDate();

  return (
    <div className="mx-auto mb-8 max-w-screen-2xl rounded-2xl bg-[#30442B] p-8 text-white">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold md:text-4xl">Welcome, {adminName}!</h1>
          <p className="mt-2 text-sm text-white/80">{currentDate} — Welcome back to your coffee shop management dashboard</p>
        </div>
      </div>
    </div>
  );
}
