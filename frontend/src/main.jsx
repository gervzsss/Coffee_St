import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#30442B]"></div>
  </div>
);

const Home = lazy(() => import('./user/pages/Home.jsx'));
const Products = lazy(() => import('./user/pages/Products.jsx'));
const About = lazy(() => import('./user/pages/About.jsx'));
const Contact = lazy(() => import('./user/pages/Contact.jsx'));
const Cart = lazy(() => import('./user/pages/Cart.jsx'));
const Checkout = lazy(() => import('./user/pages/Checkout.jsx'));
const OrderSuccess = lazy(() => import('./user/pages/OrderSuccess.jsx'));
const Profile = lazy(() => import('./user/pages/Profile.jsx'));
const Orders = lazy(() => import('./user/pages/Orders.jsx'));
const Messages = lazy(() => import('./user/pages/Messages.jsx'));
const MessageThread = lazy(() => import('./user/pages/MessageThread.jsx'));

import { AuthProvider } from './user/context/AuthContext.jsx';
import { CartProvider } from './user/context/CartContext.jsx';
import { ToastProvider } from './user/context/ToastContext.jsx';
import { useAuth } from './user/hooks/useAuth.js';
import { AuthModal } from './user/components/auth';
import { ProtectedRoute, ScrollToTop } from './user/components/layout';

const AdminLogin = lazy(() => import('./admin/pages/AdminLogin.jsx'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard.jsx'));
const AdminProducts = lazy(() => import('./admin/pages/Products.jsx'));
const AdminOrders = lazy(() => import('./admin/pages/Orders.jsx'));
const AdminUsers = lazy(() => import('./admin/pages/Users.jsx'));
const Inquiries = lazy(() => import('./admin/pages/Inquiries.jsx'));

import { AdminAuthProvider } from './admin/context/AdminAuthContext.jsx';
import { AdminProtectedRoute } from './admin/components/layout';

function UserAppContent() {
  const { isAuthModalOpen, closeAuthModal, authModalMode } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success/:orderNumber"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:id"
            element={
              <ProtectedRoute>
                <MessageThread />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </>
  );
}

function AdminAppContent() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route index element={<AdminLogin />} />
        <Route path="login" element={<AdminLogin />} />
        <Route
          path="dashboard"
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="products"
          element={
            <AdminProtectedRoute>
              <AdminProducts />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <AdminProtectedRoute>
              <AdminOrders />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="inquiries"
          element={
            <AdminProtectedRoute>
              <Inquiries />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Routes>
                <Route path="/admin/*" element={<AdminAppContent />} />
                <Route path="/*" element={<UserAppContent />} />
              </Routes>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
