import { useState, useEffect, useCallback } from 'react';
import {
  getAllUsers,
  getCustomerMetrics,
  getUser,
  updateUserStatus,
} from '../services/userService';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total_customers: 0,
    active_users: 0,
    banned_users: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showBlocked, setShowBlocked] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);

    const metricsResult = await getCustomerMetrics();
    if (metricsResult.success) {
      setMetrics(metricsResult.data);
    }

    const filters = {};
    if (debouncedSearch) filters.search = debouncedSearch;

    const usersResult = await getAllUsers(filters);
    if (usersResult.success) {
      setUsers(usersResult.data);
    }

    setLoading(false);
  }, [debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const displayedUsers = users.filter((user) => {
    if (showBlocked) {
      return user.status === 'restricted';
    }
    return user.status === 'active';
  });

  const handleViewDetails = async (userId) => {
    const result = await getUser(userId);
    if (result.success) {
      setSelectedUser(result.data);
      setShowDetailsModal(true);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedUser(null);
  };

  const handleStatusChange = (user, action) => {
    setSelectedUser(user);
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedUser || !confirmAction) return;

    setActionLoading(true);
    const newStatus = confirmAction === 'block' ? 'restricted' : 'active';
    const result = await updateUserStatus(selectedUser.id, newStatus);

    if (result.success) {
      await fetchData();
    }

    setActionLoading(false);
    setShowConfirmModal(false);
    setSelectedUser(null);
    setConfirmAction(null);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedUser(null);
    setConfirmAction(null);
  };

  const toggleBlockedView = () => {
    setShowBlocked(!showBlocked);
  };

  const getWarningText = (user) => {
    if (user.failed_orders_count > 0) {
      return `${user.failed_orders_count} Failed Orders`;
    }
    return 'NONE';
  };

  return {
    users,
    displayedUsers,
    loading,
    metrics,

    searchTerm,
    setSearchTerm,
    showBlocked,
    toggleBlockedView,

    selectedUser,
    showDetailsModal,
    showConfirmModal,
    confirmAction,
    actionLoading,

    handleViewDetails,
    closeDetailsModal,
    handleStatusChange,
    confirmStatusChange,
    closeConfirmModal,

    getWarningText,
  };
}
