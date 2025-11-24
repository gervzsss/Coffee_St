import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-64 transition-all duration-300 overflow-auto">
        {children}
      </main>
    </div>
  );
}
