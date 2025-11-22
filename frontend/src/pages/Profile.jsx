import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import api from '../services/apiClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileHero from '../components/ProfileHero';
import OrderHistoryCard from '../components/OrderHistoryCard';
import QuickSettingsPanel from '../components/QuickSettingsPanel';
import ProfileInformationForm from '../components/ProfileInformationForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import DeleteAccountModal from '../components/DeleteAccountModal';

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('profile-info'); // 'profile-info' | 'change-password'
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleChangePassword = () => {
    setActiveView('change-password');
  };

  const handleBackToProfile = () => {
    setActiveView('profile-info');
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLanguageChange = async (language) => {
    try {
      await api.put('/user/language', { language });
      showToast('Language preference saved', { type: 'success', dismissible: true });
    } catch (error) {
      console.error('Language change error:', error);
      showToast('Failed to save language preference', { type: 'error', dismissible: true });
    }
  };

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Profile Hero Section */}
        <ProfileHero user={user} />

        {/* Profile Content - 2 Column Layout */}
        <section className="relative -mt-12 pb-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Order History (Desktop only) */}
              <div className="hidden lg:block lg:col-span-1">
                <OrderHistoryCard />
              </div>

              {/* Right Column - Profile Information & Settings */}
              <div className="lg:col-span-2 space-y-6">
                {/* Dynamic Content Area */}
                {activeView === 'profile-info' ? (
                  <ProfileInformationForm user={user} onUserUpdate={handleUserUpdate} />
                ) : (
                  <ChangePasswordForm onBack={handleBackToProfile} />
                )}

                {/* Quick Settings Panel */}
                <QuickSettingsPanel
                  onChangePassword={handleChangePassword}
                  onDeleteAccount={handleDeleteAccount}
                  onLogout={handleLogout}
                  onLanguageChange={handleLanguageChange}
                  currentLanguage={user?.language_preference || 'en'}
                />

                {/* Order History Card (Mobile - below settings) */}
                <div className="lg:hidden">
                  <OrderHistoryCard />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Delete Account Modal */}
        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      </main>
      <Footer />
    </>
  );
}
