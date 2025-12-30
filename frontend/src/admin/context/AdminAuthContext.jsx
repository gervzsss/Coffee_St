import { createContext, useState, useEffect, useCallback } from "react";
import { adminLogin, adminLogout, fetchAdminUser } from "../services/authService";
import { useIdleLogout } from "../../shared/hooks/useIdleLogout";
import adminApi from "../services/apiClient";

export const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [sessionMessage, setSessionMessage] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        const result = await fetchAdminUser();
        if (result.success) {
          setAdmin(result.data);
        } else {
          localStorage.removeItem("admin_token");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setAdmin(null);
      setSessionMessage("You've been logged out due to inactivity or session expiration. Please log in again.");
      setIsAuthModalOpen(true);
    };

    window.addEventListener("admin:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("admin:unauthorized", handleUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await adminLogin(email, password);
    if (result.success) {
      setAdmin(result.data.admin);
      setIsAuthModalOpen(false);
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    await adminLogout();
    setAdmin(null);
  }, []);

  const openAuthModal = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const clearSessionMessage = useCallback(() => {
    setSessionMessage(null);
  }, []);

  const handleIdleLogout = useCallback(async () => {
    await adminLogout();
    setAdmin(null);
    setSessionMessage("You've been logged out due to inactivity. Please log in again.");
    setIsAuthModalOpen(true);
  }, []);

  const handleSessionPing = useCallback(async () => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      await adminApi.get("/session/ping");
    }
  }, []);

  // Set up idle logout timer
  useIdleLogout({
    timeoutMinutes: parseInt(import.meta.env.VITE_IDLE_TIMEOUT_MINUTES_ADMIN || "60", 10),
    onLogout: handleIdleLogout,
    enabled: !!admin,
    onPing: handleSessionPing,
  });

  const value = {
    admin,
    loading,
    isAuthenticated: !!admin,
    login,
    logout,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    sessionMessage,
    clearSessionMessage,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
