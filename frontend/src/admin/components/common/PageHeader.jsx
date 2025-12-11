export default function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-6 rounded-xl bg-[#30442B] p-4 text-white sm:mb-8 sm:rounded-2xl sm:p-6 lg:p-8">
      <h1 className="text-xl font-extrabold sm:text-2xl md:text-3xl lg:text-4xl">{title}</h1>
      {subtitle && <p className="mt-1 text-xs text-white/80 sm:mt-2 sm:text-sm">{subtitle}</p>}
    </div>
  );
}
