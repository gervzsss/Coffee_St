import adminApi from './apiClient';

export const adminLogin = async (email, password) => {
  try {
    const response = await adminApi.post('/login', { email, password });
    const { admin, token } = response.data;

    localStorage.setItem('admin_token', token);
    adminApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { success: true, data: { admin, token } };
  } catch (error) {
    console.error('Admin login failed:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed',
    };
  }
};

export const adminLogout = async () => {
  try {
    const token = localStorage.getItem('admin_token');
    if (token) {
      await adminApi.post('/logout');
    }

    localStorage.removeItem('admin_token');
    delete adminApi.defaults.headers.common['Authorization'];

    return { success: true };
  } catch (error) {
    console.error('Admin logout error:', error);

    localStorage.removeItem('admin_token');
    delete adminApi.defaults.headers.common['Authorization'];

    return { success: true };
  }
};

export const fetchAdminUser = async () => {
  try {
    const response = await adminApi.get('/user');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch admin user:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch admin user',
    };
  }
};

export default {
  adminLogin,
  adminLogout,
  fetchAdminUser,
};
