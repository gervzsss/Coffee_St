import { ButtonSpinner } from '../common';

export default function ConfirmStatusModal({
  user,
  action,
  onConfirm,
  onCancel,
  isLoading,
}) {
  if (!user) return null;

  const isBlocking = action === 'block';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Confirm Status Change
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to {isBlocking ? 'block' : 'unblock'} this user?
          This action will be logged.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#30442B] text-white rounded-lg font-medium hover:bg-[#22301e] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <ButtonSpinner />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
