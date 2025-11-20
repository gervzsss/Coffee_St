import { useState } from 'react';
import { getResponsiveImageUrl } from '../api/cloudinary';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axiosInstance from '../api/axios';

export default function ProductCard({ product }) {
  const { user, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);

  const hasVariants =
    product.active_variants && product.active_variants.length > 0;

  const handleAddToCart = async (variantId = null) => {
    if (!user) {
      showToast('Please log in to add items to cart', {
        type: 'warning',
        dismissible: true,
      });
      openAuthModal('login');
      return;
    }

    setIsAdding(true);
    try {
      const payload = {
        product_id: product.id,
        quantity: 1,
      };

      if (variantId) {
        payload.variant_id = variantId;
      }

      await axiosInstance.post('/cart', payload);

      setAddedToCart(true);
      setShowVariantModal(false);
      setSelectedVariant(null);

      // Dispatch cart update event
      window.dispatchEvent(new Event('cartUpdated'));

      showToast(`${product.name} added to cart!`, {
        type: 'success',
        dismissible: true,
      });

      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to add to cart';
      showToast(errorMessage, {
        type: 'error',
        dismissible: true,
        duration: 4000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToCartClick = () => {
    if (hasVariants) {
      setShowVariantModal(true);
    } else {
      handleAddToCart();
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const handleConfirmVariant = () => {
    if (selectedVariant) {
      handleAddToCart(selectedVariant.id);
    }
  };

  const calculatePrice = (variant = null) => {
    const basePrice = parseFloat(product.price);
    const delta = variant ? parseFloat(variant.price_delta) : 0;
    return basePrice + delta;
  };

  // Get optimized image URL
  const imageUrl = product.image_url
    ? getResponsiveImageUrl(product.image_url, 800)
    : '/assets/americano.png'; // Fallback image

  return (
    <>
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
        {/* Product Image with dark background */}
        <div className="relative h-72 overflow-hidden bg-[#30442B]">
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-48 w-auto transform drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                e.target.src = '/assets/americano.png';
              }}
            />
          </div>
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-linear-to-r from-[#30442B]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

          {/* Added to cart overlay */}
          {addedToCart && (
            <div className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center">
              <div className="text-white text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="font-semibold">Added to Cart!</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col bg-white p-6">
          <div className="mb-2">
            <h3 className="font-playfair text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-[#30442B]">
              {product.name}
            </h3>
          </div>

          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
            {product.description}
          </p>

          {/* Price and Add to Cart */}
          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-[#30442B]">
              {hasVariants ? (
                <span className="text-base">
                  From ₱{parseFloat(product.price).toFixed(2)}
                </span>
              ) : (
                `₱${parseFloat(product.price).toFixed(2)}`
              )}
            </span>

            <button
              onClick={handleAddToCartClick}
              disabled={isAdding || addedToCart}
              className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-all duration-150 active:scale-95 ${
                addedToCart
                  ? 'bg-green-500 cursor-default'
                  : isAdding
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#30442B] hover:bg-[#405939]'
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {addedToCart ? '✓ Added' : isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Variant Selection Modal */}
      {showVariantModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowVariantModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-[#30442B]">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Select a variant</p>
              </div>
              <button
                onClick={() => setShowVariantModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
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
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-2 mb-6">
              {product.active_variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantSelect(variant)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    selectedVariant?.id === variant.id
                      ? 'border-[#30442B] bg-[#30442B]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {variant.group_name}: {variant.name}
                      </p>
                      {variant.price_delta !== 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {variant.price_delta > 0 ? '+' : ''}₱
                          {variant.price_delta.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <span className="text-lg font-bold text-[#30442B]">
                      ₱{calculatePrice(variant).toFixed(2)}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowVariantModal(false)}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVariant}
                disabled={!selectedVariant || isAdding}
                className={`flex-1 px-4 py-3 rounded-lg font-medium text-white transition ${
                  !selectedVariant || isAdding
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#30442B] hover:bg-[#405939] cursor-pointer'
                }`}
              >
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
