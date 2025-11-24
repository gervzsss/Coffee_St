import api from './apiClient';

export const getUserThreads = async () => {
  try {
    const response = await api.get('/inquiries');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch inquiry threads:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch inquiry threads',
    };
  }
};

export const getThread = async (id) => {
  try {
    const response = await api.get(`/inquiries/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch thread:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch thread',
    };
  }
};

export const sendReply = async (threadId, message) => {
  try {
    const response = await api.post(`/inquiries/${threadId}/messages`, { message });
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Failed to send reply:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to send reply',
    };
  }
};

export default {
  getUserThreads,
  getThread,
  sendReply,
};
