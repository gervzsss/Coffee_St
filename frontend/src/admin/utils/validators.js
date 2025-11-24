export const validateProductForm = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Product name is required';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  if (!data.price || data.price <= 0) {
    errors.price = 'Valid price is required';
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Description is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateOrderUpdate = (data) => {
  const errors = {};

  if (!data.status) {
    errors.status = 'Status is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
