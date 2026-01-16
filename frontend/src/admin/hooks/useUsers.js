import { useState, useEffect, useCallback } from 'react';
import { useAdminToast } from './useAdminToast';
import {
  getAllUsers,
  getDeletedUsers,
  getCustomerMetrics,
  getUser,
  updateUserStatus,
  restoreUser,
} from '../services/userService';

export function useUsers() {
  const { showToast } = useAdminToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total_customers: 0,
    active_users: 0,
    banned_users: 0,
    deleted_users: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  // viewMode: 'active' | 'blocked' | 'deleted'
  const [viewMode, setViewMode] = useState('active');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
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

    let usersResult;
    if (viewMode === 'deleted') {
      usersResult = await getDeletedUsers(filters);
    } else {
      usersResult = await getAllUsers(filters);
    }

    if (usersResult.success) {
      setUsers(usersResult.data);
    }

    setLoading(false);
  }, [debouncedSearch, viewMode]);

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
    if (viewMode === 'deleted') {
      return true; // Already filtered by API
    }
    if (viewMode === 'blocked') {
      return user.status === 'restricted';
    }
    return user.status === 'active';
  });

  const handleViewDetails = async (userId) => {
    const includeTrash = viewMode === 'deleted';
    const result = await getUser(userId, includeTrash);
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
      const action = confirmAction === 'block' ? 'blocked' : 'unblocked';
      showToast(`User ${action} successfully`, { type: 'success', dismissible: true });
      await fetchData();
    } else {
      showToast(result.error || 'Failed to update user status', { type: 'error', dismissible: true, duration: 4000 });
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

  // Restore deleted user handlers
  const handleRestoreClick = (user) => {
    setSelectedUser(user);
    setShowRestoreModal(true);
  };

  const confirmRestore = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    const result = await restoreUser(selectedUser.id);

    if (result.success) {
      showToast('User account restored successfully', { type: 'success', dismissible: true });
      await fetchData();
    } else {
      showToast(result.error || 'Failed to restore user', { type: 'error', dismissible: true, duration: 4000 });
    }

    setActionLoading(false);
    setShowRestoreModal(false);
    setSelectedUser(null);
  };

  const closeRestoreModal = () => {
    setShowRestoreModal(false);
    setSelectedUser(null);
  };

  // Legacy toggle for backward compatibility - now cycles through modes
  const toggleBlockedView = () => {
    setViewMode(viewMode === 'active' ? 'blocked' : 'active');
  };

  const setView = (mode) => {
    setViewMode(mode);
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
    viewMode,
    setView,
    // Legacy support
    showBlocked: viewMode === 'blocked',
    toggleBlockedView,

    selectedUser,
    showDetailsModal,
    showConfirmModal,
    showRestoreModal,
    confirmAction,
    actionLoading,

    handleViewDetails,
    closeDetailsModal,
    handleStatusChange,
    confirmStatusChange,
    closeConfirmModal,

    // Restore handlers
    handleRestoreClick,
    confirmRestore,
    closeRestoreModal,

    getWarningText,
    refetch: fetchData,
  };
}
