import { STATUS_CONFIG } from '../../constants/orderStatus';

/**
 * Modal for confirming status changes
 */
export default function ConfirmStatusModal({
  isOpen,
  onClose,
  onConfirm,
  fromStatus,
  toStatus,
  loading,
}) {
  if (!isOpen) return null;

  const fromConfig = STATUS_CONFIG[fromStatus];
  const toConfig = STATUS_CONFIG[toStatus];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Confirm Status Change
        </h3>
        <p className="text-gray-700 mb-2">
          Change order status from{' '}
          <span className="font-semibold">{fromConfig?.label}</span> to{' '}
          <span className="font-semibold">{toConfig?.label}</span>?
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to change the order status? This action will be
          logged.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 px-4 bg-[#30442B] text-white rounded-full font-medium hover:bg-[#3d5a35] transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
