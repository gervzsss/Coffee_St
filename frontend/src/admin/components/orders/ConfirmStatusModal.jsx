import { STATUS_CONFIG } from "../../constants/orderStatus";

export default function ConfirmStatusModal({ isOpen, onClose, onConfirm, fromStatus, toStatus, loading }) {
  if (!isOpen) return null;

  const fromConfig = STATUS_CONFIG[fromStatus];
  const toConfig = STATUS_CONFIG[toStatus];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-xl sm:max-w-md sm:rounded-2xl sm:p-5 lg:p-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-800 sm:mb-4 sm:text-xl">Confirm Status Change</h3>
        <p className="mb-2 text-sm text-gray-700 sm:text-base">
          Change order status from <span className="font-semibold">{fromConfig?.label}</span> to <span className="font-semibold">{toConfig?.label}</span>?
        </p>
        <p className="mb-4 text-xs text-gray-500 sm:mb-6 sm:text-sm">Are you sure you want to change the order status? This action will be logged.</p>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 sm:px-4 sm:py-2.5 sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-full bg-[#30442B] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3d5a35] disabled:opacity-50 sm:px-4 sm:py-2.5 sm:text-base"
          >
            {loading ? "Updating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
