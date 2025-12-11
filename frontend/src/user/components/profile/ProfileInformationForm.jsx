import { useState, useEffect } from "react";
import { Edit2 } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import api from "../../services/apiClient";

export default function ProfileInformationForm({ user, onUserUpdate }) {
  const { showToast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put("/user/profile", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address: formData.address,
      });

      showToast("Profile updated successfully", {
        type: "success",
        dismissible: true,
      });
      onUserUpdate(response.data.user);
      setIsEditMode(false);
    } catch (error) {
      console.error("Profile update error:", error);
      showToast(error.response?.data?.message || "Failed to update profile", {
        type: "error",
        dismissible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 sm:rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <h2 className="font-outfit text-lg font-semibold text-gray-900 sm:text-xl">Profile Information</h2>
        {!isEditMode && (
          <button
            onClick={() => setIsEditMode(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#30442B] transition-colors hover:bg-[#30442B]/5 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
          >
            <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Edit
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
        <p className="mb-4 text-sm text-gray-600 sm:mb-5 sm:text-base lg:mb-6">
          {isEditMode ? "Update your personal information and contact details" : "Your personal information and contact details"}
        </p>

        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">First Name</label>
              {isEditMode ? (
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                  disabled={loading}
                />
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 sm:px-4 sm:py-3">
                  <p className="text-sm text-gray-800 sm:text-base">{formData.first_name || "Not provided"}</p>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">Last Name</label>
              {isEditMode ? (
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                  disabled={loading}
                />
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 sm:px-4 sm:py-3">
                  <p className="text-sm text-gray-800 sm:text-base">{formData.last_name || "Not provided"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">Email Address</label>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 sm:px-4 sm:py-3">
              <p className="text-sm text-gray-800 sm:text-base">{formData.email}</p>
            </div>
            <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">Phone Number</label>
            {isEditMode ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                placeholder="+63 900 000 0000"
                disabled={loading}
              />
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 sm:px-4 sm:py-3">
                <p className="text-sm text-gray-800 sm:text-base">{formData.phone || "Not provided"}</p>
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">Address</label>
            {isEditMode ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                placeholder="Enter your complete address"
                disabled={loading}
              />
            ) : (
              <div className="min-h-20 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="whitespace-pre-wrap text-gray-800">{formData.address || "Not provided"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditMode && (
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={handleCancel}
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
