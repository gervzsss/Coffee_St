import adminApi from './apiClient';

// Get all users with filters
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

// Get single user
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

// Update user
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

// Delete user
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
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
