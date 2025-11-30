import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#30442B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="font-outfit text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Coffee St.
            </h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Your premium coffee destination, serving artisanal brews and
              unforgettable moments.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">
              Quick Links
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">
              Contact Us
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li>123 Coffee Street</li>
              <li>City, State 12345</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: info@coffeest.com</li>
            </ul>
          </div>

          {/* Hours */}
          <div className="col-span-1">
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">
              Opening Hours
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li>Monday - Friday: 7:00 AM - 8:00 PM</li>
              <li>Saturday: 8:00 AM - 9:00 PM</li>
              <li>Sunday: 8:00 AM - 7:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 text-center text-gray-300 text-sm sm:text-base">
          <p>&copy; {currentYear} Coffee St. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
