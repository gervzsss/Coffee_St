/**
 * Get Tailwind CSS classes for order/general status
 * @param {string} status - The status value
 * @returns {string} Tailwind CSS classes
 */
export function getStatusColor(status) {
  switch (status) {
    case 'open':
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'responded':
    case 'confirmed':
    case 'preparing':
      return 'bg-blue-100 text-blue-800';
    case 'resolved':
    case 'done':
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'closed':
    case 'archived':
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get Tailwind CSS classes for inquiry status
 * @param {string} status - The inquiry status value
 * @returns {string} Tailwind CSS classes
 */
export function getInquiryStatusColor(status) {
  switch (status) {
    case 'open':
      return 'bg-amber-100 text-amber-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'responded':
      return 'bg-blue-100 text-blue-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'closed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
