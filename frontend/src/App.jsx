import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import AuthorsPage from './pages/AuthorsPage';
import GalleryPage from './pages/GalleryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { 
  AboutPage, 
  PublishingServicesPage, 
  SelfPublishingPage, 
  PublishingPackagesPage, 
  PrintingServicesPage, 
  ContactPage, 
  FAQPage 
} from './pages/StaticPages';

// Dashboard Pages (EXACTLY TWO: Customer & Admin)
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Error Page
import ErrorDisplay from './components/common/ErrorDisplay';

function App() {
  return (
    <Routes>
      {/* 1. Public Website Layout & Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        
        {/* Books & Store */}
        <Route path="/books" element={<BooksPage />} />
        <Route path="/catalogue" element={<Navigate to="/books" replace />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/authors" element={<AuthorsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Publishing & Informational Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/publishing-services" element={<PublishingServicesPage />} />
        <Route path="/submissions" element={<SelfPublishingPage />} />
        <Route path="/self-publishing" element={<SelfPublishingPage />} />
        <Route path="/packages" element={<PublishingPackagesPage />} />
        <Route path="/printing" element={<PrintingServicesPage />} />
        <Route path="/printing-services" element={<PrintingServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* 2. Customer Workspace Layout (Includes Publishing Requests) */}
      <Route path="/customer" element={<CustomerLayout />}>
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="profile" element={<CustomerDashboard />} />
        <Route path="orders" element={<CustomerDashboard />} />
        <Route path="printing" element={<CustomerDashboard />} />
        <Route path="publish" element={<CustomerDashboard />} />
        <Route path="publishing" element={<CustomerDashboard />} />
        <Route path="library" element={<CustomerDashboard />} />
        <Route path="downloads" element={<CustomerDashboard />} />
        <Route path="wishlist" element={<CustomerDashboard />} />
        <Route path="reviews" element={<CustomerDashboard />} />
        <Route path="addresses" element={<CustomerDashboard />} />
        <Route path="payments" element={<CustomerDashboard />} />
        <Route path="notifications" element={<CustomerDashboard />} />
        <Route path="security" element={<CustomerDashboard />} />
        <Route path="settings" element={<CustomerDashboard />} />
      </Route>

      {/* Author routes redirected to Customer Workspace */}
      <Route path="/author/*" element={<Navigate to="/customer/publish" replace />} />

      {/* 4. Publisher / Admin Control Console Layout (Combined ONE Admin/Publisher) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminDashboard />} />
        <Route path="authors" element={<Navigate to="/admin/users" replace />} />
        <Route path="manuscripts" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="publishing-requests" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="packages" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="analytics" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="books" element={<AdminDashboard />} />
        <Route path="categories" element={<AdminDashboard />} />
        <Route path="printing" element={<AdminDashboard />} />
        <Route path="orders" element={<AdminDashboard />} />
        <Route path="payments" element={<AdminDashboard />} />
        <Route path="inventory" element={<AdminDashboard />} />
        <Route path="delivery" element={<AdminDashboard />} />
        <Route path="reviews" element={<AdminDashboard />} />
        <Route path="gallery" element={<AdminDashboard />} />
        <Route path="content" element={<AdminDashboard />} />
        <Route path="notifications" element={<AdminDashboard />} />
        <Route path="settings" element={<AdminDashboard />} />
        <Route path="profile" element={<AdminDashboard />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-[#EAF1F7] flex items-center justify-center p-4">
            <ErrorDisplay
              title="Folio Not Found (404)"
              message="The requested volume or archival page does not exist in the KA Group repository."
            />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
