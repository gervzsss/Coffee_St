import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminSidebar({ isMobileOpen = false, onMobileClose, isCollapsed = false, toggleCollapse }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const handleNavClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const navItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 8h14v-2H7v2zm0-4h14v-2H7v2zm0-6v2h14V7H7z" />
        </svg>
      ),
    },
    {
      path: "/admin/products",
      label: "Products",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      ),
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M16 11V7a4 4 0 00-8 0v4M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      path: "/admin/inquiries",
      label: "Inquiries",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M11 17a2 2 0 104 0 2 2 0 00-4 0zm-7-2a7 7 0 0114 0v4H4v-4z" />
        </svg>
      ),
    },
  ];

  const sidebarWidth = isCollapsed ? "lg:w-20" : "lg:w-64";

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-screen w-72 flex-col bg-[#30442B] text-white shadow-lg transition-all duration-300 ease-in-out sm:w-80 lg:z-30 ${sidebarWidth} transform ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* Mobile Close Button */}
      <button
        onClick={onMobileClose}
        className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 lg:hidden"
        aria-label="Close sidebar"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Desktop Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute top-6 -right-4 hidden h-8 w-8 items-center justify-center rounded-full border-2 border-white/10 bg-[#30442B] shadow transition-all duration-300 hover:bg-[#3a543a] focus:outline-none lg:flex"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isCollapsed ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          )}
        </svg>
      </button>

      {/* Admin User Info */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        {(!isCollapsed || isMobileOpen) && admin && (
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold tracking-wide">ADMIN</span>
            <span className="truncate text-xs text-white/70">{admin.email}</span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto px-2 sm:mt-6">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-white/10 sm:gap-4 sm:px-5 sm:py-3 ${
                    isActive ? "bg-white/10 font-semibold text-white" : "text-white/80"
                  } ${isCollapsed && !isMobileOpen ? "lg:justify-center lg:px-0" : ""}`
                }
              >
                {item.icon}
                {(!isCollapsed || isMobileOpen) && <span className="text-sm font-medium tracking-wide sm:text-base">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <button
          onClick={() => {
            handleLogout();
            if (onMobileClose) onMobileClose();
          }}
          className={`group mt-auto mb-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/80 transition-all duration-200 hover:bg-white/10 sm:gap-4 sm:px-5 sm:py-3 ${
            isCollapsed && !isMobileOpen ? "lg:justify-center lg:px-0" : ""
          }`}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
          {(!isCollapsed || isMobileOpen) && <span className="text-sm font-medium tracking-wide sm:text-base">Logout</span>}
        </button>
      </nav>
    </aside>
  );
}
