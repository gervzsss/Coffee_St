import { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  MapPin,
  Phone,
  CreditCard,
  Clock,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import aboutHeadImg from '../../assets/aboutus_head.png';

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (!order) {
      navigate('/orders', { replace: true });
      return;
    }

    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentMethodLabel = (method) => {
    return method === 'cash' ? 'Cash on Delivery' : 'GCash';
  };

  const confettiColors = [
    'bg-red-400',
    'bg-yellow-400',
    'bg-blue-400',
    'bg-green-400',
    'bg-pink-400',
    'bg-purple-400',
    'bg-orange-400',
    'bg-cyan-400',
    'bg-amber-400',
    'bg-emerald-400',
    'bg-fuchsia-400',
    'bg-lime-400',
  ];

  const confettiPieces = [...Array(80)].map((_, i) => {
    const angle = (Math.PI * 2 * i) / 80 + (Math.random() - 0.5) * 0.5;
    const velocity = 150 + Math.random() * 200;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity - 100;

    return {
      id: i,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      tx,
      ty,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.3,
      duration: 2.5 + Math.random() * 1.5,
      isWide: Math.random() > 0.5,
    };
  });

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Confetti Effect */}
        {showConfetti && (
          <div
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center"
            aria-hidden="true"
          >
            {confettiPieces.map((piece) => (
              <div
                key={piece.id}
                className={`absolute ${piece.color} animate-confetti-burst ${
                  piece.isWide ? 'w-3 h-8' : 'w-2 h-6'
                }`}
                style={{
                  '--tx': `${piece.tx}px`,
                  '--ty': `${piece.ty}px`,
                  '--r': `${piece.rotation}deg`,
                  animationDelay: `${piece.delay}s`,
                  animationDuration: `${piece.duration}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Hero Section */}
        <section className="relative isolate pt-24">
          <div className="absolute inset-0">
            <img
              src={aboutHeadImg}
              alt="Order Success"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-[#1a2319]/75 mix-blend-multiply"></div>

          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-24 text-white sm:px-10 text-center">
            {/* Success Icon */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500 shadow-xl animate-bounce-slow">
              <CheckCircle className="h-14 w-14 text-white" strokeWidth={2.5} />
            </div>

            <div>
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
                Order Confirmed
              </span>
              <h1 className="mt-6 font-outfit text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Thank You for Your Order!
              </h1>
              <p className="mt-6 max-w-xl text-base text-white/90 sm:text-lg mx-auto">
                Your order has been successfully placed and is being prepared
              </p>
            </div>

            {/* Order Number */}
            <div className="mt-4 rounded-2xl bg-white/10 px-8 py-4 backdrop-blur">
              <p className="text-sm text-white/70 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-white">
                {order.order_number}
              </p>
            </div>
          </div>
        </section>

        {/* Order Details */}
        <section className="relative -mt-12 pb-24">
          <div className="mx-auto max-w-4xl px-6 sm:px-10">
            <div className="space-y-6">
              {/* Order Summary Card */}
              <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
                <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#30442B]" />
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.product_name}
                        </p>
                        {item.variant_name && (
                          <p className="text-sm text-gray-600">
                            {item.variant_name}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          x{item.quantity}
                        </p>
                        <p className="font-semibold text-[#30442B]">
                          ₱{item.line_total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₱{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₱{order.delivery_fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({(order.tax_rate * 100).toFixed(0)}%)</span>
                    <span>₱{order.tax_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-[#30442B] pt-2 border-t">
                    <span>Total</span>
                    <span>₱{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information Card */}
              <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
                <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#30442B]" />
                  Delivery Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Delivery Address
                      </p>
                      <p className="text-gray-900">{order.delivery_address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </p>
                      <p className="text-gray-900">{order.delivery_contact}</p>
                    </div>
                  </div>

                  {order.delivery_instructions && (
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Delivery Instructions
                        </p>
                        <p className="text-gray-900">
                          {order.delivery_instructions}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </p>
                      <p className="text-gray-900">
                        {getPaymentMethodLabel(order.payment_method)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Estimated Delivery
                      </p>
                      <p className="text-gray-900">25-35 minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/orders"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#30442B] text-white rounded-lg font-semibold hover:bg-[#405939] transition-colors"
                >
                  <Package className="w-5 h-5" />
                  View All Orders
                </Link>
                <Link
                  to="/products"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#30442B] text-[#30442B] rounded-lg font-semibold hover:bg-[#30442B]/5 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Confirmation Note */}
              <div className="rounded-2xl bg-blue-50 border border-blue-200 p-6 flex items-start gap-4">
                <svg
                  className="w-6 h-6 text-blue-600 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900 mb-1">
                    Order confirmation sent!
                  </p>
                  <p className="text-sm text-blue-700">
                    We've sent an order confirmation to your registered email
                    address. You'll receive updates about your delivery status.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
