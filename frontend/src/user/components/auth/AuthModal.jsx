import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialMode]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const switchToSignup = () => {
    setMode('signup');
  };

  const switchToLogin = () => {
    setMode('login');
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          id="modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 px-4 py-10 sm:py-16 backdrop-blur-sm"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {/* Login Modal */}
          {mode === 'login' && (
            <motion.div
              className="modal-panel relative w-[95vw] sm:w-full max-w-md sm:max-w-md lg:max-w-lg overflow-hidden rounded-2xl sm:rounded-3xl bg-white text-neutral-900 shadow-[0_30px_80px_-35px_rgba(15,68,43,0.45)] ring-1 ring-neutral-200/70"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="login"
            >
              <div className="shadow-top pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b from-white via-white/80 to-transparent opacity-0 transition-opacity duration-200"></div>
              <div className="shadow-bottom pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white via-white/80 to-transparent opacity-0 transition-opacity duration-200"></div>

              <button
                onClick={onClose}
                type="button"
                className="cursor-pointer absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition duration-200 hover:bg-neutral-200 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#30442B]/50"
                aria-label="Close login modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M6 18L18 6"
                  />
                </svg>
              </button>

              <div className="relative max-h-[85vh] overflow-y-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
                <LoginForm
                  onClose={onClose}
                  onSwitchToSignup={switchToSignup}
                />
              </div>
            </motion.div>
          )}

          {/* Signup Modal */}
          {mode === 'signup' && (
            <motion.div
              className="modal-panel relative w-[95vw] sm:w-full max-w-2xl lg:max-w-3xl overflow-hidden rounded-2xl sm:rounded-3xl bg-white text-neutral-900 shadow-[0_30px_80px_-35px_rgba(15,68,43,0.45)] ring-1 ring-neutral-200/70"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="signup"
            >
              <div className="shadow-top pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b from-white via-white/80 to-transparent opacity-0 transition-opacity duration-200"></div>
              <div className="shadow-bottom pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white via-white/80 to-transparent opacity-0 transition-opacity duration-200"></div>

              <button
                onClick={onClose}
                type="button"
                className="cursor-pointer absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition duration-200 hover:bg-neutral-200 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#30442B]/50"
                aria-label="Close signup modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M6 18L18 6"
                  />
                </svg>
              </button>

              <div className="relative max-h-[85vh] overflow-y-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
                <SignupForm onClose={onClose} onSwitchToLogin={switchToLogin} />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
