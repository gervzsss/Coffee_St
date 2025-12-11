import { getResponsiveImageUrl } from "../../services/cloudinaryService";
import coffeeBeansImg from "../../../assets/coffeebeans.png";

export default function CartItem({ item, isSelected, isEditing, isLoading, onToggleSelect, onUpdateQuantity, onEdit, onRemove }) {
  const hasVariants = item.selected_variants && item.selected_variants.length > 0;

  const getProductImage = (imageUrl) => {
    if (!imageUrl) return coffeeBeansImg;
    return getResponsiveImageUrl(imageUrl, 160);
  };

  return (
    <div
      onClick={() => onToggleSelect(item.id)}
      className={`cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-all duration-200 hover:bg-neutral-50 sm:p-4 ${isSelected ? "ring-2 ring-[#30442B]/30" : ""}`}
    >
      <div className="flex items-start gap-3 sm:items-center sm:gap-4">
        <label className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center sm:mt-0" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(item.id)} className="h-4 w-4 cursor-pointer rounded border-neutral-300 text-[#30442B] focus:ring-[#30442B]" />
        </label>
        <img
          src={getProductImage(item.image_url)}
          alt={item.name}
          className="h-16 w-16 shrink-0 rounded object-cover sm:h-20 sm:w-20"
          onError={(e) => {
            e.target.src = coffeeBeansImg;
          }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:flex-wrap sm:items-start sm:gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-[#30442B] sm:text-lg">{item.name}</h3>
              {/* Customization summary */}
              {item.customization_summary && <p className="mt-1 text-sm text-neutral-600">{item.customization_summary}</p>}
              {/* Legacy variant name fallback */}
              {!item.customization_summary && item.variant_name && <p className="mt-1 text-sm text-neutral-600">{item.variant_name}</p>}
              {/* Show selected variants as pills */}
              {hasVariants && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.selected_variants.map((variant, idx) => (
                    <span key={idx} className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                      {variant.name}
                      {variant.price_delta > 0 && <span className="ml-1 font-medium">+₱{parseFloat(variant.price_delta).toFixed(2)}</span>}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-1.5 text-xs text-neutral-500 sm:mt-2 sm:text-sm">
                ₱{item.unit_price.toFixed(2)} each
                {item.price_delta !== 0 && (
                  <span className="ml-1 text-neutral-400">
                    ({item.price_delta > 0 ? "+" : ""}₱{item.price_delta.toFixed(2)})
                  </span>
                )}
              </p>
            </div>
            <span className="text-base font-semibold text-[#30442B] sm:text-lg">₱{(item.line_total || 0).toFixed(2)}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3">
            <div className="relative flex items-center gap-1.5 sm:gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-neutral-200 text-base leading-none text-[#30442B] transition-opacity hover:border-[#30442B] disabled:cursor-not-allowed disabled:opacity-50 sm:h-8 sm:w-8 sm:text-lg"
              >
                -
              </button>
              <div className="relative">
                <input type="number" value={item.quantity} readOnly className="w-10 rounded-lg border border-neutral-200 text-center text-sm text-neutral-700 sm:w-14 sm:text-base" min="1" />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#30442B] border-t-transparent sm:h-4 sm:w-4"></div>
                  </div>
                )}
              </div>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-neutral-200 text-base leading-none text-[#30442B] transition-opacity hover:border-[#30442B] sm:h-8 sm:w-8 sm:text-lg"
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
                className={`flex items-center gap-1 text-xs sm:text-sm ${isEditing ? "cursor-not-allowed text-neutral-400" : "cursor-pointer text-[#30442B] hover:text-[#405939]"}`}
              >
                {isEditing ? (
                  <>
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[#30442B] border-t-transparent sm:h-4 sm:w-4"></span>
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
              className="flex cursor-pointer items-center gap-1 text-xs text-red-600 hover:text-red-700 sm:text-sm"
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
