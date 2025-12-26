import { getResponsiveImageUrl } from "../../services/cloudinaryService";
import { useProductCard } from "../../hooks";
import { ProductCustomizationModal } from "./";

export default function ProductCard({ product }) {
  const {
    isAdding,
    addedToCart,
    selectedVariant,
    showVariantModal,
    showCustomizationModal,
    hasVariants,
    calculatePrice,
    handleAddToCartClick,
    handleVariantSelect,
    handleConfirmVariant,
    closeVariantModal,
    closeCustomizationModal,
    handleAddToCartWithVariants,
  } = useProductCard(product);

  const imageUrl = product.image_url ? getResponsiveImageUrl(product.image_url, 800) : "/assets/americano.png"; // Fallback image

  const isUnavailable = product.is_available === false;
  const isSoldOut = product.is_sold_out === true;
  const isLowStock = product.is_low_stock === true;

  return (
    <>
      <div
        className={`group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg sm:rounded-2xl ${isUnavailable || isSoldOut ? "opacity-75" : ""}`}
      >
        {/* Product Image with dark background */}
        <div className="relative h-48 overflow-hidden bg-[#30442B] sm:h-56 md:h-64 lg:h-72">
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <img
              src={imageUrl}
              alt={product.name}
              className={`max-h-32 w-auto transform drop-shadow-xl transition-transform duration-500 sm:max-h-40 lg:max-h-48 ${isUnavailable || isSoldOut ? "grayscale" : "group-hover:scale-110"}`}
              loading="lazy"
              onError={(e) => {
                e.target.src = "/assets/americano.png";
              }}
            />
          </div>

          {/* Stock Badge - Top Right */}
          {isSoldOut && (
            <div className="absolute top-3 right-3 rounded-full bg-red-500 px-3 py-1.5 shadow-lg">
              <span className="text-xs font-bold text-white sm:text-sm">SOLD OUT</span>
            </div>
          )}
          {!isSoldOut && isLowStock && product.stock_quantity && (
            <div className="absolute top-3 right-3 rounded-full bg-orange-500 px-3 py-1.5 shadow-lg">
              <span className="text-xs font-bold text-white sm:text-sm">Only {product.stock_quantity} left!</span>
            </div>
          )}

          {/* Gradient overlay on hover */}
          {!isUnavailable && !isSoldOut && (
            <div className="absolute inset-0 bg-linear-to-r from-[#30442B]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          )}

          {/* Sold Out or Unavailable overlay */}
          {(isUnavailable || isSoldOut) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="px-4 text-center text-white">
                <svg className="mx-auto mb-2 h-8 w-8 opacity-80 sm:h-10 sm:w-10 lg:h-12 lg:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <p className="text-xs font-semibold sm:text-sm">{isSoldOut ? "Sold Out" : "Currently Unavailable"}</p>
              </div>
            </div>
          )}

          {/* Added to cart overlay */}
          {addedToCart && (
            <div className="bg-opacity-90 absolute inset-0 flex items-center justify-center bg-green-500">
              <div className="text-center text-white">
                <svg className="mx-auto mb-2 h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm font-semibold sm:text-base">Added to Cart!</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col bg-white p-4 sm:p-5 lg:p-6">
          <div className="mb-1.5 sm:mb-2">
            <h3 className="font-playfair line-clamp-1 text-base font-bold text-gray-800 transition-colors duration-300 group-hover:text-[#30442B] sm:text-lg lg:text-xl">{product.name}</h3>
          </div>

          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-600 sm:mb-4 sm:text-sm">{product.description}</p>

          {/* Unavailable Reason (if applicable) */}
          {isUnavailable && product.unavailable_reason && (
            <div className="mb-2 rounded-lg border border-amber-200 bg-amber-50 p-1.5 sm:mb-3 sm:p-2">
              <p className="text-xs text-amber-700">
                <span className="font-semibold">Note:</span> {product.unavailable_reason}
              </p>
            </div>
          )}

          {/* Price and Add to Cart */}
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <span className={`text-base font-bold sm:text-lg lg:text-xl ${isUnavailable ? "text-gray-400" : "text-[#30442B]"}`}>
              {hasVariants ? <span className="text-sm sm:text-base">From ₱{parseFloat(product.price).toFixed(2)}</span> : `₱${parseFloat(product.price).toFixed(2)}`}
            </span>

            <button
              onClick={handleAddToCartClick}
              disabled={isAdding || addedToCart || isUnavailable || isSoldOut}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white transition-all duration-150 active:scale-95 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${
                isUnavailable || isSoldOut
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : addedToCart
                    ? "cursor-default bg-green-500"
                    : isAdding
                      ? "cursor-not-allowed bg-gray-300 text-gray-500"
                      : "bg-[#30442B] hover:bg-[#405939]"
              }`}
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {isUnavailable ? (
                "Unavailable"
              ) : addedToCart ? (
                "✓ Added"
              ) : isAdding ? (
                "Adding..."
              ) : (
                <>
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Variant Selection Modal */}
      {showVariantModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4" onClick={closeVariantModal}>
          <div className="mx-2 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:mx-4 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Product Image Header */}
            <div className="relative h-36 shrink-0 bg-gray-100 sm:h-48">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <svg className="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <button onClick={closeVariantModal} className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-gray-600 shadow-md transition hover:bg-white hover:text-gray-800">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h3 className="text-lg font-bold text-[#30442B] sm:text-xl">{product.name}</h3>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">Select a variant</p>
              </div>

              <div className="mb-4 max-h-36 space-y-2 overflow-y-auto sm:mb-6 sm:max-h-48">
                {product.active_variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variant)}
                    className={`w-full rounded-lg border-2 p-3 text-left transition sm:p-4 ${
                      selectedVariant?.id === variant.id ? "border-[#30442B] bg-[#30442B]/5" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 sm:text-base">
                          {variant.group_name}: {variant.name}
                        </p>
                        {variant.price_delta !== 0 && (
                          <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">
                            {variant.price_delta > 0 ? "+" : ""}₱{variant.price_delta.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <span className="text-base font-bold text-[#30442B] sm:text-lg">₱{calculatePrice(variant).toFixed(2)}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={closeVariantModal}
                  className="flex-1 rounded-lg border-2 border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:px-4 sm:py-3 sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmVariant}
                  disabled={!selectedVariant || isAdding}
                  className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition sm:px-4 sm:py-3 sm:text-base ${
                    !selectedVariant || isAdding ? "cursor-not-allowed bg-gray-300" : "cursor-pointer bg-[#30442B] hover:bg-[#405939]"
                  }`}
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Customization Modal */}
      <ProductCustomizationModal isOpen={showCustomizationModal} onClose={closeCustomizationModal} product={product} onAddToCart={handleAddToCartWithVariants} />
    </>
  );
}
