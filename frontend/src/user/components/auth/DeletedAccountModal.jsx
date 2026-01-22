import { motion, AnimatePresence } from "motion/react";
import { modalOverlay, modalContent } from "../../../shared/components/motion/variants";

export default function DeletedAccountModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-60 flex items-center justify-center bg-neutral-950/70 px-4 py-10 backdrop-blur-sm sm:py-16"
          variants={modalOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="relative w-[95vw] max-w-sm overflow-hidden rounded-2xl bg-white text-neutral-900 shadow-[0_30px_80px_-35px_rgba(15,68,43,0.45)] ring-1 ring-neutral-200/70 sm:w-full sm:rounded-3xl"
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-8 sm:px-8 sm:py-10">
              {/* Warning Icon */}
              <div className="mb-6 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h3 className="mb-3 text-center text-lg font-semibold text-neutral-900 sm:text-xl">Account Deleted</h3>

              {/* Message */}
              <p className="mb-6 text-center text-sm leading-relaxed text-neutral-600">
                This account has been deleted. To retrieve your account, please contact the administrator. You may be required to provide information to verify ownership of the account.
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 cursor-pointer rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold tracking-[0.2em] text-neutral-700 uppercase transition duration-300 hover:bg-neutral-50 focus:ring-4 focus:ring-neutral-200/50 focus:outline-none sm:py-3 sm:text-sm"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 cursor-pointer rounded-xl bg-[#30442B] px-4 py-2.5 text-xs font-semibold tracking-[0.2em] text-white uppercase transition duration-300 hover:bg-[#3d5a38] focus:ring-4 focus:ring-[#30442B]/30 focus:outline-none sm:py-3 sm:text-sm"
                >
                  Understood
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
