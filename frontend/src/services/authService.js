import api from './apiClient';

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    const { user, token } = response.data;

    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { success: true, data: { user, token } };
  } catch (error) {
    console.error('Login failed:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed',
    };
  }
};

export const signup = async (userData) => {
  try {
    const response = await api.post('/signup', userData);
    const { user, token } = response.data;

    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { success: true, data: { user, token } };
  } catch (error) {
    console.error('Signup failed:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Signup failed',
    };
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await api.post('/logout');
    }

    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);

    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];

    return { success: true };
  }
};

export const fetchUser = async () => {
  try {
    const response = await api.get('/user');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch user',
    };
  }
};

export default {
  login,
  signup,
  logout,
  fetchUser,
};
