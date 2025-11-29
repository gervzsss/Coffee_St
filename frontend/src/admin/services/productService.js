import adminApi from './apiClient';

export const getProductMetrics = async () => {
  try {
    const response = await adminApi.get('/products/metrics');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch product metrics:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch metrics',
    };
  }
};

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

export const updateProductAvailability = async (id, isAvailable, reason = null) => {
  try {
    const response = await adminApi.patch(`/products/${id}/availability`, {
      is_available: isAvailable,
      unavailable_reason: reason,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to update product availability:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update availability',
    };
  }
};

export const archiveProduct = async (id) => {
  try {
    const response = await adminApi.post(`/products/${id}/archive`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to archive product:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to archive product',
    };
  }
};

export const restoreProduct = async (id) => {
  try {
    const response = await adminApi.post(`/products/${id}/restore`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to restore product:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to restore product',
    };
  }
};

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

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await adminApi.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to upload image:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to upload image',
    };
  }
};

export const deleteImage = async (publicId) => {
  try {
    const response = await adminApi.delete('/upload/image', {
      data: { public_id: publicId },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to delete image:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete image',
    };
  }
};

export default {
  getProductMetrics,
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  updateProductAvailability,
  archiveProduct,
  restoreProduct,
  deleteProduct,
  uploadImage,
  deleteImage,
};
