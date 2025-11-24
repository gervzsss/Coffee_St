import { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    const result = await authService.fetchUser();
    if (result.success) {
      setUser(result.data);
    } else {
      console.error('Failed to fetch user:', result.error);
      logout();
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setToken(result.data.token);
      setUser(result.data.user);
      return result.data;
    }
    throw new Error(result.error);
  };

  const signup = async (name, email, password, password_confirmation, address, phone) => {
    const result = await authService.signup({
      name,
      email,
      password,
      password_confirmation,
      address,
      phone,
    });
    setToken(result.data.token);
    setUser(result.data.user);
    return result.data;
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const value = {
    user,
    setUser,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!token,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
