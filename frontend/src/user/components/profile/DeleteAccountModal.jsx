import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import api from "../../services/apiClient";

export default function DeleteAccountModal({ isOpen, onClose }) {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleClose = () => {
    if (!loading) {
      setUnderstood(false);
      setConfirmText("");
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!understood || confirmText !== "DELETE") {
      return;
    }

    setLoading(true);

    try {
      await api.post("/user/soft-delete", {
        confirmation: confirmText,
      });

      showToast("Account deleted successfully", {
        type: "success",
        dismissible: true,
      });

      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Account deletion error:", error);
      showToast(error.response?.data?.message || "Failed to delete account", {
        type: "error",
        dismissible: true,
      });
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl sm:max-w-md sm:rounded-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-4 w-4 text-red-600 sm:h-5 sm:w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Delete Account</h2>
                </div>
                <button onClick={handleClose} disabled={loading} className="rounded-lg p-1.5 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2">
                  <X className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6">
                {/* Warning Message */}
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-sm font-medium text-gray-800 sm:text-base">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4">
                    <p className="mb-1.5 text-xs font-medium text-red-800 sm:mb-2 sm:text-sm">The following data will be deleted:</p>
                    <ul className="list-inside list-disc space-y-0.5 text-xs text-red-700 sm:space-y-1 sm:text-sm">
                      <li>Profile information and settings</li>
                      <li>Order history and purchase records</li>
                      <li>Shopping cart and saved items</li>
                      <li>Messages and inquiry threads</li>
                      <li>All personal data associated with your account</li>
                    </ul>
                  </div>
                </div>

                {/* Confirmation Checkbox */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <input
                      type="checkbox"
                      id="understand-deletion"
                      checked={understood}
                      onChange={(e) => setUnderstood(e.target.checked)}
                      disabled={loading}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="understand-deletion" className="cursor-pointer text-xs text-gray-700 select-none sm:text-sm">
                      I understand that this action is permanent and my data cannot be recovered
                    </label>
                  </div>

                  {/* Confirmation Text Input */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                      Type <span className="font-bold text-red-600">DELETE</span> to confirm
                    </label>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      disabled={loading || !understood}
                      placeholder="DELETE"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 sm:px-4 sm:py-3 sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-2 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:gap-3 sm:px-6 sm:py-5">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3 sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading || !understood || confirmText !== "DELETE"}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3 sm:text-base"
                >
                  {loading ? "Deleting..." : "Delete My Account"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
