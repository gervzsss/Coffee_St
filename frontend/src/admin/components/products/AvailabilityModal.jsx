import { useState } from 'react';
import { ButtonSpinner } from '../common';

export default function AvailabilityModal({
  product,
  onConfirm,
  onCancel,
  isLoading,
}) {
  const [reason, setReason] = useState('');
  const isMarkingUnavailable = product?.is_available;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isMarkingUnavailable ? 'Mark as Not Available' : 'Mark as Available'}
        </h2>
        <p className="text-gray-600 mb-4">
          {isMarkingUnavailable
            ? `Are you sure you want to mark "${product?.name}" as not available?`
            : `Are you sure you want to mark "${product?.name}" as available?`}
        </p>

        {isMarkingUnavailable && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for unavailability
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Out of stock, Seasonal item, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#30442B] focus:border-[#30442B]"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              This message will be shown to customers.
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm(
                !product?.is_available,
                isMarkingUnavailable ? reason : null
              )
            }
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#30442B] text-white rounded-lg font-medium hover:bg-[#22301e] disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <ButtonSpinner />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
