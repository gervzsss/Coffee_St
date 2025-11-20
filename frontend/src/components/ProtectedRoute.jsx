import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, openAuthModal } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access this page.</p>
          <button
            onClick={() => openAuthModal('login')}
            className="bg-[#30442B] text-white px-6 py-3 rounded-lg hover:bg-[#405939] transition-colors cursor-pointer"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return children;
}
