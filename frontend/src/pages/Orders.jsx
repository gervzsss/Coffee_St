import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import contactHeaderImg from '../assets/contact_header.png';

export default function Orders() {
  const { user } = useAuth();

  // Placeholder - no orders yet
  const orders = [];

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative isolate pt-24">
          <div className="absolute inset-0">
            <img
              src={contactHeaderImg}
              alt="Coffee background"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-[#1a2319]/80 mix-blend-multiply"></div>
          
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6 px-6 py-24 text-white sm:px-10">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
                Order History
              </span>
              <h1 className="mt-6 font-outfit text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                My Orders
              </h1>
              <p className="mt-6 max-w-xl text-base text-white/80 sm:text-lg">
                Track your order history and current deliveries. View detailed receipts and order again with one click.
              </p>
            </div>
          </div>
        </section>

        {/* Orders Content */}
        <section className="relative -mt-12 pb-24">
          <div className="mx-auto max-w-6xl px-6 sm:px-10">
            {orders.length === 0 ? (
              <div className="space-y-6">
                <EmptyState
                  icon={
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  }
                  title="No Orders Yet"
                  description="You haven't placed any orders yet. Start exploring our menu and place your first order!"
                  actionText="Browse Menu"
                  actionTo="/products"
                />

                {/* Coming Soon Info Card */}
                <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
                  <div className="flex items-start gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                      <svg
                        className="h-7 w-7 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
                        Order Management Coming Soon
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        We're working on adding full order tracking features to enhance your experience:
                      </p>
                      <ul className="space-y-2.5 text-gray-600">
                        <li className="flex items-center gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                          </span>
                          Real-time order status updates
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                          </span>
                          Order history with detailed receipts
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                          </span>
                          Re-order your favorites with one click
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                          </span>
                          Delivery tracking and estimated arrival times
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Future: Order cards will be rendered here */}
                <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
                  <p className="text-gray-600">Your orders will appear here</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
