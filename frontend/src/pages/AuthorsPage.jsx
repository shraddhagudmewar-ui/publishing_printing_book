import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Globe, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthorCard = ({ author }) => {
  const name = author.penName || author.user?.name || 'Unknown Author';
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-white border border-[#A8B9C8] rounded-2xl p-6 hover:shadow-md transition-all flex flex-col items-center text-center group">
      {/* Avatar */}
      {author.avatar ? (
        <img
          src={author.avatar}
          alt={name}
          className="w-20 h-20 rounded-full object-cover border-2 border-[#48779E]/30 mb-4 group-hover:border-[#48779E] transition-colors"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-[#48779E] flex items-center justify-center mb-4 text-white text-2xl font-bold border-2 border-[#48779E]/30 group-hover:border-[#48779E] transition-colors">
          {initials}
        </div>
      )}

      {/* Name + verified */}
      <div className="flex items-center gap-1.5 mb-1">
        <h3 className="text-base font-bold text-[#202020]" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          {name}
        </h3>
        {author.isVerified && (
          <span className="w-4 h-4 rounded-full bg-[#48779E] flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">✓</span>
          </span>
        )}
      </div>

      {/* Genres */}
      {author.genres?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mb-3">
          {author.genres.slice(0, 3).map((g) => (
            <span key={g} className="text-[10px] bg-[#EAF1F7] text-[#48779E] border border-[#A8B9C8] px-2 py-0.5 rounded-full font-medium">
              {g}
            </span>
          ))}
        </div>
      )}

      {/* Bio */}
      {author.bio && (
        <p className="text-xs text-[#A8B9C8] leading-relaxed mb-4 line-clamp-3">{author.bio}</p>
      )}

      {/* Stats */}
      <div className="flex gap-4 text-center border-t border-[#EAF1F7] pt-3 w-full justify-center mb-4">
        <div>
          <p className="text-sm font-bold text-[#202020]">{author.totalBooks ?? 0}</p>
          <p className="text-[10px] text-[#A8B9C8] uppercase tracking-wide">Books</p>
        </div>
        {author.totalSales != null && (
          <div>
            <p className="text-sm font-bold text-[#202020]">{author.totalSales}</p>
            <p className="text-[10px] text-[#A8B9C8] uppercase tracking-wide">Sales</p>
          </div>
        )}
      </div>

      {/* Social links */}
      <div className="flex items-center gap-2">
        {author.website && (
          <a href={author.website} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg border border-[#A8B9C8] flex items-center justify-center text-[#A8B9C8] hover:text-[#48779E] hover:border-[#48779E] transition-all">
            <Globe className="w-3.5 h-3.5" />
          </a>
        )}
        {author.twitter && (
          <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg border border-[#A8B9C8] flex items-center justify-center text-[#A8B9C8] hover:text-[#48779E] hover:border-[#48779E] transition-all">
            <Mail className="w-3.5 h-3.5" />
          </a>
        )}
        <Link
          to={`/books?search=${encodeURIComponent(name)}`}
          className="flex items-center gap-1 text-xs font-semibold text-[#48779E] hover:text-[#3A6486] transition-colors ml-2"
        >
          <BookOpen className="w-3.5 h-3.5" />
          View Books
        </Link>
      </div>
    </div>
  );
};

const AuthorsPage = () => {
  const { t } = useTranslation();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/authors');
        setAuthors(res.data.authors ?? []);
      } catch {
        setAuthors([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = authors.filter((a) => {
    const name = a.penName || a.user?.name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#EAF1F7]">
      {/* Header */}
      <div className="bg-[#202020] py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
          {t('nav.authors')}
        </h1>
        <p className="text-[#A8B9C8] text-sm">Meet the talented voices behind our publications</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search authors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-[#A8B9C8] rounded-lg bg-white text-[#202020] placeholder-[#A8B9C8] focus:outline-none focus:border-[#48779E]"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner message="Loading authors…" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#202020] font-semibold">{search ? 'No authors match your search.' : 'No authors yet.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((author) => (
              <AuthorCard key={author._id} author={author} />
            ))}
          </div>
        )}

        {/* Become an Author CTA */}
        <div className="mt-12 bg-[#202020] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
            Are You an Author?
          </h2>
          <p className="text-[#A8B9C8] text-sm mb-6 max-w-lg mx-auto">
            Join our growing community of published authors. We provide end-to-end publishing support, 
            professional editing, beautiful cover design and wide distribution.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-[#48779E] hover:bg-[#3A6486] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all"
          >
            Register as Author
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthorsPage;
