import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ArrowLeft, BookOpen, User, Calendar, Hash, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const FORMATS = ['Paperback', 'Hardcover', 'eBook'];

const StarRating = ({ rating = 0, size = 'sm' }) => {
  const cls = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${cls} ${s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-[#A8B9C8]'}`} />
      ))}
    </div>
  );
};

const BookDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('Paperback');
  const [inWishlist, setInWishlist] = useState(false);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const bookRes = await api.get(`/books/${id}`);
        const b = bookRes.data?.book ?? bookRes.data?.data ?? bookRes.data;
        setBook(b);
        // Fetch reviews
        try {
          const revRes = await api.get(`/reviews/book/${id}`);
          setReviews(revRes.data.reviews ?? []);
        } catch {}
        // Fetch related books (same genre)
        if (b?.genre) {
          try {
            const relRes = await api.get('/books', { params: { genre: b.genre, limit: 4 } });
            setRelatedBooks((relRes.data.books ?? []).filter((rb) => rb._id !== id));
          } catch {}
        }
      } catch {
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) { showToast('Please sign in to add to cart.', 'error'); return; }
    setAdding(true);
    const result = await addToCart(book._id, 1, selectedFormat.toLowerCase(), book.price);
    setAdding(false);
    if (result.success) showToast('Added to cart!');
    else showToast(result.message, 'error');
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { showToast('Please sign in.', 'error'); return; }
    try {
      await api.post('/wishlist/toggle', { bookId: book._id });
      setInWishlist((p) => !p);
      showToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch {}
  };

  if (loading) return <div className="flex justify-center py-32"><LoadingSpinner message="Loading book…" /></div>;
  if (!book) return (
    <div className="min-h-screen bg-[#EAF1F7] flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl font-semibold text-[#202020] mb-2">Book not found</p>
        <Link to="/books" className="text-[#48779E] hover:underline text-sm">← Back to Books</Link>
      </div>
    </div>
  );

  const authorName =
    book.authorName ||
    (typeof book.author === 'object' ? book.author?.name || book.author?.penName : book.author) ||
    'KA Press Author';

  return (
    <div className="min-h-screen bg-[#EAF1F7]">
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-2.5 rounded shadow-lg text-sm font-medium ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#A8B9C8] mb-6">
          <Link to="/" className="hover:text-[#48779E]">Home</Link>
          <span>/</span>
          <Link to="/books" className="hover:text-[#48779E]">{t('nav.books')}</Link>
          <span>/</span>
          <span className="text-[#202020]">{book.title}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-10 mb-12">
          {/* Left: Cover */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-[#A8B9C8] rounded-2xl overflow-hidden aspect-[3/4] max-w-sm mx-auto w-full shadow-md">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#EAF1F7]">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 text-[#48779E]/30 mx-auto mb-3" />
                    <p className="text-[#A8B9C8] text-sm">{book.title}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col gap-4">
            <div>
              {book.genre && (
                <span className="text-xs font-semibold uppercase tracking-widest text-[#48779E] bg-[#48779E]/10 px-2.5 py-1 rounded-full">
                  {book.genre}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#202020] mt-2 leading-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                {book.title}
              </h1>
              <p className="text-[#A8B9C8] text-base mt-1">by {authorName}</p>
              {book.subtitle && <p className="text-[#A8B9C8] italic text-sm mt-1">{book.subtitle}</p>}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={book.rating} size="lg" />
              <span className="text-sm text-[#202020] font-semibold">{Number(book.rating ?? 0).toFixed(1)}</span>
              <span className="text-sm text-[#A8B9C8]">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#202020]">₹{book.price}</span>
              {book.originalPrice > book.price && (
                <>
                  <span className="text-lg text-[#A8B9C8] line-through">₹{book.originalPrice}</span>
                  <span className="text-sm font-semibold text-green-600">
                    {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {/* Format Selector */}
            <div>
              <p className="text-xs font-semibold text-[#202020] uppercase tracking-wide mb-2">Format</p>
              <div className="flex gap-2 flex-wrap">
                {FORMATS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFormat(f)}
                    className={`px-4 py-2 text-sm rounded-lg border font-medium transition-all ${
                      selectedFormat === f
                        ? 'bg-[#48779E] text-white border-[#48779E]'
                        : 'bg-white text-[#202020] border-[#A8B9C8] hover:border-[#48779E]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all shadow ${
                  isInCart(book._id)
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-[#48779E] hover:bg-[#3A6486] text-white'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {adding ? 'Adding…' : isInCart(book._id) ? 'In Cart ✓' : t('books.addToCart')}
              </button>
              <button
                onClick={handleWishlist}
                className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all ${
                  inWishlist ? 'bg-rose-50 border-rose-300 text-rose-500' : 'bg-white border-[#A8B9C8] text-[#A8B9C8] hover:border-rose-300 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Meta info */}
            <div className="bg-white border border-[#A8B9C8] rounded-xl p-4 grid grid-cols-2 gap-3">
              {[
                { icon: BookOpen, label: 'Pages', value: book.pages ?? '—' },
                { icon: Globe, label: 'Language', value: book.language ?? '—' },
                { icon: Hash, label: 'ISBN', value: book.isbn ?? '—' },
                { icon: Calendar, label: 'Published', value: book.publishedDate ? new Date(book.publishedDate).getFullYear() : '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#48779E] shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#A8B9C8] uppercase tracking-wide">{label}</p>
                    <p className="text-xs font-semibold text-[#202020]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div className="bg-white border border-[#A8B9C8] rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#202020] mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              About This Book
            </h2>
            <p className="text-sm text-[#202020]/80 leading-relaxed">{book.description}</p>
          </div>
        )}

        {/* Reviews */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-[#202020] mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Reader Reviews
          </h2>
          {reviews.length === 0 ? (
            <div className="bg-white border border-[#A8B9C8] rounded-xl p-6 text-center">
              <p className="text-[#A8B9C8] text-sm">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reviews.map((r) => (
                <div key={r._id} className="bg-white border border-[#A8B9C8] rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#48779E] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {r.user?.name?.charAt(0) ?? 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#202020]">{r.user?.name ?? 'Reader'}</p>
                        <p className="text-xs text-[#A8B9C8]">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <StarRating rating={r.rating} />
                  </div>
                  {r.title && <p className="text-sm font-semibold text-[#202020] mb-1">{r.title}</p>}
                  {r.comment && <p className="text-sm text-[#202020]/80">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-[#202020] mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedBooks.map((rb) => (
                <Link
                  key={rb._id}
                  to={`/books/${rb._id}`}
                  className="bg-white border border-[#A8B9C8] rounded-xl overflow-hidden hover:shadow-md transition-all group"
                >
                  <div className="aspect-[3/4] bg-[#EAF1F7] overflow-hidden">
                    {rb.coverImage ? (
                      <img src={rb.coverImage} alt={rb.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-[#48779E]/40">{rb.title?.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold text-[#202020] line-clamp-2">{rb.title}</p>
                    <p className="text-xs font-bold text-[#48779E] mt-1">₹{rb.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
