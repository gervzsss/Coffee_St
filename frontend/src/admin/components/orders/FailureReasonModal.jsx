import { useState } from "react";

export default function FailureReasonModal({ isOpen, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    }
  };

  const handleClose = () => {
    onClose();
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Mark Order as Failed</h3>
        <p className="mb-4 text-sm text-gray-600">Please provide a reason for marking this order as failed.</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter failure reason..."
          className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20"
          rows={3}
        />
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim() || loading}
            className="flex-1 rounded-full bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
