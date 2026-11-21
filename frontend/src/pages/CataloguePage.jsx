import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';

const CataloguePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [activeBookModal, setActiveBookModal] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/books');
        setBooks(res.data || []);
      } catch (e) {
        console.error('Failed to load books', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const genres = ['All', 'Philosophy & Literary Arts', 'Historical Fiction', 'Academic & Science', 'Classics & Anthology'];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#A8B9C8]/60 pb-6">
        <h1 className="text-3xl font-serif font-bold text-[#202020]">Publishing Catalogue</h1>
        <p className="text-xs text-[#A8B9C8] uppercase tracking-wider mt-1 font-medium">
          Comprehensive archive of published monographs, collections, and literature
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-md border border-[#A8B9C8] shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#A8B9C8]" />
          <input
            type="text"
            placeholder="Search by title, author, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#A8B9C8] rounded text-sm text-[#202020] focus:outline-none focus:border-[#48779E]"
          />
        </div>

        {/* Genre Selector */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-[#48779E] text-white shadow-xs'
                  : 'bg-[#EAF1F7] text-[#202020] hover:bg-slate-200'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <LoadingSpinner message="Accessing library catalog..." />
      ) : filteredBooks.length === 0 ? (
        <div className="bg-white border border-[#A8B9C8] rounded p-12 text-center">
          <BookOpen className="w-12 h-12 text-[#A8B9C8] mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-[#202020]">No titles matched your search</h3>
          <p className="text-xs text-[#202020]/70 mt-1">Try resetting the query filter or searching for another author.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book._id} hoverable className="flex flex-col h-full justify-between">
              <div>
                <div className="h-44 -mx-6 -mt-6 mb-4 bg-slate-200 overflow-hidden">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#48779E] bg-[#EAF1F7] px-2 py-0.5 rounded">
                  {book.genre}
                </span>
                <h3 className="font-serif font-bold text-base text-[#202020] mt-2 line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-xs text-[#A8B9C8] font-medium mt-0.5">By {book.authorName}</p>
                <p className="text-xs text-[#202020]/75 mt-2 line-clamp-3 leading-relaxed">
                  {book.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#A8B9C8]/30 flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#202020]">
                  ${book.price ? book.price.toFixed(2) : '29.99'}
                </span>
                <Button variant="primary" size="sm" onClick={() => setActiveBookModal(book)}>
                  Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Book Detail Modal */}
      <Modal
        isOpen={!!activeBookModal}
        onClose={() => setActiveBookModal(null)}
        title={activeBookModal ? activeBookModal.title : 'Book Details'}
      >
        {activeBookModal && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <img
                src={activeBookModal.coverImage}
                alt={activeBookModal.title}
                className="w-28 h-40 object-cover rounded border border-[#A8B9C8] shrink-0"
              />
              <div className="space-y-1">
                <span className="text-xs text-[#48779E] font-semibold uppercase tracking-wider">
                  {activeBookModal.genre}
                </span>
                <h4 className="font-serif font-bold text-lg text-[#202020]">{activeBookModal.title}</h4>
                <p className="text-xs text-[#A8B9C8]">Author: {activeBookModal.authorName}</p>
                <p className="text-xs text-[#202020]/80">Pages: {activeBookModal.pages || 320}</p>
                <p className="text-xs text-[#202020]/80">Language: {activeBookModal.language || 'English'}</p>
                <p className="font-serif font-bold text-base text-[#202020] pt-1">
                  Price: ${activeBookModal.price ? activeBookModal.price.toFixed(2) : '29.99'}
                </p>
              </div>
            </div>
            <div className="border-t border-[#A8B9C8]/40 pt-3">
              <h5 className="text-xs uppercase font-semibold text-[#A8B9C8] tracking-wider mb-1">
                Synopsis
              </h5>
              <p className="text-xs text-[#202020] leading-relaxed">{activeBookModal.description}</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setActiveBookModal(null)}>
                Close
              </Button>
              <Button variant="primary" size="sm" onClick={() => alert('Order placed into Reading Library')}>
                Acquire Hardcover Edition
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CataloguePage;
