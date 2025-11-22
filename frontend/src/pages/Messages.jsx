import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import aboutHeadImg from '../assets/aboutus_head.png';

export default function Messages() {
  const { user } = useAuth();

  // Placeholder - no messages yet
  const messages = [];

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative isolate pt-24">
          <div className="absolute inset-0">
            <img
              src={aboutHeadImg}
              alt="Coffee background"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-[#1a2319]/75 mix-blend-multiply"></div>
          
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6 px-6 py-24 text-white sm:px-10">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
                Conversations
              </span>
              <h1 className="mt-6 font-outfit text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Messages
              </h1>
              <p className="mt-6 max-w-xl text-base text-white/80 sm:text-lg">
                View and manage your conversations with our team. Get real-time support and order updates.
              </p>
            </div>
          </div>
        </section>

        {/* Messages Content */}
        <section className="relative -mt-12 pb-24">
          <div className="mx-auto max-w-6xl px-6 sm:px-10">
            {messages.length === 0 ? (
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  title="No Messages Yet"
                  description="You don't have any messages at the moment. Our support team will reach out here if needed."
                  actionText="Contact Support"
                  actionTo="/contact"
                />

                {/* Coming Soon Info Card */}
                <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
                  <div className="flex items-start gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-50">
                      <svg
                        className="h-7 w-7 text-green-600"
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
                    </div>
                    <div className="flex-1">
                      <h3 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
                        Messaging System Coming Soon
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        We're building a comprehensive messaging system that will include:
                      </p>
                      <ul className="space-y-2.5 text-gray-600">
                        <li className="flex items-center gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                          </span>
                          Direct messaging with our support team
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                          </span>
                          Order-related inquiries and updates
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                          </span>
                          Real-time notifications for new messages
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                          </span>
                          Message history and conversation threads
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                          </span>
                          File attachments and image sharing
                        </li>
                      </ul>
                      <p className="mt-5 text-gray-600">
                        For now, you can still reach us through the{' '}
                        <a href="/contact" className="font-semibold text-[#30442B] underline hover:text-[#405939]">
                          Contact page
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Future: Message threads will be rendered here */}
                <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
                  <p className="text-gray-600">Your messages will appear here</p>
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
