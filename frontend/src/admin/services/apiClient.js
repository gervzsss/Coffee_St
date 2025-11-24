import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'http://localhost:8000/api/admin',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('admin_token');
      if (token) {
        localStorage.removeItem('admin_token');
        delete adminApi.defaults.headers.common['Authorization'];

        window.dispatchEvent(new CustomEvent('admin:unauthorized'));
      }
    }

    if (error.response?.status === 403) {
      console.error('Forbidden: Admin privileges required');
    }

    if (error.response?.status === 404) {
      console.error('Resource not found:', error.config.url);
    }

    if (error.response?.status === 422) {
      console.error('Validation error:', error.response.data);
    }

    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default adminApi;
