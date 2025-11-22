import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';

export default function Orders() {
  const { user } = useAuth();

  // Placeholder - no orders yet
  const orders = [];

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-[#30442B] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                My Orders
              </h1>
              <p className="text-lg text-white/90">
                Track your order history and current deliveries
              </p>
            </div>
          </div>
        </section>

        {/* Orders Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {orders.length === 0 ? (
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
              ) : (
                <div className="space-y-4">
                  {/* Future: Order cards will be rendered here */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-600">Your orders will appear here</p>
                  </div>
                </div>
              )}

              {/* Coming Soon Info Card */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <svg
                    className="w-6 h-6 text-blue-500 shrink-0 mt-1"
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
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Order Management Coming Soon
                    </h3>
                    <p className="text-blue-700">
                      We're working on adding full order tracking features including:
                    </p>
                    <ul className="mt-2 space-y-1 text-blue-700">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        Real-time order status updates
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        Order history with detailed receipts
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        Re-order your favorites with one click
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        Delivery tracking and estimated arrival times
                      </li>
                    </ul>
                  </div>
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
