import { useState, useRef } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { validators } from '../utils/authValidators';

export const useLoginForm = (onClose, resetFormCallback) => {
  const { showToast } = useToast();
  const { login } = useAuth();
  const firstInputRef = useRef(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChangeEmail = (e) => {
    setLoginEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: null }));
  };

  const handleChangePassword = (e) => {
    setLoginPassword(e.target.value);
    setErrors((prev) => ({ ...prev, password: null }));
  };

  const handleBlurEmail = (e) => {
    const error = validators.loginEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: error ? [error] : null }));
  };

  const handleBlurPassword = (e) => {
    const error = validators.loginPassword(e.target.value);
    setErrors((prev) => ({ ...prev, password: error ? [error] : null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

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
      if (onClose) onClose();
      resetForm();
      if (resetFormCallback) resetFormCallback();
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
    setErrors({});
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return {
    loginEmail,
    loginPassword,
    showPassword,
    loading,
    errors,
    firstInputRef,
    handleChangeEmail,
    handleChangePassword,
    handleBlurEmail,
    handleBlurPassword,
    handleSubmit,
    resetForm,
    toggleShowPassword,
  };
};
