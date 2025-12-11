import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import api from "../../services/apiClient";

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
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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
      newErrors.current_password = "Current password is required";
    }

    if (!formData.new_password) {
      newErrors.new_password = "New password is required";
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = "Password must be at least 8 characters";
    }

    if (!formData.new_password_confirmation) {
      newErrors.new_password_confirmation = "Please confirm your new password";
    } else if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await api.put("/user/password", {
        current_password: formData.current_password,
        new_password: formData.new_password,
        new_password_confirmation: formData.new_password_confirmation,
      });

      showToast("Password changed successfully", {
        type: "success",
        dismissible: true,
      });

      setFormData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });

      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (error) {
      console.error("Password change error:", error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        showToast(error.response?.data?.message || "Failed to change password", { type: "error", dismissible: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 sm:rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={onBack} className="rounded-lg p-1.5 transition-colors hover:bg-gray-100 sm:p-2" disabled={loading}>
            <ArrowLeft className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Change Password</h2>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
        <p className="mb-4 text-sm text-gray-600 sm:mb-5 sm:text-base lg:mb-6">Update your password to keep your account secure</p>

        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Current Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Current Password</label>
            <div className="relative">
              <input
                type={showIndividual.current ? "text" : "password"}
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 pr-12 transition-colors focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none ${
                  errors.current_password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your current password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => toggleIndividualVisibility("current")}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-2 transition-colors hover:bg-gray-100"
                disabled={loading}
              >
                {showIndividual.current ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
              </button>
            </div>
            {errors.current_password && <p className="mt-1 text-sm text-red-500">{errors.current_password}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <input
                type={showIndividual.new ? "text" : "password"}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 pr-12 transition-colors focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none ${
                  errors.new_password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => toggleIndividualVisibility("new")}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-2 transition-colors hover:bg-gray-100"
                disabled={loading}
              >
                {showIndividual.new ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
              </button>
            </div>
            {errors.new_password && <p className="mt-1 text-sm text-red-500">{errors.new_password}</p>}
            <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Confirm New Password</label>
            <div className="relative">
              <input
                type={showIndividual.confirm ? "text" : "password"}
                name="new_password_confirmation"
                value={formData.new_password_confirmation}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 pr-12 transition-colors focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none ${
                  errors.new_password_confirmation ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Re-enter your new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => toggleIndividualVisibility("confirm")}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-2 transition-colors hover:bg-gray-100"
                disabled={loading}
              >
                {showIndividual.confirm ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
              </button>
            </div>
            {errors.new_password_confirmation && <p className="mt-1 text-sm text-red-500">{errors.new_password_confirmation}</p>}
          </div>

          {/* Show All Passwords Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="show-all-passwords"
              checked={showAllPasswords}
              onChange={handleShowAllToggle}
              className="h-4 w-4 rounded border-gray-300 text-[#30442B] focus:ring-[#30442B]/20"
              disabled={loading}
            />
            <label htmlFor="show-all-passwords" className="cursor-pointer text-sm text-gray-700 select-none">
              Show all passwords
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3 sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-[#30442B] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#405939] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3 sm:text-base"
          >
            {loading ? "Changing..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
