import adminApi from './apiClient';

// Get all products with filters
export const getAllProducts = async (filters = {}) => {
  try {
    const response = await adminApi.get('/products', { params: filters });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch products',
    };
  }
};

// Get single product
export const getProduct = async (id) => {
  try {
    const response = await adminApi.get(`/products/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch product',
    };
  }
};

// Create product
export const createProduct = async (productData) => {
  try {
    const response = await adminApi.post('/products', productData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to create product:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create product',
    };
  }
};

// Update product
export const updateProduct = async (id, productData) => {
  try {
    const response = await adminApi.put(`/products/${id}`, productData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to update product:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update product',
    };
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await adminApi.delete(`/products/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete product',
    };
  }
};

export default {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
