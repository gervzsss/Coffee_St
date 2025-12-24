import { createContext, useState, useEffect, useCallback } from "react";
import * as cartService from "../services/cartService";
import { useAuth } from "../hooks/useAuth";

export const CartContext = createContext(null);

const CART_COUNT_KEY = "cart_count";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_COUNT_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const updateCartCount = useCallback((count) => {
    setCartCount(count);
    try {
      localStorage.setItem(CART_COUNT_KEY, count.toString());
    } catch (err) {
      console.error("Failed to persist cart count:", err);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      updateCartCount(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await cartService.getCart();
      if (result.success) {
        const items = result.data;
        setCartItems(items);
        updateCartCount(items.reduce((total, item) => total + item.quantity, 0));
      } else {
        setError(result.error);
        setCartItems([]);
        updateCartCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Failed to load cart");
      setCartItems([]);
      updateCartCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, updateCartCount]);

  const fetchCartCount = useCallback(async () => {
    if (!isAuthenticated) {
      updateCartCount(0);
      return;
    }

    const result = await cartService.getCartCount();
    if (result.success) {
      updateCartCount(result.data);
    }
  }, [isAuthenticated, updateCartCount]);

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

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    try {
      setError(null);
      const result = await cartService.updateCartItem(itemId, quantity);

      if (result.success) {
        setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)));

        const oldItem = cartItems.find((item) => item.id === itemId);
        const newCount = cartCount - (oldItem?.quantity || 0) + quantity;
        updateCartCount(newCount);

        return { success: true };
      } else {
        setError(result.error);
        await fetchCart();
        return result;
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setError("Failed to update quantity");
      await fetchCart();
      return { success: false, error: "Failed to update quantity" };
    }
  };

  const removeItem = async (itemId) => {
    try {
      setError(null);
      const result = await cartService.removeCartItem(itemId);

      if (result.success) {
        const removedItem = cartItems.find((item) => item.id === itemId);
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        updateCartCount(cartCount - (removedItem?.quantity || 0));

        return { success: true };
      } else {
        setError(result.error);
        await fetchCart();
        return result;
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
      setError("Failed to remove item");
      await fetchCart();
      return { success: false, error: "Failed to remove item" };
    }
  };

  const clearCart = async () => {
    setError(null);
    const result = await cartService.clearCart();
    if (result.success) {
      setCartItems([]);
      updateCartCount(0);
    } else {
      setError(result.error);
    }
    return result;
  };

  const getCartTotals = () => {
    return cartService.calculateCartTotals(cartItems);
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [fetchCart]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CART_COUNT_KEY && e.newValue !== null) {
        const newCount = parseInt(e.newValue, 10);
        if (!isNaN(newCount) && newCount !== cartCount) {
          setCartCount(newCount);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [cartCount]);

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
