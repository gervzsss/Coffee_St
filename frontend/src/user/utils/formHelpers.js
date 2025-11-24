export const preventEnterSubmit = (e) => {
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
  }
};

export const getInputClasses = (fieldName, errors = {}) => {
  const baseClasses =
    'mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition focus:outline-none focus:ring-4';
  const errorClasses = errors[fieldName]
    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
    : 'border-neutral-200 focus:border-[#30442B] focus:ring-[#30442B]/15';
  return `${baseClasses} ${errorClasses}`;
};
