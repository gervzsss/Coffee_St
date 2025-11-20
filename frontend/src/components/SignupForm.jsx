import { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { validators } from '../utils/authValidators';
import { useFieldValidation } from '../hooks/useFieldValidation';

export default function SignupForm({ onClose, onSwitchToLogin }) {
  const { showToast } = useToast();
  const { signup } = useAuth();
  const firstInputRef = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    const firstNameError = validators.firstName(firstName);
    const lastNameError = validators.lastName(lastName);
    const addressError = validators.address(address);
    const emailError = validators.email(signupEmail);
    const phoneError = validators.phone(phone);
    const passwordError = validators.password(signupPassword);
    const confirmError = validators.passwordConfirm(
      passwordConfirmation,
      signupPassword
    );

    if (
      firstNameError ||
      lastNameError ||
      addressError ||
      emailError ||
      phoneError ||
      passwordError ||
      confirmError
    ) {
      setErrors({
        first_name: firstNameError ? [firstNameError] : null,
        last_name: lastNameError ? [lastNameError] : null,
        address: addressError ? [addressError] : null,
        email: emailError ? [emailError] : null,
        phone: phoneError ? [phoneError] : null,
        password: passwordError ? [passwordError] : null,
        password_confirmation: confirmError ? [confirmError] : null,
      });
      return;
    }

    setLoading(true);

    try {
      const fullName = `${firstName} ${lastName}`;
      await signup(
        fullName,
        signupEmail,
        signupPassword,
        passwordConfirmation,
        address,
        phone
      );
      showToast(`Welcome to Coffee St., ${firstName}!`, {
        type: 'success',
        dismissible: true,
        duration: 4000,
      });
      onClose();
      resetForm();
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors);
        const errorMsg =
          errorData?.message || Object.values(errorData.errors)[0][0];
        if (errorMsg.toLowerCase().includes('email')) {
        } else {
          showToast(errorMsg, {
            type: 'error',
            dismissible: true,
            duration: 4000,
          });
        }
      } else {
        const errorMessage =
          errorData?.message || 'Signup failed. Please try again.';
        setErrors({ general: errorMessage });
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
    setFirstName('');
    setLastName('');
    setAddress('');
    setSignupEmail('');
    setPhone('');
    setSignupPassword('');
    setPasswordConfirmation('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    resetValidation();
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3 text-center">
        <span className="mx-auto inline-flex items-center rounded-full bg-[#30442B]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#30442B]">
          Join the community
        </span>
        <h2 className="font-outfit text-2xl font-semibold text-neutral-900 sm:text-3xl">
          Create your Coffee St. account
        </h2>
        <p className="text-sm text-neutral-500 sm:text-base">
          Fill out the form to save your favourites and unlock exclusive offers.
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
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="reg-first"
              className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
            >
              First name
            </label>
            <input
              ref={firstInputRef}
              id="reg-first"
              type="text"
              name="first-name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                handleFieldChange(
                  'first_name',
                  e.target.value,
                  validators.firstName
                );
              }}
              onBlur={(e) =>
                handleFieldBlur(
                  'first_name',
                  e.target.value,
                  validators.firstName
                )
              }
              autoComplete="given-name"
              className={getInputClasses('first_name')}
              placeholder="Jane"
              disabled={loading}
            />
            {errors.first_name && errors.first_name[0] && (
              <p
                className="text-sm font-medium text-red-500"
                data-error-for="reg-first"
              >
                {errors.first_name[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="reg-last"
              className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
            >
              Last name
            </label>
            <input
              id="reg-last"
              type="text"
              name="last-name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                handleFieldChange(
                  'last_name',
                  e.target.value,
                  validators.lastName
                );
              }}
              onBlur={(e) =>
                handleFieldBlur(
                  'last_name',
                  e.target.value,
                  validators.lastName
                )
              }
              autoComplete="family-name"
              className={getInputClasses('last_name')}
              placeholder="Doe"
              disabled={loading}
            />
            {errors.last_name && errors.last_name[0] && (
              <p
                className="text-sm font-medium text-red-500"
                data-error-for="reg-last"
              >
                {errors.last_name[0]}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="reg-address"
            className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
          >
            Address
          </label>
          <input
            id="reg-address"
            type="text"
            name="address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              handleFieldChange('address', e.target.value, validators.address);
            }}
            onBlur={(e) =>
              handleFieldBlur('address', e.target.value, validators.address)
            }
            autoComplete="street-address"
            className={getInputClasses('address')}
            placeholder="123 Coffee Lane, City"
            disabled={loading}
          />
          {errors.address && errors.address[0] && (
            <p
              className="text-sm font-medium text-red-500"
              data-error-for="reg-address"
            >
              {errors.address[0]}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="reg-email"
              className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
            >
              Email address
            </label>
            <input
              id="reg-email"
              type="email"
              name="email"
              value={signupEmail}
              onChange={(e) => {
                setSignupEmail(e.target.value);
                handleFieldChange('email', e.target.value, validators.email);
              }}
              onBlur={(e) =>
                handleFieldBlur('email', e.target.value, validators.email)
              }
              autoComplete="email"
              className={getInputClasses('email')}
              placeholder="name@example.com"
              disabled={loading}
            />
            {errors.email && errors.email[0] && (
              <p
                className="text-sm font-medium text-red-500"
                data-error-for="reg-email"
              >
                {errors.email[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="reg-phone"
              className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
            >
              Contact number
            </label>
            <input
              id="reg-phone"
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                handleFieldChange('phone', e.target.value, validators.phone);
              }}
              onBlur={(e) =>
                handleFieldBlur('phone', e.target.value, validators.phone)
              }
              autoComplete="tel"
              className={getInputClasses('phone')}
              placeholder="+63 900 000 0000"
              disabled={loading}
            />
            {errors.phone && errors.phone[0] && (
              <p
                className="text-sm font-medium text-red-500"
                data-error-for="reg-phone"
              >
                {errors.phone[0]}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="reg-pass"
              className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="reg-pass"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={signupPassword}
                onChange={(e) => {
                  setSignupPassword(e.target.value);
                  handleFieldChange(
                    'password',
                    e.target.value,
                    validators.password
                  );
                  // Revalidate confirm if it has value
                  if (passwordConfirmation) {
                    handleFieldChange(
                      'password_confirmation',
                      passwordConfirmation,
                      validators.passwordConfirm,
                      e.target.value
                    );
                  }
                }}
                onBlur={(e) =>
                  handleFieldBlur(
                    'password',
                    e.target.value,
                    validators.password
                  )
                }
                autoComplete="new-password"
                className={`${getInputClasses('password')} pr-12`}
                placeholder="Create a password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer password-toggle absolute inset-y-0 right-3 flex items-center justify-center rounded-full p-2 text-neutral-400 transition duration-200 hover:bg-neutral-100 hover:text-[#30442B] focus:outline-none focus:ring-2 focus:ring-[#30442B]/40"
                aria-label="Toggle password visibility"
                data-target="#reg-pass"
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
                data-error-for="reg-pass"
              >
                {errors.password[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="reg-pass-confirm"
              className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="reg-pass-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                name="password_confirmation"
                value={passwordConfirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                  handleFieldChange(
                    'password_confirmation',
                    e.target.value,
                    validators.passwordConfirm,
                    signupPassword
                  );
                }}
                onBlur={(e) =>
                  handleFieldBlur(
                    'password_confirmation',
                    e.target.value,
                    validators.passwordConfirm,
                    signupPassword
                  )
                }
                autoComplete="new-password"
                className={`${getInputClasses('password_confirmation')} pr-12`}
                placeholder="Repeat password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="cursor-pointer password-toggle absolute inset-y-0 right-3 flex items-center justify-center rounded-full p-2 text-neutral-400 transition duration-200 hover:bg-neutral-100 hover:text-[#30442B] focus:outline-none focus:ring-2 focus:ring-[#30442B]/40"
                aria-label="Toggle password visibility"
                data-target="#reg-pass-confirm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  {showConfirmPassword ? (
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
            {errors.password_confirmation &&
              errors.password_confirmation[0] && (
                <p
                  className="text-sm font-medium text-red-500"
                  data-error-for="reg-pass-confirm"
                >
                  {errors.password_confirmation[0]}
                </p>
              )}
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[#30442B] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#3d5a38] focus:outline-none focus:ring-4 focus:ring-[#30442B]/30 disabled:opacity-50 disabled:cursor-default enabled:cursor-pointer"
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
              'Create account'
            )}
          </button>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="cursor-pointer w-full text-sm font-semibold uppercase tracking-[0.2em] text-[#30442B] transition hover:text-[#3d5a38]"
          >
            Already registered? Log in
          </button>
        </div>
      </form>
    </div>
  );
}
