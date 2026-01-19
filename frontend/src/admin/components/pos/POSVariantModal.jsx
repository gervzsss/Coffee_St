import { useState, useEffect } from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import { LoadingSpinner, ButtonSpinner } from "../common";

export default function POSVariantModal({ isOpen, onClose, product, variantGroups, isLoading, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      // Initialize with default variants
      const defaults = {};
      variantGroups.forEach((group) => {
        const defaultVariant = group.variants.find((v) => v.is_default);
        if (defaultVariant) {
          defaults[group.id] = {
            variant_id: defaultVariant.id,
            group_name: group.name,
            variant_name: defaultVariant.name,
            price_delta: defaultVariant.price_delta,
          };
        } else if (group.is_required && group.variants.length > 0) {
          // Auto-select first variant if required
          defaults[group.id] = {
            variant_id: group.variants[0].id,
            group_name: group.name,
            variant_name: group.variants[0].name,
            price_delta: group.variants[0].price_delta,
          };
        }
      });
      setSelectedVariants(defaults);
    }
  }, [product, variantGroups]);

  if (!isOpen) return null;

  const handleVariantSelect = (group, variant) => {
    if (group.selection_type === "single") {
      setSelectedVariants((prev) => ({
        ...prev,
        [group.id]: {
          variant_id: variant.id,
          group_name: group.name,
          variant_name: variant.name,
          price_delta: variant.price_delta,
        },
      }));
    } else {
      // Multiple selection
      setSelectedVariants((prev) => {
        const groupSelections = prev[group.id] || [];
        const isSelected = Array.isArray(groupSelections) ? groupSelections.some((v) => v.variant_id === variant.id) : false;

        if (isSelected) {
          // Remove
          const filtered = groupSelections.filter((v) => v.variant_id !== variant.id);
          return { ...prev, [group.id]: filtered };
        } else {
          // Add
          const newSelection = {
            variant_id: variant.id,
            group_name: group.name,
            variant_name: variant.name,
            price_delta: variant.price_delta,
          };
          return {
            ...prev,
            [group.id]: Array.isArray(groupSelections) ? [...groupSelections, newSelection] : [newSelection],
          };
        }
      });
    }
  };

  const isVariantSelected = (groupId, variantId) => {
    const selection = selectedVariants[groupId];
    if (Array.isArray(selection)) {
      return selection.some((v) => v.variant_id === variantId);
    }
    return selection?.variant_id === variantId;
  };

  // Flatten selected variants for price calculation
  const flattenedVariants = Object.values(selectedVariants).flat().filter(Boolean);
  const variantPriceDelta = flattenedVariants.reduce((sum, v) => sum + (v?.price_delta || 0), 0);
  const itemPrice = (product?.price || 0) + variantPriceDelta;
  const totalPrice = itemPrice * quantity;

  // Check if all required groups have selections
  const allRequiredSelected = variantGroups
    .filter((g) => g.is_required)
    .every((g) => {
      const selection = selectedVariants[g.id];
      if (Array.isArray(selection)) return selection.length > 0;
      return !!selection;
    });

  const handleAddToCart = () => {
    if (!allRequiredSelected) return;
    onAddToCart(product, quantity, flattenedVariants);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{product?.name}</h2>
              <p className="mt-1 text-sm text-emerald-600">{formatCurrency(product?.price || 0)}</p>
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[50vh] overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : variantGroups.length === 0 ? (
            <p className="text-center text-gray-500">No customization options available</p>
          ) : (
            <div className="space-y-6">
              {variantGroups.map((group) => (
                <div key={group.id}>
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{group.name}</h3>
                    {group.is_required && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Required</span>}
                    {group.selection_type === "multiple" && <span className="text-xs text-gray-500">(Select multiple)</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantSelect(group, variant)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                          isVariantSelected(group.id, variant.id)
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {variant.name}
                        {variant.price_delta !== 0 && (
                          <span className={`ml-1 ${variant.price_delta > 0 ? "text-emerald-600" : "text-red-600"}`}>
                            {variant.price_delta > 0 ? "+" : ""}
                            {formatCurrency(variant.price_delta)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Quantity</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-gray-600">Total</span>
            <span className="text-2xl font-bold text-gray-900">{formatCurrency(totalPrice)}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!allRequiredSelected}
            className="w-full rounded-lg bg-emerald-600 py-3 text-base font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {allRequiredSelected ? "Add to Order" : "Select required options"}
          </button>
        </div>
      </div>
    </div>
  );
}
