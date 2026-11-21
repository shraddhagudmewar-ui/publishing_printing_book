import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CartPage = () => {
  const { t } = useTranslation();
  const { cartItems, cartTotal, cartLoading, removeFromCart, addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRemove = async (bookId) => {
    const res = await removeFromCart(bookId);
    if (res.success) showToast('Item removed');
    else showToast(res.message, 'error');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#EAF1F7] flex items-center justify-center px-4">
        <div className="text-center bg-white border border-[#A8B9C8] rounded-2xl p-10 max-w-sm w-full shadow">
          <ShoppingCart className="w-16 h-16 text-[#A8B9C8] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#202020] mb-2">{t('cart.title')}</h2>
          <p className="text-[#A8B9C8] text-sm mb-6">Please sign in to view your cart.</p>
          <Link
            to="/login"
            className="inline-block bg-[#48779E] hover:bg-[#3A6486] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
          >
            {t('nav.signin')}
          </Link>
        </div>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-[#EAF1F7] flex justify-center items-center">
        <LoadingSpinner message={t('common.loading')} />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#EAF1F7] flex items-center justify-center px-4">
        <div className="text-center bg-white border border-[#A8B9C8] rounded-2xl p-10 max-w-sm w-full shadow">
          <ShoppingCart className="w-16 h-16 text-[#A8B9C8] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#202020] mb-2">{t('cart.empty')}</h2>
          <p className="text-[#A8B9C8] text-sm mb-6">{t('cart.emptyHint')}</p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 bg-[#48779E] hover:bg-[#3A6486] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
          >
            <BookOpen className="w-4 h-4" />
            {t('cart.browse')}
          </Link>
        </div>
      </div>
    );
  }

  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + tax;

  return (
    <div className="min-h-screen bg-[#EAF1F7]">
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-2.5 rounded shadow-lg text-sm font-medium ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#202020] py-10 px-4 text-center">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
          {t('cart.title')}
        </h1>
        <p className="text-[#A8B9C8] text-sm mt-1">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const book = item.book ?? {};
              const price = book.price ?? 0;
              const qty = item.quantity ?? 1;
              const title = book.title ?? 'Unknown Book';
              const authorName = typeof book.author === 'object'
                ? book.author?.penName || book.author?.user?.name || 'Unknown'
                : book.author || 'Unknown';

              return (
                <div key={item._id ?? book._id} className="bg-white border border-[#A8B9C8] rounded-xl p-4 flex gap-4">
                  {/* Book cover thumbnail */}
                  <Link to={`/books/${book._id}`} className="shrink-0">
                    <div className="w-16 h-20 bg-[#EAF1F7] rounded-lg overflow-hidden border border-[#A8B9C8]/50">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-lg font-bold text-[#48779E]/40">{title.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/books/${book._id}`}>
                      <h3 className="text-sm font-semibold text-[#202020] hover:text-[#48779E] transition-colors line-clamp-2">{title}</h3>
                    </Link>
                    <p className="text-xs text-[#A8B9C8] mt-0.5">{authorName}</p>
                    {item.format && (
                      <span className="text-[10px] bg-[#EAF1F7] text-[#48779E] border border-[#A8B9C8] px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
                        {item.format}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#A8B9C8]">{t('cart.quantity')}:</span>
                        <div className="flex items-center gap-1 border border-[#A8B9C8] rounded-lg overflow-hidden">
                          <button
                            onClick={() => qty > 1 && addToCart(book._id, qty - 1, item.format, price, true)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-[#EAF1F7] text-[#202020] transition-colors disabled:opacity-30"
                            disabled={qty <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold text-[#202020] px-2">{qty}</span>
                          <button
                            onClick={() => addToCart(book._id, qty + 1, item.format, price, true)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-[#EAF1F7] text-[#202020] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Price + Remove */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#202020]">₹{price * qty}</span>
                        <button
                          onClick={() => handleRemove(book._id)}
                          className="text-[#A8B9C8] hover:text-red-500 transition-colors"
                          title={t('cart.remove')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#A8B9C8] rounded-xl p-5 sticky top-24">
              <h2 className="text-base font-bold text-[#202020] mb-4 pb-2 border-b border-[#EAF1F7]" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Order Summary
              </h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-[#202020]">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-semibold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-[#A8B9C8]">
                  <span>GST (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-[#A8B9C8]">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">{cartTotal >= 500 ? 'Free' : '₹50'}</span>
                </div>
              </div>
              <div className="border-t border-[#EAF1F7] pt-3 flex justify-between font-bold text-[#202020] mb-5">
                <span>{t('cart.total')}</span>
                <span className="text-lg">₹{cartTotal >= 500 ? grandTotal : grandTotal + 50}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 bg-[#48779E] hover:bg-[#3A6486] text-white py-3 rounded-xl font-semibold text-sm transition-all"
              >
                {t('cart.checkout')} <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/books"
                className="block text-center text-xs text-[#48779E] hover:text-[#3A6486] mt-3 transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
