import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getActiveShift } from "../services/shiftService";

const ShiftContext = createContext(null);

export function ShiftProvider({ children }) {
  const [activeShift, setActiveShift] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch active shift from API
  const fetchActiveShift = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await getActiveShift();

    if (result.success) {
      setActiveShift(result.data.active_shift);
    } else {
      setError(result.error);
      setActiveShift(null);
    }

    setIsLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchActiveShift();
  }, [fetchActiveShift]);

  // Update shift state after opening
  const onShiftOpened = useCallback((shift) => {
    setActiveShift(shift);
  }, []);

  // Clear shift state after closing
  const onShiftClosed = useCallback(() => {
    setActiveShift(null);
  }, []);

  // Refresh shift data (e.g., after creating an order)
  const refreshShift = useCallback(async () => {
    await fetchActiveShift();
  }, [fetchActiveShift]);

  const value = {
    activeShift,
    isLoading,
    error,
    hasActiveShift: !!activeShift,
    onShiftOpened,
    onShiftClosed,
    refreshShift,
  };

  return <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShift() {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error("useShift must be used within a ShiftProvider");
  }
  return context;
}
