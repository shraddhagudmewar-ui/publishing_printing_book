import React, { useState } from 'react';
import { Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, Feather, FileText, BookOpen, Layers, 
  GitPullRequest, Package, Printer, ShoppingCart, CreditCard, 
  Boxes, Truck, Star, Globe, BarChart4, Bell, Settings, User, 
  LogOut, ChevronLeft, ChevronRight, Menu, Search, ShieldCheck, Image 
} from 'lucide-react';

const AdminLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin access guard
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/dashboard', end: true, label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Customer Management', icon: Users },
    { to: '/admin/books', label: 'Book Management', icon: BookOpen },
    { to: '/admin/categories', label: 'Category Management', icon: Layers },
    { to: '/admin/printing', label: 'Printing Management', icon: Printer },
    { to: '/admin/orders', label: 'Order Management', icon: ShoppingCart },
    { to: '/admin/payments', label: 'Payment Management', icon: CreditCard },
    { to: '/admin/inventory', label: 'Inventory Management', icon: Boxes },
    { to: '/admin/delivery', label: 'Delivery Management', icon: Truck },
    { to: '/admin/gallery', label: 'Photo Gallery', icon: Image },

  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EAF1F7] text-[#202020]">
      {/* ── Top Admin Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#202020] border-b-2 border-[#48779E] h-16 flex items-center justify-between px-4 sm:px-6 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-[#EAF1F7] hover:bg-white/10 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white p-0.5 border border-[#48779E] flex items-center justify-center shrink-0">
              <img src="/logo-emblem.png" alt="KA Group" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-bold text-white tracking-wider" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
                KA PUBLISHER CONSOLE
              </span>
              <span className="text-[9px] text-[#A8B9C8] uppercase font-mono tracking-widest">
                Executive Administration
              </span>
            </div>
          </Link>
        </div>

        {/* Right side Profile & Notification */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="text-xs text-[#EAF1F7]/80 hover:text-white px-2.5 py-1 rounded border border-white/20 hover:border-[#48779E] hidden md:inline-block transition-colors"
          >
            View Live Press ↗
          </Link>

          <Link
            to="/admin/notifications"
            className="relative p-2 text-[#EAF1F7] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-white/20">
            <div className="w-7 h-7 rounded-full bg-[#48779E] text-white flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:block text-left text-xs leading-none">
              <p className="font-bold text-white">{user?.name}</p>
              <p className="text-[9px] text-[#A8B9C8] uppercase font-mono mt-0.5">Publisher/Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-1.5 text-[#EAF1F7]/80 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Layout Body ── */}
      <div className="flex grow pt-16">
        {/* Collapsible Sidebar */}
        <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white border-r border-[#A8B9C8] flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 shadow-xs overflow-y-auto`}>
          <div className="py-3 px-2 space-y-1">
            {!collapsed && (
              <div className="px-3 py-1.5 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A8B9C8]">
                  Management Modules
                </span>
              </div>
            )}

            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = window.location.pathname === item.to || (item.end && window.location.pathname === '/admin');

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#48779E] text-white shadow-xs'
                        : 'text-[#202020] hover:bg-[#EAF1F7] hover:text-[#48779E]'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors mt-4"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Logout Session</span>}
              </button>
            </nav>
          </div>

          {!collapsed && (
            <div className="p-3 m-2 rounded-xl bg-[#EAF1F7] border border-[#A8B9C8]/60 text-[11px] text-[#202020]">
              <div className="flex items-center gap-1.5 font-bold text-[#48779E]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Tier Active</span>
              </div>
              <p className="text-[10px] text-[#202020]/75 mt-0.5">Full CRUD Authorizations</p>
            </div>
          )}
        </aside>

        {/* Dynamic Outlet for all 20 modules */}
        <main className="grow p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
