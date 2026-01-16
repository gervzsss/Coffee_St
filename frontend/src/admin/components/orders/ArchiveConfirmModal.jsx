import { Archive, RotateCcw, X } from "lucide-react";

export default function ArchiveConfirmModal({ isOpen, onClose, onConfirm, orderNumber, action, loading }) {
  if (!isOpen) return null;

  const isArchive = action === "archive";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${isArchive ? "bg-amber-100" : "bg-green-100"}`}>
              {isArchive ? <Archive className="h-5 w-5 text-amber-600" /> : <RotateCcw className="h-5 w-5 text-green-600" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{isArchive ? "Archive Order" : "Restore Order"}</h3>
          </div>
          <button onClick={onClose} disabled={loading} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600">
            {isArchive ? (
              <>
                Are you sure you want to archive order <span className="font-semibold text-gray-900">{orderNumber}</span>?
                <br />
                <span className="mt-2 block text-sm text-gray-500">Archived orders will be moved to the Archived section and won't appear in active order lists.</span>
              </>
            ) : (
              <>
                Are you sure you want to restore order <span className="font-semibold text-gray-900">{orderNumber}</span>?
                <br />
                <span className="mt-2 block text-sm text-gray-500">This order will be moved back to the active orders list.</span>
              </>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} disabled={loading} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
              isArchive ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>{isArchive ? "Archiving..." : "Restoring..."}</span>
              </>
            ) : (
              <>
                {isArchive ? <Archive className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                <span>{isArchive ? "Archive" : "Restore"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
