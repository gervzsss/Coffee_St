import { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { CheckCircle, Package, MapPin, Phone, CreditCard, Clock } from "lucide-react";
import { Header, Footer } from "../components/layout";
import { AnimatedPage } from "../components/common";
import aboutHeadImg from "../../assets/aboutus_head.webp";

const confettiColors = [
  "bg-red-400",
  "bg-yellow-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-pink-400",
  "bg-purple-400",
  "bg-orange-400",
  "bg-cyan-400",
  "bg-amber-400",
  "bg-emerald-400",
  "bg-fuchsia-400",
  "bg-lime-400",
];

const generateConfettiPieces = () =>
  [...Array(80)].map((_, i) => {
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

export default function OrderSuccess() {
  useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiPieces] = useState(generateConfettiPieces);

  useEffect(() => {
    if (!order) {
      navigate("/orders", { replace: true });
      return;
    }

    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const getPaymentMethodLabel = (method) => {
    return method === "cash" ? "Cash on Delivery" : "GCash";
  };

  return (
    <>
      <Header />
      <AnimatedPage className="min-h-screen bg-gray-50 pt-20">
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden" aria-hidden="true">
            {confettiPieces.map((piece) => (
              <div
                key={piece.id}
                className={`absolute ${piece.color} animate-confetti-burst ${piece.isWide ? "h-8 w-3" : "h-6 w-2"}`}
                style={{
                  "--tx": `${piece.tx}px`,
                  "--ty": `${piece.ty}px`,
                  "--r": `${piece.rotation}deg`,
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
            <img src={aboutHeadImg} alt="Order Success" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-[#1a2319]/75 mix-blend-multiply"></div>

          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-24 text-center text-white sm:px-10">
            {/* Success Icon */}
            <div className="animate-bounce-slow flex h-24 w-24 items-center justify-center rounded-full bg-green-500 shadow-xl">
              <CheckCircle className="h-14 w-14 text-white" strokeWidth={2.5} />
            </div>

            <div>
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.35em] text-amber-200 uppercase">Order Confirmed</span>
              <h1 className="font-outfit mt-6 text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">Thank You for Your Order!</h1>
              <p className="mx-auto mt-6 max-w-xl text-base text-white/90 sm:text-lg">Your order has been successfully placed and is being prepared</p>
            </div>

            {/* Order Number */}
            <div className="mt-4 rounded-2xl bg-white/10 px-8 py-4 backdrop-blur">
              <p className="mb-1 text-sm text-white/70">Order Number</p>
              <p className="text-2xl font-bold text-white">{order.order_number}</p>
            </div>
          </div>
        </section>

        {/* Order Details */}
        <section className="relative -mt-12 pb-24">
          <div className="mx-auto max-w-4xl px-6 sm:px-10">
            <div className="space-y-6">
              {/* Order Summary Card */}
              <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
                <h2 className="font-outfit mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900">
                  <Package className="h-5 w-5 text-[#30442B]" />
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="mb-6 space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        {item.variant_name && <p className="text-sm text-gray-600">{item.variant_name}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">x{item.quantity}</p>
                        <p className="font-semibold text-[#30442B]">₱{item.line_total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 border-t border-gray-200 pt-4 text-sm">
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
                  <div className="flex items-center justify-between border-t pt-2 text-lg font-bold text-[#30442B]">
                    <span>Total</span>
                    <span>₱{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information Card */}
              <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
                <h2 className="font-outfit mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900">
                  <MapPin className="h-5 w-5 text-[#30442B]" />
                  Delivery Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                    <div>
                      <p className="mb-1 text-sm font-medium text-gray-700">Delivery Address</p>
                      <p className="text-gray-900">{order.delivery_address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                    <div>
                      <p className="mb-1 text-sm font-medium text-gray-700">Contact Number</p>
                      <p className="text-gray-900">{order.delivery_contact}</p>
                    </div>
                  </div>

                  {order.delivery_instructions && (
                    <div className="flex items-start gap-3">
                      <Package className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                      <div>
                        <p className="mb-1 text-sm font-medium text-gray-700">Delivery Instructions</p>
                        <p className="text-gray-900">{order.delivery_instructions}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                    <div>
                      <p className="mb-1 text-sm font-medium text-gray-700">Payment Method</p>
                      <p className="text-gray-900">{getPaymentMethodLabel(order.payment_method)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                    <div>
                      <p className="mb-1 text-sm font-medium text-gray-700">Estimated Delivery</p>
                      <p className="text-gray-900">25-35 minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/orders" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#30442B] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#405939]">
                  <Package className="h-5 w-5" />
                  View All Orders
                </Link>
                <Link
                  to="/products"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-[#30442B] px-6 py-3 font-semibold text-[#30442B] transition-colors hover:bg-[#30442B]/5"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Confirmation Note */}
              <div className="flex items-start gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-6">
                <svg className="h-6 w-6 shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="mb-1 font-semibold text-blue-900">Order confirmation sent!</p>
                  <p className="text-sm text-blue-700">We've sent an order confirmation to your registered email address. You'll receive updates about your delivery status.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedPage>
      <Footer />
    </>
  );
}
