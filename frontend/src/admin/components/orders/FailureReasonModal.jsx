import { useState } from 'react';

/**
 * Modal for entering failure reason when marking an order as failed
 */
export default function FailureReasonModal({ isOpen, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason('');
    }
  };

  const handleClose = () => {
    onClose();
    setReason('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Mark Order as Failed
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Please provide a reason for marking this order as failed.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter failure reason..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] resize-none"
          rows={3}
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim() || loading}
            className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
