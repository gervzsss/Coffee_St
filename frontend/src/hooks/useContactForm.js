import { useState } from 'react';
import { useToast } from './useToast';
import { validators } from '../utils/contactValidators';
import { sendContactMessage } from '../services/contactService';

export const useContactForm = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [fieldInteraction, setFieldInteraction] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [threadId, setThreadId] = useState(null);

  const validateField = (name, value) => {
    const validator = validators[name];
    return validator ? validator(value) : null;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldInteraction((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (!formSubmitted && !fieldInteraction[name]) return;

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendContactMessage(formData);

      if (result.success) {
        setSubmitSuccess(true);
        setThreadId(result.data.thread_id);

        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setErrors({});
        setFormSubmitted(false);
        setFieldInteraction({});

        showToast("Message sent successfully! We'll respond within 24 hours.", {
          type: 'success',
          dismissible: true,
          duration: 5000,
        });

        setTimeout(() => {
          setSubmitSuccess(false);
          setThreadId(null);
        }, 8000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      const errorMessage =
        error.message || 'Failed to send message. Please try again later.';
      showToast(errorMessage, {
        type: 'error',
        dismissible: true,
        duration: 4000,
      });
      setErrors({
        submit: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    submitSuccess,
    threadId,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};
