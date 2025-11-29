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
      tax_rate: orderData.tax_rate || 0.12,
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

export const calculateOrderTotals = (cartItems = [], deliveryFee = 0, taxRate = 0.12) => {
  const subtotal = cartItems.reduce((total, item) => total + (item.line_total || 0), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax + deliveryFee;

  return {
    subtotal,
    tax,
    deliveryFee,
    total,
    taxRate,
  };
};

export default {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  calculateOrderTotals,
};
