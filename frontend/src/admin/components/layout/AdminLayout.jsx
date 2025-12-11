import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("adminSidebarCollapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

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
      {isMobileSidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden" onClick={closeMobileSidebar} aria-hidden="true" />}

      {/* Mobile Header with Hamburger */}
      <div className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center border-b border-gray-200 bg-white px-4 lg:hidden">
        <button onClick={toggleMobileSidebar} className="rounded-lg p-2 transition-colors hover:bg-gray-100" aria-label="Toggle sidebar">
          <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="ml-4 text-lg font-bold text-[#30442B]">Coffee St. Admin</span>
      </div>

      <AdminSidebar isMobileOpen={isMobileSidebarOpen} onMobileClose={closeMobileSidebar} isCollapsed={isSidebarCollapsed} toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <main className={`ml-0 flex-1 overflow-auto pt-16 transition-all duration-300 lg:pt-0 ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>{children}</main>
    </div>
  );
}
