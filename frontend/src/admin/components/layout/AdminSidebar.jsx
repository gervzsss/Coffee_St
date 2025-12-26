import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import logo from "../../../assets/stcoffeelogo.png";
import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

export default function AdminSidebar({ isMobileOpen = false, onMobileClose, unreadCount = 0, onNotificationClick }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const handleNavClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const navItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      path: "/admin/products",
      label: "Products",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      path: "/admin/inquiries",
      label: "Inquiries",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          <line x1="9" y1="10" x2="15" y2="10" />
          <line x1="9" y1="14" x2="12" y2="14" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-screen w-72 transform flex-col bg-linear-to-b from-[#2a3a26] via-[#30442B] to-[#263320] text-white shadow-2xl transition-all duration-300 ease-in-out lg:z-30 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-black/10" />

      {/* Mobile Close Button */}
      <button
        onClick={onMobileClose}
        className="absolute top-5 right-5 z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20 lg:hidden"
        aria-label="Close sidebar"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Logo & Brand Section */}
      <div className="relative flex items-center gap-3 border-b border-white/10 bg-black/10 px-5 py-6 backdrop-blur-sm">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg ring-2 ring-white/10">
          <img src={logo} alt="Coffee St. Logo" className="h-full w-full object-cover" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-base font-bold tracking-tight">Coffee St.</span>
          <span className="text-xs font-medium text-white/60">Admin Portal</span>
        </div>
        {/* Notification Icon */}
        <button
          onClick={onNotificationClick}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-[#30442B]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="relative mt-3 flex flex-1 flex-col overflow-y-auto px-3">
        <div className="mb-2 px-3">
          <span className="text-xs font-bold tracking-wider text-white/40 uppercase">Menu</span>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                    isActive ? "bg-linear-to-r from-white/15 to-white/5 text-white shadow-md ring-1 ring-white/10" : "text-white/70 hover:bg-white/5 hover:text-white hover:shadow-sm"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />}
                    <div className={`flex items-center justify-center transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`}>{item.icon}</div>
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Admin User Info at Bottom */}
        <div className="relative mt-auto border-t border-white/5 px-0 pt-3 pb-4">
          <div className="relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-white/5">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400/20 to-green-600/20 ring-2 ring-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-emerald-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-[#30442B] bg-emerald-400 shadow-sm" />
            </div>
            {admin && (
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-semibold text-white">
                  {admin.first_name || "Admin"} {admin.last_name || "User"}
                </span>
                <span className="truncate text-xs font-medium text-white/50">{admin.email}</span>
              </div>
            )}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-white/10 active:scale-95"
                aria-label="User menu"
              >
                <svg className="h-5 w-5 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#30442B] shadow-2xl backdrop-blur-md">
                  <button
                    onClick={() => {
                      handleLogout();
                      if (onMobileClose) onMobileClose();
                    }}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-white/70 transition-all hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoggingOut ? (
                      <div className="flex h-5 w-5 items-center justify-center">
                        <svg className="h-5 w-5 animate-spin text-red-300" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    )}
                    <span className="text-sm font-medium">{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
