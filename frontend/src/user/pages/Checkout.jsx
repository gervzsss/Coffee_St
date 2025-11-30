import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCheckout } from '../hooks/useCheckout';
import { Header, Footer } from '../components/layout';
import {
  CheckoutItem,
  DeliveryForm,
  OrderSummaryCheckout,
} from '../components/checkout';

export default function Checkout() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedCartItems = location.state?.selectedCartItems || [];

  const { formData, formErrors, loading, error, updateFormData, submitOrder } =
    useCheckout(selectedCartItems, user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/cart', { replace: true });
      return;
    }

    if (selectedCartItems.length === 0) {
      navigate('/cart', { replace: true });
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
      <main className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
        {/* Compact Checkout Header */}
        <div className="w-full bg-[#30442B] pb-6 sm:pb-8 pt-8 sm:pt-12">
          <div className="container mx-auto px-4 sm:px-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Complete Your Order
            </h1>
            <p className="text-gray-200 text-xs sm:text-sm lg:text-base mt-1">
              Review your items and provide delivery details
            </p>
          </div>
        </div>

        {/* Checkout Content */}
        <section className="relative pb-16 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 mt-6 sm:mt-8">
            {/* Error Message */}
            {error && (
              <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-red-50 border border-red-200 p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs sm:text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Column - Order Review */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Order Items */}
                <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-lg ring-1 ring-gray-900/5">
                  <h2 className="font-outfit text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Order Review
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    {selectedCartItems.length} item
                    {selectedCartItems.length !== 1 ? 's' : ''} in your order
                  </p>

                  <div className="space-y-2 sm:space-y-3">
                    {selectedCartItems.map((item) => (
                      <CheckoutItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>

                {/* Delivery Form */}
                <DeliveryForm
                  formData={formData}
                  onChange={updateFormData}
                  errors={formErrors}
                />
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummaryCheckout
                  items={selectedCartItems}
                  deliveryFee={50}
                  taxRate={0.12}
                  onConfirmCheckout={handleConfirmCheckout}
                  disabled={loading}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
