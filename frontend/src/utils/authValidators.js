export const PATTERNS = {
  name: /^[A-Za-z\s.\-']+$/,
  email: /^[A-Za-z0-9._\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/,
  phone: /^\+?\d+$/,
};

export const MIN_PASSWORD_LENGTH = 6;

export const validators = {
  loginEmail: (value) => {
    const v = value.trim();
    if (!v) return 'Email is required.';
    if (!PATTERNS.email.test(v)) return 'Enter a valid email.';
    return null;
  },

  loginPassword: (value) => {
    const v = value.trim();
    if (!v) return 'Password is required.';
    if (v.length < MIN_PASSWORD_LENGTH) return `Minimum ${MIN_PASSWORD_LENGTH} characters.`;
    return null;
  },

  firstName: (value) => {
    const v = value.trim();
    if (!v) return 'First name required.';
    if (!PATTERNS.name.test(v)) return 'Invalid characters.';
    return null;
  },

  lastName: (value) => {
    const v = value.trim();
    if (!v) return 'Last name required.';
    if (!PATTERNS.name.test(v)) return 'Invalid characters.';
    return null;
  },

  address: (value) => {
    const v = value.trim();
    if (!v) return 'Address required.';
    return null;
  },

  email: (value) => {
    const v = value.trim();
    if (!v) return 'Email required.';
    if (!PATTERNS.email.test(v)) return 'Enter a valid email.';
    return null;
  },

  phone: (value) => {
    const v = value.trim();
    if (!v) return 'Contact number required.';
    if (!PATTERNS.phone.test(v)) return 'Digits only (optional +).';
    return null;
  },

  password: (value) => {
    const v = value.trim();
    if (!v) return 'Password required.';
    if (v.length < MIN_PASSWORD_LENGTH) return `Minimum ${MIN_PASSWORD_LENGTH} characters.`;
    return null;
  },

  passwordConfirm: (value, passwordValue) => {
    const v = value.trim();
    if (!v) return 'Please confirm password.';
    if (v !== passwordValue) return 'Passwords do not match.';
    return null;
  },
};
