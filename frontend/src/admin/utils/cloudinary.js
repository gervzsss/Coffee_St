/**
 * Extract Cloudinary public ID from URL
 * @param {string} url - Cloudinary image URL
 * @returns {string|null} Public ID or null if extraction fails
 */
export const extractPublicId = (url) => {
  if (!url) return null;
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};
