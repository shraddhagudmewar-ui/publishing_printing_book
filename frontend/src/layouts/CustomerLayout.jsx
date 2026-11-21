import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import Sidebar from '../components/navigation/Sidebar';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, User, ShoppingBag, Heart, Star, 
  BookOpen, Download, MapPin, CreditCard, Bell, KeyRound, FileUp, Printer 
} from 'lucide-react';

const CustomerLayout = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { to: '/customer/dashboard', end: true, label: 'Overview', icon: LayoutDashboard },
    { to: '/customer/publish', label: 'Publish a Book', icon: FileUp },
    { to: '/customer/printing', label: 'Printing Requests', icon: Printer },
    { to: '/customer/orders', label: 'My Orders', icon: ShoppingBag },
    { to: '/customer/library', label: 'eBook Library', icon: BookOpen },
    { to: '/customer/downloads', label: 'Downloaded Books', icon: Download },
    { to: '/customer/wishlist', label: 'My Wishlist', icon: Heart },
    { to: '/customer/addresses', label: 'Saved Addresses', icon: MapPin },
    { to: '/customer/payments', label: 'Payment History', icon: CreditCard },
    { to: '/customer/profile', label: 'My Profile', icon: User },
    { to: '/customer/security', label: 'Change Password', icon: KeyRound },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EAF1F7] text-[#202020]">
      <Navbar />
      <div className="flex grow max-w-7xl w-full mx-auto pt-16">
        <Sidebar items={navItems} title="Customer Dashboard" />
        <main className="grow p-6 md:p-8 overflow-y-auto max-w-5xl">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
