import { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCheckout } from "../hooks/useCheckout";
import { Header, Footer } from "../components/layout";
import { AnimatedPage } from "../components/common";
import { CheckoutItem, DeliveryForm, OrderSummaryCheckout } from "../components/checkout";

export default function Checkout() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedCartItems = useMemo(() => location.state?.selectedCartItems || [], [location.state?.selectedCartItems]);
  const isBuyNow = useMemo(() => location.state?.isBuyNow || false, [location.state?.isBuyNow]);

  const { formData, formErrors, loading, error, updateFormData, submitOrder } = useCheckout(selectedCartItems, user, isBuyNow);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/cart", { replace: true });
      return;
    }

    if (selectedCartItems.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [isAuthenticated, selectedCartItems, navigate]);

  const handleConfirmCheckout = async () => {
    await submitOrder();
  };

  if (selectedCartItems.length === 0) {
    return null;
  }

  return (
    <>
      <Header />
      <AnimatedPage className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
        {/* Compact Checkout Header */}
        <div className="w-full bg-[#30442B] pt-8 pb-6 sm:pt-12 sm:pb-8">
          <div className="container mx-auto px-4 sm:px-6">
            <button
              onClick={() => navigate(isBuyNow ? "/products" : "/cart")}
              className="mb-3 flex items-center gap-1.5 text-sm text-gray-300 transition-colors hover:text-white sm:mb-4 sm:gap-2 sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Back to {isBuyNow ? "Menu" : "Cart"}</span>
            </button>
            <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">Complete Your Order</h1>
            <p className="mt-1 text-xs text-gray-200 sm:text-sm lg:text-base">Review your items and provide delivery details</p>
          </div>
        </div>

        {/* Checkout Content */}
        <section className="relative pb-16 sm:pb-24">
          <div className="mx-auto mt-6 max-w-7xl px-4 sm:mt-8 sm:px-6 lg:px-10">
            {/* Error Message */}
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 sm:mb-6 sm:gap-3 sm:rounded-2xl sm:p-4">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-600 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-red-800 sm:text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              {/* Left Column - Order Review */}
              <div className="space-y-4 sm:space-y-6 lg:col-span-2">
                {/* Order Items */}
                <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-900/5 sm:rounded-3xl sm:p-6">
                  <h2 className="font-outfit mb-3 text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl">Order Review</h2>
                  <p className="mb-4 text-xs text-gray-600 sm:mb-6 sm:text-sm">
                    {selectedCartItems.length} item
                    {selectedCartItems.length !== 1 ? "s" : ""} in your order
                  </p>

                  <div className="space-y-2 sm:space-y-3">
                    {selectedCartItems.map((item) => (
                      <CheckoutItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>

                {/* Delivery Form */}
                <DeliveryForm formData={formData} onChange={updateFormData} errors={formErrors} />
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummaryCheckout items={selectedCartItems} deliveryFee={50} taxRate={0.12} onConfirmCheckout={handleConfirmCheckout} disabled={loading} loading={loading} />
              </div>
            </div>
          </div>
        </section>
      </AnimatedPage>
      <Footer />
    </>
  );
}
