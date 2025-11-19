/**
 * Cloudinary Helper Functions
 * Utilities for working with Cloudinary URLs and transformations
 */

/**
 * Check if a URL is a Cloudinary URL
 * @param {string} url - The URL to check
 * @returns {boolean} - True if URL is from Cloudinary
 */
export function isCloudinaryUrl(url) {
  if (!url) return false;
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

/**
 * Inject Cloudinary transformations into a Cloudinary URL
 * @param {string} url - The original Cloudinary URL
 * @param {object} opts - Transformation options
 * @param {number} opts.w - Width
 * @param {number} opts.h - Height
 * @param {string} opts.c - Crop mode (fill, fit, scale, etc.)
 * @param {string} opts.q - Quality (auto, best, good, eco, low)
 * @param {string} opts.f - Format (auto, webp, jpg, png)
 * @param {number} opts.dpr - Device pixel ratio
 * @returns {string} - Transformed Cloudinary URL
 */
export function cldUrlWith(url, opts = {}) {
  if (!url || !isCloudinaryUrl(url)) {
    return url; // Return as-is if not a Cloudinary URL
  }

  try {
    // Build transformation string from options
    const transformations = [];
    
    if (opts.w) transformations.push(`w_${opts.w}`);
    if (opts.h) transformations.push(`h_${opts.h}`);
    if (opts.c) transformations.push(`c_${opts.c}`);
    if (opts.q) transformations.push(`q_${opts.q}`);
    if (opts.f) transformations.push(`f_${opts.f}`);
    if (opts.dpr) transformations.push(`dpr_${opts.dpr}`);
    
    if (transformations.length === 0) {
      return url; // No transformations to apply
    }
    
    const transformString = transformations.join(',');
    
    // Split URL at /upload/ and inject transformations
    // Format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{transformations}/{public_id}.{format}
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) {
      return url; // Not a standard upload URL
    }
    
    const beforeUpload = url.substring(0, uploadIndex + 8); // Include '/upload/'
    const afterUpload = url.substring(uploadIndex + 8);
    
    // Check if there are already transformations
    const existingTransformIndex = afterUpload.search(/^[a-z_,0-9]+\//);
    if (existingTransformIndex === 0) {
      // Replace existing transformations
      const nextSlash = afterUpload.indexOf('/');
      const publicId = afterUpload.substring(nextSlash);
      return `${beforeUpload}${transformString}${publicId}`;
    } else {
      // No existing transformations, add new ones
      return `${beforeUpload}${transformString}/${afterUpload}`;
    }
  } catch (error) {
    console.error('Error applying Cloudinary transformations:', error);
    return url; // Return original URL on error
  }
}

/**
 * Get a responsive Cloudinary image URL
 * @param {string} url - The original Cloudinary URL
 * @param {number} width - Desired width
 * @returns {string} - Transformed URL optimized for responsive display
 */
export function getResponsiveImageUrl(url, width = 800) {
  return cldUrlWith(url, {
    w: width,
    c: 'fill',
    q: 'auto',
    f: 'auto',
  });
}

/**
 * Get a thumbnail Cloudinary image URL
 * @param {string} url - The original Cloudinary URL
 * @param {number} size - Thumbnail size (default 200)
 * @returns {string} - Transformed URL optimized for thumbnails
 */
export function getThumbnailUrl(url, size = 200) {
  return cldUrlWith(url, {
    w: size,
    h: size,
    c: 'fill',
    q: 'auto',
    f: 'auto',
  });
}
