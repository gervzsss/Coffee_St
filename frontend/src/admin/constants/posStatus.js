// POS-specific status configuration (no delivery statuses)
export const POS_STATUS_CONFIG = {
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
  delivered: {
    label: 'Completed',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-400',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-400',
  },
};

// POS status flow (no out_for_delivery or failed)
export const POS_STATUS_FLOW = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

export function getPosStatusConfig(status) {
  return POS_STATUS_CONFIG[status] || POS_STATUS_CONFIG.pending;
}

export function getPosNextStatuses(status) {
  return POS_STATUS_FLOW[status] || [];
}

// Order source labels and styles
export const ORDER_SOURCE_CONFIG = {
  online: {
    label: 'Online',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    icon: '🌐',
  },
  pos: {
    label: 'In-store',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    icon: '🏪',
  },
};

export function getOrderSourceConfig(source) {
  return ORDER_SOURCE_CONFIG[source] || ORDER_SOURCE_CONFIG.online;
}
