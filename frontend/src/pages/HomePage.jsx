import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Feather,
  ArrowRight,
  Sparkles,
  Package,
  Globe,
  Upload,
  Layers,
} from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/books');
        setBooks(res.data?.slice(0, 4) || []);
      } catch (e) {
        console.warn('Using local fallback books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const selfPublishingSteps = [
    {
      step: '01',
      title: 'Submit Your Manuscript',
      desc: 'Send your raw draft, novel, or thesis. Our editorial desk verifies formatting and requirements.',
      icon: Upload,
    },
    {
      step: '02',
      title: 'Editing & Formatting',
      desc: 'Professional interior typesetting, custom cover illustration, and official ISBN allocation.',
      icon: Layers,
    },
    {
      step: '03',
      title: 'Printing & Packaging',
      desc: 'Premium hardcover and paperback editions printed with high-grade archival binding.',
      icon: Package,
    },
    {
      step: '04',
      title: 'Global Distribution & Royalties',
      desc: 'Distribute across leading online retail platforms with 100% author copyright retention.',
      icon: Globe,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section matching #202020 + #48779E Border */}
      <section className="bg-[#202020] text-white py-14 md:py-20 px-4 sm:px-6 lg:px-8 border-b-2 border-[#48779E] relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#48779E] text-xs tracking-wider text-[#EAF1F7]">
              <Sparkles className="w-3.5 h-3.5 text-[#48779E]" />
              Official Self-Publishing & Literary Press
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-brand font-bold tracking-tight text-white leading-tight">
              KA GROUP OF PUBLICATION
            </h1>

            <p className="text-xl md:text-2xl font-heading italic text-[#A8B9C8]">
              "Where Words Become Legacy."
            </p>

            <p className="text-sm md:text-base text-[#EAF1F7]/85 max-w-xl font-sans leading-relaxed">
              Empowering writers, scholars, and poets to transform raw ideas into professionally published, ISBN-registered books distributed worldwide.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link to="/submissions">
                <button className="bg-[#48779E] hover:bg-[#3A6486] text-white font-semibold text-sm px-6 py-2.5 rounded-md shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer">
                  <Feather className="w-4 h-4" />
                  Self-Publish Your Book
                </button>
              </Link>
              <Link to="/catalogue">
                <button className="bg-white/10 hover:bg-white/20 text-white border border-[#A8B9C8]/50 font-medium text-sm px-5 py-2.5 rounded-md transition-all duration-200 flex items-center gap-2 cursor-pointer">
                  <BookOpen className="w-4 h-4" />
                  Explore Catalogue
                </button>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-5 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-lg font-brand font-bold text-white">100%</p>
                <p className="text-[10px] text-[#A8B9C8] uppercase font-semibold">Author Rights</p>
              </div>
              <div>
                <p className="text-lg font-brand font-bold text-white">ISBN</p>
                <p className="text-[10px] text-[#A8B9C8] uppercase font-semibold">Registration</p>
              </div>
              <div>
                <p className="text-lg font-brand font-bold text-white">Global</p>
                <p className="text-[10px] text-[#A8B9C8] uppercase font-semibold">Distribution</p>
              </div>
            </div>
          </div>

          {/* Right: Logo Emblem & Typography Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
            <div className="relative group">
              {/* Clean Logo Circle with only the Emblem */}
              <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-white p-5 shadow-2xl flex items-center justify-center border-4 border-[#48779E] transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/logo-emblem.png"
                  alt="KA Group Of Publication Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Typography & Tagline Outside Circle */}
            <div className="mt-5 space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                KA Group Of Publication
              </h3>
              <p className="text-xs sm:text-sm font-serif italic text-[#A8B9C8]">
                Where words become legacy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Publishing Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#48779E] font-semibold">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#202020]">
            How Self-Publishing Works With Us
          </h2>
          <p className="text-xs sm:text-sm text-[#A8B9C8] font-medium">
            Publish your poetry anthology, academic thesis, or novel with full editorial and distribution support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {selfPublishingSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-[#A8B9C8] shadow-xs hover:shadow-md hover:border-[#48779E] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-brand font-bold text-[#48779E]">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#EAF1F7] flex items-center justify-center text-[#48779E]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-base text-[#202020] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#202020]/75 leading-relaxed font-sans">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Releases from MongoDB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#A8B9C8] pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#48779E] font-semibold">
              Live Database Archive
            </span>
            <h2 className="text-2xl font-heading font-bold text-[#202020] mt-1">
              Curated Releases & Monographs
            </h2>
          </div>
          <Link
            to="/catalogue"
            className="mt-2 md:mt-0 text-sm font-semibold text-[#48779E] hover:text-[#3A6486] flex items-center gap-1.5"
          >
            Explore all titles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Retrieving books from MongoDB archive..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-xl border border-[#A8B9C8] overflow-hidden shadow-xs hover:shadow-md hover:border-[#48779E] transition-all flex flex-col justify-between p-5"
              >
                <div>
                  <div className="h-48 overflow-hidden rounded-md mb-4 bg-slate-100">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-[#48779E] bg-[#EAF1F7] px-2 py-0.5 rounded">
                    {book.genre}
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#202020] mt-2 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-[#A8B9C8] font-medium mt-0.5">By {book.authorName}</p>
                  <p className="text-xs text-[#202020]/75 mt-2 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#A8B9C8] flex items-center justify-between">
                  <span className="font-brand font-bold text-base text-[#202020]">
                    ${book.price ? book.price.toFixed(2) : '24.99'}
                  </span>
                  <Link to="/catalogue">
                    <button className="text-xs font-semibold bg-[#48779E] hover:bg-[#3A6486] text-white px-3 py-1.5 rounded transition-colors cursor-pointer">
                      View Book
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
