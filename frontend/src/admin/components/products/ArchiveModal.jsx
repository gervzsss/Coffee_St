import { ButtonSpinner } from "../common";

export default function ArchiveModal({ product, onConfirm, onCancel, isLoading, isRestore }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <h2 className="mb-2 text-xl font-bold text-gray-900">{isRestore ? "Restore Product" : "Archive Product"}</h2>
        <p className="mb-6 text-gray-600">
          {isRestore ? `Are you sure you want to restore "${product?.name}" to the active catalog?` : `Are you sure you want to archive "${product?.name}"? It will be removed from the main catalog.`}
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} disabled={isLoading} className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="flex items-center gap-2 rounded-lg bg-[#30442B] px-6 py-2.5 font-medium text-white hover:bg-[#22301e] disabled:opacity-50">
            {isLoading && <ButtonSpinner />}
            {isRestore ? "Restore" : "Archive"}
          </button>
        </div>
      </div>
    </div>
  );
}
