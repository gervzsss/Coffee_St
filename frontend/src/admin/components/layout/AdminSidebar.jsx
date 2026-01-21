import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { usePosMode } from "../../context/PosModeContext";
import { usePendingPosOrdersAlert } from "../../hooks/usePendingPosOrdersAlert";
import logo from "/favicon-padded.png";
import { useState, useRef, useEffect } from "react";
import { Bell, ShoppingCart, ArrowLeft, Store, LayoutDashboard, Package, ShoppingBag, Users, MessageSquare, ClipboardList } from "lucide-react";

export default function AdminSidebar({ isMobileOpen = false, onMobileClose, unreadCount = 0, onNotificationClick }) {
  const { admin, logout } = useAdminAuth();
  const { isPosMode, togglePosMode, disablePosMode } = usePosMode();
  const { pendingCount } = usePendingPosOrdersAlert();
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

  // Regular admin navigation items
  const adminNavItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: "/admin/products",
      label: "Products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      path: "/admin/inquiries",
      label: "Inquiries",
      icon: <MessageSquare className="h-5 w-5" />,
    },
  ];

  // POS mode navigation items
  const posNavItems = [
    {
      path: "/admin/pos",
      label: "New Sale",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      path: "/admin/pos/orders",
      label: "POS Orders",
      icon: <ClipboardList className="h-5 w-5" />,
    },
  ];

  const navItems = isPosMode ? posNavItems : adminNavItems;

  const handlePosToggle = () => {
    if (isPosMode) {
      disablePosMode();
    } else {
      togglePosMode();
    }
    if (onMobileClose) {
      onMobileClose();
    }
  };

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
      <div className={`relative flex items-center gap-3 border-b border-white/10 px-5 py-6 backdrop-blur-sm ${isPosMode ? "bg-amber-900/30" : "bg-black/10"}`}>
        <div
          className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-lg ring-2 ${isPosMode ? "bg-amber-100 ring-amber-400/30" : "bg-white ring-white/10"}`}
        >
          <img src={logo} alt="Coffee St. Logo" className="h-full w-full object-cover" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-base font-bold tracking-tight">Coffee St.</span>
          <span className={`text-xs font-medium ${isPosMode ? "text-amber-300" : "text-white/60"}`}>{isPosMode ? "POS Mode" : "Admin Portal"}</span>
        </div>
        {/* Notification Icon - Hidden on mobile and in POS mode */}
        {!isPosMode && (
          <button
            onClick={onNotificationClick}
            className="relative hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 active:scale-95 lg:flex"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-[#30442B]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* POS Mode Toggle Button */}
      <div className="relative px-3 pt-4">
        <button
          onClick={handlePosToggle}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
            isPosMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
          }`}
        >
          {isPosMode ? (
            <>
              <ArrowLeft className="h-5 w-5" />
              <span>Exit POS Mode</span>
            </>
          ) : (
            <>
              <Store className="h-5 w-5" />
              <span>Enter POS Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="relative mt-3 flex flex-1 flex-col overflow-y-auto px-3">
        <div className="mb-2 px-3">
          <span className="text-xs font-bold tracking-wider text-white/40 uppercase">{isPosMode ? "Point of Sale" : "Menu"}</span>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/admin/pos" || !isPosMode}
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
                    {/* Show pending badge on POS Orders */}
                    {isPosMode && item.path === "/admin/pos/orders" && pendingCount > 0 && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white shadow-sm">
                        {pendingCount > 9 ? "9+" : pendingCount}
                      </span>
                    )}
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
