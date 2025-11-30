export default function PageHeader({ title, subtitle }) {
  return (
    <div className="bg-[#30442B] text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">{title}</h1>
      {subtitle && <p className="text-xs sm:text-sm text-white/80 mt-1 sm:mt-2">{subtitle}</p>}
    </div>
  );
}
