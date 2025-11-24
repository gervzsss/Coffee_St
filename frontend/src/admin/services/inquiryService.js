import adminApi from './apiClient';

export const getAllThreads = async (filters = {}) => {
  try {
    const response = await adminApi.get('/inquiries', { params: filters });
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
    const response = await adminApi.get(`/inquiries/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch thread:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch thread',
    };
  }
};

export const sendMessage = async (threadId, message) => {
  try {
    const response = await adminApi.post(`/inquiries/${threadId}/messages`, { message });
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Failed to send message:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to send message',
    };
  }
};

export const updateThreadStatus = async (id, status) => {
  try {
    const response = await adminApi.patch(`/inquiries/${id}/status`, { status });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to update thread status:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update thread status',
    };
  }
};

export default {
  getAllThreads,
  getThread,
  sendMessage,
  updateThreadStatus,
};
