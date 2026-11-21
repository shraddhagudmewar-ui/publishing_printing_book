import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Heart, ShoppingCart, Star, SlidersHorizontal, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const FORMATS = ['Paperback', 'Hardcover', 'eBook'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];
const LANGUAGES = ['English', 'Hindi', 'Marathi'];

const StarRating = ({ rating = 0 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-3 h-3 ${s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-[#A8B9C8]'}`}
      />
    ))}
    <span className="text-[11px] text-[#A8B9C8] ml-1">{Number(rating).toFixed(1)}</span>
  </div>
);

const BookCard = ({ book, onAddToCart, wishlistIds, onToggleWishlist }) => {
  const { t } = useTranslation();
  const { isInCart } = useCart();
  const [selectedFormat, setSelectedFormat] = useState('Paperback');
  const [adding, setAdding] = useState(false);
  const inCart = isInCart(book._id);
  const inWishlist = wishlistIds.includes(book._id);

  const handleAddToCart = async () => {
    setAdding(true);
    await onAddToCart(book._id, 1, selectedFormat.toLowerCase(), book.price);
    setAdding(false);
  };

  return (
    <div className="bg-white border border-[#A8B9C8] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
      {/* Book Cover */}
      <Link to={`/books/${book._id}`} className="relative block overflow-hidden bg-[#EAF1F7] aspect-[3/4]">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 bg-[#48779E]/20 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-[#48779E]">
                {book.title?.charAt(0) ?? 'B'}
              </span>
            </div>
            <p className="text-xs text-[#A8B9C8] text-center font-medium">{book.title}</p>
          </div>
        )}
        {book.isBestseller && (
          <span className="absolute top-2 left-2 bg-[#48779E] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Bestseller
          </span>
        )}
        {book.isNewRelease && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            New
          </span>
        )}
        {/* Wishlist button overlay */}
        <button
          onClick={(e) => { e.preventDefault(); onToggleWishlist(book._id); }}
          className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow ${
            inWishlist ? 'bg-rose-500 text-white' : 'bg-white/80 text-[#A8B9C8] hover:text-rose-500'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <Link to={`/books/${book._id}`}>
            <h3 className="text-sm font-semibold text-[#202020] leading-snug hover:text-[#48779E] transition-colors line-clamp-2">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-[#A8B9C8] mt-0.5">
            {typeof book.author === 'object' ? book.author?.penName || book.author?.user?.name : book.author}
          </p>
        </div>

        <StarRating rating={book.rating} />

        {/* Format Selector */}
        <div className="flex gap-1 flex-wrap">
          {FORMATS.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFormat(f)}
              className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                selectedFormat === f
                  ? 'bg-[#48779E] text-white border-[#48779E]'
                  : 'border-[#A8B9C8] text-[#A8B9C8] hover:border-[#48779E]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div>
            <span className="text-base font-bold text-[#202020]">₹{book.price}</span>
            {book.originalPrice && book.originalPrice > book.price && (
              <span className="text-xs text-[#A8B9C8] line-through ml-1.5">₹{book.originalPrice}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
              inCart
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-[#48779E] hover:bg-[#3A6486] text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {adding ? '…' : inCart ? t('books.inCart') : t('books.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

const BooksPage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  // Filters from URL params
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const language = searchParams.get('language') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);

  const updateParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    if (key !== 'page') p.delete('page');
    setSearchParams(p);
  };

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.genre = category;
      if (language) params.language = language;
      if (sort) params.sort = sort;
      params.page = page;
      params.limit = 12;
      const res = await api.get('/books', { params });
      setBooks(res.data.books ?? []);
      setPagination({
        total: res.data.total ?? 0,
        page: res.data.page ?? 1,
        pages: res.data.pages ?? 1,
      });
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, language, sort, page]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      const list = res.data.categories || res.data.data || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch {}
  };

  useEffect(() => { fetchBooks(); }, [fetchBooks]);
  useEffect(() => { fetchCategories(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async (bookId, qty, format, price) => {
    if (!isAuthenticated) {
      showToast('Please sign in to add items to cart.', 'error');
      return;
    }
    const book = books.find(b => b._id === bookId);
    const itemPrice = price || book?.price;
    const result = await addToCart(bookId, qty, format, itemPrice);
    if (result.success) showToast('Added to cart!');
    else showToast(result.message, 'error');
  };

  const handleToggleWishlist = async (bookId) => {
    if (!isAuthenticated) { showToast('Please sign in to use wishlist.', 'error'); return; }
    try {
      await api.post('/wishlist/toggle', { bookId });
      setWishlistIds((prev) =>
        prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
      );
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#EAF1F7]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-2.5 rounded shadow-lg text-sm font-medium transition-all ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="bg-[#202020] py-10 px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
          {t('books.title')}
        </h1>
        <p className="text-[#A8B9C8] text-sm">Explore our complete collection of published titles</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B9C8]" />
            <input
              type="text"
              placeholder={t('books.search')}
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#A8B9C8] rounded-lg bg-white text-[#202020] placeholder-[#A8B9C8] focus:outline-none focus:border-[#48779E]"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="px-3 py-2.5 text-sm border border-[#A8B9C8] rounded-lg bg-white text-[#202020] focus:outline-none focus:border-[#48779E]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[#A8B9C8] rounded-lg bg-white text-[#202020] hover:border-[#48779E] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t('books.filter')}
          </button>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className="bg-white border border-[#A8B9C8] rounded-xl p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-[#202020] uppercase tracking-wide mb-1.5 block">Category</label>
              <select
                value={category}
                onChange={(e) => updateParam('category', e.target.value)}
                className="w-full text-sm border border-[#A8B9C8] rounded-lg px-2 py-1.5 bg-[#EAF1F7] text-[#202020] focus:outline-none focus:border-[#48779E]"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            {/* Language */}
            <div>
              <label className="text-xs font-semibold text-[#202020] uppercase tracking-wide mb-1.5 block">{t('books.language')}</label>
              <select
                value={language}
                onChange={(e) => updateParam('language', e.target.value)}
                className="w-full text-sm border border-[#A8B9C8] rounded-lg px-2 py-1.5 bg-[#EAF1F7] text-[#202020] focus:outline-none focus:border-[#48779E]"
              >
                <option value="">All Languages</option>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            {/* Clear */}
            <div className="flex items-end">
              <button
                onClick={() => setSearchParams({})}
                className="flex items-center gap-1 text-xs text-[#A8B9C8] hover:text-[#202020] transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Results info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[#A8B9C8]">
            {pagination.total} book{pagination.total !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner message="Loading books…" /></div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#202020] font-semibold text-lg">{t('books.noBooks')}</p>
            <p className="text-[#A8B9C8] text-sm mt-1">{t('books.noBooksHint')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onAddToCart={handleAddToCart}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => updateParam('page', String(p))}
                className={`w-9 h-9 rounded-lg text-sm font-medium border transition-all ${
                  p === pagination.page
                    ? 'bg-[#48779E] text-white border-[#48779E]'
                    : 'bg-white text-[#202020] border-[#A8B9C8] hover:border-[#48779E]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;
