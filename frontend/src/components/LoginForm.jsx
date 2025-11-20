import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validators } from '../utils/authValidators';
import { useFieldValidation } from '../utils/useFieldValidation';

export default function LoginForm({ onClose, onSwitchToSignup }) {
  const { showToast } = useToast();
  const { login } = useAuth();
  const firstInputRef = useRef(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    errors,
    setErrors,
    handleFieldChange,
    handleFieldBlur,
    getInputClasses,
    resetValidation,
    markFormSubmitted,
  } = useFieldValidation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    markFormSubmitted();
    setErrors({});

    // Validate all fields
    const emailError = validators.loginEmail(loginEmail);
    const passwordError = validators.loginPassword(loginPassword);

    if (emailError || passwordError) {
      setErrors({
        email: emailError ? [emailError] : null,
        password: passwordError ? [passwordError] : null,
      });
      return;
    }

    setLoading(true);

    try {
      await login(loginEmail, loginPassword);
      const userName = loginEmail.split('@')[0];
      showToast(`Welcome back, ${userName}!`, {
        type: 'success',
        dismissible: true,
        duration: 3000,
      });
      onClose();
      resetForm();
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors);
      } else {
        const errorMessage =
          errorData?.message || 'Login failed. Please check your credentials.';
        setErrors({ password: [errorMessage] });
        showToast(errorMessage, {
          type: 'error',
          dismissible: true,
          duration: 4000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLoginEmail('');
    setLoginPassword('');
    setShowPassword(false);
    resetValidation();
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3 text-center">
        <span className="mx-auto inline-flex items-center rounded-full bg-[#30442B]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#30442B]">
          Welcome back
        </span>
        <h2 className="font-outfit text-2xl font-semibold text-neutral-900 sm:text-3xl">
          Log in to Coffee St.
        </h2>
        <p className="text-sm text-neutral-500 sm:text-base">
          Access your saved drinks, track orders, and enjoy a personalized
          experience.
        </p>
      </div>

      {errors.general && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errors.general}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        autoComplete="off"
        noValidate
      >
        <div className="space-y-2">
          <label
            htmlFor="login-email"
            className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
          >
            Email address
          </label>
          <div className="relative">
            <input
              ref={firstInputRef}
              id="login-email"
              type="email"
              name="email"
              value={loginEmail}
              onChange={(e) => {
                setLoginEmail(e.target.value);
                handleFieldChange(
                  'email',
                  e.target.value,
                  validators.loginEmail
                );
              }}
              onBlur={(e) =>
                handleFieldBlur('email', e.target.value, validators.loginEmail)
              }
              autoComplete="email"
              className={getInputClasses('email')}
              placeholder="name@example.com"
              disabled={loading}
            />
          </div>
          {errors.email && errors.email[0] && (
            <p
              className="text-sm font-medium text-red-500"
              data-error-for="login-email"
            >
              {errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="login-password"
            className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={loginPassword}
              onChange={(e) => {
                setLoginPassword(e.target.value);
                handleFieldChange(
                  'password',
                  e.target.value,
                  validators.loginPassword
                );
              }}
              onBlur={(e) =>
                handleFieldBlur(
                  'password',
                  e.target.value,
                  validators.loginPassword
                )
              }
              autoComplete="current-password"
              className={`${getInputClasses('password')} pr-12`}
              placeholder="Enter your password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer password-toggle absolute inset-y-0 right-3 flex items-center justify-center rounded-full p-2 text-neutral-400 transition duration-200 hover:bg-neutral-100 hover:text-[#30442B] focus:outline-none focus:ring-2 focus:ring-[#30442B]/40"
              aria-label="Toggle password visibility"
              data-target="#login-password"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {showPassword ? (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18M10.73 6.73A9.77 9.77 0 0 1 12 6c4.477 0 8.268 2.943 9.542 7a9.77 9.77 0 0 1-1.566 2.566M17.94 17.94A9.77 9.77 0 0 1 12 19c-4.477 0-8.268-2.943-9.542-7a9.77 9.77 0 0 1 1.566-2.566"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 0 1-6 0"
                    />
                  </>
                ) : (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </>
                )}
              </svg>
            </button>
          </div>
          {errors.password && errors.password[0] && (
            <p
              className="text-sm font-medium text-red-500"
              data-error-for="login-password"
            >
              {errors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="group inline-flex w-full items-center justify-center rounded-2xl bg-[#30442B] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#3d5a38] focus:outline-none focus:ring-4 focus:ring-[#30442B]/30 disabled:opacity-50 disabled:cursor-default enabled:cursor-pointer"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              'Log in'
            )}
          </button>
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="cursor-pointer w-full text-sm font-semibold uppercase tracking-[0.2em] text-[#30442B] transition hover:text-[#3d5a38]"
          >
            No account yet? Create one
          </button>
        </div>
      </form>
    </div>
  );
}
