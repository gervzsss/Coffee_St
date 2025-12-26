import { useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { useToast } from './useToast';
import api from '../services/apiClient';

export function useCartOperations(isAuthenticated) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const debouncedUpdateRefs = useRef({});
  const { showToast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const refs = debouncedUpdateRefs.current;
    return () => {
      Object.values(refs).forEach((debouncedFn) => {
        if (debouncedFn && debouncedFn.cancel) {
          debouncedFn.cancel();
        }
      });
    };
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCartItems(response.data.items || []);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart items');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateLineTotal = useCallback((item, quantity) => {
    const variantsDelta = item.selected_variants
      ? item.selected_variants.reduce((sum, v) => sum + parseFloat(v.price_delta || 0), 0)
      : 0;
    return (item.unit_price + item.price_delta + variantsDelta) * quantity;
  }, []);

  const debouncedApiUpdate = useCallback((itemId, quantity) => {
    if (!debouncedUpdateRefs.current[itemId]) {
      debouncedUpdateRefs.current[itemId] = debounce(async (qty) => {
        try {
          const response = await api.put(`/cart/${itemId}`, { quantity: qty });
          setCartItems((prev) =>
            prev.map((item) => (item.id === itemId ? { ...item, ...response.data.item } : item))
          );
          window.dispatchEvent(new Event('cartUpdated'));
          setError(null);
        } catch (err) {
          console.error('Failed to update quantity:', err);
          setError('Failed to update quantity');
          showToast('Failed to update quantity', {
            type: 'error',
            dismissible: true,
          });
          fetchCartItems();
        } finally {
          setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
        }
      }, 300);
    }
    debouncedUpdateRefs.current[itemId](quantity);
  }, [showToast]);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newLineTotal = calculateLineTotal(item, quantity);
          return { ...item, quantity, line_total: newLineTotal };
        }
        return item;
      })
    );

    setLoadingItems((prev) => ({ ...prev, [itemId]: true }));

    debouncedApiUpdate(itemId, quantity);
  }, [calculateLineTotal, debouncedApiUpdate]);

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError('Failed to remove item');
      showToast('Failed to remove item', {
        type: 'error',
        dismissible: true,
      });
    }
  };

  const removeItems = async (itemIds) => {
    try {
      await Promise.all(itemIds.map((id) => api.delete(`/cart/${id}`)));
      setCartItems((prev) => prev.filter((item) => !itemIds.includes(item.id)));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Failed to remove items:', err);
      setError('Failed to remove items');
      showToast('Failed to remove items', {
        type: 'error',
        dismissible: true,
      });
    }
  };

  const updateCartItem = async (itemId, cartData) => {
    try {
      await api.delete(`/cart/${itemId}`);

      await api.post('/cart', cartData);

      await fetchCartItems();
    } catch (err) {
      console.error('Failed to update cart item:', err);
      setError('Failed to update item');
      showToast('Failed to update item', {
        type: 'error',
        dismissible: true,
      });
      throw err;
    }
  };

  const validateCart = async () => {
    try {
      const response = await api.get('/cart/validate');
      return response.data;
    } catch (err) {
      console.error('Failed to validate cart:', err);
      showToast('Failed to validate cart', {
        type: 'error',
        dismissible: true,
      });
      return { valid: false, has_errors: true, items: [] };
    }
  };

  return {
    cartItems,
    loading,
    error,
    loadingItems,
    setError,
    fetchCartItems,
    updateQuantity,
    removeItem,
    removeItems,
    updateCartItem,
    validateCart,
  };
}
