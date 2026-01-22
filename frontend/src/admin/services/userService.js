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

export const getDeletedUsers = async (filters = {}) => {
  try {
    const response = await adminApi.get('/users', { params: { ...filters, trashed: 'only' } });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch deleted users:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch deleted users',
    };
  }
};

export const getUser = async (id, includeTrash = false) => {
  try {
    const params = includeTrash ? { include_trashed: 1 } : {};
    const response = await adminApi.get(`/users/${id}`, { params });
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

export const restoreUser = async (id) => {
  try {
    const response = await adminApi.post(`/users/${id}/restore`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to restore user:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to restore user',
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

export const changeUserPassword = async (id, newPassword, confirmPassword) => {
  try {
    const response = await adminApi.patch(`/users/${id}/password`, {
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to change user password:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to change password',
    };
  }
};

export default {
  getCustomerMetrics,
  getAllUsers,
  getDeletedUsers,
  getUser,
  updateUserStatus,
  restoreUser,
  updateUser,
  deleteUser,
  changeUserPassword,
};
