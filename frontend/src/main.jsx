import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Home from "./user/pages/Home.jsx";
import Products from "./user/pages/Products.jsx";
import About from "./user/pages/About.jsx";
import Contact from "./user/pages/Contact.jsx";
import Cart from "./user/pages/Cart.jsx";
import Checkout from "./user/pages/Checkout.jsx";
import OrderSuccess from "./user/pages/OrderSuccess.jsx";
import Profile from "./user/pages/Profile.jsx";
import Orders from "./user/pages/Orders.jsx";
import Messages from "./user/pages/Messages.jsx";
import MessageThread from "./user/pages/MessageThread.jsx";

import { AuthProvider } from "./user/context/AuthContext.jsx";
import { CartProvider } from "./user/context/CartContext.jsx";
import { ToastProvider } from "./user/context/ToastContext.jsx";
import { useAuth } from "./user/hooks/useAuth.js";
import { AuthModal } from "./user/components/auth";
import { ProtectedRoute, ScrollToTop } from "./user/components/layout";

import AdminLogin from "./admin/pages/AdminLogin.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import AdminProducts from "./admin/pages/Products.jsx";
import AdminOrders from "./admin/pages/Orders.jsx";
import AdminUsers from "./admin/pages/Users.jsx";
import Inquiries from "./admin/pages/Inquiries.jsx";

import { AdminAuthProvider } from "./admin/context/AdminAuthContext.jsx";
import { AdminToastProvider } from "./admin/context/ToastContext.jsx";
import { AdminProtectedRoute } from "./admin/components/layout";
import { useToast } from "./user/hooks/useToast";

function UserAppContent() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, blockedMessage, clearBlockedMessage } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (blockedMessage) {
      showToast(blockedMessage, { type: "error", duration: 5000 });
      clearBlockedMessage();
    }
  }, [blockedMessage, showToast, clearBlockedMessage]);

  return (
    <>
      <ScrollToTop />
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
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
    </>
  );
}

function AdminAppContent() {
  return (
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
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <AdminToastProvider>
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
        </AdminToastProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
