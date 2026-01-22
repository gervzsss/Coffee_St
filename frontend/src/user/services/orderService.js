import api from './apiClient';

export const getOrders = async () => {
  try {
    const response = await api.get('/orders');
    return { success: true, data: response.data.orders };
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch orders',
    };
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return { success: true, data: response.data.order || response.data };
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch order',
    };
  }
};

export const createOrder = async (orderData = {}) => {
  try {
    const response = await api.post('/orders', {
      delivery_fee: orderData.delivery_fee || 0,
      ...orderData,
    });
    return { success: true, data: response.data.order };
  } catch (error) {
    console.error('Failed to create order:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create order',
    };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return { success: true, data: response.data.order };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update order status',
    };
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.post(`/orders/${orderId}/cancel`);
    return { success: true, data: response.data.order };
  } catch (error) {
    console.error('Failed to cancel order:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to cancel order',
      errorCode: error.response?.data?.error,
    };
  }
};

export const calculateOrderTotals = (cartItems = [], deliveryFee = 0) => {
  const subtotal = cartItems.reduce((total, item) => total + (item.line_total || 0), 0);
  const total = subtotal + deliveryFee;

  return {
    subtotal,
    deliveryFee,
    total,
  };
};

export default {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  calculateOrderTotals,
};
