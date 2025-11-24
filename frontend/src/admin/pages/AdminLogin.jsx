import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import adminLoginBg from '../../assets/AdminLogin.png';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <main className="relative min-h-screen w-full">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-x-[-1]"
        style={{ backgroundImage: `url(${adminLoginBg})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content Container */}
      <div className="relative min-h-screen flex items-center justify-end">
        {/* Login Form Container */}
        <div className="w-full max-w-2xl mx-auto lg:mr-24 px-8 py-12 lg:py-0">
          <div className="rounded-3xl p-8 lg:p-12">
            {/* Logo and Header */}
            <div className="text-center mb-14">
              <h1 className="text-7xl font-black text-white drop-shadow-lg tracking-tight mb-6">
                COFFEE ST.
              </h1>
              <p className="text-sm text-white/90 uppercase tracking-[0.25em] leading-relaxed drop-shadow">
                Welcome to the Admin Portal<br />
                — Please log in to continue.
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-8" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 text-red-700 rounded-lg px-4 py-3 mb-4 text-center">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-3">
                <label 
                  htmlFor="email" 
                  className="block text-xs text-white/90 font-medium uppercase tracking-widest"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-6 py-4 bg-white/95 rounded-xl placeholder-gray-400 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#30442B]/60 transition-all duration-300"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label 
                  htmlFor="password" 
                  className="block text-xs text-white/90 font-medium uppercase tracking-widest"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-6 py-4 bg-white/95 rounded-xl placeholder-gray-400 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#30442B]/60 transition-all duration-300"
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-8 bg-[#30442B] hover:bg-[#22301e] rounded-xl text-white font-semibold tracking-widest uppercase text-sm transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#30442B]/30 mt-8 border border-transparent hover:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/60 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging In...' : 'Log In'}
              </button>

              {/* Forgot Password Link */}
              <div className="text-center mt-8">
                <a 
                  href="#" 
                  className="text-sm text-white/70 hover:text-white transition-colors duration-300 tracking-wider"
                >
                  Forgot your password?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
