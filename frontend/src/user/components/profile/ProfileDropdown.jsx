import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { dropdown } from "../../../components/motion/variants";
import { User, Package, Mail, LogOut } from "lucide-react";

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
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
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

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      color: "text-[#30442B]",
      hoverBg: "hover:bg-[#30442B]/5",
    },
    {
      icon: Package,
      label: "Orders",
      path: "/orders",
      color: "text-[#30442B]",
      hoverBg: "hover:bg-[#30442B]/5",
    },
    {
      icon: Mail,
      label: "Messages",
      path: "/messages",
      color: "text-[#30442B]",
      hoverBg: "hover:bg-[#30442B]/5",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex cursor-pointer items-center gap-3 rounded-full px-4 py-2 transition-all duration-300 hover:bg-[#30442B]/5"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {/* Profile Icon Circle */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#30442B] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#405939]">
          <User className="h-5 w-5 text-white" strokeWidth={2} />
        </div>

        {/* Username */}
        <div className="hidden flex-col items-start md:flex">
          <span className="text-sm font-semibold text-[#30442B] transition-colors duration-300">{userName}</span>
        </div>

        {/* Dropdown Arrow */}
        <svg className={`h-4 w-4 text-[#30442B] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdown}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
          >
            <div className="py-2">
              {/* Menu Items */}
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleMenuItemClick(item.path)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-200 ${item.hoverBg} cursor-pointer`}
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} strokeWidth={2} />
                  <span className={`font-medium ${item.color}`}>{item.label}</span>
                </button>
              ))}

              {/* Divider */}
              <div className="my-2 border-t border-gray-100"></div>

              {/* Logout */}
              <button onClick={handleLogoutClick} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-red-50">
                <LogOut className="h-5 w-5 text-red-600" strokeWidth={2} />
                <span className="font-medium text-red-600">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
