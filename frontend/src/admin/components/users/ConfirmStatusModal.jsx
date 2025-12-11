import { ButtonSpinner } from "../common";

export default function ConfirmStatusModal({ user, action, onConfirm, onCancel, isLoading }) {
  if (!user) return null;

  const isBlocking = action === "block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <h2 className="mb-2 text-xl font-bold text-gray-900">Confirm Status Change</h2>
        <p className="mb-6 text-gray-600">Are you sure you want to {isBlocking ? "block" : "unblock"} this user? This action will be logged.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} disabled={isLoading} className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-[#30442B] px-6 py-2.5 font-medium text-white transition-colors hover:bg-[#22301e] disabled:opacity-50"
          >
            {isLoading && <ButtonSpinner />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
