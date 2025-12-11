import { useState } from "react";
import { ButtonSpinner } from "../common";

export default function DeleteConfirmModal({ product, onConfirm, onCancel, isLoading }) {
  const [confirmText, setConfirmText] = useState("");
  const productName = product?.name || "";
  const hasOrders = product?.has_orders || false;
  const canDelete = confirmText === productName && !hasOrders;

  if (hasOrders) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Cannot Delete Product</h2>
              <p className="text-sm font-medium text-amber-600">This product has order history</p>
            </div>
          </div>

          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              <strong>"{productName}"</strong> cannot be permanently deleted because it has been ordered by customers.
            </p>
            <p className="mt-2 text-sm text-amber-700">To maintain order history integrity and accurate sales records, products with orders must be kept in the database.</p>
          </div>

          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="mb-1 text-sm font-medium text-blue-800">💡 Recommended: Keep it archived</p>
            <p className="text-sm text-blue-700">Archived products are hidden from customers and the active catalog, but their order history is preserved for reporting and reference.</p>
          </div>

          <div className="flex justify-end">
            <button onClick={onCancel} className="rounded-lg bg-gray-100 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-200">
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Permanently Delete Product</h2>
            <p className="text-sm font-medium text-red-600">This action cannot be undone</p>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            You are about to permanently delete <strong>"{productName}"</strong>. This will:
          </p>
          <ul className="mt-2 ml-4 list-disc text-sm text-red-700">
            <li>Remove the product from the database</li>
            <li>Delete all associated variants</li>
            <li>Remove the product image from storage</li>
          </ul>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Type <strong>"{productName}"</strong> to confirm deletion:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Enter product name to confirm"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-red-500 focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} disabled={isLoading} className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || !canDelete}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading && <ButtonSpinner />}
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
