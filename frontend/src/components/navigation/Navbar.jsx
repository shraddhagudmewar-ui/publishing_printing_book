import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X, Feather, ShoppingCart, Globe, ChevronDown, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

// Language options
const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'हि', name: 'हिंदी' },
  { code: 'mr', label: 'म', name: 'मराठी' },
];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const navigate = useNavigate();

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  // Close lang dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/customer/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/customer/dashboard';
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium tracking-wide transition-all px-4 py-1.5 rounded-lg whitespace-nowrap text-center ${
      isActive
        ? 'bg-[#48779E] text-white shadow-sm font-semibold'
        : 'text-[#EAF1F7]/85 hover:text-white hover:bg-white/10'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#202020] border-b-2 border-[#48779E] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Brand Logo ──────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-white rounded-full p-0.5 border border-[#48779E]/60 shadow-sm">
              <img
                src="/logo-emblem.png"
                alt="KA Group Emblem"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-bold tracking-widest text-white group-hover:text-slate-200 transition-colors uppercase" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
                KA Group of Publication
              </span>
              <span className="text-[9px] text-[#A8B9C8] tracking-widest uppercase font-medium">
                Where Words Become Legacy
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links (Equally Spread) ─────────── */}
          <nav className="hidden lg:flex items-center justify-evenly flex-1 mx-4 xl:mx-10">
            <NavLink to="/" end className={navLinkClass}>{t('nav.home')}</NavLink>
            <NavLink to="/about" className={navLinkClass}>{t('nav.about')}</NavLink>
            <NavLink to="/books" className={navLinkClass}>{t('nav.books')}</NavLink>
            <NavLink to="/categories" className={navLinkClass}>{t('nav.categories')}</NavLink>
            <NavLink to="/gallery" className={navLinkClass}>Gallery</NavLink>
            {isAuthenticated && (
              <NavLink to={getDashboardLink()} className={navLinkClass}>{t('nav.workspace')}</NavLink>
            )}
          </nav>

          {/* ── Right: Cart + Lang + Auth ─────────────────── */}
          <div className="hidden md:flex items-center gap-2 shrink-0">

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-xs font-medium text-[#EAF1F7] hover:text-white px-2.5 py-1.5 rounded border border-white/20 hover:border-[#48779E] transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-[#A8B9C8]" />
                <span>{currentLang.label}</span>
                <ChevronDown className={`w-3 h-3 text-[#A8B9C8] transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-[#2a2a2a] border border-[#48779E]/40 rounded shadow-lg z-50 overflow-hidden min-w-[120px]">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2 ${
                        i18n.language === lang.code
                          ? 'bg-[#48779E] text-white'
                          : 'text-[#EAF1F7] hover:bg-white/10'
                      }`}
                    >
                      <span className="font-semibold w-5">{lang.label}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-9 h-9 rounded border border-white/20 hover:border-[#48779E] text-[#EAF1F7] hover:text-white transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#48779E] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-1.5 text-xs bg-white/10 text-white px-2.5 py-1.5 rounded border border-[#A8B9C8]/40 hover:border-[#48779E] transition-all"
                >
                  <User className="w-3.5 h-3.5 text-[#48779E]" />
                  <span className="font-medium max-w-[80px] truncate">{user.name}</span>
                  <span className="text-[9px] bg-[#48779E] text-white px-1.5 py-0.5 rounded uppercase font-mono">
                    {user.role}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs font-medium text-[#EAF1F7] hover:text-white px-2.5 py-1.5 rounded border border-[#A8B9C8]/40 hover:bg-rose-900/50 hover:border-rose-700 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-medium text-[#EAF1F7] hover:text-white px-3 py-1.5 rounded border border-white/20 hover:border-[#48779E] transition-all"
                >
                  {t('nav.signin')}
                </Link>
                <Link
                  to="/submissions"
                  className="text-xs font-semibold bg-[#48779E] hover:bg-[#3A6486] text-white px-3.5 py-1.5 rounded shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Feather className="w-3.5 h-3.5" />
                  {t('nav.publishBook')}
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Hamburger ─────────────────────────── */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Cart */}
            <Link to="/cart" className="relative text-[#EAF1F7]">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#48779E] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#EAF1F7] hover:text-white p-1.5 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ─────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#202020] border-t border-white/10 px-4 pt-3 pb-5 space-y-1">
          {[
            { to: '/', label: t('nav.home'), end: true },
            { to: '/about', label: t('nav.about') },
            { to: '/books', label: t('nav.books') },
            { to: '/categories', label: t('nav.categories') },
            { to: '/gallery', label: 'Gallery' },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 px-2 text-sm rounded transition-colors ${
                  isActive
                    ? 'bg-[#48779E] text-white font-semibold'
                    : 'text-[#EAF1F7] hover:text-[#48779E]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Mobile Language Selector */}
          <div className="pt-2 border-t border-white/10">
            <p className="text-[10px] text-[#A8B9C8] uppercase tracking-widest mb-2 px-2">Language</p>
            <div className="flex gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-all ${
                    i18n.language === lang.code
                      ? 'bg-[#48779E] border-[#48779E] text-white'
                      : 'border-white/20 text-[#EAF1F7] hover:border-[#48779E]'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-white py-2 px-2"
                >
                  Go to {user.role?.toUpperCase()} Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-sm font-medium text-white bg-rose-900/50 border border-rose-700 py-2 rounded"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center text-sm font-medium text-white border border-[#A8B9C8]/40 py-2 rounded"
                >
                  {t('nav.signin')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center text-sm font-semibold bg-[#48779E] text-white py-2 rounded"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
