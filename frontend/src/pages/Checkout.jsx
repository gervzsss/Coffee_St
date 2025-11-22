import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCheckout } from '../hooks/useCheckout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckoutItem from '../components/CheckoutItem';
import DeliveryForm from '../components/DeliveryForm';
import OrderSummaryCheckout from '../components/OrderSummaryCheckout';
import contactHeaderImg from '../assets/contact_header.png';

export default function Checkout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedCartItems = location.state?.selectedCartItems || [];

  const { formData, formErrors, loading, error, updateFormData, submitOrder } =
    useCheckout(selectedCartItems);

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
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative isolate pt-24">
          <div className="absolute inset-0">
            <img
              src={contactHeaderImg}
              alt="Checkout"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-[#1a2319]/80 mix-blend-multiply"></div>

          <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6 px-6 py-24 text-white sm:px-10">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
                Checkout
              </span>
              <h1 className="mt-6 font-outfit text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Complete Your Order
              </h1>
              <p className="mt-6 max-w-xl text-base text-white/80 sm:text-lg">
                Review your items and provide delivery details to complete your
                purchase
              </p>
            </div>
          </div>
        </section>

        {/* Checkout Content */}
        <section className="relative -mt-12 pb-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
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
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Order Review */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Items */}
                <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                  <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-4">
                    Order Review
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    {selectedCartItems.length} item
                    {selectedCartItems.length !== 1 ? 's' : ''} in your order
                  </p>

                  <div className="space-y-3">
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
