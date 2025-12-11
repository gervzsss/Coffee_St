import { useState } from "react";
import { ButtonSpinner } from "../common";

export default function AvailabilityModal({ product, onConfirm, onCancel, isLoading }) {
  const [reason, setReason] = useState("");
  const isMarkingUnavailable = product?.is_available;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <h2 className="mb-2 text-xl font-bold text-gray-900">{isMarkingUnavailable ? "Mark as Not Available" : "Mark as Available"}</h2>
        <p className="mb-4 text-gray-600">
          {isMarkingUnavailable ? `Are you sure you want to mark "${product?.name}" as not available?` : `Are you sure you want to mark "${product?.name}" as available?`}
        </p>

        {isMarkingUnavailable && (
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">Reason for unavailability</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Out of stock, Seasonal item, etc."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]"
              rows={3}
            />
            <p className="mt-1 text-xs text-gray-500">This message will be shown to customers.</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} disabled={isLoading} className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(!product?.is_available, isMarkingUnavailable ? reason : null)}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-[#30442B] px-6 py-2.5 font-medium text-white hover:bg-[#22301e] disabled:opacity-50"
          >
            {isLoading && <ButtonSpinner />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
