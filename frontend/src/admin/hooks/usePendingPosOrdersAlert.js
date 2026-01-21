import { useState, useEffect, useCallback } from 'react';
import { getPendingPosOrdersAlert } from '../services/posService';
import { usePosMode } from '../context/PosModeContext';

/**
 * Hook for fetching pending (non-completed) POS orders count for sidebar badge
 * Fetches on mount and when explicitly refreshed
 */
export function usePendingPosOrdersAlert() {
  const { isPosMode } = usePosMode();

  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingOrders = useCallback(async () => {
    if (!isPosMode) return;

    try {
      const result = await getPendingPosOrdersAlert();

      if (result.success) {
        const { pending_count } = result.data;
        setPendingCount(pending_count);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to fetch pending orders');
    } finally {
      setIsLoading(false);
    }
  }, [isPosMode]);

  // Fetch on mount and when entering POS mode
  useEffect(() => {
    if (isPosMode) {
      fetchPendingOrders();
    } else {
      setPendingCount(0);
    }
  }, [isPosMode, fetchPendingOrders]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchPendingOrders();
  }, [fetchPendingOrders]);

  return {
    pendingCount,
    isLoading,
    error,
    refresh,
  };
}
