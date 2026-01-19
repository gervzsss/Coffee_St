import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout, AdminHeader } from "../components/layout";
import { usePosMode } from "../context/PosModeContext";
import { useAdminToast } from "../hooks/useAdminToast";
import { getPosProducts, getProductVariants, createPosOrder } from "../services/posService";
import { formatCurrency } from "../utils/formatCurrency";
import { LoadingSpinner, ButtonSpinner } from "../components/common";
import POSCart from "../components/pos/POSCart";
import POSProductGrid from "../components/pos/POSProductGrid";
import POSVariantModal from "../components/pos/POSVariantModal";
import POSCheckoutModal from "../components/pos/POSCheckoutModal";
import POSOrderSuccessModal from "../components/pos/POSOrderSuccessModal";

export default function POS() {
  const navigate = useNavigate();
  const { isPosMode } = usePosMode();
  const { showToast } = useAdminToast();

  // Products state
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // Cart state
  const [cart, setCart] = useState([]);

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productVariants, setProductVariants] = useState([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success modal state
  const [successOrder, setSuccessOrder] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Redirect if not in POS mode
  useEffect(() => {
    if (!isPosMode) {
      navigate("/admin/dashboard");
    }
  }, [isPosMode, navigate]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    const result = await getPosProducts({
      search: searchQuery,
      category: selectedCategory,
    });

    if (result.success) {
      setProducts(result.data);
      // Extract unique categories
      const uniqueCategories = [...new Set(result.data.map((p) => p.category))];
      setCategories(uniqueCategories);
    } else {
      showToast(result.error, { type: "error" });
    }
    setIsLoadingProducts(false);
  }, [searchQuery, selectedCategory, showToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle product selection
  const handleProductSelect = async (product) => {
    setSelectedProduct(product);
    setIsLoadingVariants(true);
    setIsVariantModalOpen(true);

    const result = await getProductVariants(product.id);
    if (result.success) {
      setProductVariants(result.data);
    } else {
      setProductVariants([]);
    }
    setIsLoadingVariants(false);
  };

  // Add item to cart
  const handleAddToCart = (product, quantity, selectedVariants) => {
    const variantPriceDelta = selectedVariants.reduce((sum, v) => sum + v.price_delta, 0);
    const itemTotal = (product.price + variantPriceDelta) * quantity;

    const cartItem = {
      id: `${product.id}-${Date.now()}`, // Unique ID for cart item
      product_id: product.id,
      product_name: product.name,
      unit_price: product.price,
      quantity,
      variants: selectedVariants,
      variant_price_delta: variantPriceDelta,
      line_total: itemTotal,
    };

    setCart((prev) => [...prev, cartItem]);
    setIsVariantModalOpen(false);
    setSelectedProduct(null);
    setProductVariants([]);
    showToast(`${product.name} added to cart`, { type: "success" });
  };

  // Update cart item quantity
  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const newLineTotal = (item.unit_price + item.variant_price_delta) * newQuantity;
          return { ...item, quantity: newQuantity, line_total: newLineTotal };
        }
        return item;
      }),
    );
  };

  // Remove item from cart
  const handleRemoveFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.line_total, 0);
  const taxRate = 0.12;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast("Cart is empty", { type: "error" });
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  // Submit order
  const handleSubmitOrder = async (checkoutData) => {
    setIsSubmitting(true);

    const orderData = {
      items: cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        variants: item.variants.map((v) => ({
          variant_id: v.variant_id,
          variant_group_name: v.group_name,
          variant_name: v.variant_name,
          price_delta: v.price_delta,
        })),
      })),
      payment_method: checkoutData.paymentMethod,
      customer_name: checkoutData.customerName || null,
      customer_phone: checkoutData.customerPhone || null,
      notes: checkoutData.notes || null,
      tax_rate: taxRate,
    };

    const result = await createPosOrder(orderData);

    if (result.success) {
      setIsCheckoutModalOpen(false);
      setCart([]);
      setSuccessOrder(result.data.order);
      setIsSuccessModalOpen(true);
    } else {
      showToast(result.error, { type: "error" });
    }

    setIsSubmitting(false);
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setSuccessOrder(null);
  };

  // View order after success
  const handleViewOrder = () => {
    if (successOrder) {
      navigate(`/admin/pos/order/${successOrder.id}`);
    }
    setIsSuccessModalOpen(false);
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Point of Sale"
        action={
          <button
            onClick={() => navigate("/admin/pos/orders")}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            View Orders
          </button>
        }
      />

      <div className="flex h-[calc(100vh-80px)] gap-4 p-4 lg:p-6">
        {/* Products Section */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          {/* Search and Filter */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
                <svg className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoadingProducts ? (
              <div className="flex h-full items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <POSProductGrid products={products} onProductSelect={handleProductSelect} />
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-full max-w-md">
          <POSCart
            items={cart}
            subtotal={subtotal}
            tax={tax}
            total={total}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      {/* Variant Selection Modal */}
      <POSVariantModal
        isOpen={isVariantModalOpen}
        onClose={() => {
          setIsVariantModalOpen(false);
          setSelectedProduct(null);
          setProductVariants([]);
        }}
        product={selectedProduct}
        variantGroups={productVariants}
        isLoading={isLoadingVariants}
        onAddToCart={handleAddToCart}
      />

      {/* Checkout Modal */}
      <POSCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        subtotal={subtotal}
        tax={tax}
        total={total}
        itemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onSubmit={handleSubmitOrder}
        isSubmitting={isSubmitting}
      />

      {/* Order Success Modal */}
      <POSOrderSuccessModal isOpen={isSuccessModalOpen} onClose={handleSuccessModalClose} order={successOrder} onViewOrder={handleViewOrder} onNewSale={handleSuccessModalClose} />
    </AdminLayout>
  );
}
