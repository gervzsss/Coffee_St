import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Header, Footer } from "../components/layout";
import { EmptyState } from "../components/common";
import { CartItem, CartSummary } from "../components/cart";
import { ProductCustomizationModal } from "../components/products";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useCartOperations } from "../hooks/useCartOperations";
import { useCartSelection } from "../hooks/useCartSelection";
import { useProductEdit } from "../hooks/useProductEdit";
import { calculateSelectedSubtotal, calculateTax, calculateTotal, getTaxRatePercentage } from "../utils/cartCalculations";

export default function Cart() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { cartItems, loading, error, loadingItems, setError, updateQuantity, removeItem, removeItems, updateCartItem } = useCartOperations(isAuthenticated);

  const { selectedItems, toggleSelectAll, toggleSelectItem, clearSelection, removeFromSelection } = useCartSelection(cartItems);

  const { editingItem, editingProduct, editingItemId, openEditModal, closeEditModal, handleSave } = useProductEdit(null, setError);

  const [removingSelected, setRemovingSelected] = useState(false);

  const handleRemoveItem = async (itemId) => {
    await removeItem(itemId);
    removeFromSelection(itemId);
  };

  const handleRemoveSelectedItems = async () => {
    setRemovingSelected(true);
    const itemsToRemove = Array.from(selectedItems);
    await removeItems(itemsToRemove);
    clearSelection();
    setRemovingSelected(false);
  };

  const handleEditSave = async (cartData) => {
    await handleSave(cartData, updateCartItem, removeFromSelection);
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      showToast("Please select at least one item to checkout", {
        type: "error",
        dismissible: true,
      });
      return;
    }

    const selectedCartItems = cartItems.filter((item) => selectedItems.has(item.id));

    navigate("/checkout", {
      state: { selectedCartItems },
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 px-4 pt-24 pb-8 sm:px-6 sm:pt-28 sm:pb-12 lg:pt-32">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-6 text-2xl font-bold text-[#30442B] sm:mb-8 sm:text-3xl lg:text-4xl">Your Cart</h1>
            <div className="flex items-center justify-center py-20 sm:py-32">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#30442B] sm:h-16 sm:w-16"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 px-4 pt-24 pb-8 sm:px-6 sm:pt-28 sm:pb-12 lg:pt-32">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-2xl font-bold text-[#30442B] sm:text-3xl lg:text-4xl">Your Cart</h1>
            <div className="mt-6 sm:mt-8">
              <EmptyState
                title="Please log in to view your cart"
                description="You need to be logged in to add items and view your cart."
                actionText="Login or Sign Up"
                onAction={() => openAuthModal("login")}
              />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 px-4 pt-24 pb-8 sm:px-6 sm:pt-28 sm:pb-12 lg:pt-32">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-2xl font-bold text-[#30442B] sm:text-3xl lg:text-4xl">Your Cart</h1>
            <div className="mt-6 sm:mt-8">
              <EmptyState title="Your cart is empty" description="Start shopping to add items to your cart!" actionText="Browse Products" actionTo="/products" />
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
      <main className="min-h-screen bg-gray-50 px-4 pt-24 pb-8 sm:px-6 sm:pt-28 sm:pb-12 lg:pt-32">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-bold text-[#30442B] sm:mb-8 sm:text-3xl lg:text-4xl">Your Cart</h1>

          {error && <div className="mb-4 rounded border border-red-400 bg-red-100 px-3 py-2.5 text-sm text-red-700 sm:px-4 sm:py-3 sm:text-base">{error}</div>}

          <div className="mt-6 grid grid-cols-1 items-start gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-3">
            {/* Items Column */}
            <section className="space-y-3 sm:space-y-4 lg:col-span-2">
              {/* Select All & Remove Selected */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-white p-3 text-neutral-700 shadow-sm sm:gap-3 sm:p-4">
                <div className="flex flex-col gap-0.5 sm:gap-1">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-[#30442B] sm:text-sm">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 cursor-pointer rounded border-neutral-300 text-[#30442B] focus:ring-[#30442B]"
                    />
                    <span>Select All ({cartItems.length})</span>
                  </label>
                  <p className="hidden text-xs text-neutral-500 sm:block">{cartItems.length} items in your cart</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveSelectedItems}
                  disabled={selectedItems.size === 0 || removingSelected}
                  className={`inline-flex items-center gap-2 rounded border border-red-500 px-3 py-1.5 text-sm font-medium text-red-600 transition-all ${
                    selectedItems.size === 0 || removingSelected ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-red-50"
                  }`}
                >
                  {removingSelected ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                      <span>Removing...</span>
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">🗑</span>
                      <span>Remove Selected</span>
                    </>
                  )}
                </button>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.has(item.id)}
                    isEditing={editingItemId === item.id}
                    isLoading={loadingItems[item.id]}
                    onToggleSelect={toggleSelectItem}
                    onUpdateQuantity={updateQuantity}
                    onEdit={openEditModal}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="flex items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center rounded-full border border-[#30442B] px-4 py-2 text-sm font-medium text-[#30442B] transition hover:bg-[#30442B] hover:text-white sm:px-5 sm:py-2.5 sm:text-base"
                >
                  Continue Shopping
                </Link>
              </div>
            </section>

            {/* Summary Column */}
            <aside className="lg:col-span-1">
              <CartSummary
                selectedCount={selectedItems.size}
                subtotal={calculateSelectedSubtotal(cartItems, selectedItems)}
                tax={calculateTax(cartItems, selectedItems)}
                taxRate={getTaxRatePercentage()}
                total={calculateTotal(cartItems, selectedItems)}
                onCheckout={handleCheckout}
                disabled={selectedItems.size === 0}
              />
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
