import adminApi from './apiClient';

// Get all orders with filters and pagination
export const getAllOrders = async (filters = {}) => {
  try {
    const response = await adminApi.get('/orders', { params: filters });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch orders',
    };
  }
};

// Get single order
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

// Update order status
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await adminApi.patch(`/orders/${id}/status`, { status });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update order status',
    };
  }
};

// Get order statistics
export const getOrderStats = async () => {
  try {
    const response = await adminApi.get('/orders/stats');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch order stats:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch order stats',
    };
  }
};

export default {
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats,
};
