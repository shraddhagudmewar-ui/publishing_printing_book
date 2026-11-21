import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

// A set of gradient pairs for category cards (cycles through)
const CARD_STYLES = [
  { bg: '#48779E', light: '#EAF1F7' },
  { bg: '#3A6486', light: '#EAF1F7' },
  { bg: '#202020', light: '#A8B9C8' },
  { bg: '#5a8aad', light: '#EAF1F7' },
  { bg: '#2d5a7a', light: '#EAF1F7' },
  { bg: '#1a4a6b', light: '#A8B9C8' },
];

const CategoriesPage = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/categories');
        const list = res.data.categories || res.data.data || [];
        setCategories(Array.isArray(list) ? list : []);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-[#EAF1F7]">
      {/* Header */}
      <div className="bg-[#202020] py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
          {t('nav.categories')}
        </h1>
        <p className="text-[#A8B9C8] text-sm max-w-xl mx-auto">
          {t('home.categoriesSub')}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner message="Loading categories…" /></div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-[#A8B9C8] mx-auto mb-4" />
            <p className="text-[#202020] font-semibold">No categories yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const style = CARD_STYLES[idx % CARD_STYLES.length];
              return (
                <Link
                  key={cat._id}
                  to={`/books?category=${encodeURIComponent(cat.name)}`}
                  className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                  style={{ background: style.bg }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-24 h-24 border-2 border-white rounded-full" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 border border-white rounded-full" />
                  </div>

                  <div className="relative p-6 flex flex-col gap-3 min-h-[160px]">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
                        {cat.name}
                      </h2>
                      {cat.description && (
                        <p className="text-xs line-clamp-2" style={{ color: style.light + 'cc' }}>
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {cat.bookCount != null && (
                        <span className="text-xs font-medium" style={{ color: style.light + 'aa' }}>
                          {cat.bookCount ?? 0} books
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-xs font-semibold text-white group-hover:gap-2 transition-all">
                        Browse <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center bg-white border border-[#A8B9C8] rounded-2xl p-8">
          <h2 className="text-xl font-bold text-[#202020] mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Can't find what you're looking for?
          </h2>
          <p className="text-[#A8B9C8] text-sm mb-4">
            Browse our complete catalogue or use the search to find specific titles.
          </p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 bg-[#48779E] hover:bg-[#3A6486] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
          >
            Browse All Books <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
