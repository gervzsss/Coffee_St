import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden" onClick={closeMobileSidebar} aria-hidden="true" />}

      {/* Mobile Header with Hamburger */}
      <div className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center border-b border-gray-200 bg-white/95 px-4 shadow-sm backdrop-blur-md lg:hidden">
        <button onClick={toggleMobileSidebar} className="rounded-xl p-2 transition-all hover:bg-gray-100 active:scale-95" aria-label="Toggle sidebar">
          <svg className="h-6 w-6 text-[#30442B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="ml-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-[#5d7f52] to-[#3d5a34] shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 010 8h-1" />
              <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#30442B]">Coffee St.</span>
            <span className="text-xs font-medium text-gray-500">Admin</span>
          </div>
        </div>
      </div>

      <AdminSidebar isMobileOpen={isMobileSidebarOpen} onMobileClose={closeMobileSidebar} />

      <main className="ml-0 flex-1 pt-16 transition-all duration-300 lg:ml-72 lg:pt-0">{children}</main>
    </div>
  );
}
