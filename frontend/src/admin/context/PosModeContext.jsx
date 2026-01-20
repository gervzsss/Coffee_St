import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PosModeContext = createContext(null);

const POS_MODE_KEY = "coffee_st_pos_mode";

// Routes allowed in POS mode
const POS_ROUTES = ["/admin/pos", "/admin/pos/orders", "/admin/pos/order", "/admin/pos/shifts"];

// Routes that are NOT allowed in POS mode
const ADMIN_ONLY_ROUTES = ["/admin/dashboard", "/admin/products", "/admin/orders", "/admin/users", "/admin/inquiries"];

export function PosModeProvider({ children }) {
  const [isPosMode, setIsPosMode] = useState(() => {
    try {
      return localStorage.getItem(POS_MODE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Persist POS mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(POS_MODE_KEY, isPosMode ? "true" : "false");
    } catch (e) {
      console.error("Failed to persist POS mode:", e);
    }
  }, [isPosMode]);

  // Redirect logic when POS mode changes or when navigating
  useEffect(() => {
    const currentPath = location.pathname;

    if (isPosMode) {
      // In POS mode, redirect admin-only routes to POS home
      const isAdminOnlyRoute = ADMIN_ONLY_ROUTES.some((route) => currentPath.startsWith(route));
      if (isAdminOnlyRoute) {
        navigate("/admin/pos", { replace: true });
      }
    }
  }, [isPosMode, location.pathname, navigate]);

  const enablePosMode = useCallback(() => {
    setIsPosMode(true);
    navigate("/admin/pos");
  }, [navigate]);

  const disablePosMode = useCallback(() => {
    setIsPosMode(false);
    navigate("/admin/dashboard");
  }, [navigate]);

  const togglePosMode = useCallback(() => {
    if (isPosMode) {
      disablePosMode();
    } else {
      enablePosMode();
    }
  }, [isPosMode, enablePosMode, disablePosMode]);

  // Check if a route is allowed in current mode
  const isRouteAllowed = useCallback(
    (path) => {
      if (isPosMode) {
        return POS_ROUTES.some((route) => path.startsWith(route)) || path === "/admin/login";
      }
      return true;
    },
    [isPosMode],
  );

  const value = {
    isPosMode,
    enablePosMode,
    disablePosMode,
    togglePosMode,
    isRouteAllowed,
  };

  return <PosModeContext.Provider value={value}>{children}</PosModeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePosMode() {
  const context = useContext(PosModeContext);
  if (!context) {
    throw new Error("usePosMode must be used within a PosModeProvider");
  }
  return context;
}
