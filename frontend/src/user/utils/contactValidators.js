export const nameRegex = /^[A-Za-z\s.'-]+$/;
export const emailRegex = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const validators = {

  name: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Name is required.';
    if (!nameRegex.test(trimmed)) return 'Please enter a valid name.';
    return null;
  },

  email: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Email is required.';
    if (!emailRegex.test(trimmed))
      return 'Please enter a valid email address.';
    return null;
  },

  subject: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Subject is required.';
    if (trimmed.length < 3) return 'Subject should be at least 3 characters.';
    return null;
  },

  message: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Message is required.';
    if (trimmed.length < 10)
      return 'Message should be at least 10 characters.';
    return null;
  },
};
