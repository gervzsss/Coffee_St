import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';

export default function Messages() {
  const { user } = useAuth();

  // Placeholder - no messages yet
  const messages = [];

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-[#30442B] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Messages
              </h1>
              <p className="text-lg text-white/90">
                View and manage your conversations with our team
              </p>
            </div>
          </div>
        </section>

        {/* Messages Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {messages.length === 0 ? (
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  title="No Messages Yet"
                  description="You don't have any messages at the moment. Our support team will reach out here if needed."
                  actionText="Contact Support"
                  actionTo="/contact"
                />
              ) : (
                <div className="space-y-4">
                  {/* Future: Message threads will be rendered here */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-600">Your messages will appear here</p>
                  </div>
                </div>
              )}

              {/* Coming Soon Info Card */}
              <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <svg
                    className="w-6 h-6 text-green-500 shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      Messaging System Coming Soon
                    </h3>
                    <p className="text-green-700">
                      We're building a comprehensive messaging system that will include:
                    </p>
                    <ul className="mt-2 space-y-1 text-green-700">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Direct messaging with our support team
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Order-related inquiries and updates
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Real-time notifications for new messages
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Message history and conversation threads
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        File attachments and image sharing
                      </li>
                    </ul>
                    <p className="mt-4 text-green-700">
                      For now, you can still reach us through the{' '}
                      <a href="/contact" className="font-semibold underline hover:text-green-800">
                        Contact page
                      </a>
                      .
                    </p>
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
