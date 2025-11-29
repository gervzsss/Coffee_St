import { ButtonSpinner } from '../common';

export default function ArchiveModal({ product, onConfirm, onCancel, isLoading, isRestore }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isRestore ? 'Restore Product' : 'Archive Product'}
        </h2>
        <p className="text-gray-600 mb-6">
          {isRestore
            ? `Are you sure you want to restore "${product?.name}" to the active catalog?`
            : `Are you sure you want to archive "${product?.name}"? It will be removed from the main catalog.`}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#30442B] text-white rounded-lg font-medium hover:bg-[#22301e] disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <ButtonSpinner />}
            {isRestore ? 'Restore' : 'Archive'}
          </button>
        </div>
      </div>
    </div>
  );
}
