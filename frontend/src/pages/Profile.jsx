import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Profile() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-[#30442B] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                My Profile
              </h1>
              <p className="text-lg text-white/90">
                Manage your account information and preferences
              </p>
            </div>
          </div>
        </section>

        {/* Profile Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-[#30442B] px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {user?.first_name && user?.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user?.name || 'User'}
                      </h2>
                      <p className="text-white/80">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-xl font-semibold text-[#30442B] mb-4">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-800">
                              {user?.first_name || 'Not provided'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-800">
                              {user?.last_name || 'Not provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-xl font-semibold text-[#30442B] mb-4">
                        Contact Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-800">{user?.email}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-800">
                              {user?.phone || 'Not provided'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                          </label>
                          <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-800">
                              {user?.address || 'Not provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coming Soon Badge */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                      <svg
                        className="w-12 h-12 text-amber-500 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <h4 className="text-lg font-semibold text-amber-900 mb-2">
                        Edit Profile - Coming Soon
                      </h4>
                      <p className="text-amber-700">
                        Profile editing functionality will be available soon. Stay tuned!
                      </p>
                    </div>
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
