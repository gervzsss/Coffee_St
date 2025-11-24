export default function AdminHeader({ title, action }) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}
