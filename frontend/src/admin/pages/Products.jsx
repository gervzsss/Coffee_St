import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  getAllProducts,
  getProductMetrics,
  getProduct,
  createProduct,
  updateProduct,
  updateProductAvailability,
  archiveProduct,
  restoreProduct,
  deleteProduct,
  uploadImage,
  deleteImage,
} from '../services/productService';

const extractPublicId = (url) => {
  if (!url) return null;
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

const CATEGORIES = [
  { value: 'hot-coffee', label: 'Hot Coffee' },
  { value: 'iced-coffee', label: 'Iced Coffee' },
  { value: 'frappe', label: 'Frappe' },
  { value: 'non-coffee', label: 'Non-Coffee' },
  { value: 'pastries', label: 'Pastries' },
  { value: 'cakes', label: 'Cakes' },
  { value: 'buns', label: 'Buns' },
];

function ProductDetailsModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Product Details
              </h2>
              <p className="text-gray-500 mt-1">
                View product information and history
              </p>
            </div>
            <button
              onClick={onClose}
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

          <div className="flex gap-6 mb-6">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-32 h-32 rounded-xl object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-xl bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
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
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                {product.name}
              </h3>
              <p className="text-[#30442B] font-semibold text-lg mt-1">
                ₱{Number(product.price).toFixed(2)}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 capitalize">
                {product.category?.replace('-', ' ')}
              </span>
              <div className="flex gap-2 mt-2">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    product.is_available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.is_available ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {product.unavailable_reason && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl">
              <h4 className="font-semibold text-red-800 mb-1">
                Unavailable Reason
              </h4>
              <p className="text-red-600">{product.unavailable_reason}</p>
            </div>
          )}

          {product.variant_groups && product.variant_groups.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Variants & Add-ons
              </h4>
              <div className="space-y-3">
                {product.variant_groups.map((group) => (
                  <div key={group.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">
                        {group.name}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {group.selection_type} selection
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.variants?.map((variant) => (
                        <span
                          key={variant.id}
                          className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200"
                        >
                          {variant.name}{' '}
                          {variant.price_delta > 0 &&
                            `(+₱${variant.price_delta})`}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-[#30442B]/5 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#30442B]">
                {product.stats?.total_orders || 0}
              </p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="p-4 bg-[#30442B]/5 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#30442B]">
                ₱{Number(product.stats?.total_revenue || 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="p-4 bg-[#30442B]/5 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#30442B]">
                {product.stats?.total_quantity_sold || 0}
              </p>
              <p className="text-sm text-gray-600">Items Sold</p>
            </div>
          </div>

          {product.recent_orders && product.recent_orders.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Recent Orders
              </h4>
              <div className="border rounded-xl overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500">
                        Order #
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500">
                        Qty
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500">
                        Amount
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {product.recent_orders.map((order, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-4 text-sm">
                          {order.order_number || `#${order.order_id}`}
                        </td>
                        <td className="py-2 px-4 text-sm">{order.quantity}</td>
                        <td className="py-2 px-4 text-sm">
                          ₱{Number(order.line_total).toFixed(2)}
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t text-sm text-gray-500">
            <p>Created: {new Date(product.created_at).toLocaleString()}</p>
            {product.updated_at && (
              <p>
                Last Updated: {new Date(product.updated_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Availability Modal
function AvailabilityModal({ product, onConfirm, onCancel, isLoading }) {
  const [reason, setReason] = useState('');
  const isMarkingUnavailable = product?.is_available;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isMarkingUnavailable ? 'Mark as Not Available' : 'Mark as Available'}
        </h2>
        <p className="text-gray-600 mb-4">
          {isMarkingUnavailable
            ? `Are you sure you want to mark "${product?.name}" as not available?`
            : `Are you sure you want to mark "${product?.name}" as available?`}
        </p>

        {isMarkingUnavailable && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for unavailability
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Out of stock, Seasonal item, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#30442B] focus:border-[#30442B]"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              This message will be shown to customers.
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm(
                !product?.is_available,
                isMarkingUnavailable ? reason : null
              )
            }
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#30442B] text-white rounded-lg font-medium hover:bg-[#22301e] disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// Archive Confirm Modal
function ArchiveModal({ product, onConfirm, onCancel, isLoading, isRestore }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isRestore ? 'Restore Product' : 'Archive Product'}
        </h2>
        <p className="text-gray-600 mb-6">
          {isRestore
            ? `Are you sure you want to restore "${product?.name}" to the active catalog?`
            : `Are you sure you want to archive "${product?.name}"? It will be removed from the main catalog.`}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#30442B] text-white rounded-lg font-medium hover:bg-[#22301e] disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isRestore ? 'Restore' : 'Archive'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Permanent Delete Confirmation Modal
function DeleteConfirmModal({ product, onConfirm, onCancel, isLoading }) {
  const [confirmText, setConfirmText] = useState('');
  const productName = product?.name || '';
  const hasOrders = product?.has_orders || false;
  const canDelete = confirmText === productName && !hasOrders;

  // If product has orders, show info modal instead of delete confirmation
  if (hasOrders) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Cannot Delete Product
              </h2>
              <p className="text-sm text-amber-600 font-medium">
                This product has order history
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-800">
              <strong>"{productName}"</strong> cannot be permanently deleted because it has been ordered by customers.
            </p>
            <p className="text-sm text-amber-700 mt-2">
              To maintain order history integrity and accurate sales records, products with orders must be kept in the database.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 font-medium mb-1">
              💡 Recommended: Keep it archived
            </p>
            <p className="text-sm text-blue-700">
              Archived products are hidden from customers and the active catalog, but their order history is preserved for reporting and reference.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Permanently Delete Product
            </h2>
            <p className="text-sm text-red-600 font-medium">
              This action cannot be undone
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800">
            You are about to permanently delete <strong>"{productName}"</strong>
            . This will:
          </p>
          <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
            <li>Remove the product from the database</li>
            <li>Delete all associated variants</li>
            <li>Remove the product image from storage</li>
          </ul>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type <strong>"{productName}"</strong> to confirm deletion:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Enter product name to confirm"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || !canDelete}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

// Add/Edit Product Modal
function ProductFormModal({ product, onSave, onCancel, isLoading }) {
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
                                // Allow empty, numbers, and decimal point
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
                                // Parse to float on blur to clean up the value
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
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
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

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [metrics, setMetrics] = useState({
    total_products: 0,
    archived_products: 0,
    available_products: 0,
    not_available_products: 0,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, filterCategory, showArchived]);

  const fetchData = async () => {
    setLoading(true);

    const metricsResult = await getProductMetrics();
    if (metricsResult.success) {
      setMetrics(metricsResult.data);
    }

    const filters = { archived: showArchived ? 'true' : 'false' };
    if (debouncedSearch) filters.search = debouncedSearch;
    if (filterCategory) filters.category = filterCategory;

    const productsResult = await getAllProducts(filters);
    if (productsResult.success) {
      setProducts(productsResult.data);
    }

    setLoading(false);
  };

  const handleViewDetails = async (productId) => {
    const result = await getProduct(productId);
    if (result.success) {
      setSelectedProduct(result.data);
      setShowDetailsModal(true);
    }
  };

  const handleEditProduct = async (productId) => {
    const result = await getProduct(productId);
    if (result.success) {
      setSelectedProduct(result.data);
      setShowFormModal(true);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowFormModal(true);
  };

  const handleSaveProduct = async (productData) => {
    setActionLoading(true);
    let result;
    if (selectedProduct) {
      result = await updateProduct(selectedProduct.id, productData);
    } else {
      result = await createProduct(productData);
    }
    if (result.success) {
      await fetchData();
      setShowFormModal(false);
      setSelectedProduct(null);
    }
    setActionLoading(false);
  };

  const handleAvailabilityClick = (product) => {
    setSelectedProduct(product);
    setShowAvailabilityModal(true);
  };

  const handleAvailabilityConfirm = async (isAvailable, reason) => {
    if (!selectedProduct) return;
    setActionLoading(true);
    const result = await updateProductAvailability(
      selectedProduct.id,
      isAvailable,
      reason
    );
    if (result.success) {
      await fetchData();
    }
    setActionLoading(false);
    setShowAvailabilityModal(false);
    setSelectedProduct(null);
  };

  const handleArchiveClick = (product, restore = false) => {
    setSelectedProduct(product);
    setIsRestoring(restore);
    setShowArchiveModal(true);
  };

  const handleArchiveConfirm = async () => {
    if (!selectedProduct) return;
    setActionLoading(true);
    const result = isRestoring
      ? await restoreProduct(selectedProduct.id)
      : await archiveProduct(selectedProduct.id);
    if (result.success) {
      await fetchData();
    }
    setActionLoading(false);
    setShowArchiveModal(false);
    setSelectedProduct(null);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setActionLoading(true);
    const result = await deleteProduct(selectedProduct.id);
    if (result.success) {
      await fetchData();
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } else {
      alert(result.error || 'Failed to delete product');
    }
    setActionLoading(false);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Catalog Management
              </h1>
              <p className="text-gray-600">
                Manage your products and categories
              </p>
            </div>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#30442B] text-white rounded-full font-medium hover:bg-[#22301e] transition-colors"
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
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              {showArchived ? 'Active Products' : 'Archived Products'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Active Products</p>
              <p className="text-4xl font-bold text-gray-900">
                {metrics.total_products}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Archived Products</p>
              <p className="text-4xl font-bold text-gray-900">
                {metrics.archived_products}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Available</p>
              <p className="text-4xl font-bold text-green-600">
                {metrics.available_products}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Not Available</p>
              <p className="text-4xl font-bold text-red-600">
                {metrics.not_available_products}
              </p>
            </div>
          </div>

          <div className="bg-[#30442B] rounded-2xl p-5 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 bg-white focus:outline-none focus:border-[#30442B] text-sm"
                />
              </div>
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="appearance-none bg-white px-6 py-3 pr-12 rounded-full border-2 border-gray-200 font-medium text-gray-700 cursor-pointer focus:outline-none focus:border-[#30442B]"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {showArchived ? 'Archived' : 'Active'} Products (
                {products.length})
              </h2>
              {!showArchived && (
                <button
                  onClick={handleAddProduct}
                  className="px-6 py-2.5 bg-[#30442B] text-white rounded-lg hover:bg-[#22301e] transition-colors flex items-center gap-2"
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Product
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30442B]"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p className="text-gray-500">
                  {showArchived
                    ? 'No archived products'
                    : 'No products yet. Click "Add Product" to create your first item.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase">
                        Available
                      </th>
                      <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-gray-400"
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
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 capitalize">
                            {product.category?.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-900">
                          ₱{Number(product.price).toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 text-sm rounded-full ${
                              product.archived_at
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {product.archived_at ? 'Archived' : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleAvailabilityClick(product)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#30442B] focus:ring-offset-2 ${
                              product.is_available
                                ? 'bg-[#30442B]'
                                : 'bg-gray-300'
                            }`}
                            role="switch"
                            aria-checked={product.is_available}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                product.is_available
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(product.id)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              title="View Details"
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            {!showArchived && (
                              <button
                                onClick={() => handleEditProduct(product.id)}
                                className="p-2 text-[#30442B] hover:bg-[#30442B]/10 rounded-lg"
                                title="Edit"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleArchiveClick(product, showArchived)
                              }
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              title={showArchived ? 'Restore' : 'Archive'}
                            >
                              {showArchived ? (
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
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                              ) : (
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
                                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                  />
                                </svg>
                              )}
                            </button>
                            {showArchived && (
                              <button
                                onClick={() => handleDeleteClick(product)}
                                className={`p-2 rounded-lg ${
                                  product.has_orders
                                    ? 'text-gray-400 hover:bg-gray-100 cursor-help'
                                    : 'text-red-600 hover:bg-red-50'
                                }`}
                                title={
                                  product.has_orders
                                    ? 'Cannot delete - has order history (click for details)'
                                    : 'Delete Permanently'
                                }
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetailsModal && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {showFormModal && (
        <ProductFormModal
          product={selectedProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowFormModal(false);
            setSelectedProduct(null);
          }}
          isLoading={actionLoading}
        />
      )}

      {showAvailabilityModal && (
        <AvailabilityModal
          product={selectedProduct}
          onConfirm={handleAvailabilityConfirm}
          onCancel={() => {
            setShowAvailabilityModal(false);
            setSelectedProduct(null);
          }}
          isLoading={actionLoading}
        />
      )}

      {showArchiveModal && (
        <ArchiveModal
          product={selectedProduct}
          isRestore={isRestoring}
          onConfirm={handleArchiveConfirm}
          onCancel={() => {
            setShowArchiveModal(false);
            setSelectedProduct(null);
          }}
          isLoading={actionLoading}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          product={selectedProduct}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedProduct(null);
          }}
          isLoading={actionLoading}
        />
      )}
    </AdminLayout>
  );
}
