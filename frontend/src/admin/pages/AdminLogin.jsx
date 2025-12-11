import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import adminLoginBg from "../../assets/AdminLogin.webp";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      <div className="absolute inset-0 scale-x-[-1] bg-cover bg-center" style={{ backgroundImage: `url(${adminLoginBg})` }}>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content Container */}
      <div className="relative flex min-h-screen items-center justify-end">
        {/* Login Form Container */}
        <div className="mx-auto w-full max-w-2xl px-8 py-12 lg:mr-24 lg:py-0">
          <div className="rounded-3xl p-8 lg:p-12">
            {/* Logo and Header */}
            <div className="mb-14 text-center">
              <h1 className="mb-6 text-7xl font-black tracking-tight text-white drop-shadow-lg">COFFEE ST.</h1>
              <p className="text-sm leading-relaxed tracking-[0.25em] text-white/90 uppercase drop-shadow">
                Welcome to the Admin Portal
                <br />— Please log in to continue.
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-8" onSubmit={handleSubmit}>
              {error && <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-center text-red-700">{error}</div>}

              {/* Email Field */}
              <div className="space-y-3">
                <label htmlFor="email" className="block text-xs font-medium tracking-widest text-white/90 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl bg-white/95 px-6 py-4 text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-[#30442B]/60 focus:outline-none"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label htmlFor="password" className="block text-xs font-medium tracking-widest text-white/90 uppercase">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl bg-white/95 px-6 py-4 text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-[#30442B]/60 focus:outline-none"
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full rounded-xl border border-transparent bg-[#30442B] px-8 py-4 text-sm font-semibold tracking-widest text-white uppercase shadow-md transition-all duration-300 hover:border-[#30442B] hover:bg-[#22301e] hover:shadow-xl hover:shadow-[#30442B]/30 focus:ring-2 focus:ring-[#30442B]/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Logging In..." : "Log In"}
              </button>

              {/* Forgot Password Link */}
              <div className="mt-8 text-center">
                <a href="#" className="text-sm tracking-wider text-white/70 transition-colors duration-300 hover:text-white">
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
