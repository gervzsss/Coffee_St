import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import api from '../services/apiClient';
import logo from '../assets/stcoffeelogo.png';

export default function Header() {
  const { showToast } = useToast();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const location = useLocation();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }

    const handleCartUpdate = () => {
      if (isAuthenticated) {
        fetchCartCount();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [isAuthenticated]);

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

  const fetchCartCount = async () => {
    try {
      const response = await api.get('/cart/count');
      setCartCount(response.data.count || 0);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
      setCartCount(0);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCartCount(0);
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

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Menu' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm fixed w-full z-50 border-b border-gray-100">
        <div className="flex justify-between items-center h-24 px-6">
          <div className="absolute left-6 md:left-12 lg:left-24 xl:left-32 flex items-center gap-6">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-6">
              <img
                src={logo}
                alt="Coffee St. Logo"
                className="h-16 w-16 object-contain"
              />
              <span className="font-outfit text-[48px] font-bold text-[#30442B] tracking-tight leading-none transition-all duration-300 hover:text-[#30442B] hover:tracking-normal">
                Coffee St.
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center ml-[440px]">
            <div className="flex items-center space-x-14">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group relative px-4 py-2.5"
                >
                  <span
                    className={`relative z-10 text-[22px] font-outfit font-semibold tracking-wide transition-all duration-300 ease-out transform group-hover:-translate-y-0.5 group-hover:tracking-wider ${
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
          <div className="flex items-center gap-8">
            {/* Cart */}
            <Link to="/cart" className="relative flex items-center gap-2 group">
              <div className="relative flex items-center gap-2.5 py-2 px-4 rounded-full transition-all duration-300 ease-out bg-transparent hover:bg-[#30442B]/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 transition-all duration-300 ease-out text-gray-700 group-hover:text-[#30442B] transform group-hover:scale-110 group-hover:-rotate-6"
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
                <span className="hidden md:inline font-outfit text-[18px] tracking-wide text-gray-700 group-hover:text-[#30442B] transition-all duration-300 ease-out transform group-hover:translate-x-0.5">
                  Cart
                </span>
                {cartCount > 0 && (
                  <span className="cart-count absolute -top-2 -right-1 bg-[#30442B] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transition-all duration-300 ease-out group-hover:ring-4 group-hover:ring-[#30442B]/20 group-hover:scale-110 group-hover:-translate-y-0.5">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Login / User Profile */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="font-outfit text-[16px] text-gray-700">
                  Welcome,{' '}
                  <strong className="text-[#30442B]">
                    {getUserDisplayName()}
                  </strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-6 py-2.5 cursor-pointer font-outfit text-[18px] font-medium tracking-wide border-2 border-red-600 text-red-600 rounded-full overflow-hidden relative transition-all duration-300 ease-out hover:text-white hover:border-red-700 hover:shadow-xl group transform hover:-translate-y-0.5"
                >
                  <span className="relative z-10 transform transition-transform duration-300 ease-out group-hover:translate-x-1">
                    Logout
                  </span>
                  <div className="absolute inset-0 bg-red-600 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="hidden md:inline-flex items-center px-8 py-2.5 cursor-pointer font-outfit text-[18px] font-medium tracking-wide border-2 border-[#30442B] text-[#30442B] rounded-full overflow-hidden relative transition-all duration-300 ease-out hover:text-white hover:border-[#30442B]/80 hover:shadow-xl group transform hover:-translate-y-0.5"
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
              className="md:hidden text-black hover:text-[#30442B] transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-8 px-6 bg-white border-t border-gray-100">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-6 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative text-[24px] font-outfit transition-all duration-300 ease-in-out py-2 group ${
                    isActive(link.path)
                      ? 'text-[#30442B] font-semibold'
                      : 'text-black hover:text-[#30442B]'
                  }`}
                >
                  <span className="relative z-10 transition-all duration-300">
                    {link.label}
                  </span>
                  <span
                    className={`absolute inset-0 h-full w-full bg-[#30442B]/5 rounded-lg transform scale-95 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 ${
                      isActive(link.path) ? 'opacity-100 scale-100' : ''
                    }`}
                  ></span>
                </Link>
              ))}
              <div className="pt-4">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="text-center font-outfit text-[16px] text-gray-700">
                      Welcome,{' '}
                      <strong className="text-[#30442B]">
                        {getUserDisplayName()}
                      </strong>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="inline-flex items-center justify-center w-full px-7 py-3 cursor-pointer font-outfit text-[20px] font-medium border-2 border-red-600 text-red-600 rounded-full overflow-hidden relative transition-all duration-300 ease-in-out hover:text-white group"
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
                    className="inline-flex items-center justify-center w-full px-7 py-3 cursor-pointer font-outfit text-[20px] font-medium border-2 border-[#30442B] text-[#30442B] rounded-full overflow-hidden relative transition-all duration-300 ease-in-out hover:text-white group"
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
        )}
      </nav>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 z-50">
        <div
          id="scroll-progress"
          className="h-full bg-[#30442B] transition-all duration-300 rounded-full"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
    </>
  );
}
