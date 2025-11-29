import { useState, useRef } from 'react';
import { CATEGORIES } from '../../constants/categories';
import { extractPublicId } from '../../utils/cloudinary';
import { uploadImage, deleteImage } from '../../services/productService';
import { ButtonSpinner } from '../common';

export default function ProductFormModal({ product, onSave, onCancel, isLoading }) {
  const isEdit = !!product;
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image_url || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    image_url: product?.image_url || '',
    is_available: product?.is_available ?? true,
    variant_groups: product?.variant_groups || [],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: 'Image size must be less than 5MB',
        }));
        return;
      }
      if (
        ![
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/gif',
          'image/webp',
        ].includes(file.type)
      ) {
        setErrors((prev) => ({
          ...prev,
          image: 'Please select a valid image file (JPEG, PNG, GIF, WEBP)',
        }));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addVariantGroup = () => {
    setFormData((prev) => ({
      ...prev,
      variant_groups: [
        ...prev.variant_groups,
        {
          name: '',
          selection_type: 'single',
          is_required: false,
          variants: [],
        },
      ],
    }));
  };

  const updateVariantGroup = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      variant_groups: prev.variant_groups.map((g, i) =>
        i === index ? { ...g, [field]: value } : g
      ),
    }));
  };

  const removeVariantGroup = (index) => {
    setFormData((prev) => ({
      ...prev,
      variant_groups: prev.variant_groups.filter((_, i) => i !== index),
    }));
  };

  const addVariant = (groupIndex) => {
    setFormData((prev) => ({
      ...prev,
      variant_groups: prev.variant_groups.map((g, i) =>
        i === groupIndex
          ? {
              ...g,
              variants: [...(g.variants || []), { name: '', price_delta: '' }],
            }
          : g
      ),
    }));
  };

  const updateVariant = (groupIndex, variantIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      variant_groups: prev.variant_groups.map((g, i) =>
        i === groupIndex
          ? {
              ...g,
              variants: g.variants.map((v, vi) =>
                vi === variantIndex ? { ...v, [field]: value } : v
              ),
            }
          : g
      ),
    }));
  };

  const removeVariant = (groupIndex, variantIndex) => {
    setFormData((prev) => ({
      ...prev,
      variant_groups: prev.variant_groups.map((g, i) =>
        i === groupIndex
          ? {
              ...g,
              variants: g.variants.filter((_, vi) => vi !== variantIndex),
            }
          : g
      ),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0)
      newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    let imageUrl = formData.image_url;
    const oldImageUrl = product?.image_url;

    // Upload new image if selected
    if (imageFile) {
      setUploadingImage(true);

      // Delete old image from Cloudinary if replacing
      if (oldImageUrl) {
        const oldPublicId = extractPublicId(oldImageUrl);
        if (oldPublicId) {
          await deleteImage(oldPublicId);
        }
      }

      const uploadResult = await uploadImage(imageFile);
      setUploadingImage(false);

      if (!uploadResult.success) {
        setErrors((prev) => ({
          ...prev,
          image: uploadResult.error || 'Failed to upload image',
        }));
        return;
      }
      imageUrl = uploadResult.data.url;
    } else if (!imagePreview && oldImageUrl) {
      // Image was removed (cleared), delete from Cloudinary
      const oldPublicId = extractPublicId(oldImageUrl);
      if (oldPublicId) {
        await deleteImage(oldPublicId);
      }
      imageUrl = '';
    }

    onSave({
      ...formData,
      image_url: imageUrl,
      price: parseFloat(formData.price),
    });
  };

  const isSubmitting = isLoading || uploadingImage;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-gray-500 mt-1">
                {isEdit
                  ? 'Update product information'
                  : 'Fill in the product details'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#30442B] focus:border-[#30442B] ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₱) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#30442B] focus:border-[#30442B] ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#30442B] focus:border-[#30442B] ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#30442B] focus:border-[#30442B] ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product description"
                rows={3}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#30442B] hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload product image
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      PNG, JPG, GIF, WEBP up to 5MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-sm text-[#30442B] hover:text-[#22301e] font-medium"
                  >
                    Change image
                  </button>
                )}
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_available"
                checked={formData.is_available}
                onChange={(e) => handleChange('is_available', e.target.checked)}
                className="w-5 h-5 text-[#30442B] border-gray-300 rounded focus:ring-[#30442B]"
              />
              <label
                htmlFor="is_available"
                className="text-sm font-medium text-gray-700"
              >
                Available for purchase
              </label>
            </div>

            {/* Variants Section */}
            <div className="border-t pt-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">
                  Variants & Add-ons
                </h3>
                <button
                  type="button"
                  onClick={addVariantGroup}
                  className="text-[#30442B] hover:text-[#22301e] text-sm font-medium flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Variant Group
                </button>
              </div>

              {formData.variant_groups.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No variants added yet
                </p>
              ) : (
                <div className="space-y-4">
                  {formData.variant_groups.map((group, groupIndex) => (
                    <div key={groupIndex} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={group.name}
                            onChange={(e) =>
                              updateVariantGroup(
                                groupIndex,
                                'name',
                                e.target.value
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Group name (e.g., Size, Add-ons)"
                          />
                          <select
                            value={group.selection_type}
                            onChange={(e) =>
                              updateVariantGroup(
                                groupIndex,
                                'selection_type',
                                e.target.value
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="single">Single selection</option>
                            <option value="multiple">Multiple selection</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVariantGroup(groupIndex)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          checked={group.is_required}
                          onChange={(e) =>
                            updateVariantGroup(
                              groupIndex,
                              'is_required',
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-[#30442B] rounded"
                        />
                        <label className="text-sm text-gray-600">
                          Required
                        </label>
                      </div>

                      <div className="space-y-2">
                        {group.variants?.map((variant, variantIndex) => (
                          <div key={variantIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={variant.name}
                              onChange={(e) =>
                                updateVariant(
                                  groupIndex,
                                  variantIndex,
                                  'name',
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Variant name"
                            />
                            <input
                              type="text"
                              inputMode="decimal"
                              value={variant.price_delta}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value === '' ||
                                  /^-?\d*\.?\d*$/.test(value)
                                ) {
                                  updateVariant(
                                    groupIndex,
                                    variantIndex,
                                    'price_delta',
                                    value === '' ? 0 : value
                                  );
                                }
                              }}
                              onBlur={(e) => {
                                const parsed = parseFloat(e.target.value) || 0;
                                updateVariant(
                                  groupIndex,
                                  variantIndex,
                                  'price_delta',
                                  parsed
                                );
                              }}
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="+₱0"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeVariant(groupIndex, variantIndex)
                              }
                              className="text-red-500 hover:text-red-700 px-2"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addVariant(groupIndex)}
                          className="text-sm text-[#30442B] hover:text-[#22301e]"
                        >
                          + Add variant option
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#30442B] text-white rounded-lg font-medium hover:bg-[#22301e] disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <ButtonSpinner />}
              {uploadingImage
                ? 'Uploading Image...'
                : isEdit
                ? 'Save Changes'
                : 'Add Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
