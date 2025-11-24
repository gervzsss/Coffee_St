export function isCloudinaryUrl(url) {
  if (!url) return false;
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

export function cldUrlWith(url, opts = {}) {
  if (!url || !isCloudinaryUrl(url)) {
    return url;
  }

  try {
    const transformations = [];

    if (opts.w) transformations.push(`w_${opts.w}`);
    if (opts.h) transformations.push(`h_${opts.h}`);
    if (opts.c) transformations.push(`c_${opts.c}`);
    if (opts.q) transformations.push(`q_${opts.q}`);
    if (opts.f) transformations.push(`f_${opts.f}`);
    if (opts.dpr) transformations.push(`dpr_${opts.dpr}`);

    if (transformations.length === 0) {
      return url;
    }

    const transformString = transformations.join(',');

    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) {
      return url;
    }

    const beforeUpload = url.substring(0, uploadIndex + 8); // Include '/upload/'
    const afterUpload = url.substring(uploadIndex + 8);

    const existingTransformIndex = afterUpload.search(/^[a-z_,0-9]+\//);
    if (existingTransformIndex === 0) {
      const nextSlash = afterUpload.indexOf('/');
      const publicId = afterUpload.substring(nextSlash);
      return `${beforeUpload}${transformString}${publicId}`;
    } else {
      return `${beforeUpload}${transformString}/${afterUpload}`;
    }
  } catch (error) {
    console.error('Error applying Cloudinary transformations:', error);
    return url;
  }
}

export function getResponsiveImageUrl(url, width = 800) {
  return cldUrlWith(url, {
    w: width,
    c: 'fill',
    q: 'auto',
    f: 'auto',
  });
}

export function getThumbnailUrl(url, size = 200) {
  return cldUrlWith(url, {
    w: size,
    h: size,
    c: 'fill',
    q: 'auto',
    f: 'auto',
  });
}

export default {
  isCloudinaryUrl,
  cldUrlWith,
  getResponsiveImageUrl,
  getThumbnailUrl,
};
