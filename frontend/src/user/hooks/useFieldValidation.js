import { useState } from 'react';

export const useFieldValidation = () => {
  const [errors, setErrors] = useState({});
  const [fieldInteraction, setFieldInteraction] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFieldChange = (field, value, validator, compareValue) => {
    setFieldInteraction(prev => ({ ...prev, [field]: true }));

    const error = compareValue !== undefined
      ? validator(value, compareValue)
      : validator(value);

    setErrors(prev => ({ ...prev, [field]: error ? [error] : null }));
  };

  const handleFieldBlur = (field, value, validator, compareValue) => {
    if (!formSubmitted && !fieldInteraction[field]) return;

    const error = compareValue !== undefined
      ? validator(value, compareValue)
      : validator(value);

    setErrors(prev => ({ ...prev, [field]: error ? [error] : null }));
  };

  const getInputClasses = (field) => {
    const hasError = errors[field] && errors[field].length > 0;
    return `w-full rounded-2xl border ${hasError
      ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
      : 'border-neutral-200 focus:border-[#30442B] focus:ring-[#30442B]/20'
      } bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:outline-none focus:ring-4`;
  };

  const resetValidation = () => {
    setErrors({});
    setFieldInteraction({});
    setFormSubmitted(false);
  };

  const markFormSubmitted = () => {
    setFormSubmitted(true);
  };

  return {
    errors,
    setErrors,
    fieldInteraction,
    formSubmitted,
    handleFieldChange,
    handleFieldBlur,
    getInputClasses,
    resetValidation,
    markFormSubmitted,
  };
};
