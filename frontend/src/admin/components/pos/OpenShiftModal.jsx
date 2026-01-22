import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "../../utils/formatCurrency";
import { ButtonSpinner } from "../common";
import { usePosMode } from "../../context/PosModeContext";

export default function OpenShiftModal({ isOpen, onOpenShift, isSubmitting }) {
  const [openingFloat, setOpeningFloat] = useState("");
  const [error, setError] = useState("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const navigate = useNavigate();
  const { disablePosMode } = usePosMode();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const floatValue = parseFloat(openingFloat);
    if (isNaN(floatValue) || floatValue < 0) {
      setError("Please enter a valid amount (0 or greater)");
      return;
    }

    if (floatValue > 1000000) {
      setError("Opening float cannot exceed ₱1,000,000");
      return;
    }

    onOpenShift(floatValue);
  };

  const handleViewShiftHistory = () => {
    navigate("/admin/pos/shifts");
  };

  const handleExitPosMode = () => {
    setShowExitConfirm(true);
  };

  const confirmExitPosMode = () => {
    disablePosMode();
  };

  // Exit confirmation dialog
  if (showExitConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="p-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">Exit POS Mode?</h3>
            <p className="text-center text-sm text-gray-600">You will return to the Admin Dashboard. No shift will be opened.</p>
          </div>
          <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button onClick={() => setShowExitConfirm(false)} className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={confirmExitPosMode} className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700">
              Exit POS Mode
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-emerald-600 to-emerald-700 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Open Shift</h2>
                  <p className="text-sm text-emerald-100">Enter your starting cash to begin</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6">
                {/* Info Banner */}
                <div className="mb-6 rounded-lg bg-amber-50 p-4 ring-1 ring-amber-200">
                  <div className="flex gap-3">
                    <svg className="h-5 w-5 shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-amber-800">
                      <p className="font-medium">A shift must be opened before processing sales.</p>
                      <p className="mt-1 text-amber-700">Count your cash drawer and enter the starting amount below.</p>
                    </div>
                  </div>
                </div>

                {/* Opening Float Input */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Opening Cash Float <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute top-1/2 left-4 -translate-y-1/2 font-medium text-gray-500">₱</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={openingFloat}
                      onChange={(e) => setOpeningFloat(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 text-lg font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  {openingFloat && !isNaN(parseFloat(openingFloat)) && (
                    <p className="mt-2 text-sm text-gray-500">
                      Starting with: <span className="font-medium text-gray-700">{formatCurrency(parseFloat(openingFloat))}</span>
                    </p>
                  )}
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>
              </div>

              {/* Footer */}
              <div className="space-y-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !openingFloat}
                  className="w-full rounded-lg bg-emerald-600 py-3.5 text-base font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <ButtonSpinner />
                      Opening Shift...
                    </span>
                  ) : (
                    "Open Shift & Start Selling"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleViewShiftHistory}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View Shift History
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleExitPosMode}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-red-200 bg-red-50 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Exit POS Mode
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
