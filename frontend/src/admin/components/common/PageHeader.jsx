/**
 * Reusable page header component for admin pages
 * @param {{ title: string, subtitle?: string }} props
 */
export default function PageHeader({ title, subtitle }) {
  return (
    <div className="bg-[#30442B] text-white rounded-2xl p-8 mb-8">
      <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
      {subtitle && (
        <p className="text-sm text-white/80 mt-2">{subtitle}</p>
      )}
    </div>
  );
}
