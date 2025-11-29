/**
 * Formats the current date in a human-readable format
 * @returns {string} Formatted date string (e.g., "Friday, November 29, 2025")
 */
export function formatCurrentDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a date object or string to a short format
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string (e.g., "Nov 29, 2025")
 */
export function formatShortDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a date with time
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string (e.g., "11/29/2025, 02:30 PM")
 */
export function formatDateTime(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
