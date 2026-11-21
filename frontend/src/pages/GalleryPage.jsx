import React, { useState, useEffect } from 'react';
import { Image, Camera, Plus, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const GalleryPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePhoto, setActivePhoto] = useState(null);

  // Admin Upload Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    imageUrl: '',
    caption: '',
    category: 'Events & Releases',
  });
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gallery');
      setPhotos(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load gallery photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const categories = ['All', ...new Set(photos.map((p) => p.category).filter(Boolean))];

  const filteredPhotos =
    selectedCategory === 'All'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!form.title || !form.imageUrl) {
      setErrorMsg('Please provide both a title and an image URL.');
      return;
    }

    setUploading(true);
    try {
      await api.post('/gallery', form);
      setShowModal(false);
      setForm({ title: '', imageUrl: '', caption: '', category: 'Events & Releases' });
      fetchPhotos();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add image to gallery.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this photo from the gallery?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      fetchPhotos();
      if (activePhoto?._id === id) setActivePhoto(null);
    } catch (err) {
      alert(err.message || 'Failed to remove photo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF1F7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-[#202020] text-white rounded-2xl p-8 sm:p-12 border-b-4 border-[#48779E] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A8B9C8] bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Photographic Archive
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              Press & Literary Gallery
            </h1>
            <p className="text-[#A8B9C8] text-sm sm:text-base leading-relaxed">
              Explore moments from our national book launches, literary conclaves, master printing press, and editorial symposiums.
            </p>
          </div>

          {isAdmin && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowModal(true)}
              className="shrink-0 shadow-lg"
            >
              Add New Photo
            </Button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#A8B9C8]/40 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#48779E] text-white shadow-sm'
                  : 'bg-white text-[#202020] hover:bg-white/80 border border-[#A8B9C8]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner message="Opening archival photographic collection..." />
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#A8B9C8] space-y-4 shadow-sm">
            <Camera className="w-12 h-12 text-[#A8B9C8] mx-auto" />
            <h3 className="font-serif font-bold text-lg text-[#202020]">No Photographs In This Section</h3>
            <p className="text-xs text-[#A8B9C8] max-w-md mx-auto">
              Photos uploaded by the administration for this category will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo._id}
                onClick={() => setActivePhoto(photo)}
                className="group bg-white rounded-2xl overflow-hidden border border-[#A8B9C8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#202020]">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[11px] text-white/90 line-clamp-2">{photo.caption}</span>
                  </div>
                  <span className="absolute top-3 left-3 bg-[#202020]/80 backdrop-blur-md text-[#EAF1F7] text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-wider">
                    {photo.category}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={(e) => handleDeletePhoto(photo._id, e)}
                      title="Delete photo"
                      className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                  <h3 className="font-serif font-bold text-sm text-[#202020] group-hover:text-[#48779E] transition-colors line-clamp-1">
                    {photo.title}
                  </h3>
                  {photo.caption && (
                    <p className="text-xs text-[#202020]/70 line-clamp-2">{photo.caption}</p>
                  )}
                  <div className="pt-2 border-t border-[#EAF1F7] flex items-center justify-between text-[10px] text-[#A8B9C8]">
                    <span>{new Date(photo.createdAt).toLocaleDateString()}</span>
                    <span className="text-[#48779E] font-semibold group-hover:underline">View Photo ↗</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: View Photo Lightbox */}
        {activePhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActivePhoto(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-[#202020] flex items-center justify-center overflow-hidden">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => setActivePhoto(null)}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                >
                  ✕ Close
                </button>
              </div>
              <div className="p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#48779E]/10 text-[#48779E] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {activePhoto.category}
                  </span>
                  <span className="text-xs text-[#A8B9C8]">
                    {new Date(activePhoto.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-serif font-bold text-[#202020]">{activePhoto.title}</h2>
                {activePhoto.caption && (
                  <p className="text-xs sm:text-sm text-[#202020]/80 leading-relaxed">
                    {activePhoto.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Admin Add Photo Form */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#A8B9C8] space-y-5 animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#EAF1F7] pb-3">
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-[#48779E]" />
                  <h3 className="font-serif font-bold text-lg text-[#202020]">Add Photo to Gallery</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-xs text-[#A8B9C8] hover:text-[#202020]"
                >
                  ✕
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleAddPhoto} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#202020] mb-1">Photo Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Book Fair 2026 Exhibition"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7] text-[#202020]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#202020] mb-1">Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/... or cloud image URL"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7] text-[#202020]"
                  />
                  {form.imageUrl && (
                    <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-[#A8B9C8] bg-black">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-[#202020] mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7] text-[#202020]"
                  >
                    <option value="Events & Releases">Events & Releases</option>
                    <option value="Book Launches">Book Launches</option>
                    <option value="Conferences">Conferences</option>
                    <option value="Press & Production">Press & Production</option>
                    <option value="Literary Events">Literary Events</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#202020] mb-1">Caption / Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the event or photo..."
                    value={form.caption}
                    onChange={(e) => setForm({ ...form, caption: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7] text-[#202020]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={uploading}>
                    {uploading ? 'Adding...' : 'Save & Publish Photo'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GalleryPage;
