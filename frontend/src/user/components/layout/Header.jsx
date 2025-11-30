import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { ProfileDropdown } from '../profile';
import logo from '../../../assets/stcoffeelogo.png';

export default function Header() {
  const { showToast } = useToast();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const location = useLocation();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', { type: 'info', dismissible: true });
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Logout failed. Please try again.', {
        type: 'error',
        dismissible: true,
      });
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
      return user.name.split(' ')[0]; // First name only
    }
    return user?.email?.split('@')[0] || 'Guest';
  };

  const getFormattedUserName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name.charAt(0)}.`;
    }
    if (user?.name) {
      const parts = user.name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0]} ${parts[1].charAt(0)}.`;
      }
      return parts[0];
    }
    return user?.email?.split('@')[0] || 'Guest';
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Menu' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm fixed w-full z-50 border-b border-gray-100">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center h-16 sm:h-20 lg:h-24 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          {/* Brand - Left Side */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 lg:gap-4 xl:gap-6"
            >
              <img
                src={logo}
                alt="Coffee St. Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16 object-contain"
              />
              <span className="hidden sm:inline font-outfit text-2xl sm:text-3xl lg:text-4xl xl:text-[48px] font-bold text-[#30442B] tracking-tight leading-none transition-all duration-300 hover:tracking-normal">
                Coffee St.
              </span>
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-4 xl:px-8">
            <div className="flex items-center space-x-4 lg:space-x-8 xl:space-x-12 2xl:space-x-14">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group relative px-2 lg:px-3 xl:px-4 py-2 lg:py-2.5"
                >
                  <span
                    className={`relative z-10 text-base lg:text-lg xl:text-xl 2xl:text-[22px] font-outfit font-semibold tracking-wide transition-all duration-300 ease-out transform group-hover:-translate-y-0.5 group-hover:tracking-wider ${
                      isActive(link.path)
                        ? 'text-[#30442B]'
                        : 'text-gray-800 group-hover:text-[#30442B]'
                    }`}
                  >
                    {link.label}
                  </span>
                  <span
                    className={`absolute inset-0 h-full w-full bg-[#30442B]/5 rounded-lg z-0 transform scale-95 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 ${
                      isActive(link.path) ? 'opacity-100 scale-100' : ''
                    }`}
                  ></span>
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 w-full bg-[#30442B] transform origin-left scale-x-0 transition-all duration-300 ease-out group-hover:scale-x-100 ${
                      isActive(link.path) ? 'scale-x-100' : ''
                    }`}
                  ></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Elements */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 xl:gap-8 shrink-0">
            {/* Cart */}
            <Link to="/cart" className="relative flex items-center gap-2 group">
              <div className="relative flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 py-1.5 sm:py-2 px-2 sm:px-3 lg:px-4 rounded-full transition-all duration-300 ease-out bg-transparent hover:bg-[#30442B]/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 ease-out text-gray-700 group-hover:text-[#30442B] transform group-hover:scale-110 group-hover:-rotate-6"
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
                <span className="hidden lg:inline font-outfit text-sm lg:text-base xl:text-lg 2xl:text-[18px] tracking-wide text-gray-700 group-hover:text-[#30442B] transition-all duration-300 ease-out transform group-hover:translate-x-0.5">
                  Cart
                </span>
                {cartCount > 0 && (
                  <span className="cart-count absolute -top-1 sm:-top-2 -right-0.5 sm:-right-1 bg-[#30442B] text-white text-[10px] sm:text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center transition-all duration-300 ease-out group-hover:ring-2 sm:group-hover:ring-4 group-hover:ring-[#30442B]/20 group-hover:scale-110 group-hover:-translate-y-0.5">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Login / User Profile */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center">
                <ProfileDropdown
                  userName={getFormattedUserName()}
                  onLogout={handleLogout}
                />
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="hidden lg:inline-flex items-center px-4 lg:px-6 xl:px-8 py-2 lg:py-2.5 cursor-pointer font-outfit text-sm lg:text-base xl:text-lg 2xl:text-[18px] font-medium tracking-wide border-2 border-[#30442B] text-[#30442B] rounded-full overflow-hidden relative transition-all duration-300 ease-out hover:text-white hover:border-[#30442B]/80 hover:shadow-xl group transform hover:-translate-y-0.5"
              >
                <span className="relative z-10 transform transition-transform duration-300 ease-out group-hover:translate-x-1">
                  Login
                </span>
                <div className="absolute inset-0 bg-[#30442B] transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-1.5 sm:p-2 text-black hover:text-[#30442B] hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-7 sm:w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Menu Panel - Full Width */}
        <div
          className={`absolute inset-0 bg-white transform transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 border-b border-gray-100">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 sm:gap-3"
            >
              <img
                src={logo}
                alt="Coffee St. Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              />
              <span className="font-outfit text-xl sm:text-2xl font-bold text-[#30442B]">
                Coffee St.
              </span>
            </Link>
            <div className="flex items-center gap-2">
              {/* Cart in mobile menu header */}
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative p-2 text-gray-700 hover:text-[#30442B] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#30442B] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              {/* Close button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-700 hover:text-[#30442B] hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Content */}
          <div className="px-4 sm:px-6 py-6 overflow-y-auto h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] flex flex-col items-center">
            {/* Navigation Links */}
            <div className="flex flex-col space-y-2 items-center w-full max-w-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative text-lg sm:text-xl font-outfit transition-all duration-300 ease-in-out py-3 px-4 rounded-lg text-center w-full ${
                    isActive(link.path)
                      ? 'text-[#30442B] font-semibold bg-[#30442B]/5'
                      : 'text-black hover:text-[#30442B] hover:bg-[#30442B]/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 w-full max-w-sm">
              {isAuthenticated ? (
                <div className="space-y-4 text-center">
                  <div className="text-center font-outfit text-base text-gray-700 py-2">
                    Welcome,{' '}
                    <strong className="text-[#30442B]">
                      {getUserDisplayName()}
                    </strong>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full px-6 py-3 font-outfit text-base font-medium border-2 border-[#30442B] text-[#30442B] rounded-full transition-all duration-300 hover:bg-[#30442B]/5"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full px-6 py-3 font-outfit text-base font-medium border-2 border-[#30442B] text-[#30442B] rounded-full transition-all duration-300 hover:bg-[#30442B]/5"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="inline-flex items-center justify-center w-full px-6 py-3 cursor-pointer font-outfit text-base font-medium border-2 border-red-600 text-red-600 rounded-full overflow-hidden relative transition-all duration-300 ease-in-out hover:text-white group"
                  >
                    <span className="relative z-10 transform transition-transform duration-300 group-hover:translate-x-1">
                      Logout
                    </span>
                    <div className="absolute inset-0 bg-red-600 transform scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="inline-flex items-center justify-center w-full px-6 py-3 cursor-pointer font-outfit text-base font-medium border-2 border-[#30442B] text-[#30442B] rounded-full overflow-hidden relative transition-all duration-300 ease-in-out hover:text-white group"
                >
                  <span className="relative z-10 transform transition-transform duration-300 group-hover:translate-x-1">
                    Login
                  </span>
                  <div className="absolute inset-0 bg-[#30442B] transform scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 z-60">
        <div
          id="scroll-progress"
          className="h-full bg-[#30442B] transition-all duration-300 rounded-full"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
    </>
  );
}
