import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, BookOpen, Heart, Star, MapPin, CreditCard, 
  Bell, KeyRound, User, Download, CheckCircle, Clock, Truck, 
  PackageCheck, FileUp, FileText, CheckCircle2, AlertCircle, Upload, Printer, Layers
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ORDER_STEPS = ['Placed', 'Confirmed', 'Processing', 'Printing', 'Shipped', 'Delivered'];

const getStepIndex = (status) => {
  const map = {
    'placed': 0,
    'confirmed': 1,
    'processing': 2,
    'printing': 3,
    'dispatched': 4,
    'shipped': 4,
    'in_transit': 4,
    'delivered': 5,
  };
  return map[status?.toLowerCase()] ?? 2;
};

const CustomerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentTab = location.pathname.split('/')[2] || 'dashboard';

  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [publishingRequests, setPublishingRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [printingRequests, setPrintingRequests] = useState([]);
  const [printForm, setPrintForm] = useState({
    bookTitle: '',
    quantity: 50,
    paperQuality: '70 GSM Natural Shade',
    coverFinish: 'Matte Velvet with Gold Foil',
    deliveryAddress: '',
  });
  const [printPdfFile, setPrintPdfFile] = useState(null);
  const [printSubmitting, setPrintSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Address form
  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', streetAddress: '', city: '', state: '', postalCode: '', isDefault: false
  });
  // Password form
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  // Publishing Request Form
  const [publishForm, setPublishForm] = useState({
    title: '',
    subtitle: '',
    genre: 'Fiction',
    description: '',
    language: 'English',
    targetWordCount: 45000,
    packageSelected: '',
    manuscriptFileUrl: '',
    sampleChapterUrl: '',
    coverImageUrl: '',
    authorBio: user?.bio || '',
    format: 'Paperback',
  });

  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [uploadingFile, setUploadingFile] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [orderRes, wishRes, addrRes, payRes, notifRes, pubRes, catRes, pkgRes, printRes] = await Promise.allSettled([
        api.get('/orders'),
        api.get('/wishlist'),
        api.get('/addresses'),
        api.get('/payments'),
        api.get('/notifications'),
        api.get('/publishing'),
        api.get('/categories'),
        api.get('/packages'),
        api.get('/printing'),
      ]);

      if (orderRes.status === 'fulfilled') setOrders(orderRes.value.data?.orders || orderRes.value.data?.data || []);
      if (wishRes.status === 'fulfilled') setWishlist(wishRes.value.data?.books || []);
      if (addrRes.status === 'fulfilled') setAddresses(addrRes.value.data?.addresses || []);
      if (payRes.status === 'fulfilled') setPayments(payRes.value.data?.payments || []);
      if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data?.notifications || []);
      if (pubRes.status === 'fulfilled') setPublishingRequests(pubRes.value.data?.data || []);
      if (catRes.status === 'fulfilled') {
        const catList = catRes.value.data?.categories || catRes.value.data?.data || [];
        setCategories(Array.isArray(catList) ? catList : []);
      }
      if (pkgRes.status === 'fulfilled') setPackages(pkgRes.value.data?.packages || []);
      if (printRes.status === 'fulfilled') setPrintingRequests(printRes.value.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentTab]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post('/addresses', addressForm);
      setStatusMsg({ type: 'success', text: 'Address saved successfully!' });
      setAddressForm({ fullName: '', phone: '', streetAddress: '', city: '', state: '', postalCode: '', isDefault: false });
      fetchData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to save address' });
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete address');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    try {
      await api.put('/auth/updatedetails', { password: passwordForm.newPassword });
      setStatusMsg({ type: 'success', text: 'Password updated successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to update password' });
    }
  };

  // Submit Publishing Request
  const handleSubmitPublishing = async (e) => {
    e.preventDefault();
    try {
      await api.post('/publishing', {
        title: publishForm.title,
        genre: publishForm.genre,
        abstract: `${publishForm.subtitle ? publishForm.subtitle + ' — ' : ''}${publishForm.description}\nAuthor Bio: ${publishForm.authorBio}`,
        targetWordCount: Number(publishForm.targetWordCount),
        packageSelected: publishForm.packageSelected || undefined,
        manuscriptFileUrl: publishForm.manuscriptFileUrl || 'https://storage.kagroup.com/manuscripts/sample-draft.docx',
        sampleChapterUrl: publishForm.sampleChapterUrl,
      });

      setStatusMsg({ type: 'success', text: 'Book publishing request submitted successfully to KA Group Editorial Desk!' });
      setPublishForm({
        title: '', subtitle: '', genre: 'Fiction', description: '', language: 'English',
        targetWordCount: 45000, packageSelected: '', manuscriptFileUrl: '', sampleChapterUrl: '',
        coverImageUrl: '', authorBio: '', format: 'Paperback'
      });
      fetchData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err?.response?.data?.message || 'Publishing submission failed.' });
    }
  };

  // ── Handle Print Request Submission ──────────────────────────────
  const handleSubmitPrintRequest = async (e) => {
    e.preventDefault();
    if (!printForm.bookTitle.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter a book title for the print request.' });
      return;
    }
    if (!printForm.deliveryAddress.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter a delivery address.' });
      return;
    }
    setPrintSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('bookTitle', printForm.bookTitle);
      formData.append('quantity', printForm.quantity);
      formData.append('paperQuality', printForm.paperQuality);
      formData.append('coverFinish', printForm.coverFinish);
      formData.append('deliveryAddress', printForm.deliveryAddress);
      if (printPdfFile) {
        formData.append('pdf', printPdfFile);
      }

      await api.post('/printing', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatusMsg({ type: 'success', text: `Print request for "${printForm.bookTitle}" submitted! KA Printworks will contact you shortly.` });
      setPrintForm({
        bookTitle: '',
        quantity: 50,
        paperQuality: '70 GSM Natural Shade',
        coverFinish: 'Matte Velvet with Gold Foil',
        deliveryAddress: '',
      });
      setPrintPdfFile(null);
      const fileInput = document.getElementById('printPdfInput');
      if (fileInput) fileInput.value = '';
      fetchData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err?.message || err?.response?.data?.message || 'Failed to submit print request.' });
    } finally {
      setPrintSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner message="Loading customer dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {statusMsg.text && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${statusMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>
          {statusMsg.text}
        </div>
      )}

      {/* ── 1. DASHBOARD OVERVIEW ── */}
      {(currentTab === 'dashboard' || !currentTab) && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#202020]">Welcome Back, {user?.name}</h1>
              <p className="text-xs text-[#A8B9C8]">Customer Account • {user?.email}</p>
            </div>
            <div className="flex gap-2">
              <Link to="/customer/publish">
                <Button variant="primary" icon={FileUp}>Submit Book to Publish</Button>
              </Link>
              <Link to="/books">
                <Button variant="outline">Browse Bookstore</Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#A8B9C8] space-y-1 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#A8B9C8]">My Orders</span>
              <p className="text-2xl font-bold text-[#202020]">{orders.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#A8B9C8] space-y-1 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#A8B9C8]">Publishing Requests</span>
              <p className="text-2xl font-bold text-[#48779E]">{publishingRequests.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#A8B9C8] space-y-1 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#A8B9C8]">Wishlist Titles</span>
              <p className="text-2xl font-bold text-[#202020]">{wishlist.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#A8B9C8] space-y-1 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#A8B9C8]">Unread Alerts</span>
              <p className="text-2xl font-bold text-amber-600">{notifications.filter(n => !n.isRead).length}</p>
            </div>
          </div>

          {/* Book Publishing Requests Status Tracker */}
          <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-base text-[#202020]">My Book Publishing Inquests</h2>
              <Link to="/customer/publish" className="text-xs font-semibold text-[#48779E] hover:underline">Submit New Work →</Link>
            </div>

            {publishingRequests.length === 0 ? (
              <p className="text-xs text-[#A8B9C8] py-2">
                Have a manuscript or book idea? Click "Submit Book to Publish" to have our editors review and publish your work!
              </p>
            ) : (
              <div className="space-y-3">
                {publishingRequests.slice(0, 3).map((pr) => (
                  <div key={pr._id} className="border border-[#EAF1F7] p-4 rounded-xl space-y-2 bg-[#EAF1F7]/30">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#202020] text-sm">{pr.title}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#48779E] text-white">
                        {pr.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#202020]/75 line-clamp-2">{pr.abstract}</p>
                    {pr.editorialFeedback && (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                        <strong>Editorial Board Feedback:</strong> {pr.editorialFeedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-base text-[#202020]">Recent Book Orders & Trackers</h2>
              <Link to="/customer/orders" className="text-xs font-semibold text-[#48779E] hover:underline">View All Orders →</Link>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-[#A8B9C8] py-2">No orders placed yet. Explore our published titles!</p>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map((ord) => {
                  const stepIdx = getStepIndex(ord.orderStatus);
                  return (
                    <div key={ord._id} className="border border-[#EAF1F7] p-4 rounded-xl space-y-3 bg-[#EAF1F7]/30">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="font-mono font-bold text-[#202020]">Order #{ord.orderNumber}</span>
                          <span className="text-[#A8B9C8] ml-2">• ₹{ord.totalAmount}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wide font-bold bg-[#48779E]/10 text-[#48779E]">
                          Status: {ord.orderStatus}
                        </span>
                      </div>

                      {/* Visual Order Tracker */}
                      <div className="pt-2">
                        <div className="flex justify-between items-center text-[10px] font-semibold text-[#202020] mb-2">
                          {ORDER_STEPS.map((s, idx) => (
                            <span key={s} className={idx <= stepIdx ? 'text-[#48779E]' : 'text-[#A8B9C8]'}>
                              {s}
                            </span>
                          ))}
                        </div>
                        <div className="w-full bg-[#EAF1F7] h-2 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-[#48779E] h-full transition-all duration-500 rounded-full" 
                            style={{ width: `${((stepIdx + 1) / ORDER_STEPS.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Literary Categories & Imprints ── */}
          <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-base text-[#202020]">Literary Categories & Imprints</h2>
                <p className="text-xs text-[#A8B9C8]">Explore published books across all editorial genres</p>
              </div>
              <Link to="/categories" className="text-xs font-semibold text-[#48779E] hover:underline flex items-center gap-1">
                View All Categories →
              </Link>
            </div>

            {categories.length === 0 ? (
              <p className="text-xs text-[#A8B9C8] py-2">No categories available at the moment.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((c) => (
                  <Link
                    key={c._id || c.name}
                    to={`/books?category=${encodeURIComponent(c.name)}`}
                    className="p-3.5 rounded-xl border border-[#A8B9C8]/50 bg-[#EAF1F7]/40 hover:bg-[#EAF1F7] hover:border-[#48779E] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-6 h-6 rounded-md bg-[#48779E]/15 text-[#48779E] flex items-center justify-center text-xs font-bold shrink-0">
                          <Layers className="w-3.5 h-3.5" />
                        </span>
                        <h4 className="font-bold text-xs text-[#202020] group-hover:text-[#48779E] transition-colors truncate">
                          {c.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                        {c.description || 'Editorial catalog imprint'}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#48779E] font-semibold mt-2 block group-hover:underline">
                      Explore Titles →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 2. SUBMIT BOOK PUBLISHING REQUEST (FROM CUSTOMER PORTAL) ── */}
      {currentTab === 'publish' && (
        <div className="space-y-6">
          <div className="border-b border-[#A8B9C8]/40 pb-4">
            <h1 className="text-2xl font-serif font-bold text-[#202020]">Submit Book Publishing Request</h1>
            <p className="text-xs text-[#A8B9C8]">
              Upload your manuscript (PDF/DOCX), enter your synopsis, and our editorial board will review, edit, and publish your volume.
            </p>
          </div>

          <form onSubmit={handleSubmitPublishing} className="bg-white p-6 md:p-8 rounded-2xl border border-[#A8B9C8] space-y-5 shadow-xs">
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Book Title *</label>
                <input required placeholder="e.g. Whispers of the High Himalayas" value={publishForm.title} onChange={(e) => setPublishForm({ ...publishForm, title: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Subtitle / Series</label>
                <input placeholder="e.g. Chronicles of Sacred Peaks" value={publishForm.subtitle} onChange={(e) => setPublishForm({ ...publishForm, subtitle: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Genre & Category *</label>
                <select value={publishForm.genre} onChange={(e) => setPublishForm({ ...publishForm, genre: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]">
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Poetry">Poetry</option>
                  <option value="Academic">Academic & Scholarly</option>
                  <option value="Memoir">Memoir & Autobiography</option>
                  <option value="Philosophy">Philosophy & Culture</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Primary Language *</label>
                <select value={publishForm.language} onChange={(e) => setPublishForm({ ...publishForm, language: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]">
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Bilingual">Bilingual</option>
                </select>
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Estimated Word Count</label>
                <input type="number" value={publishForm.targetWordCount} onChange={(e) => setPublishForm({ ...publishForm, targetWordCount: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Select Publishing Package</label>
                <select value={publishForm.packageSelected} onChange={(e) => setPublishForm({ ...publishForm, packageSelected: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]">
                  <option value="">-- Choose Publication Tier --</option>
                  {packages.map(p => (
                    <option key={p._id} value={p._id}>{p.name} (₹{p.price} • {p.royaltyPercentage}% Royalty)</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block uppercase font-bold text-[#202020] mb-1">Book Description & Thematic Synopsis *</label>
                <textarea required rows={4} placeholder="Summarize your narrative, chapter outline, and core premise..." value={publishForm.description} onChange={(e) => setPublishForm({ ...publishForm, description: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Manuscript File URL (PDF/DOCX) *</label>
                <input placeholder="https://cloud.storage/manuscript-draft.docx" value={publishForm.manuscriptFileUrl} onChange={(e) => setPublishForm({ ...publishForm, manuscriptFileUrl: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Optional Book Cover Image URL</label>
                <input placeholder="https://cloud.storage/cover.jpg" value={publishForm.coverImageUrl} onChange={(e) => setPublishForm({ ...publishForm, coverImageUrl: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>

              <div className="col-span-2">
                <label className="block uppercase font-bold text-[#202020] mb-1">Author Bio for Back Cover</label>
                <textarea rows={2} placeholder="Author bio to appear on published copies..." value={publishForm.authorBio} onChange={(e) => setPublishForm({ ...publishForm, authorBio: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Submit Manuscript for Editorial Review
            </Button>
          </form>

          {/* Existing Requests List */}
          <div className="space-y-4 pt-4">
            <h2 className="font-serif font-bold text-lg text-[#202020]">My Submitted Requests</h2>
            {publishingRequests.length === 0 ? (
              <p className="text-xs text-[#A8B9C8]">No requests submitted yet.</p>
            ) : (
              publishingRequests.map(pr => (
                <div key={pr._id} className="bg-white p-5 rounded-2xl border border-[#A8B9C8] space-y-2 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-[#202020]">{pr.title}</h4>
                      <p className="text-xs text-[#A8B9C8]">Genre: {pr.genre} • Words: {pr.targetWordCount}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#48779E] text-white">
                      {pr.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#202020]/75">{pr.abstract}</p>
                  {pr.editorialFeedback && (
                    <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-900">
                      <strong>Editorial Desk Feedback:</strong> {pr.editorialFeedback}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── 3. MY ORDERS & TRACKING ── */}
      {currentTab === 'orders' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">My Orders & Physical Tracking</h1>

          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-[#A8B9C8] text-center space-y-3 shadow-xs">
              <ShoppingBag className="w-12 h-12 text-[#A8B9C8] mx-auto" />
              <p className="text-sm font-semibold text-[#202020]">No Orders Found</p>
              <Link to="/books"><Button variant="primary">Browse Bookstore</Button></Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((ord) => {
                const stepIdx = getStepIndex(ord.orderStatus);
                return (
                  <div key={ord._id} className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between border-b border-[#EAF1F7] pb-3 gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-[#202020]">Order #{ord.orderNumber}</h3>
                        <p className="text-xs text-[#A8B9C8]">Date: {new Date(ord.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-[#202020]">₹{ord.totalAmount}</span>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase">{ord.paymentStatus}</p>
                      </div>
                    </div>

                    {/* Stepper Progress */}
                    <div className="bg-[#EAF1F7]/40 p-4 rounded-xl space-y-2">
                      <div className="text-xs font-semibold text-[#202020] flex items-center justify-between">
                        <span>Courier Pipeline:</span>
                        <span className="text-[#48779E] font-bold uppercase text-[11px]">{ord.orderStatus}</span>
                      </div>
                      <div className="grid grid-cols-6 gap-1 text-[9px] font-bold text-center">
                        {ORDER_STEPS.map((step, idx) => (
                          <div key={step} className={`py-1 rounded ${idx <= stepIdx ? 'bg-[#48779E] text-white' : 'bg-white text-[#A8B9C8] border border-[#A8B9C8]/40'}`}>
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Book Items */}
                    <div className="space-y-2">
                      {ord.items?.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-[#202020] border-b border-[#EAF1F7] py-1.5">
                          <span>{it.title || 'Volume Edition'} × {it.quantity}</span>
                          <span className="font-bold">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-[#A8B9C8]">
                      Delivering to: <span className="text-[#202020] font-medium">{ord.shippingAddress?.fullName}, {ord.shippingAddress?.streetAddress}, {ord.shippingAddress?.city} ({ord.shippingAddress?.postalCode})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── 3.5 PRINTING REQUESTS ── */}
      {currentTab === 'printing' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#202020]">My Printing Requests</h1>
            <p className="text-xs text-[#A8B9C8] mt-1">Order custom print runs of your books — KA Printworks delivers to your doorstep</p>
          </div>

          {/* ── Submit New Print Request Form ── */}
          <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] shadow-xs">
            <h3 className="font-serif font-bold text-sm text-[#202020] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#48779E] text-white rounded-full text-xs flex items-center justify-center font-bold">+</span>
              Request New Print Run
            </h3>
            <form onSubmit={handleSubmitPrintRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block uppercase font-bold text-[#202020] mb-1">Book Title *</label>
                  <input
                    required
                    placeholder="Enter the name of the book to print"
                    value={printForm.bookTitle}
                    onChange={e => setPrintForm({ ...printForm, bookTitle: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7] text-[#202020]"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-[#202020] mb-1">Number of Copies *</label>
                  <input
                    required
                    type="number"
                    min="5"
                    max="10000"
                    value={printForm.quantity}
                    onChange={e => setPrintForm({ ...printForm, quantity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7] text-[#202020] font-mono"
                  />
                  <p className="text-[10px] text-[#A8B9C8] mt-0.5">Minimum 5 copies</p>
                </div>

                <div>
                  <label className="block uppercase font-bold text-[#202020] mb-1">Paper Quality</label>
                  <select
                    value={printForm.paperQuality}
                    onChange={e => setPrintForm({ ...printForm, paperQuality: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7] text-[#202020]"
                  >
                    <option value="70 GSM Natural Shade">70 GSM Natural Shade (Economy)</option>
                    <option value="80 GSM Royal Bond">80 GSM Royal Bond (Standard)</option>
                    <option value="100 GSM Archival Cream">100 GSM Archival Cream (Premium)</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-bold text-[#202020] mb-1">Cover Finish</label>
                  <select
                    value={printForm.coverFinish}
                    onChange={e => setPrintForm({ ...printForm, coverFinish: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7] text-[#202020]"
                  >
                    <option value="Matte Velvet with Gold Foil">Matte Velvet with Gold Foil (₹85/copy)</option>
                    <option value="Gloss Laminated">Gloss Laminated (₹85/copy)</option>
                    <option value="Hardcover Cloth Bound">Hardcover Cloth Bound (₹140/copy)</option>
                  </select>
                </div>

                <div>
                  {/* Estimated Cost Display */}
                  <label className="block uppercase font-bold text-[#202020] mb-1">Estimated Cost</label>
                  <div className="p-2.5 rounded border border-[#48779E] bg-[#48779E]/10 text-[#48779E] font-bold text-sm">
                    ₹{printForm.quantity * (printForm.coverFinish.includes('Hardcover') ? 140 : 85)}
                    <span className="text-[10px] font-normal text-[#A8B9C8] ml-1">
                      ({printForm.quantity} copies × ₹{printForm.coverFinish.includes('Hardcover') ? 140 : 85})
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block uppercase font-bold text-[#202020] mb-1">Delivery Address *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Full delivery address — House/Flat No., Street, City, State, PIN Code"
                    value={printForm.deliveryAddress}
                    onChange={e => setPrintForm({ ...printForm, deliveryAddress: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7] text-[#202020] resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block uppercase font-bold text-[#202020] mb-1">
                    Upload Book Manuscript / PDF (Optional)
                  </label>
                  <input
                    id="printPdfInput"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={e => setPrintPdfFile(e.target.files[0] || null)}
                    className="w-full p-2 rounded border border-[#A8B9C8] bg-[#EAF1F7] text-[#202020] text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#48779E] file:text-white hover:file:bg-[#3A6486] cursor-pointer"
                  />
                  <p className="text-[10px] text-[#A8B9C8] mt-1">Upload the print-ready PDF file for your book (Max 50MB).</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={printSubmitting}
                  className="px-6 py-2.5 bg-[#48779E] hover:bg-[#3A6486] disabled:bg-[#A8B9C8] text-white rounded-lg font-bold text-xs transition-all flex items-center gap-2"
                >
                  {printSubmitting ? (
                    <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
                  ) : (
                    '🖨 Submit Print Request'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── Existing Print Requests List ── */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#202020]">My Print Requests ({printingRequests.length})</h3>
            {printingRequests.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-[#A8B9C8] text-center shadow-xs">
                <p className="text-xs text-[#A8B9C8]">No print requests yet. Submit your first request above!</p>
              </div>
            ) : (
              printingRequests.map(pr => {
                const statusColors = {
                  pending: 'bg-yellow-100 text-yellow-800',
                  submitted: 'bg-blue-100 text-blue-800',
                  in_progress: 'bg-orange-100 text-orange-800',
                  quality_check: 'bg-purple-100 text-purple-800',
                  completed: 'bg-emerald-100 text-emerald-800',
                  dispatched: 'bg-teal-100 text-teal-800',
                  delivered: 'bg-green-100 text-green-800',
                };
                return (
                  <div key={pr._id} className="bg-white p-5 rounded-2xl border border-[#A8B9C8] shadow-xs">
                    <div className="flex flex-wrap justify-between items-start gap-3">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-[#202020]">{pr.bookTitle}</h4>
                        <p className="text-xs text-[#A8B9C8]">
                          {pr.quantity} copies • {pr.paperQuality} • {pr.coverFinish}
                        </p>
                        <p className="text-xs text-[#48779E] font-bold">Estimated: ₹{pr.estimatedCost}</p>
                        <p className="text-[11px] text-[#202020]/70">📦 Deliver to: {pr.deliveryAddress}</p>
                        {pr.pdfUrl && (
                          <a
                            href={`http://localhost:5000/${pr.pdfUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-[#48779E] hover:underline font-bold mt-1.5"
                          >
                            📄 View / Download Uploaded PDF
                          </a>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[pr.status] || 'bg-gray-100 text-gray-700'}`}>
                          {pr.status?.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-[#A8B9C8]">
                          {new Date(pr.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── 4. EBOOK LIBRARY & DOWNLOADS ── */}
      {(currentTab === 'library' || currentTab === 'downloads') && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Digital Monograph Library & Downloads</h1>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-3 shadow-xs">
              <BookOpen className="w-8 h-8 text-[#48779E]" />
              <h3 className="font-bold text-sm text-[#202020]">Heritage of the Sahyadris</h3>
              <p className="text-xs text-[#A8B9C8]">Digital PDF Edition • Granted Permanent Archival Access</p>
              <Button variant="outline" size="sm" icon={Download}>Download E-Book (PDF)</Button>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-3 shadow-xs">
              <BookOpen className="w-8 h-8 text-[#48779E]" />
              <h3 className="font-bold text-sm text-[#202020]">Whispers of the Deccan Monograph</h3>
              <p className="text-xs text-[#A8B9C8]">EPUB Format • Synchronized on Mobile Reader</p>
              <Button variant="outline" size="sm" icon={Download}>Download E-Book (EPUB)</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. MY WISHLIST ── */}
      {currentTab === 'wishlist' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Curated Wishlist ({wishlist.length})</h1>
          {wishlist.length === 0 ? (
            <p className="text-xs text-[#A8B9C8] bg-white p-6 rounded-xl border border-[#A8B9C8]">Your wishlist is currently clear.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {wishlist.map((bk) => (
                <div key={bk._id} className="bg-white p-4 rounded-xl border border-[#A8B9C8] space-y-2 shadow-xs">
                  <h4 className="font-bold text-sm text-[#202020] truncate">{bk.title}</h4>
                  <p className="text-xs text-[#48779E] font-bold">₹{bk.price}</p>
                  <Link to={`/books/${bk._id}`}>
                    <Button variant="primary" size="sm" className="w-full">View Details</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 6. SAVED ADDRESSES ── */}
      {currentTab === 'addresses' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Saved Delivery Addresses</h1>

          {/* Form */}
          <form onSubmit={handleAddAddress} className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4 shadow-xs">
            <h3 className="font-serif font-bold text-sm text-[#202020]">Add New Destination</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <input required placeholder="Recipient Full Name" value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} className="p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              <input required placeholder="Contact Phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} className="p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              <input required placeholder="Street / Flat / House" value={addressForm.streetAddress} onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })} className="col-span-2 p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              <input required placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              <input required placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              <input required placeholder="Postal Pincode" value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} className="p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
            </div>
            <Button type="submit" variant="primary" size="sm">Save Address</Button>
          </form>

          {/* List */}
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((ad) => (
              <div key={ad._id} className="bg-white p-4 rounded-xl border border-[#A8B9C8] flex justify-between items-start shadow-xs">
                <div className="text-xs space-y-1">
                  <span className="font-bold text-[#202020]">{ad.fullName}</span>
                  <p className="text-[#A8B9C8]">{ad.streetAddress}, {ad.city}, {ad.state} - {ad.postalCode}</p>
                  <p className="text-[#A8B9C8]">Phone: {ad.phone}</p>
                </div>
                <button onClick={() => handleDeleteAddress(ad._id)} className="text-xs text-rose-600 hover:underline font-bold">Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 7. PAYMENT HISTORY ── */}
      {currentTab === 'payments' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Payment Receipts & Ledger</h1>
          <div className="bg-white rounded-2xl border border-[#A8B9C8] overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EAF1F7] text-[#202020] uppercase font-bold border-b border-[#A8B9C8]">
                <tr>
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Order Ref</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF1F7]">
                {payments.length === 0 ? (
                  <tr><td colSpan={5} className="p-4 text-center text-[#A8B9C8]">No transaction records found</td></tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p._id}>
                      <td className="p-3 font-mono">{p.paymentId}</td>
                      <td className="p-3 font-mono">{p.order?.orderNumber || 'Direct'}</td>
                      <td className="p-3">{p.paymentMethod}</td>
                      <td className="p-3 font-bold text-[#202020]">₹{p.amount}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold uppercase">{p.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 8. PROFILE & CHANGE PASSWORD ── */}
      {(currentTab === 'profile' || currentTab === 'security' || currentTab === 'settings') && (
        <div className="space-y-6 max-w-xl">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Profile & Security Credentials</h1>
          <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-[#202020]">Customer Account Info</h3>
            <div className="text-xs space-y-1">
              <p><strong className="text-[#A8B9C8]">Full Name:</strong> {user?.name}</p>
              <p><strong className="text-[#A8B9C8]">Email:</strong> {user?.email}</p>
              <p><strong className="text-[#A8B9C8]">Account Tier:</strong> <span className="font-bold uppercase text-[#48779E]">{user?.role}</span></p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4 shadow-xs">
            <h3 className="font-serif font-bold text-sm text-[#202020]">Change Password</h3>
            <div className="space-y-3 text-xs">
              <input required type="password" placeholder="New Password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              <input required type="password" placeholder="Confirm New Password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
            </div>
            <Button type="submit" variant="primary" size="sm">Update Password</Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
