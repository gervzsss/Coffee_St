import adminApi from './apiClient';

export const getCustomerMetrics = async () => {
  try {
    const response = await adminApi.get('/users/metrics');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch customer metrics:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch metrics',
    };
  }
};

export const getAllUsers = async (filters = {}) => {
  try {
    const response = await adminApi.get('/users', { params: filters });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch users',
    };
  }
};

export const getUser = async (id) => {
  try {
    const response = await adminApi.get(`/users/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch user',
    };
  }
};

export const updateUserStatus = async (id, status) => {
  try {
    const response = await adminApi.patch(`/users/${id}/status`, { status });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to update user status:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update user status',
    };
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await adminApi.put(`/users/${id}`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to update user:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update user',
    };
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await adminApi.delete(`/users/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to delete user:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete user',
    };
  }
};

export default {
  getCustomerMetrics,
  getAllUsers,
  getUser,
  updateUserStatus,
  updateUser,
  deleteUser,
};
