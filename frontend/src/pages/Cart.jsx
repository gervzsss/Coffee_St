import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCustomizationModal from '../components/ProductCustomizationModal';
import api from '../services/apiClient';
import { getResponsiveImageUrl } from '../services/cloudinaryService';
import { useAuth } from '../hooks/useAuth';
import coffeeBeansImg from '../assets/coffeebeans.png';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const { isAuthenticated, openAuthModal } = useAuth();
  
  const debouncedUpdateRefs = useRef({});

  const TAX_RATE = 0.12; // 12% tax

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

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

  // Helper to calculate line total optimistically
  const calculateLineTotal = useCallback((item, quantity) => {
    const variantsDelta = item.selected_variants
      ? item.selected_variants.reduce((sum, v) => sum + parseFloat(v.price_delta || 0), 0)
      : 0;
    return (item.unit_price + item.price_delta + variantsDelta) * quantity;
  }, []);

  // Debounced API call function
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
          // Revert optimistic update on error
          fetchCartItems();
        } finally {
          setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
        }
      }, 300);
    }
    debouncedUpdateRefs.current[itemId](quantity);
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity < 1) return;
    
    // Optimistic update - update UI immediately
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newLineTotal = calculateLineTotal(item, quantity);
          return { ...item, quantity, line_total: newLineTotal };
        }
        return item;
      })
    );
    
    // Mark item as loading
    setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
    
    // Debounced API call
    debouncedApiUpdate(itemId, quantity);
  }, [calculateLineTotal, debouncedApiUpdate]);

  // Cleanup debounced functions on unmount
  useEffect(() => {
    return () => {
      Object.values(debouncedUpdateRefs.current).forEach((debouncedFn) => {
        if (debouncedFn && debouncedFn.cancel) {
          debouncedFn.cancel();
        }
      });
    };
  }, []);

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError('Failed to remove item');
    }
  };

  const removeSelectedItems = async () => {
    const itemsToRemove = Array.from(selectedItems);
    try {
      await Promise.all(itemsToRemove.map((id) => api.delete(`/cart/${id}`)));
      setCartItems((prev) =>
        prev.filter((item) => !selectedItems.has(item.id))
      );
      setSelectedItems(new Set());
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Failed to remove selected items:', err);
      setError('Failed to remove selected items');
    }
  };

  const handleEditItem = async (item) => {
    if (!item.selected_variants || item.selected_variants.length === 0) {
      return; // Don't show edit for items without variants
    }

    setEditingItemId(item.id);
    try {
      // Fetch full product details to get variant groups
      const response = await api.get(`/products/${item.product_id}`);
      setEditingProduct(response.data);
      setEditingItem(item);
    } catch (err) {
      console.error('Failed to fetch product details:', err);
      setError('Failed to load product details');
      setEditingItemId(null);
    }
  };

  const handleEditSave = async (cartData) => {
    if (!editingItem) return;

    try {
      // Delete old cart item
      await api.delete(`/cart/${editingItem.id}`);
      
      // Remove from selected items if it was selected
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(editingItem.id);
        return newSet;
      });

      // Create new cart item with updated configuration
      await api.post('/cart', cartData);

      // Close modal and refresh cart
      setEditingItem(null);
      setEditingProduct(null);
      setEditingItemId(null);
      await fetchCartItems();
    } catch (err) {
      console.error('Failed to update cart item:', err);
      setError('Failed to update item');
      setEditingItemId(null);
    }
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setEditingProduct(null);
    setEditingItemId(null);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    }
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const calculateSelectedSubtotal = () => {
    return cartItems
      .filter((item) => selectedItems.has(item.id))
      .reduce((total, item) => total + (item.line_total || 0), 0);
  };

  const calculateTax = () => {
    return calculateSelectedSubtotal() * TAX_RATE;
  };

  const calculateTotal = () => {
    return calculateSelectedSubtotal() + calculateTax();
  };

  const getProductImage = (imageUrl) => {
    if (!imageUrl) return coffeeBeansImg;
    return getResponsiveImageUrl(imageUrl, 160);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-32 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-500">Loading cart...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Empty Cart or Guest User
  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-32 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-[#30442B]">
              Your Cart
            </h1>
            <div className="mt-8">
              <div className="rounded-lg border bg-white p-12 shadow-sm text-center">
                <svg
                  className="w-24 h-24 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Please log in to view your cart
                </h2>
                <p className="text-gray-600 mb-6">
                  You need to be logged in to add items and view your cart.
                </p>
                <button
                  onClick={() => openAuthModal('login')}
                  className="bg-[#30442B] text-white px-6 py-3 cursor-pointer rounded-lg hover:bg-[#405939] transition-colors"
                >
                  Login or Sign Up
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-32 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-[#30442B]">
              Your Cart
            </h1>
            <div className="mt-8">
              <div className="rounded-lg border bg-white p-12 shadow-sm text-center">
                <svg
                  className="w-24 h-24 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-gray-600 mb-6">
                  Start shopping to add items to your cart!
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center px-6 py-3 bg-[#30442B] text-white rounded-lg hover:bg-[#405939] transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-32 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#30442B] mb-8">
            Your Cart
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
            {/* Items Column */}
            <section className="lg:col-span-2 space-y-4">
              {/* Select All & Remove Selected */}
              <div className="rounded-lg border bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-neutral-700">
                <div className="flex flex-col gap-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-[#30442B] font-medium">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.size === cartItems.length &&
                        cartItems.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-neutral-300 text-[#30442B] focus:ring-[#30442B] cursor-pointer"
                    />
                    <span>Select All Items ({cartItems.length})</span>
                  </label>
                  <p className="text-xs text-neutral-500">
                    {cartItems.length} items in your cart
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeSelectedItems}
                  disabled={selectedItems.size === 0}
                  className={`inline-flex items-center gap-2 rounded border border-red-500 px-3 py-1.5 text-sm font-medium text-red-600 ${
                    selectedItems.size === 0
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:bg-red-50 cursor-pointer'
                  }`}
                >
                  <span aria-hidden="true">🗑</span>
                  <span>Remove Selected</span>
                </button>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  const isEditing = editingItemId === item.id;
                  const hasVariants = item.selected_variants && item.selected_variants.length > 0;
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleSelectItem(item.id)}
                      className={`rounded-lg border bg-white p-4 shadow-sm cursor-pointer transition-all duration-200 hover:bg-neutral-50 ${
                        isSelected ? 'ring-2 ring-[#30442B]/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <label 
                          className="flex h-5 w-5 items-center justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectItem(item.id)}
                            className="h-4 w-4 rounded border-neutral-300 cursor-pointer text-[#30442B] focus:ring-[#30442B]"
                          />
                        </label>
                        <img
                          src={getProductImage(item.image_url)}
                          alt={item.name}
                          className="h-20 w-20 rounded object-cover"
                          onError={(e) => {
                            e.target.src = coffeeBeansImg;
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-lg text-[#30442B]">
                                {item.name}
                              </h3>
                              {/* New customization summary */}
                              {item.customization_summary && (
                                <p className="text-sm text-neutral-600 mt-1">
                                  {item.customization_summary}
                                </p>
                              )}
                              {/* Legacy variant name fallback */}
                              {!item.customization_summary &&
                                item.variant_name && (
                                  <p className="text-sm text-neutral-600 mt-1">
                                    {item.variant_name}
                                  </p>
                                )}
                              {/* Show selected variants as pills */}
                              {hasVariants && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.selected_variants.map(
                                    (variant, idx) => (
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
                                    )
                                  )}
                                </div>
                              )}
                              <p className="text-sm text-neutral-500 mt-2">
                                ₱{item.unit_price.toFixed(2)} each
                                {item.price_delta !== 0 && (
                                  <span className="ml-1 text-neutral-400">
                                    ({item.price_delta > 0 ? '+' : ''}₱
                                    {item.price_delta.toFixed(2)})
                                  </span>
                                )}
                              </p>
                            </div>
                            <span className="text-lg font-semibold text-[#30442B]">
                              ₱{(item.line_total || 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <div 
                              className="flex items-center gap-2 relative"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 rounded-full border border-neutral-200 flex items-center justify-center cursor-pointer text-lg leading-none text-[#30442B] hover:border-[#30442B] transition-opacity"
                              >
                                -
                              </button>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={item.quantity}
                                  readOnly
                                  className="w-14 text-center border border-neutral-200 rounded-lg text-neutral-700"
                                  min="1"
                                />
                                {loadingItems[item.id] && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                                    <div className="w-4 h-4 border-2 border-[#30442B] border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="h-8 w-8 rounded-full border border-neutral-200 flex items-center justify-center cursor-pointer text-lg leading-none text-[#30442B] hover:border-[#30442B] transition-opacity"
                              >
                                +
                              </button>
                            </div>
                            {hasVariants && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditItem(item);
                                }}
                                disabled={isEditing}
                                className={`text-sm flex items-center gap-1 ${
                                  isEditing
                                    ? 'text-neutral-400 cursor-not-allowed'
                                    : 'text-[#30442B] hover:text-[#405939] cursor-pointer'
                                }`}
                              >
                                {isEditing ? (
                                  <>
                                    <span className="inline-block w-4 h-4 border-2 border-[#30442B] border-t-transparent rounded-full animate-spin"></span>
                                    Loading...
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
                                removeItem(item.id);
                              }}
                              className="text-sm cursor-pointer text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                              <span aria-hidden="true">🗑</span>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping */}
              <div className="flex items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center px-5 py-2.5 border border-[#30442B] text-[#30442B] rounded-full font-medium hover:text-white hover:bg-[#30442B] transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </section>

            {/* Summary Column */}
            <aside className="lg:col-span-1">
              <div className="rounded-lg border bg-white p-6 shadow-sm sticky top-28 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#30442B]">
                    Order Summary
                  </h2>
                  <p className="text-sm text-neutral-500">
                    {selectedItems.size === 0
                      ? 'No items selected.'
                      : `${selectedItems.size} item${
                          selectedItems.size > 1 ? 's' : ''
                        } selected.`}
                  </p>
                </div>
                <dl className="space-y-2 text-sm text-neutral-700">
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <dt>Subtotal</dt>
                    <dd>₱{calculateSelectedSubtotal().toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <dt>Tax ({(TAX_RATE * 100).toFixed(0)}%)</dt>
                    <dd>₱{calculateTax().toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold text-[#30442B] pt-2">
                    <dt>Total</dt>
                    <dd>₱{calculateTotal().toFixed(2)}</dd>
                  </div>
                </dl>
                <button
                  disabled={selectedItems.size === 0}
                  className={`w-full py-3 rounded-lg transition-colors ${
                    selectedItems.size === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#30442B] cursor-pointer text-white hover:bg-[#405939]'
                  }`}
                >
                  Proceed to Checkout
                </button>
                <p className="text-xs text-neutral-500">
                  Estimated delivery: 25-35 minutes
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Edit Modal */}
      {editingItem && editingProduct && (
        <ProductCustomizationModal
          isOpen={true}
          onClose={closeEditModal}
          product={editingProduct}
          onAddToCart={handleEditSave}
          initialQuantity={editingItem.quantity}
          initialVariants={editingItem.selected_variants}
        />
      )}
    </>
  );
}
