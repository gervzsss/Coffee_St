import { getResponsiveImageUrl } from '../../services/cloudinaryService';
import coffeeBeansImg from '../../../assets/coffeebeans.png';

export default function CartItem({
  item,
  isSelected,
  isEditing,
  isLoading,
  onToggleSelect,
  onUpdateQuantity,
  onEdit,
  onRemove,
}) {
  const hasVariants =
    item.selected_variants && item.selected_variants.length > 0;

  const getProductImage = (imageUrl) => {
    if (!imageUrl) return coffeeBeansImg;
    return getResponsiveImageUrl(imageUrl, 160);
  };

  return (
    <div
      onClick={() => onToggleSelect(item.id)}
      className={`rounded-lg border bg-white p-3 sm:p-4 shadow-sm cursor-pointer transition-all duration-200 hover:bg-neutral-50 ${
        isSelected ? 'ring-2 ring-[#30442B]/30' : ''
      }`}
    >
      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
        <label
          className="flex h-5 w-5 items-center justify-center shrink-0 mt-1 sm:mt-0"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(item.id)}
            className="h-4 w-4 rounded border-neutral-300 cursor-pointer text-[#30442B] focus:ring-[#30442B]"
          />
        </label>
        <img
          src={getProductImage(item.image_url)}
          alt={item.name}
          className="h-16 w-16 sm:h-20 sm:w-20 rounded object-cover shrink-0"
          onError={(e) => {
            e.target.src = coffeeBeansImg;
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-start justify-between gap-1 sm:gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-base sm:text-lg text-[#30442B] truncate">
                {item.name}
              </h3>
              {/* Customization summary */}
              {item.customization_summary && (
                <p className="text-sm text-neutral-600 mt-1">
                  {item.customization_summary}
                </p>
              )}
              {/* Legacy variant name fallback */}
              {!item.customization_summary && item.variant_name && (
                <p className="text-sm text-neutral-600 mt-1">
                  {item.variant_name}
                </p>
              )}
              {/* Show selected variants as pills */}
              {hasVariants && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.selected_variants.map((variant, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800"
                    >
                      {variant.name}
                      {variant.price_delta > 0 && (
                        <span className="ml-1 font-medium">
                          +₱{parseFloat(variant.price_delta).toFixed(2)}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 sm:mt-2">
                ₱{item.unit_price.toFixed(2)} each
                {item.price_delta !== 0 && (
                  <span className="ml-1 text-neutral-400">
                    ({item.price_delta > 0 ? '+' : ''}₱
                    {item.price_delta.toFixed(2)})
                  </span>
                )}
              </p>
            </div>
            <span className="text-base sm:text-lg font-semibold text-[#30442B]">
              ₱{(item.line_total || 0).toFixed(2)}
            </span>
          </div>
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <div
              className="flex items-center gap-1.5 sm:gap-2 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-neutral-200 flex items-center justify-center cursor-pointer text-base sm:text-lg leading-none text-[#30442B] hover:border-[#30442B] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <div className="relative">
                <input
                  type="number"
                  value={item.quantity}
                  readOnly
                  className="w-10 sm:w-14 text-center text-sm sm:text-base border border-neutral-200 rounded-lg text-neutral-700"
                  min="1"
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-[#30442B] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-neutral-200 flex items-center justify-center cursor-pointer text-base sm:text-lg leading-none text-[#30442B] hover:border-[#30442B] transition-opacity"
              >
                +
              </button>
            </div>
            {hasVariants && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                disabled={isEditing}
                className={`text-xs sm:text-sm flex items-center gap-1 ${
                  isEditing
                    ? 'text-neutral-400 cursor-not-allowed'
                    : 'text-[#30442B] hover:text-[#405939] cursor-pointer'
                }`}
              >
                {isEditing ? (
                  <>
                    <span className="inline-block w-3 h-3 sm:w-4 sm:h-4 border-2 border-[#30442B] border-t-transparent rounded-full animate-spin"></span>
                    <span className="hidden sm:inline">Loading...</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">✏️</span>
                    Edit
                  </>
                )}
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
              className="text-xs sm:text-sm cursor-pointer text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span aria-hidden="true">🗑</span>
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
