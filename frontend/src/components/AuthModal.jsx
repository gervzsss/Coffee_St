import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const { login, signup } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      resetForms();
    }
  }, [isOpen, initialMode]);

  const resetForms = () => {
    setLoginEmail('');
    setLoginPassword('');
    setFirstName('');
    setLastName('');
    setAddress('');
    setSignupEmail('');
    setPhone('');
    setSignupPassword('');
    setPasswordConfirmation('');
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await login(loginEmail, loginPassword);
      onClose();
      resetForms();
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors);
      } else {
        setErrors({ general: errorData?.message || 'Login failed. Please check your credentials.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (signupPassword !== passwordConfirmation) {
      setErrors({ password_confirmation: ['Passwords do not match'] });
      setLoading(false);
      return;
    }

    try {
      const fullName = `${firstName} ${lastName}`;
      await signup(fullName, signupEmail, signupPassword, passwordConfirmation, address, phone);
      onClose();
      resetForms();
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors);
      } else {
        setErrors({ general: errorData?.message || 'Signup failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToSignup = () => {
    setMode('signup');
    setErrors({});
  };

  const switchToLogin = () => {
    setMode('login');
    setErrors({});
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 px-4 py-10 sm:py-16 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      {/* Login Modal */}
      {mode === 'login' && (
        <div className="modal-panel relative w-full max-w-md overflow-hidden rounded-3xl bg-white text-neutral-900 shadow-[0_30px_80px_-35px_rgba(15,68,43,0.45)] ring-1 ring-neutral-200/70 transition duration-200">
          <div className="shadow-top pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b from-white via-white/80 to-transparent opacity-0 transition-opacity duration-200"></div>
          <div className="shadow-bottom pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white via-white/80 to-transparent opacity-0 transition-opacity duration-200"></div>
          
          <button
            onClick={onClose}
            type="button"
            className="cursor-pointer absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition duration-200 hover:bg-neutral-200 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#30442B]/50"
            aria-label="Close login modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>

          <div className="relative max-h-[85vh] overflow-y-auto px-6 py-10 sm:px-10">
            <div className="flex flex-col gap-8">
              <div className="space-y-3 text-center">
                <span className="mx-auto inline-flex items-center rounded-full bg-[#30442B]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#30442B]">
                  Welcome back
                </span>
                <h2 className="font-outfit text-2xl font-semibold text-neutral-900 sm:text-3xl">Log in to Coffee St.</h2>
                <p className="text-sm text-neutral-500 sm:text-base">Access your saved drinks, track orders, and enjoy a personalized experience.</p>
              </div>

              {errors.general && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-6" autoComplete="off" noValidate>
                <div className="space-y-2">
                  <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="login-email"
                      type="email"
                      name="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      autoComplete="email"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                      placeholder="name@example.com"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm font-medium text-red-500">{errors.email[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 pr-12 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer absolute inset-y-0 right-3 flex items-center justify-center rounded-full p-2 text-neutral-400 transition duration-200 hover:bg-neutral-100 hover:text-[#30442B] focus:outline-none focus:ring-2 focus:ring-[#30442B]/40"
                      aria-label="Toggle password visibility"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm font-medium text-red-500">{errors.password[0]}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer group inline-flex w-full items-center justify-center rounded-2xl bg-[#30442B] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#3d5a38] focus:outline-none focus:ring-4 focus:ring-[#30442B]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Logging in...' : 'Log in'}
                  </button>
                  <button
                    type="button"
                    onClick={switchToSignup}
                    className="cursor-pointer w-full text-sm font-semibold uppercase tracking-[0.2em] text-[#30442B] transition hover:text-[#3d5a38]"
                  >
                    No account yet? Create one
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {mode === 'signup' && (
        <div className="modal-panel relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white text-neutral-900 shadow-[0_30px_80px_-35px_rgba(15,68,43,0.45)] ring-1 ring-neutral-200/70 transition duration-200">
          <div className="shadow-top pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b from-white via-white/80 to-transparent opacity-0 transition-opacity duration-200"></div>
          <div className="shadow-bottom pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white via-white/80 to-transparent opacity-0 transition-opacity duration-200"></div>

          <button
            onClick={onClose}
            type="button"
            className="cursor-pointer absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition duration-200 hover:bg-neutral-200 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#30442B]/50"
            aria-label="Close signup modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>

          <div className="relative max-h-[85vh] overflow-y-auto px-6 py-10 sm:px-10">
            <div className="flex flex-col gap-8">
              <div className="space-y-3 text-center">
                <span className="mx-auto inline-flex items-center rounded-full bg-[#30442B]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#30442B]">
                  Join the community
                </span>
                <h2 className="font-outfit text-2xl font-semibold text-neutral-900 sm:text-3xl">Create your Coffee St. account</h2>
                <p className="text-sm text-neutral-500 sm:text-base">Fill out the form to save your favourites and unlock exclusive offers.</p>
              </div>

              {errors.general && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSignupSubmit} className="space-y-6" autoComplete="off" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="reg-first" className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      First name
                    </label>
                    <input
                      id="reg-first"
                      type="text"
                      name="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                      placeholder="Jane"
                      disabled={loading}
                    />
                    {errors.first_name && (
                      <p className="text-sm font-medium text-red-500">{errors.first_name[0]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reg-last" className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Last name
                    </label>
                    <input
                      id="reg-last"
                      type="text"
                      name="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                      placeholder="Doe"
                      disabled={loading}
                    />
                    {errors.last_name && (
                      <p className="text-sm font-medium text-red-500">{errors.last_name[0]}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="reg-address" className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Address
                  </label>
                  <input
                    id="reg-address"
                    type="text"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoComplete="street-address"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                    placeholder="123 Coffee Lane, City"
                    disabled={loading}
                  />
                  {errors.address && (
                    <p className="text-sm font-medium text-red-500">{errors.address[0]}</p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="reg-email" className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Email address
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      name="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      autoComplete="email"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                      placeholder="name@example.com"
                      disabled={loading}
                    />
                    {errors.email && (
                      <p className="text-sm font-medium text-red-500">{errors.email[0]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reg-phone" className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Contact number
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                      placeholder="+63 900 000 0000"
                      disabled={loading}
                    />
                    {errors.phone && (
                      <p className="text-sm font-medium text-red-500">{errors.phone[0]}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="reg-pass" className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Password
                    </label>
                    <input
                      id="reg-pass"
                      type="password"
                      name="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                      placeholder="Create a password"
                      disabled={loading}
                    />
                    {errors.password && (
                      <p className="text-sm font-medium text-red-500">{errors.password[0]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reg-pass-confirm" className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Confirm password
                    </label>
                    <input
                      id="reg-pass-confirm"
                      type="password"
                      name="password_confirmation"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      autoComplete="new-password"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/20"
                      placeholder="Repeat password"
                      disabled={loading}
                    />
                    {errors.password_confirmation && (
                      <p className="text-sm font-medium text-red-500">{errors.password_confirmation[0]}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer inline-flex w-full items-center justify-center rounded-2xl bg-[#30442B] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#3d5a38] focus:outline-none focus:ring-4 focus:ring-[#30442B]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                  </button>
                  <button
                    type="button"
                    onClick={switchToLogin}
                    className="cursor-pointer w-full text-sm font-semibold uppercase tracking-[0.2em] text-[#30442B] transition hover:text-[#3d5a38]"
                  >
                    Already registered? Log in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
