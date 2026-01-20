import adminApi from './apiClient';

/**
 * Get the currently active shift
 */
export const getActiveShift = async () => {
  try {
    const response = await adminApi.get('/pos/shifts/active');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch active shift:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch active shift',
    };
  }
};

/**
 * Open a new shift
 */
export const openShift = async (openingCashFloat) => {
  try {
    const response = await adminApi.post('/pos/shifts/open', {
      opening_cash_float: openingCashFloat,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to open shift:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to open shift',
    };
  }
};

/**
 * Close a shift with blind cash count
 */
export const closeShift = async (shiftId, actualCashCount, notes = null) => {
  try {
    const response = await adminApi.post(`/pos/shifts/${shiftId}/close`, {
      actual_cash_count: actualCashCount,
      notes,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to close shift:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to close shift',
      inFlightOrders: error.response?.data?.in_flight_orders || null,
    };
  }
};

/**
 * Get list of shifts (paginated)
 */
export const getShifts = async (params = {}) => {
  try {
    const response = await adminApi.get('/pos/shifts', { params });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch shifts:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch shifts',
    };
  }
};

/**
 * Get shift details
 */
export const getShiftDetail = async (shiftId, params = {}) => {
  try {
    const response = await adminApi.get(`/pos/shifts/${shiftId}`, { params });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to fetch shift detail:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch shift detail',
    };
  }
};

export default {
  getActiveShift,
  openShift,
  closeShift,
  getShifts,
  getShiftDetail,
};
