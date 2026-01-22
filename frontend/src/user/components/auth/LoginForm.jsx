import { useLoginForm } from "../../hooks";
import { getInputClasses } from "../../utils/formHelpers";
import DeletedAccountModal from "./DeletedAccountModal";

export default function LoginForm({ onClose, onSwitchToSignup }) {
  const {
    loginEmail,
    loginPassword,
    showPassword,
    loading,
    errors,
    firstInputRef,
    showDeletedAccountModal,
    handleChangeEmail,
    handleChangePassword,
    handleBlurEmail,
    handleBlurPassword,
    handleSubmit,
    toggleShowPassword,
    closeDeletedAccountModal,
  } = useLoginForm(onClose);

  return (
    <>
      <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
        <div className="space-y-2 text-center sm:space-y-3">
          <span className="mx-auto inline-flex items-center rounded-full bg-[#30442B]/10 px-3 py-1 text-[10px] font-semibold tracking-[0.35em] text-[#30442B] uppercase sm:px-4 sm:text-xs">
            Welcome back
          </span>
          <h2 className="font-outfit text-xl font-semibold text-neutral-900 sm:text-2xl lg:text-3xl">Log in to Coffee St.</h2>
          <p className="text-xs text-neutral-500 sm:text-sm lg:text-base">Access your saved drinks, track orders, and enjoy a personalized experience.</p>
        </div>

        {errors.general && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{errors.general}</div>}

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" noValidate>
          <div className="space-y-2">
            <label htmlFor="login-email" className="block text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
              Email address
            </label>
            <div className="relative">
              <input
                ref={firstInputRef}
                id="login-email"
                type="email"
                name="email"
                value={loginEmail}
                onChange={handleChangeEmail}
                onBlur={handleBlurEmail}
                autoComplete="email"
                className={getInputClasses("email", errors)}
                placeholder="name@example.com"
                disabled={loading}
              />
            </div>
            {errors.email && errors.email[0] && (
              <p className="text-sm font-medium text-red-500" data-error-for="login-email">
                {errors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="login-password" className="block text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginPassword}
                onChange={handleChangePassword}
                onBlur={handleBlurPassword}
                autoComplete="current-password"
                className={`${getInputClasses("password", errors)} pr-12`}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="password-toggle absolute inset-y-0 right-3 flex cursor-pointer items-center justify-center rounded-full p-2 text-neutral-400 transition duration-200 hover:bg-neutral-100 hover:text-[#30442B] focus:ring-2 focus:ring-[#30442B]/40 focus:outline-none"
                aria-label="Toggle password visibility"
                data-target="#login-password"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {showPassword ? (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18M10.73 6.73A9.77 9.77 0 0 1 12 6c4.477 0 8.268 2.943 9.542 7a9.77 9.77 0 0 1-1.566 2.566M17.94 17.94A9.77 9.77 0 0 1 12 19c-4.477 0-8.268-2.943-9.542-7a9.77 9.77 0 0 1 1.566-2.566"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 0 1-6 0" />
                    </>
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.password && errors.password[0] && (
              <p className="text-sm font-medium text-red-500" data-error-for="login-password">
                {errors.password[0]}
              </p>
            )}
          </div>

          <div className="space-y-3 sm:space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex w-full items-center justify-center rounded-xl bg-[#30442B] px-4 py-2.5 text-xs font-semibold tracking-[0.2em] text-white uppercase transition duration-300 hover:bg-[#3d5a38] focus:ring-4 focus:ring-[#30442B]/30 focus:outline-none enabled:cursor-pointer disabled:cursor-default disabled:opacity-50 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm lg:py-3.5"
            >
              {loading ? (
                <svg className="mx-auto h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Log in"
              )}
            </button>
            <button type="button" onClick={onSwitchToSignup} className="w-full cursor-pointer text-sm font-semibold tracking-[0.2em] text-[#30442B] uppercase transition hover:text-[#3d5a38]">
              No account yet? Create one
            </button>
          </div>
        </form>
      </div>

      <DeletedAccountModal isOpen={showDeletedAccountModal} onClose={closeDeletedAccountModal} />
    </>
  );
}
