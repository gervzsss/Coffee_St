import api from './axios';

/**
 * Order API Service
 * Handles all order-related API calls
 */

/**
 * Get all orders for the authenticated user
 * @returns {Promise} Array of orders with items
 */
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

/**
 * Get a single order by ID
 * @param {number} orderId - The order ID
 * @returns {Promise} Order details with items
 */
export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return { success: true, data: response.data.order };
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch order',
    };
  }
};

/**
 * Create a new order from the user's cart
 * @param {Object} orderData - Order details
 * @param {number} orderData.delivery_fee - Delivery fee (optional, default 0)
 * @param {number} orderData.tax_rate - Tax rate (optional, default 0.08)
 * @returns {Promise} Created order details
 */
export const createOrder = async (orderData = {}) => {
  try {
    const response = await api.post('/orders', {
      delivery_fee: orderData.delivery_fee || 0,
      tax_rate: orderData.tax_rate || 0.12, // 12% default tax rate
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

/**
 * Update order status
 * @param {number} orderId - The order ID
 * @param {string} status - New status (pending, paid, cancelled)
 * @returns {Promise} Updated order details
 */
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

/**
 * Calculate order totals from cart items
 * @param {Array} cartItems - Array of cart items
 * @param {number} deliveryFee - Delivery fee (default 0)
 * @param {number} taxRate - Tax rate (default 0.12)
 * @returns {Object} Order totals
 */
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
