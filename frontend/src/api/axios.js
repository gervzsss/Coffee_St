import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401) {
            const token = localStorage.getItem('token');
            if (token) {
                // Token exists but is invalid, clear it
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
                
                // Optionally redirect to login or show modal
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            }
        }
        
        // Handle 404 Not Found
        if (error.response?.status === 404) {
            console.error('Resource not found:', error.config.url);
        }
        
        // Handle 422 Validation Error
        if (error.response?.status === 422) {
            console.error('Validation error:', error.response.data);
        }
        
        // Handle 500 Server Error
        if (error.response?.status === 500) {
            console.error('Server error:', error.response.data);
        }
        
        return Promise.reject(error);
    }
);

export default api;
