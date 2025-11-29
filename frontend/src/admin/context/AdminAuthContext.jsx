import { createContext, useState, useEffect, useCallback } from 'react';
import {
  adminLogin,
  adminLogout,
  fetchAdminUser,
} from '../services/authService';

export const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        const result = await fetchAdminUser();
        if (result.success) {
          setAdmin(result.data);
        } else {
          localStorage.removeItem('admin_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setAdmin(null);
      setIsAuthModalOpen(true);
    };

    window.addEventListener('admin:unauthorized', handleUnauthorized);
    return () =>
      window.removeEventListener('admin:unauthorized', handleUnauthorized);
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

  const value = {
    admin,
    loading,
    isAuthenticated: !!admin,
    login,
    logout,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
