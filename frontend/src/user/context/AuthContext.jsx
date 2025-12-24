import { createContext, useState, useEffect, useCallback } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [blockedMessage, setBlockedMessage] = useState(null);

  const fetchUser = useCallback(async () => {
    const result = await authService.fetchUser();
    if (result.success) {
      setUser(result.data);
    } else {
      console.error("Failed to fetch user:", result.error);
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  // Listen for blocked user events
  useEffect(() => {
    const handleBlocked = (event) => {
      setToken(null);
      setUser(null);
      setBlockedMessage(event.detail?.message || "Your account has been blocked. Please contact support for assistance.");
    };

    window.addEventListener("auth:blocked", handleBlocked);
    return () => window.removeEventListener("auth:blocked", handleBlocked);
  }, []);

  const clearBlockedMessage = () => {
    setBlockedMessage(null);
  };

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    setToken(result.token);
    setUser(result.user);
    return result;
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

  const openAuthModal = (mode = "login") => {
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
    blockedMessage,
    clearBlockedMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
