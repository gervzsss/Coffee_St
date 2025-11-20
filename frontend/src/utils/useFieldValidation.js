import { useState } from 'react';

/**
 * Custom hook for field validation management
 * Handles field interaction tracking, live/blur validation, and error state
 * 
 * @returns {Object} Validation utilities and state
 */
export const useFieldValidation = () => {
  const [errors, setErrors] = useState({});
  const [fieldInteraction, setFieldInteraction] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  /**
   * Live validation handler - validates on field change
   * @param {string} field - Field name
   * @param {string} value - Field value
   * @param {Function} validator - Validation function
   * @param {string} compareValue - Optional value for comparison (e.g., password confirm)
   */
  const handleFieldChange = (field, value, validator, compareValue) => {
    // Track that user has interacted with this field
    setFieldInteraction(prev => ({ ...prev, [field]: true }));

    // Validate on change
    const error = compareValue !== undefined
      ? validator(value, compareValue)
      : validator(value);

    setErrors(prev => ({ ...prev, [field]: error ? [error] : null }));
  };

  /**
   * Blur validation handler - validates on field blur (conditional)
   * Only validates if field was previously interacted with or form was submitted
   * @param {string} field - Field name
   * @param {string} value - Field value
   * @param {Function} validator - Validation function
   * @param {string} compareValue - Optional value for comparison
   */
  const handleFieldBlur = (field, value, validator, compareValue) => {
    // Only validate on blur if user has interacted or form was submitted
    if (!formSubmitted && !fieldInteraction[field]) return;

    const error = compareValue !== undefined
      ? validator(value, compareValue)
      : validator(value);

    setErrors(prev => ({ ...prev, [field]: error ? [error] : null }));
  };

  /**
   * Get input CSS classes based on error state
   * @param {string} field - Field name
   * @returns {string} Tailwind CSS classes
   */
  const getInputClasses = (field) => {
    const hasError = errors[field] && errors[field].length > 0;
    return `w-full rounded-2xl border ${hasError
        ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
        : 'border-neutral-200 focus:border-[#30442B] focus:ring-[#30442B]/20'
      } bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:outline-none focus:ring-4`;
  };

  /**
   * Reset all validation state
   */
  const resetValidation = () => {
    setErrors({});
    setFieldInteraction({});
    setFormSubmitted(false);
  };

  /**
   * Set form as submitted (enables blur validation on all fields)
   */
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
