import { STATUS_CONFIG } from '../../constants/orderStatus';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 w-full max-w-sm sm:max-w-md shadow-xl">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
          Confirm Status Change
        </h3>
        <p className="text-sm sm:text-base text-gray-700 mb-2">
          Change order status from{' '}
          <span className="font-semibold">{fromConfig?.label}</span> to{' '}
          <span className="font-semibold">{toConfig?.label}</span>?
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          Are you sure you want to change the order status? This action will be
          logged.
        </p>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 border border-gray-300 text-sm sm:text-base text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 bg-[#30442B] text-sm sm:text-base text-white rounded-full font-medium hover:bg-[#3d5a35] transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
