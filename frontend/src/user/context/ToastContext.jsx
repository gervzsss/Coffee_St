import { createContext, useState, useCallback } from "react";
import { Toast } from "../components/common";

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (toast?.onClose) {
        try {
          toast.onClose();
        } catch (e) {
          console.error("Toast onClose error:", e);
        }
      }
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const showToast = useCallback(
    (message, options = {}) => {
      const id = Date.now() + Math.random();
      const toast = {
        id,
        message,
        type: options.type || "default",
        duration: typeof options.duration === "number" ? options.duration : 2800,
        dismissible: !!options.dismissible,
        onClose: options.onClose,
      };

      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        removeToast(id);
      }, toast.duration);

      return id;
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <Toast toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}
