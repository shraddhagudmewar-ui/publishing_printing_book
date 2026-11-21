import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      if (result.user?.role === 'admin') navigate('/admin/dashboard');
      else navigate('/customer/dashboard');
    } else {
      setError(result.error);
    }
  };

  const fillQuickDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@kagroup.com');
      setPassword('password123');
    } else {
      setEmail('customer@kagroup.com');
      setPassword('password123');
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-xl shadow-md border border-[#A8B9C8] overflow-hidden">
        {/* Left Side: Brand Panel */}
        <div className="lg:col-span-5 bg-[#202020] p-8 sm:p-10 text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r-2 border-[#48779E] relative">
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-3 shadow-md max-w-[240px] mx-auto lg:mx-0 flex flex-col items-center border border-[#A8B9C8]">
              <img
                src="/logo-lockup.png"
                alt="KA Group Of Publication"
                className="w-full h-auto object-contain"
              />
            </div>

            <div>
              <p className="text-sm font-heading italic text-[#A8B9C8]">
                "Where Words Become Legacy."
              </p>
              <p className="text-xs text-[#EAF1F7]/80 mt-2 leading-relaxed font-sans">
                Official portal for readers, writers, and administrative press staff. Synced directly with MongoDB Compass for real-time publishing and order tracking.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2.5 text-xs text-[#EAF1F7]/90">
                <CheckCircle2 className="w-4 h-4 text-[#48779E] shrink-0" />
                <span>Publishing Requests & Manuscript Submissions</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#EAF1F7]/90">
                <CheckCircle2 className="w-4 h-4 text-[#48779E] shrink-0" />
                <span>Online Bookstore, Cart & Courier Tracking</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#EAF1F7]/90">
                <CheckCircle2 className="w-4 h-4 text-[#48779E] shrink-0" />
                <span>Live MongoDB Database Persistence</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 text-[11px] text-[#A8B9C8] flex justify-between">
            <span>Editorial Desk</span>
            <span className="font-mono text-white/80">press@kagroup.com</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-[#202020]">
                Sign In to Account
              </h2>
              <p className="text-xs text-[#A8B9C8] font-semibold uppercase tracking-wider mt-1">
                Customer & Administrative Portal
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 border border-[#A8B9C8] rounded-md text-sm text-[#202020] bg-[#EAF1F7]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#48779E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 border border-[#A8B9C8] rounded-md text-sm text-[#202020] bg-[#EAF1F7]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#48779E]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#48779E] hover:bg-[#3A6486] text-white font-medium py-2.5 px-4 rounded-md text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <LogIn className="w-4 h-4" />
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            {/* Quick Demo Fill Buttons */}
            <div className="pt-4 border-t border-[#A8B9C8]/40">
              <p className="text-[11px] text-[#A8B9C8] uppercase font-bold text-center mb-2.5 tracking-wider">
                Instant Demo Access (Seeded in MongoDB)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('customer')}
                  className="text-xs py-2 px-3 border border-[#A8B9C8] rounded-md hover:border-[#48779E] hover:bg-[#EAF1F7] text-[#202020] font-medium transition-all text-center cursor-pointer"
                >
                  📖 Customer / Reader
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin')}
                  className="text-xs py-2 px-3 border border-[#A8B9C8] rounded-md hover:border-[#48779E] hover:bg-[#EAF1F7] text-[#202020] font-medium transition-all text-center cursor-pointer"
                >
                  🛡️ Admin / Publisher
                </button>
              </div>
            </div>

            <div className="text-center pt-1">
              <Link to="/register" className="text-xs text-[#48779E] hover:underline font-medium">
                Don't have an account? Register as Customer →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(name, email, password, 'customer');
    if (result.success) {
      navigate('/customer/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-xl shadow-md border border-[#A8B9C8] overflow-hidden">
        {/* Left Side: Brand Panel */}
        <div className="lg:col-span-5 bg-[#202020] p-8 sm:p-10 text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r-2 border-[#48779E] relative">
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-3 shadow-md max-w-[240px] mx-auto lg:mx-0 flex flex-col items-center border border-[#A8B9C8]">
              <img
                src="/logo-lockup.png"
                alt="KA Group Of Publication"
                className="w-full h-auto object-contain"
              />
            </div>

            <div>
              <h3 className="text-xl font-heading font-bold text-white">
                Join KA Group of Publications
              </h3>
              <p className="text-xs text-[#EAF1F7]/80 mt-2 leading-relaxed">
                Create your customer account to purchase books, track deliveries, and submit book publishing requests directly from your customer portal.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 text-[11px] text-[#A8B9C8]">
            KA Group of Publications © {new Date().getFullYear()}
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-[#202020]">
                Create Customer Account
              </h2>
              <p className="text-xs text-[#48779E] font-semibold uppercase tracking-wider mt-1">
                Access bookstore orders and submit publishing requests
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full px-3.5 py-2.5 border border-[#A8B9C8] rounded-md text-sm text-[#202020] bg-[#EAF1F7]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#48779E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. radhika@example.com"
                  className="w-full px-3.5 py-2.5 border border-[#A8B9C8] rounded-md text-sm text-[#202020] bg-[#EAF1F7]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#48779E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 border border-[#A8B9C8] rounded-md text-sm text-[#202020] bg-[#EAF1F7]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#48779E]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#48779E] hover:bg-[#3A6486] text-white font-medium py-2.5 px-4 rounded-md text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <UserPlus className="w-4 h-4" />
                {loading ? 'Creating Account...' : 'Register Account'}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-[#A8B9C8]/40">
              <p className="text-xs text-[#202020]/80">
                Already have an account?{' '}
                <Link to="/login" className="text-[#48779E] hover:underline font-medium">
                  Sign in here →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
