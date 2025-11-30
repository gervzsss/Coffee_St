import { useState, useEffect } from 'react';
import { Edit2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import api from '../../services/apiClient';

export default function ProfileInformationForm({ user, onUserUpdate }) {
  const { showToast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
    });
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/user/profile', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address: formData.address,
      });

      showToast('Profile updated successfully', {
        type: 'success',
        dismissible: true,
      });
      onUserUpdate(response.data.user);
      setIsEditMode(false);
    } catch (error) {
      console.error('Profile update error:', error);
      showToast(error.response?.data?.message || 'Failed to update profile', {
        type: 'error',
        dismissible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-outfit text-lg sm:text-xl font-semibold text-gray-900">
          Profile Information
        </h2>
        {!isEditMode && (
          <button
            onClick={() => setIsEditMode(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#30442B] hover:bg-[#30442B]/5 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Edit
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-5 lg:mb-6">
          {isEditMode
            ? 'Update your personal information and contact details'
            : 'Your personal information and contact details'}
        </p>

        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                First Name
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-colors"
                  disabled={loading}
                />
              ) : (
                <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm sm:text-base text-gray-800">
                    {formData.first_name || 'Not provided'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Last Name
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-colors"
                  disabled={loading}
                />
              ) : (
                <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm sm:text-base text-gray-800">
                    {formData.last_name || 'Not provided'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Email Address
            </label>
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm sm:text-base text-gray-800">
                {formData.email}
              </p>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Email address cannot be changed
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Phone Number
            </label>
            {isEditMode ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-colors"
                placeholder="+63 900 000 0000"
                disabled={loading}
              />
            ) : (
              <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm sm:text-base text-gray-800">
                  {formData.phone || 'Not provided'}
                </p>
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Address
            </label>
            {isEditMode ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] transition-colors resize-none"
                placeholder="Enter your complete address"
                disabled={loading}
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-20">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {formData.address || 'Not provided'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditMode && (
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-sm sm:text-base text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#30442B] text-sm sm:text-base text-white rounded-lg font-medium hover:bg-[#405939] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
