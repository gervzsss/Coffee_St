import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/useToast";
import { ProfileDropdown } from "../profile";
import logo from "/favicon-padded.png";

export default function Header() {
  const { showToast } = useToast();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const location = useLocation();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      showToast("Logged out successfully", { type: "info", dismissible: true });
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Logout failed. Please try again.", {
        type: "error",
        dismissible: true,
      });
      setIsLoggingOut(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getUserDisplayName = () => {
    if (user?.name) {
      return user.name.split(" ")[0]; // First name only
    }
    return user?.email?.split("@")[0] || "Guest";
  };

  const getFormattedUserName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name.charAt(0)}.`;
    }
    if (user?.name) {
      const parts = user.name.split(" ");
      if (parts.length >= 2) {
        return `${parts[0]} ${parts[1].charAt(0)}.`;
      }
      return parts[0];
    }
    return user?.email?.split("@")[0] || "Guest";
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Menu" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="fixed z-50 w-full border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:h-24 lg:px-8 xl:px-12 2xl:px-16">
          {/* Brand - Left Side */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4 lg:gap-6">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
              <img src={logo} alt="Coffee St. Logo" className="h-10 w-10 object-contain sm:h-12 sm:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16" />
              <span className="font-outfit hidden text-2xl leading-none font-bold tracking-tight text-[#30442B] transition-all duration-300 hover:tracking-normal sm:inline sm:text-3xl lg:text-4xl xl:text-[48px]">
                Coffee St.
              </span>
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden flex-1 items-center justify-center px-4 lg:flex xl:px-8">
            <div className="flex items-center space-x-4 lg:space-x-8 xl:space-x-12 2xl:space-x-14">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className="group relative px-2 py-2 lg:px-3 lg:py-2.5 xl:px-4">
                  <span
                    className={`font-outfit relative z-10 transform text-base font-semibold tracking-wide transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:tracking-wider lg:text-lg xl:text-xl 2xl:text-[22px] ${
                      isActive(link.path) ? "text-[#30442B]" : "text-gray-800 group-hover:text-[#30442B]"
                    }`}
                  >
                    {link.label}
                  </span>
                  <span
                    className={`absolute inset-0 z-0 h-full w-full scale-95 transform rounded-lg bg-[#30442B]/5 opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 ${
                      isActive(link.path) ? "scale-100 opacity-100" : ""
                    }`}
                  ></span>
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 transform bg-[#30442B] transition-all duration-300 ease-out group-hover:scale-x-100 ${
                      isActive(link.path) ? "scale-x-100" : ""
                    }`}
                  ></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Elements */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-6 xl:gap-8">
            {/* Cart */}
            <Link to="/cart" className="group relative flex items-center gap-2">
              <div className="relative flex items-center gap-1.5 rounded-full bg-transparent px-2 py-1.5 transition-all duration-300 ease-out hover:bg-[#30442B]/5 sm:gap-2 sm:px-3 sm:py-2 lg:gap-2.5 lg:px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transform text-gray-700 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6 group-hover:text-[#30442B] sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="font-outfit hidden transform text-sm tracking-wide text-gray-700 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:text-[#30442B] lg:inline lg:text-base xl:text-lg 2xl:text-[18px]">
                  Cart
                </span>
                {cartCount > 0 && (
                  <span className="cart-count absolute -top-1 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#30442B] text-[10px] font-bold text-white transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:ring-2 group-hover:ring-[#30442B]/20 sm:-top-2 sm:-right-1 sm:h-5 sm:w-5 sm:text-xs sm:group-hover:ring-4">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Login / User Profile */}
            {isAuthenticated ? (
              <div className="hidden items-center lg:flex">
                <ProfileDropdown userName={getFormattedUserName()} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="font-outfit group relative hidden transform cursor-pointer items-center overflow-hidden rounded-full border-2 border-[#30442B] px-4 py-2 text-sm font-medium tracking-wide text-[#30442B] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#30442B]/80 hover:text-white hover:shadow-xl lg:inline-flex lg:px-6 lg:py-2.5 lg:text-base xl:px-8 xl:text-lg 2xl:text-[18px]"
              >
                <span className="relative z-10 transform transition-transform duration-300 ease-out group-hover:translate-x-1">Login</span>
                <div className="absolute inset-0 origin-left scale-x-0 transform bg-[#30442B] transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button onClick={toggleMobileMenu} className="rounded-lg p-1.5 text-black transition-colors duration-200 hover:bg-gray-100 hover:text-[#30442B] sm:p-2 lg:hidden" aria-label="Toggle menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "visible" : "invisible"}`}>
        {/* Menu Panel - Full Width */}
        <div className={`absolute inset-0 transform bg-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}>
          {/* Menu Header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4 sm:h-20 sm:px-6">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 sm:gap-3">
              <img src={logo} alt="Coffee St. Logo" className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
              <span className="font-outfit text-xl font-bold text-[#30442B] sm:text-2xl">Coffee St.</span>
            </Link>
            <div className="flex items-center gap-2">
              {/* Cart in mobile menu header */}
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="relative p-2 text-gray-700 transition-colors hover:text-[#30442B]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#30442B] text-[10px] font-bold text-white">{cartCount}</span>}
              </Link>
              {/* Close button */}
              <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-[#30442B]" aria-label="Close menu">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Content */}
          <div className="flex h-[calc(100%-4rem)] flex-col items-center overflow-y-auto px-4 py-6 sm:h-[calc(100%-5rem)] sm:px-6">
            {/* Navigation Links */}
            <div className="flex w-full max-w-sm flex-col items-center space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-outfit relative w-full rounded-lg px-4 py-3 text-center text-lg transition-all duration-300 ease-in-out sm:text-xl ${
                    isActive(link.path) ? "bg-[#30442B]/5 font-semibold text-[#30442B]" : "text-black hover:bg-[#30442B]/5 hover:text-[#30442B]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 w-full max-w-sm border-t border-gray-100 pt-6">
              {isAuthenticated ? (
                <div className="space-y-4 text-center">
                  <div className="font-outfit py-2 text-center text-base text-gray-700">
                    Welcome, <strong className="text-[#30442B]">{getUserDisplayName()}</strong>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-outfit flex w-full items-center justify-center rounded-full border-2 border-[#30442B] px-6 py-3 text-base font-medium text-[#30442B] transition-all duration-300 hover:bg-[#30442B]/5"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-outfit flex w-full items-center justify-center rounded-full border-2 border-[#30442B] px-6 py-3 text-base font-medium text-[#30442B] transition-all duration-300 hover:bg-[#30442B]/5"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="font-outfit group relative inline-flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-red-600 px-6 py-3 text-base font-medium text-red-600 transition-all duration-300 ease-in-out hover:text-white"
                  >
                    <span className="relative z-10 transform transition-transform duration-300 group-hover:translate-x-1">Logout</span>
                    <div className="absolute inset-0 origin-left scale-x-0 transform bg-red-600 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    openAuthModal("login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="font-outfit group relative inline-flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[#30442B] px-6 py-3 text-base font-medium text-[#30442B] transition-all duration-300 ease-in-out hover:text-white"
                >
                  <span className="relative z-10 transform transition-transform duration-300 group-hover:translate-x-1">Login</span>
                  <div className="absolute inset-0 origin-left scale-x-0 transform bg-[#30442B] transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 z-60 h-0.5 w-full">
        <div id="scroll-progress" className="h-full rounded-full bg-[#30442B] transition-all duration-300" style={{ width: `${scrollProgress}%` }}></div>
      </div>
    </>
  );
}
