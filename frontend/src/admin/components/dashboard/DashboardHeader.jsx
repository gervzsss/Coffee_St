import { formatCurrentDate } from '../../utils/formatDate';

export default function DashboardHeader({ adminName = 'Admin' }) {
  const currentDate = formatCurrentDate();

  return (
    <div className="bg-[#30442B] text-white rounded-2xl p-8 mb-8 max-w-screen-2xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Welcome, {adminName}!
          </h1>
          <p className="text-sm text-white/80 mt-2">
            {currentDate} — Welcome back to your coffee shop management
            dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
