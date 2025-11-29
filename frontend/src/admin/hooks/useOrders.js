import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getOrderMetrics,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  markOrderFailed,
} from '../services/orderService';

/**
 * Custom hook for managing orders data and operations
 */
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    all: 0,
    processing: 0,
    out_for_delivery: 0,
    completed: 0,
    failed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected order state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    orderId: null,
    fromStatus: null,
    toStatus: null,
  });
  const [failModal, setFailModal] = useState({
    isOpen: false,
    orderId: null,
  });
  const [updating, setUpdating] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [ordersResult, metricsResult] = await Promise.all([
      getAllOrders(),
      getOrderMetrics(),
    ]);

    if (ordersResult.success) {
      setOrders(ordersResult.data);
    } else {
      setError(ordersResult.error || 'Failed to fetch orders');
    }

    if (metricsResult.success) {
      const data = metricsResult.data;
      setMetrics({
        all: data.all || 0,
        processing: (data.pending || 0) + (data.confirmed || 0) + (data.preparing || 0),
        out_for_delivery: data.out_for_delivery || 0,
        completed: data.delivered || 0,
        failed: (data.failed || 0) + (data.cancelled || 0),
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewOrder = useCallback(async (orderId) => {
    setDetailLoading(true);
    const result = await getOrder(orderId);
    if (result.success) {
      setSelectedOrder(result.data);
    }
    setDetailLoading(false);
  }, []);

  const closeOrderDetail = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  // Quick status change handler (from dropdown)
  const handleQuickStatusChange = useCallback((orderId, fromStatus, toStatus) => {
    if (toStatus === 'failed') {
      setFailModal({ isOpen: true, orderId });
    } else {
      setConfirmModal({ isOpen: true, orderId, fromStatus, toStatus });
    }
  }, []);

  // Confirm status update
  const confirmStatusUpdate = useCallback(async () => {
    const { orderId, toStatus } = confirmModal;
    setUpdating(true);

    const result = await updateOrderStatus(orderId, { status: toStatus });
    if (result.success) {
      await fetchData();
      if (selectedOrder?.id === orderId) {
        const orderResult = await getOrder(orderId);
        if (orderResult.success) {
          setSelectedOrder(orderResult.data);
        }
      }
    }

    setUpdating(false);
    setConfirmModal({ isOpen: false, orderId: null, fromStatus: null, toStatus: null });
  }, [confirmModal, fetchData, selectedOrder?.id]);

  const handleStatusUpdate = useCallback(async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, { status: newStatus });
    if (result.success) {
      await fetchData();
      if (selectedOrder?.id === orderId) {
        const orderResult = await getOrder(orderId);
        if (orderResult.success) {
          setSelectedOrder(orderResult.data);
        }
      }
    }
    return result;
  }, [fetchData, selectedOrder?.id]);

  const handleMarkFailed = useCallback(async (orderId, reason) => {
    setUpdating(true);
    const result = await markOrderFailed(orderId, reason);
    if (result.success) {
      await fetchData();
      if (selectedOrder?.id === orderId) {
        const orderResult = await getOrder(orderId);
        if (orderResult.success) {
          setSelectedOrder(orderResult.data);
        }
      }
    }
    setUpdating(false);
    setFailModal({ isOpen: false, orderId: null });
    return result;
  }, [fetchData, selectedOrder?.id]);

  const confirmFailure = useCallback(async (reason) => {
    await handleMarkFailed(failModal.orderId, reason);
  }, [failModal.orderId, handleMarkFailed]);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal({ isOpen: false, orderId: null, fromStatus: null, toStatus: null });
  }, []);

  const closeFailModal = useCallback(() => {
    setFailModal({ isOpen: false, orderId: null });
  }, []);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (filterStatus === 'processing') {
        matchesStatus = ['pending', 'confirmed', 'preparing'].includes(order.status);
      } else if (filterStatus === 'completed') {
        matchesStatus = order.status === 'delivered';
      } else if (filterStatus === 'failed') {
        matchesStatus = ['failed', 'cancelled'].includes(order.status);
      } else if (filterStatus !== 'all') {
        matchesStatus = order.status === filterStatus;
      }

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, filterStatus]);

  // Status cards config
  const statusCards = useMemo(() => [
    { key: 'all', label: 'All Orders', count: metrics.all },
    { key: 'processing', label: 'Processing Orders', count: metrics.processing },
    { key: 'out_for_delivery', label: 'Out for Delivery', count: metrics.out_for_delivery },
    { key: 'completed', label: 'Completed Orders', count: metrics.completed },
    { key: 'failed', label: 'Failed Orders', count: metrics.failed },
  ], [metrics]);

  return {
    // State
    orders,
    filteredOrders,
    metrics,
    loading,
    error,
    filterStatus,
    searchTerm,
    selectedOrder,
    detailLoading,
    confirmModal,
    failModal,
    updating,
    statusCards,

    // Actions
    setFilterStatus,
    setSearchTerm,
    handleViewOrder,
    closeOrderDetail,
    handleQuickStatusChange,
    confirmStatusUpdate,
    handleStatusUpdate,
    handleMarkFailed,
    confirmFailure,
    closeConfirmModal,
    closeFailModal,
    refetch: fetchData,
  };
}
