import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';

const ProductCustomizationModal = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  initialQuantity = 1,
  initialVariants = [],
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(initialQuantity);

      if (initialVariants && initialVariants.length > 0) {
        const preSelected = {};

        initialVariants.forEach((variant) => {
          const group = product.active_variant_groups?.find(
            (g) => g.name === variant.group_name
          );

          if (group) {
            const matchingVariant = group.active_variants?.find(
              (v) => v.id === variant.id
            );

            if (matchingVariant) {
              if (!preSelected[group.id]) {
                preSelected[group.id] = [];
              }
              preSelected[group.id].push({
                id: matchingVariant.id,
                name: matchingVariant.name,
                group_name: group.name,
                price_delta: matchingVariant.price_delta,
              });
            }
          }
        });

        setSelectedVariants(preSelected);
      } else {
        setSelectedVariants({});
      }
    }
  }, [isOpen, initialQuantity]);

  if (!product) return null;

  const variantGroups = product.active_variant_groups || [];

  const calculateTotalPrice = () => {
    let total = product.price * quantity;

    Object.values(selectedVariants).forEach((variantArray) => {
      variantArray.forEach((variant) => {
        total += variant.price_delta * quantity;
      });
    });

    return total.toFixed(2);
  };

  const handleSingleSelect = (groupId, variant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [groupId]: [variant],
    }));
  };

  const handleMultiSelect = (groupId, variant) => {
    setSelectedVariants((prev) => {
      const currentSelections = prev[groupId] || [];
      const isSelected = currentSelections.some((v) => v.id === variant.id);

      if (isSelected) {
        return {
          ...prev,
          [groupId]: currentSelections.filter((v) => v.id !== variant.id),
        };
      } else {
        return {
          ...prev,
          [groupId]: [...currentSelections, variant],
        };
      }
    });
  };

  const isVariantSelected = (groupId, variantId) => {
    const groupSelections = selectedVariants[groupId] || [];
    return groupSelections.some((v) => v.id === variantId);
  };

  const validateSelections = () => {
    for (const group of variantGroups) {
      if (
        group.is_required &&
        (!selectedVariants[group.id] || selectedVariants[group.id].length === 0)
      ) {
        return false;
      }
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!validateSelections()) {
      alert('Please select all required options');
      return;
    }

    setIsSubmitting(true);

    try {
      const variantsArray = [];
      Object.values(selectedVariants).forEach((variantArray) => {
        variantArray.forEach((variant) => {
          variantsArray.push({
            id: variant.id,
            group_name: variant.group_name,
            name: variant.name,
            price_delta: variant.price_delta,
          });
        });
      });

      await onAddToCart({
        product_id: product.id,
        quantity,
        variants: variantsArray,
      });

      onClose();
      setQuantity(1);
      setSelectedVariants({});
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 px-4 py-10 sm:py-16 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white text-neutral-900 shadow-[0_30px_80px_-35px_rgba(15,68,43,0.45)] ring-1 ring-neutral-200/70 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scroll shadows */}
            <div className="shadow-top pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b from-white via-white/80 to-transparent opacity-0 transition-opacity duration-200 z-10"></div>
            <div className="shadow-bottom pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white via-white/80 to-transparent opacity-0 transition-opacity duration-200 z-10"></div>
            {/* Close Button */}
            <button
              onClick={onClose}
              type="button"
              className="cursor-pointer absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition duration-200 hover:bg-neutral-200 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#30442B]/50"
              aria-label="Close customization modal"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-10 sm:px-10 pb-6 border-b border-neutral-200">
              <div className="flex-1 pr-8">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {product.name}
                </h2>
                {product.description && (
                  <p className="mt-1 text-sm text-neutral-600">
                    {product.description}
                  </p>
                )}
                <p className="mt-2 text-xl font-semibold text-[#30442B]">
                  ₱{product.price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-10">
              {variantGroups.length === 0 ? (
                <p className="text-neutral-500 text-center py-8">
                  No customization options available for this product.
                </p>
              ) : (
                <div className="space-y-6">
                  {variantGroups.map((group) => (
                    <div key={group.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {group.name}
                          {group.is_required && (
                            <span className="ml-2 text-sm text-red-500">*</span>
                          )}
                        </h3>
                        {group.selection_type === 'single' && (
                          <span className="text-xs text-neutral-500">
                            Select one
                          </span>
                        )}
                        {group.selection_type === 'multiple' && (
                          <span className="text-xs text-neutral-500">
                            Select multiple
                          </span>
                        )}
                      </div>

                      {group.description && (
                        <p className="text-sm text-neutral-600">
                          {group.description}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        {group.active_variants?.map((variant) => {
                          const isSelected = isVariantSelected(
                            group.id,
                            variant.id
                          );
                          const isSingleSelect =
                            group.selection_type === 'single';

                          return (
                            <button
                              key={variant.id}
                              onClick={() =>
                                isSingleSelect
                                  ? handleSingleSelect(group.id, {
                                      id: variant.id,
                                      name: variant.name,
                                      group_name: group.name,
                                      price_delta: variant.price_delta,
                                    })
                                  : handleMultiSelect(group.id, {
                                      id: variant.id,
                                      name: variant.name,
                                      group_name: group.name,
                                      price_delta: variant.price_delta,
                                    })
                              }
                              className={`
                                relative px-4 py-3 rounded-lg border-2 text-left transition-all duration-200
                                ${
                                  isSelected
                                    ? 'border-[#30442B] bg-[#30442B]/5 text-[#30442B]'
                                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-[#30442B]/50'
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {variant.name}
                                </span>
                                {variant.price_delta > 0 && (
                                  <span className="text-sm text-neutral-600">
                                    +₱{variant.price_delta.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-[#30442B] rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-200 px-6 py-6 sm:px-10 bg-neutral-50">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-neutral-700">
                  Quantity
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-300 hover:bg-neutral-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total Price and Add Button */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Price</p>
                  <p className="text-2xl font-bold text-[#30442B]">
                    ₱{calculateTotalPrice()}
                  </p>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#30442B] cursor-pointer text-white rounded-lg font-semibold hover:bg-[#405939] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{isSubmitting ? 'Adding...' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductCustomizationModal;
