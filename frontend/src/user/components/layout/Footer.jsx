import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#30442B] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="font-outfit mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">Coffee St.</h3>
            <p className="text-sm text-gray-300 sm:text-base">Your premium coffee destination, serving artisanal brews and unforgettable moments.</p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="mb-3 text-sm font-bold sm:mb-4 sm:text-base">Quick Links</h4>
            <ul className="space-y-1.5 text-sm sm:space-y-2 sm:text-base">
              <li>
                <Link to="/" className="text-gray-300 transition-colors duration-200 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 transition-colors duration-200 hover:text-white">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 transition-colors duration-200 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 transition-colors duration-200 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h4 className="mb-3 text-sm font-bold sm:mb-4 sm:text-base">Contact Us</h4>
            <ul className="space-y-1.5 text-sm text-gray-300 sm:space-y-2 sm:text-base">
              <li>123 Coffee Street</li>
              <li>City, State 12345</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: info@coffeest.com</li>
            </ul>
          </div>

          {/* Hours */}
          <div className="col-span-1">
            <h4 className="mb-3 text-sm font-bold sm:mb-4 sm:text-base">Opening Hours</h4>
            <ul className="space-y-1.5 text-sm text-gray-300 sm:space-y-2 sm:text-base">
              <li>Monday - Friday: 7:00 AM - 8:00 PM</li>
              <li>Saturday: 8:00 AM - 9:00 PM</li>
              <li>Sunday: 8:00 AM - 7:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-300 sm:mt-10 sm:pt-8 sm:text-base lg:mt-12">
          <p>&copy; {currentYear} Coffee St. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
