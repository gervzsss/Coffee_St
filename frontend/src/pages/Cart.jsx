import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import ProductCustomizationModal from '../components/ProductCustomizationModal';
import { useAuth } from '../hooks/useAuth';
import { useCartOperations } from '../hooks/useCartOperations';
import { useCartSelection } from '../hooks/useCartSelection';
import { useProductEdit } from '../hooks/useProductEdit';
import {
  calculateSelectedSubtotal,
  calculateTax,
  calculateTotal,
  getTaxRatePercentage,
} from '../utils/cartCalculations';

export default function Cart() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const {
    cartItems,
    loading,
    error,
    loadingItems,
    setError,
    updateQuantity,
    removeItem,
    removeItems,
    updateCartItem,
  } = useCartOperations(isAuthenticated);

  const {
    selectedItems,
    toggleSelectAll,
    toggleSelectItem,
    clearSelection,
    removeFromSelection,
  } = useCartSelection(cartItems);

  const {
    editingItem,
    editingProduct,
    editingItemId,
    openEditModal,
    closeEditModal,
    handleSave,
  } = useProductEdit(null, setError);

  const handleRemoveItem = async (itemId) => {
    await removeItem(itemId);
    removeFromSelection(itemId);
  };

  const handleRemoveSelectedItems = async () => {
    const itemsToRemove = Array.from(selectedItems);
    await removeItems(itemsToRemove);
    clearSelection();
  };

  const handleEditSave = async (cartData) => {
    await handleSave(cartData, updateCartItem, removeFromSelection);
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
              <EmptyState
                title="Please log in to view your cart"
                description="You need to be logged in to add items and view your cart."
                actionText="Login or Sign Up"
                onAction={() => openAuthModal('login')}
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
        <main className="min-h-screen bg-gray-50 pt-32 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-[#30442B]">
              Your Cart
            </h1>
            <div className="mt-8">
              <EmptyState
                title="Your cart is empty"
                description="Start shopping to add items to your cart!"
                actionText="Browse Products"
                actionTo="/products"
              />
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
                  onClick={handleRemoveSelectedItems}
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
                  className="inline-flex items-center px-5 py-2.5 border border-[#30442B] text-[#30442B] rounded-full font-medium hover:text-white hover:bg-[#30442B] transition"
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
                onCheckout={() => {
                  /* TODO: Implement checkout */
                }}
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
