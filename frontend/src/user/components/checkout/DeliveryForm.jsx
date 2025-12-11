import { useState } from "react";

export default function DeliveryForm({ formData, onChange, errors }) {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-900/5 sm:rounded-3xl sm:p-6 lg:p-8">
      <h2 className="font-outfit mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl">Delivery Information</h2>

      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Delivery Address */}
        <div>
          <label htmlFor="delivery_address" className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
            Delivery Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="delivery_address"
            name="delivery_address"
            rows={3}
            value={formData.delivery_address}
            onChange={handleChange}
            className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm transition-colors focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base ${
              errors.delivery_address ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your complete delivery address (House/Unit No., Street, Barangay, City)"
          />
          {errors.delivery_address && <p className="mt-1 text-sm text-red-500">{errors.delivery_address}</p>}
        </div>

        {/* Contact Number */}
        <div>
          <label htmlFor="delivery_contact" className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="delivery_contact"
            name="delivery_contact"
            value={formData.delivery_contact}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base ${
              errors.delivery_contact ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="+63 900 000 0000"
          />
          {errors.delivery_contact && <p className="mt-1 text-sm text-red-500">{errors.delivery_contact}</p>}
        </div>

        {/* Delivery Instructions (Optional - Collapsible) */}
        <div>
          <button type="button" onClick={() => setShowInstructions(!showInstructions)} className="flex items-center gap-2 text-sm font-medium text-[#30442B] transition-colors hover:text-[#405939]">
            <svg className={`h-4 w-4 transition-transform ${showInstructions ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Add delivery instructions (optional)
          </button>

          {showInstructions && (
            <textarea
              id="delivery_instructions"
              name="delivery_instructions"
              rows={2}
              value={formData.delivery_instructions}
              onChange={handleChange}
              className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none"
              placeholder="e.g., Please ring the doorbell, Leave at the gate, etc."
            />
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-700 sm:mb-3 sm:text-sm">
            Payment Method <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2 sm:space-y-3">
            {/* Cash on Delivery */}
            <label className="flex cursor-pointer items-start gap-2 rounded-lg border-2 border-gray-200 p-3 transition-colors hover:border-[#30442B]/30 sm:gap-3 sm:p-4">
              <input
                type="radio"
                name="payment_method"
                value="cash"
                checked={formData.payment_method === "cash"}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 text-[#30442B] focus:ring-[#30442B]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Cash on Delivery</span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Recommended</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">Pay with cash when your order arrives</p>
              </div>
            </label>

            {/* GCash (Mock) */}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-gray-200 p-4 transition-colors hover:border-[#30442B]/30">
              <input
                type="radio"
                name="payment_method"
                value="gcash"
                checked={formData.payment_method === "gcash"}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 text-[#30442B] focus:ring-[#30442B]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">GCash</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Mock Payment</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">Digital wallet payment (no actual charge will be made)</p>
              </div>
            </label>
          </div>
          {errors.payment_method && <p className="mt-2 text-sm text-red-500">{errors.payment_method}</p>}
        </div>
      </div>
    </div>
  );
}
