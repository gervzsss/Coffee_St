import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, LogOut } from 'lucide-react';

export default function ProfileDropdown({ userName, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLogoutClick = async () => {
    setIsOpen(false);
    await onLogout();
  };

  const handleMenuItemClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
      },
    },
  };

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      color: 'text-[#30442B]',
      hoverBg: 'hover:bg-[#30442B]/5',
    },
    {
      icon: Package,
      label: 'Orders',
      path: '/orders',
      color: 'text-[#30442B]',
      hoverBg: 'hover:bg-[#30442B]/5',
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#30442B]/5 group cursor-pointer"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {/* Profile Icon Circle */}
        <div className="w-10 h-10 rounded-full bg-[#30442B] flex items-center justify-center transition-all duration-300 group-hover:bg-[#405939] group-hover:scale-110">
          <User className="w-5 h-5 text-white" strokeWidth={2} />
        </div>

        {/* Username */}
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-semibold text-[#30442B] transition-colors duration-300">
            {userName}
          </span>
        </div>

        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-[#30442B] transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            <div className="py-2">
              {/* Menu Items */}
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleMenuItemClick(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 ${item.hoverBg} cursor-pointer`}
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} strokeWidth={2} />
                  <span className={`font-medium ${item.color}`}>{item.label}</span>
                </button>
              ))}

              {/* Divider */}
              <div className="my-2 border-t border-gray-100"></div>

              {/* Logout */}
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-red-600" strokeWidth={2} />
                <span className="font-medium text-red-600">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
