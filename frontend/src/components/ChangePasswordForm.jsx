import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import api from '../services/apiClient';

export default function ChangePasswordForm({ onBack }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showAllPasswords, setShowAllPasswords] = useState(false);
  const [showIndividual, setShowIndividual] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleIndividualVisibility = (field) => {
    setShowIndividual((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleShowAllToggle = () => {
    const newValue = !showAllPasswords;
    setShowAllPasswords(newValue);
    setShowIndividual({
      current: newValue,
      new: newValue,
      confirm: newValue,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required';
    }

    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }

    if (!formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Please confirm your new password';
    } else if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await api.put('/user/password', {
        current_password: formData.current_password,
        new_password: formData.new_password,
        new_password_confirmation: formData.new_password_confirmation,
      });

      showToast('Password changed successfully', {
        type: 'success',
        dismissible: true,
      });

      setFormData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });

      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (error) {
      console.error('Password change error:', error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        showToast(
          error.response?.data?.message || 'Failed to change password',
          { type: 'error', dismissible: true }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            Change Password
          </h2>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8">
        <p className="text-gray-600 mb-6">
          Update your password to keep your account secure
        </p>

        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showIndividual.current ? 'text' : 'password'}
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-colors ${
                  errors.current_password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your current password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => toggleIndividualVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                {showIndividual.current ? (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
            {errors.current_password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.current_password}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showIndividual.new ? 'text' : 'password'}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-colors ${
                  errors.new_password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => toggleIndividualVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                {showIndividual.new ? (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
            {errors.new_password && (
              <p className="mt-1 text-sm text-red-500">{errors.new_password}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 8 characters
            </p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showIndividual.confirm ? 'text' : 'password'}
                name="new_password_confirmation"
                value={formData.new_password_confirmation}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-colors ${
                  errors.new_password_confirmation
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Re-enter your new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => toggleIndividualVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                {showIndividual.confirm ? (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
            {errors.new_password_confirmation && (
              <p className="mt-1 text-sm text-red-500">
                {errors.new_password_confirmation}
              </p>
            )}
          </div>

          {/* Show All Passwords Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="show-all-passwords"
              checked={showAllPasswords}
              onChange={handleShowAllToggle}
              className="w-4 h-4 text-[#30442B] border-gray-300 rounded focus:ring-[#30442B]/20"
              disabled={loading}
            />
            <label
              htmlFor="show-all-passwords"
              className="text-sm text-gray-700 cursor-pointer select-none"
            >
              Show all passwords
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#30442B] text-white rounded-lg font-medium hover:bg-[#405939] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Changing...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
