import adminApi from './apiClient';

export const getOrderMetrics = async () => {
  try {
    const response = await adminApi.get('/orders/metrics');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch order metrics:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch metrics',
    };
  }
};

export const getAllOrders = async (filters = {}) => {
  try {
    // Explicitly request online orders only (delivery orders)
    const response = await adminApi.get('/orders', {
      params: { ...filters, order_source: 'online' }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch orders',
    };
  }
};

export const getArchivedOrders = async (filters = {}) => {
  try {
    // Explicitly request online orders only (delivery orders)
    const response = await adminApi.get('/orders', {
      params: { ...filters, archived: 'only', order_source: 'online' }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch archived orders:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch archived orders',
    };
  }
};

export const getOrder = async (id) => {
  try {
    const response = await adminApi.get(`/orders/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch order',
    };
  }
};

export const updateOrderStatus = async (id, statusData) => {
  try {
    const response = await adminApi.patch(`/orders/${id}/status`, statusData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update order status',
    };
  }
};

export const markOrderFailed = async (id, failureReason) => {
  try {
    const response = await adminApi.patch(`/orders/${id}/status`, {
      status: 'failed',
      failure_reason: failureReason,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to mark order as failed:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to mark order as failed',
    };
  }
};

export const uploadDeliveryProof = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await adminApi.post('/orders/upload-proof', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to upload delivery proof:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to upload image',
    };
  }
};

export const archiveOrder = async (id) => {
  try {
    const response = await adminApi.post(`/orders/${id}/archive`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to archive order:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to archive order',
    };
  }
};

export const unarchiveOrder = async (id) => {
  try {
    const response = await adminApi.post(`/orders/${id}/unarchive`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to restore order:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to restore order',
    };
  }
};

export default {
  getOrderMetrics,
  getAllOrders,
  getArchivedOrders,
  getOrder,
  updateOrderStatus,
  markOrderFailed,
  uploadDeliveryProof,
  archiveOrder,
  unarchiveOrder,
};
