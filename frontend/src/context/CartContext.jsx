import { createContext, useState, useEffect, useCallback } from 'react';
import * as cartService from '../services/cartService';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch cart items
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await cartService.getCart();
      if (result.success) {
        const items = result.data;
        setCartItems(items);
        setCartCount(items.reduce((total, item) => total + item.quantity, 0));
      } else {
        setError(result.error);
        setCartItems([]);
        setCartCount(0);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart');
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch cart count
  const fetchCartCount = useCallback(async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }

    const result = await cartService.getCartCount();
    if (result.success) {
      setCartCount(result.data);
    }
  }, [isAuthenticated]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1, variantId = null) => {
    setError(null);
    const result = await cartService.addToCart(productId, quantity, variantId);
    if (result.success) {
      await fetchCart();
    } else {
      setError(result.error);
    }
    return result;
  };

  // Update cart item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    try {
      setError(null);
      const result = await cartService.updateCartItem(itemId, quantity);
      
      if (result.success) {
        // Optimistically update local state
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          )
        );
        
        // Recalculate count
        setCartCount((prev) => {
          const oldItem = cartItems.find(item => item.id === itemId);
          return prev - (oldItem?.quantity || 0) + quantity;
        });
        
        return { success: true };
      } else {
        setError(result.error);
        // Revert to server state
        await fetchCart();
        return result;
      }
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError('Failed to update quantity');
      await fetchCart();
      return { success: false, error: 'Failed to update quantity' };
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      setError(null);
      const result = await cartService.removeCartItem(itemId);
      
      if (result.success) {
        // Optimistically update local state
        const removedItem = cartItems.find(item => item.id === itemId);
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        setCartCount((prev) => prev - (removedItem?.quantity || 0));
        
        return { success: true };
      } else {
        setError(result.error);
        await fetchCart();
        return result;
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError('Failed to remove item');
      await fetchCart();
      return { success: false, error: 'Failed to remove item' };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    setError(null);
    const result = await cartService.clearCart();
    if (result.success) {
      setCartItems([]);
      setCartCount(0);
    } else {
      setError(result.error);
    }
    return result;
  };

  // Calculate cart totals
  const getCartTotals = () => {
    return cartService.calculateCartTotals(cartItems);
  };

  // Load cart on mount and auth change
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Listen for cart update events
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [fetchCart]);

  const value = {
    cartItems,
    cartCount,
    loading,
    error,
    fetchCart,
    fetchCartCount,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartTotals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
