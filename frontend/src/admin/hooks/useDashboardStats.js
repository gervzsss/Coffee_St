import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats } from '../services/dashboardService';

/**
 * Custom hook for fetching and managing dashboard statistics
 * @returns {{ stats: object|null, loading: boolean, error: string|null, refetch: () => void }}
 */
export function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await getDashboardStats();
    
    if (result.success) {
      setStats(result.data);
    } else {
      setError(result.error || 'Failed to fetch dashboard stats');
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
