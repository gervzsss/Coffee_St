import api from './apiClient';

export const sendContactMessage = async (formData) => {
  try {
    const response = await api.post('/contact', formData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to send contact message:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to send message. Please try again later.',
    };
  }
};

export default {
  sendContactMessage,
};
