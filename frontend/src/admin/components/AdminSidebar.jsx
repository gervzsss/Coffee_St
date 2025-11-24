import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function AdminSidebar() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 8h14v-2H7v2zm0-4h14v-2H7v2zm0-6v2h14V7H7z" />
        </svg>
      ),
    },
    {
      path: '/admin/products',
      label: 'Products',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      ),
    },
    {
      path: '/admin/orders',
      label: 'Orders',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
    },
    {
      path: '/admin/users',
      label: 'Users',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M16 11V7a4 4 0 00-8 0v4M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      path: '/admin/inquiries',
      label: 'Inquiries',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M11 17a2 2 0 104 0 2 2 0 00-4 0zm-7-2a7 7 0 0114 0v4H4v-4z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-30 flex flex-col bg-[#30442B] text-white shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-4 top-6 w-8 h-8 flex items-center justify-center bg-[#30442B] border-2 border-white/10 rounded-full shadow transition-all duration-300 focus:outline-none hover:bg-[#3a543a]"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Admin User Info */}
      <div className="flex items-center gap-3 px-6 py-8 border-b border-white/10">
        <div className="shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        {isOpen && admin && (
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-wide">ADMIN</span>
            <span className="text-xs text-white/70 truncate">
              {admin.email}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1 mt-6 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 group ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/80'
                  } ${!isOpen ? 'justify-center px-0' : ''}`
                }
              >
                {item.icon}
                {isOpen && (
                  <span className="font-medium tracking-wide">
                    {item.label}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 group text-white/80 mt-auto mb-4 ${
            !isOpen ? 'justify-center px-0' : ''
          }`}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
          {isOpen && <span className="font-medium tracking-wide">Logout</span>}
        </button>
      </nav>
    </aside>
  );
}
