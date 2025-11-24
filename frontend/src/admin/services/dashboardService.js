import adminApi from './apiClient';

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await adminApi.get('/dashboard/stats');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch dashboard stats',
    };
  }
};

export default {
  getDashboardStats,
};
