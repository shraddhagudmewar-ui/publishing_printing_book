import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import Sidebar from '../components/navigation/Sidebar';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, User, FileUp, FileText, Image, BookCheck, 
  Package, GitPullRequest, MessageSquareText, BookOpen, 
  BarChart3, DollarSign, Bell 
} from 'lucide-react';

const AuthorLayout = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Ensure customer role cannot access author dashboard
  if (user && user.role !== 'author' && user.role !== 'admin') {
    return <Navigate to="/customer/dashboard" replace />;
  }

  const navItems = [
    { to: '/author/dashboard', end: true, label: 'Overview', icon: LayoutDashboard },
    { to: '/author/profile', label: 'Author Profile', icon: User },
    { to: '/author/submit', label: 'Submit Manuscript', icon: FileUp },
    { to: '/author/manuscripts', label: 'My Manuscripts', icon: FileText },
    { to: '/author/cover-upload', label: 'Upload Book Cover', icon: Image },
    { to: '/author/book-management', label: 'Book Details Mgmt', icon: BookCheck },
    { to: '/author/packages', label: 'Publishing Packages', icon: Package },
    { to: '/author/requests', label: 'Publishing Requests', icon: GitPullRequest },
    { to: '/author/feedback', label: 'Admin Feedback', icon: MessageSquareText },
    { to: '/author/published-books', label: 'Published Books', icon: BookOpen },
    { to: '/author/sales-analytics', label: 'Sales Analytics', icon: BarChart3 },
    { to: '/author/royalties', label: 'Royalty Reports', icon: DollarSign },
    { to: '/author/notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EAF1F7] text-[#202020]">
      <Navbar />
      <div className="flex grow max-w-7xl w-full mx-auto pt-16">
        <Sidebar items={navItems} title="Author Studio" />
        <main className="grow p-6 md:p-8 overflow-y-auto max-w-5xl">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AuthorLayout;
