import { ButtonSpinner } from "../common";

export default function RestoreConfirmModal({ user, onConfirm, onCancel, isLoading }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">Restore Account</h2>
        <p className="mb-2 text-gray-600">Are you sure you want to restore this account?</p>
        <div className="mb-6 rounded-lg bg-gray-50 p-3">
          <p className="font-medium text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <p className="mb-6 text-sm text-gray-500">The user will regain access and can log in again with their existing credentials.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} disabled={isLoading} className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading && <ButtonSpinner />}
            Restore Account
          </button>
        </div>
      </div>
    </div>
  );
}
