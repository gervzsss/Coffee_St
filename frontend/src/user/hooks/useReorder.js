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

          if (item.variant_id) {
            const variant = product.variants?.find((v) => v.id === item.variant_id);
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
          unavailableItems.push(item.product_name);
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
