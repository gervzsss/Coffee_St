import api from './apiClient';

export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return { success: true, data: response.data.items || [] };
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch cart',
    };
  }
};

export const getCartCount = async () => {
  try {
    const response = await api.get('/cart/count');
    return { success: true, data: response.data.count || 0 };
  } catch (error) {
    console.error('Failed to fetch cart count:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch cart count',
    };
  }
};

export const addToCart = async (productId, quantity = 1, variantId = null) => {
  try {
    const payload = {
      product_id: productId,
      quantity,
    };

    if (variantId) {
      payload.variant_id = variantId;
    }

    const response = await api.post('/cart', payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to add to cart',
    };
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to update cart item:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update cart item',
    };
  }
};

export const removeCartItem = async (itemId) => {
  try {
    await api.delete(`/cart/${itemId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to remove cart item:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to remove cart item',
    };
  }
};

export const clearCart = async () => {
  try {
    await api.delete('/cart');
    return { success: true };
  } catch (error) {
    console.error('Failed to clear cart:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to clear cart',
    };
  }
};

export const calculateCartTotals = (cartItems = []) => {
  const subtotal = cartItems.reduce((total, item) => total + (item.line_total || 0), 0);
  const total = subtotal;

  return { subtotal, total };
};

export default {
  getCart,
  getCartCount,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  calculateCartTotals,
};
