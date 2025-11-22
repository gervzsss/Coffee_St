export default function CheckoutItem({ item }) {
  const getVariantsDisplay = () => {
    if (!item.selected_variants || item.selected_variants.length === 0) {
      return null;
    }

    return item.selected_variants
      .map((variant) => `${variant.name}: ${variant.option}`)
      .join(', ');
  };

  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white ring-1 ring-gray-100">
      {/* Product Image */}
      <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
        {item.product?.image_url ? (
          <img
            src={item.product.image_url}
            alt={item.product_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">
          {item.product_name}
        </h4>

        {getVariantsDisplay() && (
          <p className="text-sm text-gray-600 mt-1">{getVariantsDisplay()}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-500">
            <span>₱{item.unit_price.toFixed(2)}</span>
            {item.price_delta !== 0 && (
              <span className="ml-1 text-gray-400">
                ({item.price_delta > 0 ? '+' : ''}₱{item.price_delta.toFixed(2)}
                )
              </span>
            )}
            <span className="mx-2">×</span>
            <span>{item.quantity}</span>
          </div>

          <div className="font-semibold text-[#30442B]">
            ₱{(item.line_total || 0).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
