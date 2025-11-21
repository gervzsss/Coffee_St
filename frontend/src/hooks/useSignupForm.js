import { useState, useRef } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { validators } from '../utils/authValidators';

export const useSignupForm = (onClose) => {
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
  const [errors, setErrors] = useState({});

  const handleChangeFirstName = (e) => {
    setFirstName(e.target.value);
    setErrors((prev) => ({ ...prev, first_name: null }));
  };

  const handleChangeLastName = (e) => {
    setLastName(e.target.value);
    setErrors((prev) => ({ ...prev, last_name: null }));
  };

  const handleChangeAddress = (e) => {
    setAddress(e.target.value);
    setErrors((prev) => ({ ...prev, address: null }));
  };

  const handleChangeEmail = (e) => {
    setSignupEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: null }));
  };

  const handleChangePhone = (e) => {
    setPhone(e.target.value);
    setErrors((prev) => ({ ...prev, phone: null }));
  };

  const handleChangePassword = (e) => {
    const newPassword = e.target.value;
    setSignupPassword(newPassword);
    setErrors((prev) => ({ ...prev, password: null }));

    if (passwordConfirmation) {
      const confirmError = validators.passwordConfirm(
        passwordConfirmation,
        newPassword
      );
      setErrors((prev) => ({
        ...prev,
        password_confirmation: confirmError ? [confirmError] : null,
      }));
    }
  };

  const handleChangePasswordConfirmation = (e) => {
    setPasswordConfirmation(e.target.value);
    setErrors((prev) => ({ ...prev, password_confirmation: null }));
  };

  const handleBlurFirstName = (e) => {
    const error = validators.firstName(e.target.value);
    setErrors((prev) => ({ ...prev, first_name: error ? [error] : null }));
  };

  const handleBlurLastName = (e) => {
    const error = validators.lastName(e.target.value);
    setErrors((prev) => ({ ...prev, last_name: error ? [error] : null }));
  };

  const handleBlurAddress = (e) => {
    const error = validators.address(e.target.value);
    setErrors((prev) => ({ ...prev, address: error ? [error] : null }));
  };

  const handleBlurEmail = (e) => {
    const error = validators.email(e.target.value);
    setErrors((prev) => ({ ...prev, email: error ? [error] : null }));
  };

  const handleBlurPhone = (e) => {
    const error = validators.phone(e.target.value);
    setErrors((prev) => ({ ...prev, phone: error ? [error] : null }));
  };

  const handleBlurPassword = (e) => {
    const error = validators.password(e.target.value);
    setErrors((prev) => ({ ...prev, password: error ? [error] : null }));
  };

  const handleBlurPasswordConfirmation = (e) => {
    const error = validators.passwordConfirm(e.target.value, signupPassword);
    setErrors((prev) => ({
      ...prev,
      password_confirmation: error ? [error] : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      if (onClose) onClose();
      resetForm();
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors);
        const errorMsg =
          errorData?.message || Object.values(errorData.errors)[0][0];
        if (!errorMsg.toLowerCase().includes('email')) {
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
    setErrors({});
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return {
    firstName,
    lastName,
    address,
    signupEmail,
    phone,
    signupPassword,
    passwordConfirmation,

    showPassword,
    showConfirmPassword,
    loading,
    errors,
    firstInputRef,

    handleChangeFirstName,
    handleChangeLastName,
    handleChangeAddress,
    handleChangeEmail,
    handleChangePhone,
    handleChangePassword,
    handleChangePasswordConfirmation,
    handleBlurFirstName,
    handleBlurLastName,
    handleBlurAddress,
    handleBlurEmail,
    handleBlurPhone,
    handleBlurPassword,
    handleBlurPasswordConfirmation,
    handleSubmit,
    toggleShowPassword,
    toggleShowConfirmPassword,
  };
};
