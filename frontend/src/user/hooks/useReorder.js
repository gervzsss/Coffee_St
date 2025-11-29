import { useState } from 'react';
import { useToast } from './useToast';
import { TOAST_DURATION } from '../constants/toastConfig';
import api from '../services/apiClient';

export function useReorder() {
  const [reordering, setReordering] = useState(false);
  const { showToast } = useToast();

  const reorderItems = async (orderItems) => {
    setReordering(true);

    try {
      const unavailableItems = [];
      const addedItems = [];

      for (const item of orderItems) {
        try {
          const productResponse = await api.get(`/products/${item.product_id}`);
          const product = productResponse.data;

          if (!product) {
            unavailableItems.push(item.product_name);
            continue;
          }

          const cartData = {
            product_id: item.product_id,
            quantity: item.quantity,
          };

          // Check if item has selected_variants (new multi-variant system)
          if (item.selected_variants && item.selected_variants.length > 0) {
            // Validate that all variants still exist and are active
            const validVariants = [];
            let hasInvalidVariant = false;

            for (const selectedVariant of item.selected_variants) {
              // Find the variant in the product's active variant groups
              let variantFound = false;
              for (const group of product.active_variant_groups || []) {
                const matchingVariant = (group.active_variants || []).find(
                  (v) => v.id === selectedVariant.variant_id
                );
                if (matchingVariant) {
                  validVariants.push({
                    id: matchingVariant.id,
                    group_name: selectedVariant.variant_group_name,
                    name: matchingVariant.name,
                    price_delta: matchingVariant.price_delta,
                  });
                  variantFound = true;
                  break;
                }
              }
              if (!variantFound) {
                hasInvalidVariant = true;
              }
            }

            if (hasInvalidVariant && validVariants.length === 0) {
              // All variants are no longer available
              unavailableItems.push(`${item.product_name} (customizations no longer available)`);
              continue;
            }

            if (validVariants.length > 0) {
              cartData.variants = validVariants;
            }
          } else if (item.variant_id) {
            // Legacy single variant support
            const variant = product.active_variants?.find((v) => v.id === item.variant_id);
            if (variant) {
              cartData.variant_id = item.variant_id;
            } else {
              unavailableItems.push(`${item.product_name} (${item.variant_name})`);
              continue;
            }
          }

          await api.post('/cart', cartData);
          addedItems.push(item.product_name);
        } catch (err) {
          console.error(`Error adding ${item.product_name} to cart:`, err);
          // Check if product is archived
          if (err.response?.data?.archived) {
            unavailableItems.push(`${item.product_name} (no longer on menu)`);
          } else {
            unavailableItems.push(item.product_name);
          }
        }
      }

      if (addedItems.length > 0) {
        showToast(
          `${addedItems.length} item${addedItems.length > 1 ? 's' : ''} added to cart!`,
          { type: 'success', dismissible: true, duration: TOAST_DURATION.ERROR }
        );
      }

      if (unavailableItems.length > 0) {
        showToast(
          `${unavailableItems.length} item${unavailableItems.length > 1 ? 's are' : ' is'
          } no longer available`,
          { type: 'error', dismissible: true, duration: TOAST_DURATION.LONG }
        );
      }

      return {
        success: addedItems.length > 0,
        addedCount: addedItems.length,
        unavailableCount: unavailableItems.length,
      };
    } catch (error) {
      console.error('Error during reorder:', error);
      showToast('Failed to reorder items. Please try again.', {
        type: 'error',
        dismissible: true,
      });
      return {
        success: false,
        addedCount: 0,
        unavailableCount: orderItems.length,
      };
    } finally {
      setReordering(false);
    }
  };

  return {
    reorderItems,
    reordering,
  };
}
