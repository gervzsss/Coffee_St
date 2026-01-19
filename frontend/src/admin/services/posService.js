import adminApi from './apiClient';

/**
 * Get products available for POS
 */
export const getPosProducts = async (filters = {}) => {
  try {
    const response = await adminApi.get('/pos/products', { params: filters });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch POS products:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch products',
    };
  }
};

/**
 * Get variant groups for a product
 */
export const getProductVariants = async (productId) => {
  try {
    const response = await adminApi.get(`/pos/products/${productId}/variants`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch product variants:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch variants',
    };
  }
};

/**
 * Create a new POS order
 */
export const createPosOrder = async (orderData) => {
  try {
    const response = await adminApi.post('/pos/orders', orderData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to create POS order:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || 'Failed to create order',
    };
  }
};

/**
 * Get POS orders
 */
export const getPosOrders = async (filters = {}) => {
  try {
    const response = await adminApi.get('/pos/orders', { params: filters });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch POS orders:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch orders',
    };
  }
};

/**
 * Get a single POS order
 */
export const getPosOrder = async (id) => {
  try {
    const response = await adminApi.get(`/pos/orders/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch POS order:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch order',
    };
  }
};

/**
 * Update POS order status
 */
export const updatePosOrderStatus = async (id, statusData) => {
  try {
    const response = await adminApi.patch(`/pos/orders/${id}/status`, statusData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to update POS order status:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update order status',
    };
  }
};

export default {
  getPosProducts,
  getProductVariants,
  createPosOrder,
  getPosOrders,
  getPosOrder,
  updatePosOrderStatus,
};
