/**
 * Order status configuration with styling
 */
export const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'yellow',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-400',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-400',
  },
  preparing: {
    label: 'Preparing',
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-400',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-400',
  },
  delivered: {
    label: 'Delivered',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-400',
  },
  failed: {
    label: 'Failed',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-400',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-400',
  },
};

/**
 * Status flow - defines valid status transitions
 */
export const STATUS_FLOW = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['out_for_delivery', 'failed'],
  out_for_delivery: ['delivered', 'failed'],
  delivered: [],
  failed: [],
  cancelled: [],
};

/**
 * Get status configuration by status key
 * @param {string} status - The status key
 * @returns {object} Status configuration object
 */
export function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.pending;
}

/**
 * Get next available statuses for a given status
 * @param {string} status - The current status
 * @returns {string[]} Array of valid next statuses
 */
export function getNextStatuses(status) {
  return STATUS_FLOW[status] || [];
}
