import { useState, useCallback, useMemo, useEffect } from 'react';
import { getAllThreads, updateThreadStatus } from '../services/inquiryService';

export function useInquiries() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await getAllThreads();

    if (result.success) {
      setThreads(result.data);
    } else {
      setError(result.error || 'Failed to fetch threads');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const handleStatusChange = useCallback(async (threadId, newStatus) => {
    const result = await updateThreadStatus(threadId, newStatus);

    if (result.success) {
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === threadId ? { ...thread, status: newStatus } : thread
        )
      );
      return true;
    }

    return false;
  }, []);

  const filteredThreads = useMemo(() => {
    if (filterStatus === 'all') return threads;
    return threads.filter((thread) => thread.status === filterStatus);
  }, [threads, filterStatus]);

  const messageCounts = useMemo(() => ({
    total: threads.reduce((sum, t) => sum + (t.messages_count || 0), 0),
    unread: threads.filter((t) => t.status === 'pending' || t.status === 'open').length,
    archived: threads.filter((t) => t.status === 'closed' || t.status === 'archived').length,
  }), [threads]);

  return {
    threads,
    filteredThreads,
    loading,
    error,
    filterStatus,
    messageCounts,

    setFilterStatus,
    handleStatusChange,
    refetch: fetchThreads,
  };
}
