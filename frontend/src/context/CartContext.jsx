import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

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
      const response = await api.get('/cart');
      const items = response.data.items || [];
      setCartItems(items);
      setCartCount(items.reduce((total, item) => total + item.quantity, 0));
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

    try {
      const response = await api.get('/cart/count');
      setCartCount(response.data.count || 0);
    } catch (err) {
      console.error('Failed to fetch cart count:', err);
    }
  }, [isAuthenticated]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1, variantId = null) => {
    try {
      setError(null);
      const payload = {
        product_id: productId,
        quantity,
      };
      
      if (variantId) {
        payload.variant_id = variantId;
      }

      await api.post('/cart', payload);
      await fetchCart();
      return { success: true };
    } catch (err) {
      console.error('Failed to add to cart:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add to cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update cart item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    try {
      setError(null);
      await api.put(`/cart/${itemId}`, { quantity });
      
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
    } catch (err) {
      console.error('Failed to update quantity:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update quantity';
      setError(errorMessage);
      // Revert to server state
      await fetchCart();
      return { success: false, error: errorMessage };
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      setError(null);
      await api.delete(`/cart/${itemId}`);
      
      // Optimistically update local state
      const removedItem = cartItems.find(item => item.id === itemId);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      setCartCount((prev) => prev - (removedItem?.quantity || 0));
      
      return { success: true };
    } catch (err) {
      console.error('Failed to remove item:', err);
      const errorMessage = err.response?.data?.message || 'Failed to remove item';
      setError(errorMessage);
      // Revert to server state
      await fetchCart();
      return { success: false, error: errorMessage };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setError(null);
      await api.delete('/cart');
      setCartItems([]);
      setCartCount(0);
      return { success: true };
    } catch (err) {
      console.error('Failed to clear cart:', err);
      const errorMessage = err.response?.data?.message || 'Failed to clear cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Calculate cart totals
  const getCartTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.line_total || 0), 0);
    const taxRate = 0.12; // 12% tax
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    return { subtotal, tax, total, taxRate };
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
