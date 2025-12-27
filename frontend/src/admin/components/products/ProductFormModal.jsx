import { useState, useRef } from "react";
import { CATEGORIES } from "../../constants/categories";
import { extractPublicId } from "../../utils/cloudinary";
import { uploadImage, deleteImage } from "../../services/productService";
import { ButtonSpinner } from "../common";
import StockHistoryModal from "./StockHistoryModal";

export default function ProductFormModal({ product, onSave, onCancel, isLoading }) {
  const isEdit = !!product;
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image_url || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showStockHistory, setShowStockHistory] = useState(false);
  const [showInitialStockPrompt, setShowInitialStockPrompt] = useState(false);
  const [pendingTrackStock, setPendingTrackStock] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
    image_url: product?.image_url || "",
    is_available: product?.is_available ?? true,
    track_stock: product?.track_stock ?? false,
    stock_quantity: product?.stock_quantity ?? "",
    low_stock_threshold: product?.low_stock_threshold ?? 5,
    variant_groups: product?.variant_groups || [],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    // Special handling for track_stock toggle
    if (field === "track_stock" && value === true && !formData.track_stock) {
      // Enabling stock tracking for the first time or when it was disabled
      if (!formData.stock_quantity || formData.stock_quantity === "") {
        // Show initial stock prompt
        setPendingTrackStock(true);
        setShowInitialStockPrompt(true);
        return;
      }
    }

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
          image: "Image size must be less than 5MB",
        }));
        return;
      }
      if (!["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file (JPEG, PNG, GIF, WEBP)",
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
    setFormData((prev) => ({ ...prev, image_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInitialStockConfirm = (initialStock) => {
    setFormData((prev) => ({
      ...prev,
      track_stock: true,
      stock_quantity: initialStock,
    }));
    setShowInitialStockPrompt(false);
    setPendingTrackStock(false);
  };

  const handleInitialStockCancel = () => {
    setShowInitialStockPrompt(false);
    setPendingTrackStock(false);
  };

  const addVariantGroup = () => {
    setFormData((prev) => ({
      ...prev,
      variant_groups: [
        ...prev.variant_groups,
        {
          name: "",
          selection_type: "single",
          is_required: false,
          variants: [],
        },
      ],
    }));
  };

  const updateVariantGroup = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      variant_groups: prev.variant_groups.map((g, i) => (i === index ? { ...g, [field]: value } : g)),
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
              variants: [...(g.variants || []), { name: "", price_delta: "" }],
            }
          : g,
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
              variants: g.variants.map((v, vi) => (vi === variantIndex ? { ...v, [field]: value } : v)),
            }
          : g,
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
          : g,
      ),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.track_stock && (!formData.stock_quantity || formData.stock_quantity < 0)) {
      newErrors.stock_quantity = "Stock quantity is required when tracking inventory";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    let imageUrl = formData.image_url;
    const oldImageUrl = product?.image_url;

    if (imageFile) {
      setUploadingImage(true);

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
          image: uploadResult.error || "Failed to upload image",
        }));
        return;
      }
      imageUrl = uploadResult.data.url;
    } else if (!imagePreview && oldImageUrl) {
      const oldPublicId = extractPublicId(oldImageUrl);
      if (oldPublicId) {
        await deleteImage(oldPublicId);
      }
      imageUrl = "";
    }

    onSave({
      ...formData,
      image_url: imageUrl,
      price: parseFloat(formData.price),
      track_stock: formData.track_stock,
      stock_quantity: formData.track_stock && formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
      low_stock_threshold: formData.track_stock && formData.low_stock_threshold ? parseInt(formData.low_stock_threshold) : 5,
    });
  };

  const isSubmitting = isLoading || uploadingImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white sm:rounded-2xl lg:max-w-2xl">
        <div className="p-4 sm:p-5 lg:p-6">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between sm:mb-5 lg:mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{isEdit ? "Edit Product" : "Add New Product"}</h2>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">{isEdit ? "Update product information" : "Fill in the product details"}</p>
            </div>
            <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600">
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {/* Product Name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B] sm:rounded-xl sm:px-4 sm:py-3 sm:text-base ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">Price (₱) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B] sm:rounded-xl sm:px-4 sm:py-3 sm:text-base ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B] sm:rounded-xl sm:px-4 sm:py-3 sm:text-base ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B] sm:rounded-xl sm:px-4 sm:py-3 sm:text-base ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product description"
                rows={3}
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">Product Image</label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="h-24 w-24 rounded-lg border border-gray-200 object-cover sm:h-32 sm:w-32 sm:rounded-xl" />
                    <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-5 text-center transition-colors hover:border-[#30442B] hover:bg-gray-50 sm:rounded-xl sm:p-8"
                  >
                    <svg className="mx-auto h-8 w-8 text-gray-400 sm:h-12 sm:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Click to upload product image</p>
                    <p className="mt-1 text-xs text-gray-400">PNG, JPG, GIF, WEBP up to 5MB</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg,image/gif,image/webp" onChange={handleImageSelect} className="hidden" />
                {imagePreview && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 text-sm font-medium text-[#30442B] hover:text-[#22301e]">
                    Change image
                  </button>
                )}
                {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_available"
                checked={formData.is_available}
                onChange={(e) => handleChange("is_available", e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-[#30442B] focus:ring-[#30442B]"
              />
              <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
                Available for purchase
              </label>
            </div>

            {/* Stock Management Section */}
            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Stock Management</h3>
                <div className="flex items-center gap-3">
                  {isEdit && product?.track_stock && (
                    <button type="button" onClick={() => setShowStockHistory(true)} className="flex items-center gap-1 text-sm font-medium text-[#30442B] hover:text-[#22301e]">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      View History
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="track_stock"
                      checked={formData.track_stock}
                      onChange={(e) => handleChange("track_stock", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#30442B] focus:ring-[#30442B]"
                    />
                    <label htmlFor="track_stock" className="text-sm font-medium text-gray-700">
                      Track inventory
                    </label>
                  </div>
                </div>
              </div>

              {formData.track_stock && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock_quantity}
                      onChange={(e) => handleChange("stock_quantity", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#30442B] focus:ring-[#30442B]"
                      placeholder="Enter quantity"
                    />
                    {errors.stock_quantity && <p className="mt-1 text-sm text-red-500">{errors.stock_quantity}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Low Stock Alert</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.low_stock_threshold}
                      onChange={(e) => handleChange("low_stock_threshold", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#30442B] focus:ring-[#30442B]"
                      placeholder="Alert threshold"
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500">
                {formData.track_stock ? "Stock will automatically decrease when orders are placed." : "Product will be treated as always available (unlimited stock)."}
              </p>
            </div>

            {/* Variants Section */}
            <div className="border-t pt-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Variants & Add-ons</h3>
                <button type="button" onClick={addVariantGroup} className="flex items-center gap-1 text-sm font-medium text-[#30442B] hover:text-[#22301e]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Variant Group
                </button>
              </div>

              {formData.variant_groups.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-500">No variants added yet</p>
              ) : (
                <div className="space-y-4">
                  {formData.variant_groups.map((group, groupIndex) => (
                    <div key={groupIndex} className="rounded-xl bg-gray-50 p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="grid flex-1 grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={group.name}
                            onChange={(e) => updateVariantGroup(groupIndex, "name", e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            placeholder="Group name (e.g., Size, Add-ons)"
                          />
                          <select
                            value={group.selection_type}
                            onChange={(e) => updateVariantGroup(groupIndex, "selection_type", e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          >
                            <option value="single">Single selection</option>
                            <option value="multiple">Multiple selection</option>
                          </select>
                        </div>
                        <button type="button" onClick={() => removeVariantGroup(groupIndex)} className="ml-2 text-red-500 hover:text-red-700">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="mb-3 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={group.is_required}
                          onChange={(e) => updateVariantGroup(groupIndex, "is_required", e.target.checked)}
                          className="h-4 w-4 rounded text-[#30442B]"
                        />
                        <label className="text-sm text-gray-600">Required</label>
                      </div>

                      <div className="space-y-2">
                        {group.variants?.map((variant, variantIndex) => (
                          <div key={variantIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={variant.name}
                              onChange={(e) => updateVariant(groupIndex, variantIndex, "name", e.target.value)}
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                              placeholder="Variant name"
                            />
                            <input
                              type="text"
                              inputMode="decimal"
                              value={variant.price_delta}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                                  updateVariant(groupIndex, variantIndex, "price_delta", value === "" ? 0 : value);
                                }
                              }}
                              onBlur={(e) => {
                                const parsed = parseFloat(e.target.value) || 0;
                                updateVariant(groupIndex, variantIndex, "price_delta", parsed);
                              }}
                              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                              placeholder="+₱0"
                            />
                            <button type="button" onClick={() => removeVariant(groupIndex, variantIndex)} className="px-2 text-red-500 hover:text-red-700">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => addVariant(groupIndex)} className="text-sm text-[#30442B] hover:text-[#22301e]">
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
          <div className="mt-5 flex flex-col-reverse justify-end gap-2 border-t pt-4 sm:mt-6 sm:flex-row sm:gap-3">
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 sm:px-6 sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#30442B] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#22301e] disabled:opacity-50 sm:px-6 sm:text-base"
            >
              {isSubmitting && <ButtonSpinner />}
              {uploadingImage ? "Uploading Image..." : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </div>
      </div>

      {/* Stock History Modal */}
      {showStockHistory && isEdit && product && <StockHistoryModal isOpen={showStockHistory} onClose={() => setShowStockHistory(false)} product={product} />}

      {/* Initial Stock Prompt Modal */}
      {showInitialStockPrompt && <InitialStockPrompt onConfirm={handleInitialStockConfirm} onCancel={handleInitialStockCancel} />}
    </div>
  );
}

// Initial Stock Prompt Modal Component
function InitialStockPrompt({ onConfirm, onCancel }) {
  const [stockQuantity, setStockQuantity] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    const quantity = parseInt(stockQuantity);

    if (!stockQuantity || stockQuantity === "") {
      setError("Please enter a starting stock quantity");
      return;
    }

    if (isNaN(quantity) || quantity < 0) {
      setError("Please enter a valid quantity (0 or greater)");
      return;
    }

    onConfirm(quantity);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-60 flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Set Initial Stock Quantity</h3>
          <p className="mt-2 text-sm text-gray-600">You're enabling inventory tracking. Please enter the current stock quantity for this product.</p>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Starting Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={stockQuantity}
            onChange={(e) => {
              setStockQuantity(e.target.value);
              setError("");
            }}
            onKeyPress={handleKeyPress}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#30442B] focus:ring-[#30442B]"
            placeholder="Enter current stock (e.g., 50)"
            autoFocus
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          <p className="mt-1 text-xs text-gray-500">Enter the number of items currently in stock. You can adjust this later.</p>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleConfirm} className="flex-1 rounded-lg bg-[#30442B] px-4 py-2 text-sm font-medium text-white hover:bg-[#22301e]">
            Enable Tracking
          </button>
        </div>
      </div>
    </div>
  );
}
