import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import api from "../services/apiClient";
import { Header, Footer } from "../components/layout";
import { AnimatedPage } from "../components/common";
import { OrderHistoryCard } from "../components/orders";
import { QuickSettingsPanel, ProfileInformationForm, ChangePasswordForm, DeleteAccountModal } from "../components/profile";

export default function Profile() {
  const { user, setUser, logout, refreshUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("profile-info");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Refresh user data when profile page loads to ensure status is up-to-date
  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
  }, [refreshUser]);

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleChangePassword = () => {
    setActiveView("change-password");
  };

  const handleBackToProfile = () => {
    setActiveView("profile-info");
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const handleLanguageChange = async (language) => {
    try {
      await api.put("/user/language", { language });
      showToast("Language preference saved", {
        type: "success",
        dismissible: true,
      });
    } catch (error) {
      console.error("Language change error:", error);
      showToast("Failed to save language preference", {
        type: "error",
        dismissible: true,
      });
    }
  };

  return (
    <>
      <Header />
      <AnimatedPage className="min-h-screen bg-gray-50 pt-20">
        {/* Compact Profile Header */}
        <div className="w-full bg-[#30442B] pt-8 pb-6 sm:pt-10 sm:pb-8 lg:pt-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">Your Profile</h1>
            <p className="mt-1 text-xs text-gray-200 sm:mt-2 sm:text-sm lg:text-base">Manage your account settings and preferences</p>
          </div>
        </div>

        {/* Profile Content - 2 Column Layout */}
        <section className="relative pb-16 sm:pb-20 lg:pb-24">
          <div className="mx-auto mt-6 max-w-7xl px-4 sm:mt-8 sm:px-6 lg:px-10 xl:max-w-[1400px]">
            <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              {/* Left Column - Order History (Desktop only) */}
              <div className="hidden lg:col-span-1 lg:block">
                <OrderHistoryCard user={user} />
              </div>

              {/* Right Column - Profile Information & Settings */}
              <div className="space-y-4 sm:space-y-5 lg:col-span-2 lg:space-y-6">
                {/* Dynamic Content Area */}
                {activeView === "profile-info" ? <ProfileInformationForm user={user} onUserUpdate={handleUserUpdate} /> : <ChangePasswordForm onBack={handleBackToProfile} />}

                {/* Quick Settings Panel */}
                <QuickSettingsPanel
                  onChangePassword={handleChangePassword}
                  onDeleteAccount={handleDeleteAccount}
                  onLogout={handleLogout}
                  onLanguageChange={handleLanguageChange}
                  currentLanguage={user?.language_preference || "en"}
                  isLoggingOut={isLoggingOut}
                />

                {/* Order History Card (Mobile - below settings) */}
                <div className="lg:hidden">
                  <OrderHistoryCard user={user} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Delete Account Modal */}
        <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
      </AnimatedPage>
      <Footer />
    </>
  );
}
