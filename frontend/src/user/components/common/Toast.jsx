import { motion, AnimatePresence } from 'framer-motion';

const TYPE_CONFIGS = {
  default: {
    classes: 'bg-[#30442B] shadow-[#30442B]/20',
    icon: (
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    ),
  },
  success: {
    classes: 'bg-green-600 shadow-green-600/20',
    icon: (
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    ),
  },
  error: {
    classes: 'bg-red-600 shadow-red-600/20',
    icon: (
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
  info: {
    classes: 'bg-blue-600 shadow-blue-600/20',
    icon: (
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8h.01M11 12h1v4m0-12a9 9 0 110 18 9 9 0 010-18"
        />
      </svg>
    ),
  },
  warning: {
    classes: 'bg-amber-500 shadow-amber-500/20',
    icon: (
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v4m0 4h.01M10.29 3.86l-8.1 14A2 2 0 004 21h16a2 2 0 001.81-3.14l-8.1-14a2 2 0 00-3.42 0z"
        />
      </svg>
    ),
  },
};

function ToastItem({ toast, onRemove }) {
  const config = TYPE_CONFIGS[toast.type] || TYPE_CONFIGS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`pointer-events-auto select-none rounded-xl sm:rounded-2xl px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white shadow-xl ring-1 ring-white/15 ${config.classes}`}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="inline-flex h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 items-center justify-center rounded-full bg-white/15 text-white">
          {config.icon}
        </span>
        <span className="leading-tight flex-1">{toast.message}</span>
        {toast.dismissible && (
          <button
            type="button"
            className="ml-2 -mr-1 text-white/70 hover:text-white transition"
            aria-label="Dismiss"
            onClick={() => onRemove(toast.id)}
          >
            ×
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function Toast({ toasts, onRemove }) {
  return (
    <div
      className="fixed top-20 sm:top-24 lg:top-28 right-3 sm:right-4 left-3 sm:left-auto z-50 flex flex-col gap-2 sm:gap-3"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}
