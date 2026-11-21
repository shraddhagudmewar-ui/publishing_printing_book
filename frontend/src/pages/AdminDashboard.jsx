import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Feather, FileText, BookOpen, Layers, 
  GitPullRequest, Package, Printer, ShoppingCart, CreditCard, 
  Boxes, Truck, Star, Globe, BarChart4, Bell, Settings, User, 
  Plus, Trash2, Edit3, Check, X, Search, Filter, RefreshCw, 
  AlertCircle, CheckCircle2, FileUp, Eye, Download, Shield 
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Active module extracted from path: /admin/<module>
  const currentTab = location.pathname.split('/')[2] || 'dashboard';

  // ── Database State Collections ────────────────────────────────────
  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [authorsList, setAuthorsList] = useState([]);
  const [manuscripts, setManuscripts] = useState([]);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [printingRequests, setPrintingRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [contents, setContents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // ── Modal & Form States ──────────────────────────────────────────
  // 1. Book Modal
  const [bookModal, setBookModal] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: '', authorName: '', genre: 'Literature', price: 299, stock: 50,
    description: '', isbn: '', format: 'Paperback', pages: 220, language: 'English',
    isBestseller: false, isNewRelease: false, coverImage: ''
  });

  // 2. Manuscript Review Modal
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedManuscript, setSelectedManuscript] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('accepted');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [publishBookToStore, setPublishBookToStore] = useState(true);
  const [storePrice, setStorePrice] = useState(349);

  // 3. Category Modal
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // 4. Publishing Package Modal
  const [pkgModal, setPkgModal] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState(null);
  const [pkgForm, setPkgForm] = useState({
    name: '', tier: 'Standard', price: 9999, royaltyPercentage: 100,
    complimentaryCopies: 10, features: ''
  });

  // 5. Website Content / Banner Form
  const [contentKey, setContentKey] = useState('hero_announcement');
  const [contentTitle, setContentTitle] = useState('');
  const [contentValue, setContentValue] = useState('');
  const [contentCategory, setContentCategory] = useState('announcement');

  // 6. Delivery Tracking Modal
  const [deliveryModal, setDeliveryModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderDeliveryStatus, setOrderDeliveryStatus] = useState('shipped');

  // 8. Gallery Modal
  const [galleryModal, setGalleryModal] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '', imageUrl: '', caption: '', category: 'Events & Releases'
  });

  // ── Centralized Fetch Function ──────────────────────────────────
  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [
        analyticsRes, usersRes, authorsRes, manuscriptsRes, booksRes, 
        catsRes, pkgsRes, printsRes, ordersRes, paysRes, reviewsRes, 
        galleryRes, contentRes, notifsRes, logsRes
      ] = await Promise.allSettled([
        api.get('/admin/analytics'),
        api.get('/users'),
        api.get('/authors'),
        api.get('/publishing'),
        api.get('/books'),
        api.get('/categories'),
        api.get('/packages'),
        api.get('/printing'),
        api.get('/orders'),
        api.get('/payments'),
        api.get('/admin/reviews'),
        api.get('/gallery'),
        api.get('/admin/content'),
        api.get('/notifications'),
        api.get('/admin/audit-logs'),
      ]);

      if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data);
      if (usersRes.status === 'fulfilled') setUsersList(usersRes.value.data.users || []);
      if (authorsRes.status === 'fulfilled') setAuthorsList(authorsRes.value.data.authors || []);
      if (manuscriptsRes.status === 'fulfilled') setManuscripts(manuscriptsRes.value.data.data || []);
      if (booksRes.status === 'fulfilled') {
        const loadedBooks = booksRes.value.data.books || booksRes.value.data.data || [];
        setBooks(Array.isArray(loadedBooks) ? loadedBooks : []);
      }
      if (catsRes.status === 'fulfilled') {
        const catList = catsRes.value.data.categories || catsRes.value.data.data || [];
        setCategories(Array.isArray(catList) ? catList : []);
      }
      if (pkgsRes.status === 'fulfilled') setPackages(pkgsRes.value.data.packages || []);
      if (printsRes.status === 'fulfilled') setPrintingRequests(printsRes.value.data.data || []);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data.orders || ordersRes.value.data.data || []);
      if (paysRes.status === 'fulfilled') setPayments(paysRes.value.data.payments || []);
      if (reviewsRes.status === 'fulfilled') setReviews(reviewsRes.value.data.reviews || []);
      if (galleryRes && galleryRes.status === 'fulfilled') setGalleryPhotos(galleryRes.value.data.data || []);
      if (contentRes.status === 'fulfilled') setContents(contentRes.value.data.contents || []);
      if (notifsRes.status === 'fulfilled') setNotifications(notifsRes.value.data.notifications || []);
      if (logsRes.status === 'fulfilled') setAuditLogs(logsRes.value.data.logs || []);
    } catch (err) {
      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, [currentTab]);

  const showNotification = (text, type = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
  };

  // ── Action Handlers ──────────────────────────────────────────────
  // User status toggling
  const handleToggleUserActive = async (userId, currentStatus) => {
    try {
      await api.put(`/users/${userId}`, { isActive: !currentStatus });
      showNotification(`User account ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchAllAdminData();
    } catch (err) {
      showNotification('Failed to update account status', 'error');
    }
  };

  // Book CRUD
  const handleOpenAddBookModal = () => {
    setEditingBookId(null);
    setBookForm({
      title: '',
      authorName: '',
      genre: categories[0]?.name || 'Literature',
      category: categories[0]?._id || undefined,
      price: 299,
      stock: 50,
      description: '',
      isbn: '',
      format: 'Paperback',
      pages: 220,
      language: 'English',
      isBestseller: false,
      isNewRelease: false,
      coverImage: '',
    });
    setBookModal(true);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    try {
      if (editingBookId) {
        await api.put(`/books/${editingBookId}`, bookForm);
        showNotification('Volume details updated in press catalogue');
      } else {
        await api.post('/books', bookForm);
        showNotification('New volume published into live catalogue!');
      }
      setBookModal(false);
      setEditingBookId(null);
      fetchAllAdminData();
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Book operation failed', 'error');
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Confirm removing this volume from catalogue?')) return;
    try {
      await api.delete(`/books/${id}`);
      showNotification('Book removed from circulation');
      fetchAllAdminData();
    } catch (err) {
      showNotification('Delete failed', 'error');
    }
  };

  // Manuscript Review & Approval Gate
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/publishing/${selectedManuscript._id}/review`, {
        status: reviewStatus,
        editorialFeedback: reviewFeedback,
        publishToStore: publishBookToStore,
        price: Number(storePrice),
      });
      showNotification(`Manuscript decision applied: [${reviewStatus.toUpperCase()}]`);
      setReviewModal(false);
      setSelectedManuscript(null);
      fetchAllAdminData();
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Review failed', 'error');
    }
  };

  // Category Management
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name: catName, description: catDesc });
      showNotification(`Imprint category "${catName}" registered`);
      setCatName('');
      setCatDesc('');
      fetchAllAdminData();
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Category creation failed', 'error');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      showNotification(`Category "${name}" removed`);
      fetchAllAdminData();
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Failed to delete category', 'error');
    }
  };

  // Package Management
  const handleSavePackage = async (e) => {
    e.preventDefault();
    try {
      if (editingPkgId) {
        await api.put(`/packages/${editingPkgId}`, pkgForm);
        showNotification('Publishing package updated');
      } else {
        await api.post('/packages', pkgForm);
        showNotification('New publishing package registered');
      }
      setPkgModal(false);
      setEditingPkgId(null);
      fetchAllAdminData();
    } catch (err) {
      showNotification('Package operation failed', 'error');
    }
  };

  // Stock / Inventory update
  const handleUpdateStock = async (bookId, newStock) => {
    try {
      await api.put(`/admin/inventory/${bookId}`, { stock: Number(newStock) });
      showNotification('Inventory stock updated');
      fetchAllAdminData();
    } catch (err) {
      showNotification('Failed to update stock', 'error');
    }
  };

  // Delivery & Tracking Assignment
  const handleAssignDelivery = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/orders/${selectedOrder._id}/delivery`, {
        trackingNumber,
        orderStatus: orderDeliveryStatus,
      });
      showNotification(`Order #${selectedOrder.orderNumber} assigned tracking: ${trackingNumber}`);
      setDeliveryModal(false);
      setSelectedOrder(null);
      setTrackingNumber('');
      fetchAllAdminData();
    } catch (err) {
      showNotification('Failed to update delivery', 'error');
    }
  };

  // Website Content Management
  const handleSaveContent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/content', {
        key: contentKey,
        title: contentTitle,
        value: contentValue,
        category: contentCategory,
      });
      showNotification(`Website content updated for "${contentKey}"`);
      setContentTitle('');
      setContentValue('');
      fetchAllAdminData();
    } catch (err) {
      showNotification('Failed to update content', 'error');
    }
  };

  // Review Moderation
  const handleDeleteReview = async (revId) => {
    if (!window.confirm('Remove this review for violation?')) return;
    try {
      await api.delete(`/admin/reviews/${revId}`);
      showNotification('Review deleted');
      fetchAllAdminData();
    } catch (err) {
      showNotification('Failed to delete review', 'error');
    }
  };

  // Printing Status Update
  const handleUpdatePrintingStatus = async (printId, newStatus) => {
    try {
      await api.put(`/printing/${printId}/status`, { status: newStatus });
      showNotification(`Printing request moved to: ${newStatus}`);
      fetchAllAdminData();
    } catch (err) {
      showNotification('Failed to update printing status', 'error');
    }
  };

  // Password Update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    try {
      await api.put('/auth/updatedetails', { password: passwordForm.newPassword });
      showNotification('Administrator password updated successfully');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      showNotification('Failed to update password', 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner message="Loading Executive Publisher Console..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Status Toast ── */}
      {statusMsg.text && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md transition-all ${
          statusMsg.type === 'error' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
        }`}>
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg({ text: '', type: '' })}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          1. DASHBOARD OVERVIEW
      ══════════════════════════════════════════════════════════════════ */}
      {(currentTab === 'dashboard' || !currentTab) && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#202020]">Publisher Command Center</h1>
              <p className="text-xs text-[#A8B9C8]">Comprehensive Overview • Real-Time Transactions & Manuscripts</p>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" icon={Plus} onClick={handleOpenAddBookModal}>
                Publish New Book
              </Button>
            </div>
          </div>

          {/* Statistics Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#A8B9C8] space-y-1 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B9C8]">Total Customers</span>
              <p className="text-2xl font-bold text-[#202020]">{usersList.filter(u => u.role === 'customer').length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#A8B9C8] space-y-1 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B9C8]">Registered Accounts</span>
              <p className="text-2xl font-bold text-[#48779E]">{usersList.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#A8B9C8] space-y-1 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B9C8]">Published Titles</span>
              <p className="text-2xl font-bold text-[#202020]">{books.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#A8B9C8] space-y-1 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B9C8]">Categories</span>
              <p className="text-2xl font-bold text-amber-600">{categories.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#A8B9C8] space-y-1 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B9C8]">Total Orders</span>
              <p className="text-2xl font-bold text-[#202020]">{orders.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#A8B9C8] space-y-1 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B9C8]">Gross Revenue</span>
              <p className="text-2xl font-bold text-emerald-600">₹{analytics?.stats?.totalRevenue || payments.reduce((s, p) => s + (p.amount || 0), 0)}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#A8B9C8] space-y-1 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B9C8]">Printing Requests</span>
              <p className="text-2xl font-bold text-[#202020]">{printingRequests.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#A8B9C8] space-y-1 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B9C8]">Audit Activity Logs</span>
              <p className="text-2xl font-bold text-[#48779E]">{auditLogs.length}</p>
            </div>
          </div>

          {/* Interactive Monthly Sales Chart */}
          <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-[#EAF1F7] pb-3">
              <h2 className="font-serif font-bold text-base text-[#202020]">Monthly Sales & Circulation Trajectory</h2>
              <span className="text-xs text-emerald-600 font-bold">+24.5% vs Prior Quarter</span>
            </div>
            <div className="grid grid-cols-6 gap-3 items-end h-44 pt-6 text-center text-xs">
              {(analytics?.monthlySales || [
                { month: 'Jun', sales: 45000, orders: 38 },
                { month: 'Jul', sales: 62000, orders: 54 },
                { month: 'Aug', sales: 58000, orders: 49 },
                { month: 'Sep', sales: 84000, orders: 72 },
                { month: 'Oct', sales: 96000, orders: 85 },
                { month: 'Nov', sales: 114000, orders: 94 },
              ]).map((m, idx) => {
                const heightPercent = Math.min(100, Math.round((m.sales / 120000) * 100));
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-bold text-[#48779E] opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{m.sales}
                    </div>
                    <div 
                      className="w-full bg-[#EAF1F7] group-hover:bg-[#48779E] rounded-t-lg transition-all duration-300" 
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] font-bold text-[#202020] uppercase">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Orders & Recent Manuscripts Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4 shadow-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-[#202020]">Recent Acquisitions</h3>
                <Link to="/admin/orders" className="text-xs text-[#48779E] hover:underline font-semibold">View All →</Link>
              </div>
              <div className="space-y-2 text-xs">
                {orders.slice(0, 4).map(o => (
                  <div key={o._id} className="p-3 rounded-xl bg-[#EAF1F7]/40 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#202020]">#{o.orderNumber}</p>
                      <p className="text-[11px] text-[#A8B9C8]">{o.shippingAddress?.fullName} • ₹{o.totalAmount}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#48779E] text-white">
                      {o.orderStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Printing Queue */}
            <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4 shadow-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-[#202020]">Recent Printing Requests</h3>
                <Link to="/admin/printing" className="text-xs text-[#48779E] hover:underline font-semibold">View All →</Link>
              </div>
              <div className="space-y-2 text-xs">
                {printingRequests.length === 0 ? (
                  <p className="text-xs text-[#A8B9C8] py-4 text-center">No printing requests recorded yet.</p>
                ) : (
                  printingRequests.slice(0, 4).map(pr => (
                    <div key={pr._id} className="p-3 rounded-xl bg-[#EAF1F7]/40 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-[#202020] truncate max-w-[200px]">{pr.bookTitle}</p>
                        <p className="text-[11px] text-[#A8B9C8]">{pr.quantity} copies • ₹{pr.estimatedCost}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#48779E] text-white">
                        {pr.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          2. CUSTOMER & USER MANAGEMENT
      ══════════════════════════════════════════════════════════════════ */}
      {currentTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#202020]">Customer Account Registry</h1>
              <p className="text-xs text-[#A8B9C8]">Total Registered Customers: {usersList.filter(u => u.role !== 'admin').length}</p>
            </div>
            <input 
              type="text" 
              placeholder="Filter by name or email..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="text-xs p-2.5 rounded-lg border border-[#A8B9C8] bg-white text-[#202020] w-64"
            />
          </div>

          <div className="bg-white rounded-2xl border border-[#A8B9C8] overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EAF1F7] text-[#202020] uppercase font-bold border-b border-[#A8B9C8]">
                <tr>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Registered Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF1F7]">
                {usersList
                  .filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(u => (
                    <tr key={u._id} className="hover:bg-[#EAF1F7]/30">
                      <td className="p-3.5 font-bold text-[#202020]">{u.name}</td>
                      <td className="p-3.5 text-[#A8B9C8]">{u.email}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#48779E]/10 text-[#48779E] font-bold">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-[#A8B9C8]">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {u.isActive !== false ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => handleToggleUserActive(u._id, u.isActive !== false)}
                            className="text-xs font-bold text-[#48779E] hover:underline"
                          >
                            {u.isActive !== false ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          5. BOOK MANAGEMENT
      ══════════════════════════════════════════════════════════════════ */}
      {currentTab === 'books' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#202020]">Book Catalogue Management</h1>
              <p className="text-xs text-[#A8B9C8]">Volumes in circulation: {books.length}</p>
            </div>
            <Button variant="primary" icon={Plus} onClick={handleOpenAddBookModal}>
              Add New Volume
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-[#A8B9C8] overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EAF1F7] text-[#202020] uppercase font-bold border-b border-[#A8B9C8]">
                <tr>
                  <th className="p-3">Cover</th>
                  <th className="p-3">Title & Author</th>
                  <th className="p-3">Genre</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Format</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF1F7]">
                {books.map(b => (
                  <tr key={b._id} className="hover:bg-[#EAF1F7]/30">
                    <td className="p-3">
                      <img src={b.coverImage} alt={b.title} className="w-9 h-13 object-cover rounded bg-[#EAF1F7]" />
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-[#202020]">{b.title}</p>
                      <p className="text-[11px] text-[#A8B9C8]">by {b.authorName} • ISBN: {b.isbn || 'Pending'}</p>
                    </td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-[#EAF1F7] text-[#48779E] font-medium">{b.genre}</span></td>
                    <td className="p-3 font-bold text-[#202020]">₹{b.price}</td>
                    <td className="p-3 font-mono">{b.stock} copies</td>
                    <td className="p-3">{b.format || 'Paperback'}</td>
                    <td className="p-3 text-right space-x-2">
                      <button 
                        onClick={() => {
                          setEditingBookId(b._id);
                          setBookForm({
                            title: b.title, authorName: b.authorName, genre: b.genre, category: b.category?._id || b.category, price: b.price,
                            stock: b.stock, description: b.description, isbn: b.isbn || '',
                            format: b.format || 'Paperback', pages: b.pages || 200, language: b.language || 'English',
                            isBestseller: b.isBestseller || false, isNewRelease: b.isNewRelease || false,
                            coverImage: b.coverImage || ''
                          });
                          setBookModal(true);
                        }}
                        className="text-[#48779E] font-bold hover:underline"
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteBook(b._id)} className="text-rose-600 font-bold hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          6. CATEGORY MANAGEMENT
      ══════════════════════════════════════════════════════════════════ */}
      {currentTab === 'categories' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Literary Categories & Imprints</h1>

          <form onSubmit={handleSaveCategory} className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-3 max-w-xl shadow-xs">
            <h3 className="font-bold text-sm text-[#202020]">Register New Category</h3>
            <input required placeholder="Category Title (e.g. Classical Poetry)" value={catName} onChange={e => setCatName(e.target.value)} className="w-full text-xs p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
            <textarea placeholder="Category scope..." value={catDesc} onChange={e => setCatDesc(e.target.value)} className="w-full text-xs p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" rows={2} />
            <Button type="submit" variant="primary" size="sm">Create Category</Button>
          </form>

          <div className="grid md:grid-cols-3 gap-4">
            {categories.map(c => (
              <div key={c._id} className="bg-white p-5 rounded-2xl border border-[#A8B9C8] flex flex-col justify-between shadow-xs">
                <div>
                  <h4 className="font-bold text-sm text-[#202020]">{c.name}</h4>
                  <p className="text-xs text-[#A8B9C8] mt-1">{c.description || 'General imprint'}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => handleDeleteCategory(c._id, c.name)}
                    className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold cursor-pointer hover:underline"
                  >
                    Delete Imprint
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          8. PRINTING MANAGEMENT
      ══════════════════════════════════════════════════════════════════ */}
      {currentTab === 'printing' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Printing Press Operations</h1>
          <div className="space-y-4">
            {printingRequests.map(pr => (
              <div key={pr._id} className="bg-white p-6 rounded-2xl border border-[#A8B9C8] flex flex-wrap justify-between items-center gap-4 shadow-xs">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[#202020]">{pr.bookTitle}</h3>
                  <p className="text-xs text-[#A8B9C8]">Quantity: {pr.quantity} copies • Paper: {pr.paperQuality} • Cost: ₹{pr.estimatedCost}</p>
                  <p className="text-[11px] text-[#202020]/70">Customer: {pr.author?.name || 'Customer'} ({pr.author?.email || 'N/A'})</p>
                  <p className="text-[11px] text-[#202020]/70">Delivery to: {pr.deliveryAddress}</p>
                  {pr.pdfUrl && (
                    <a
                      href={`http://localhost:5000/${pr.pdfUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold underline mt-1"
                    >
                      📄 View / Download Customer PDF
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#A8B9C8]">Job Status:</span>
                  <select 
                    value={pr.status} 
                    onChange={e => handleUpdatePrintingStatus(pr._id, e.target.value)}
                    className="text-xs p-1.5 rounded border border-[#A8B9C8] bg-[#EAF1F7] font-semibold text-[#202020]"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="quality_check">Quality Check</option>
                    <option value="completed">Completed</option>
                    <option value="dispatched">Dispatched</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          9. ORDER MANAGEMENT & 10. DELIVERY
      ══════════════════════════════════════════════════════════════════ */}
      {(currentTab === 'orders' || currentTab === 'delivery') && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Order Fulfillment & Logistics</h1>
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o._id} className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-3 shadow-xs">
                <div className="flex flex-wrap justify-between items-center border-b border-[#EAF1F7] pb-3 gap-2">
                  <div>
                    <h3 className="font-mono font-bold text-sm text-[#202020]">Order #{o.orderNumber}</h3>
                    <p className="text-xs text-[#A8B9C8]">Placed: {new Date(o.createdAt).toLocaleDateString()} • Total: ₹{o.totalAmount}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-[#48779E] text-white">
                      {o.orderStatus}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedOrder(o);
                        setTrackingNumber(o.trackingNumber || '');
                        setOrderDeliveryStatus(o.orderStatus);
                        setDeliveryModal(true);
                      }}
                    >
                      Assign Tracking
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-[#202020]/80 space-y-1">
                  <p><strong>Courier Tracking #:</strong> {o.trackingNumber || 'Unassigned'}</p>
                  <p><strong>Shipping:</strong> {o.shippingAddress?.fullName}, {o.shippingAddress?.streetAddress}, {o.shippingAddress?.city} ({o.shippingAddress?.postalCode})</p>
                  <p><strong>Line Items:</strong> {o.items?.map(it => `${it.title || 'Volume'} (×${it.quantity})`).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          11. PAYMENT MANAGEMENT
      ══════════════════════════════════════════════════════════════════ */}
      {currentTab === 'payments' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Financial Ledger & Transactions</h1>
          <div className="bg-white rounded-2xl border border-[#A8B9C8] overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EAF1F7] text-[#202020] uppercase font-bold border-b border-[#A8B9C8]">
                <tr>
                  <th className="p-3">Payment Ref</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Refund Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF1F7]">
                {payments.map(p => (
                  <tr key={p._id}>
                    <td className="p-3 font-mono font-bold text-[#202020]">{p.paymentId}</td>
                    <td className="p-3">{p.user?.name || 'Customer'}</td>
                    <td className="p-3 font-bold text-[#202020]">₹{p.amount}</td>
                    <td className="p-3">{p.paymentMethod}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {p.status !== 'refunded' ? (
                        <button 
                          onClick={async () => {
                            if (window.confirm('Process refund for this payment?')) {
                              await api.put(`/payments/${p._id}/refund`);
                              showNotification('Refund processed');
                              fetchAllAdminData();
                            }
                          }}
                          className="text-rose-600 hover:underline font-bold text-xs"
                        >
                          Process Refund
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#A8B9C8] uppercase font-bold">Refunded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          12. INVENTORY MANAGEMENT
      ══════════════════════════════════════════════════════════════════ */}
      {currentTab === 'inventory' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Inventory & Stock Control</h1>
          <div className="grid md:grid-cols-2 gap-4">
            {books.map(b => (
              <div key={b._id} className="bg-white p-5 rounded-2xl border border-[#A8B9C8] flex justify-between items-center shadow-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#202020]">{b.title}</h4>
                  <p className="text-xs text-[#A8B9C8]">Price: ₹{b.price} • Stock: {b.stock} copies</p>
                  {b.stock < 15 && (
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold uppercase">
                      Low Stock Warning
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    defaultValue={b.stock} 
                    id={`stock-${b._id}`} 
                    className="w-16 p-1.5 text-xs rounded border border-[#A8B9C8] bg-[#EAF1F7] font-bold text-center"
                  />
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => {
                      const val = document.getElementById(`stock-${b._id}`).value;
                      handleUpdateStock(b._id, val);
                    }}
                  >
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          14. REVIEWS & RATINGS
      ══════════════════════════════════════════════════════════════════ */}
      {currentTab === 'reviews' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Customer Reviews & Moderation</h1>
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r._id} className="bg-white p-5 rounded-2xl border border-[#A8B9C8] flex justify-between items-start shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#202020]">{r.userName || r.user?.name}</span>
                    <span className="text-xs text-amber-500 font-bold">★ {r.rating}/5</span>
                  </div>
                  <p className="text-xs font-semibold text-[#48779E]">{r.title}</p>
                  <p className="text-xs text-[#202020]/80">{r.comment}</p>
                </div>
                <button onClick={() => handleDeleteReview(r._id)} className="text-rose-600 hover:underline text-xs font-bold">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          14. PHOTO GALLERY MANAGEMENT
      ══════════════════════════════════════════════════════════════════ */}
      {currentTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#202020]">Photo Gallery Management</h1>
              <p className="text-xs text-[#A8B9C8]">Curate photos displayed on the public Gallery page: {galleryPhotos.length} photos</p>
            </div>
            <Button variant="primary" icon={Plus} onClick={() => setGalleryModal(true)}>
              Add New Photo
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryPhotos.map((photo) => (
              <div key={photo._id} className="bg-white rounded-2xl overflow-hidden border border-[#A8B9C8] shadow-xs flex flex-col justify-between">
                <div className="relative aspect-[4/3] bg-[#202020]">
                  <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#202020]/80 text-[#EAF1F7] text-[10px] font-bold px-2 py-0.5 rounded">
                    {photo.category}
                  </span>
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#202020] line-clamp-1">{photo.title}</h4>
                    {photo.caption && <p className="text-xs text-[#202020]/70 line-clamp-2 mt-1">{photo.caption}</p>}
                  </div>
                  <div className="pt-2 border-t border-[#EAF1F7] flex items-center justify-between">
                    <span className="text-[10px] text-[#A8B9C8]">{new Date(photo.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={async () => {
                        if (!window.confirm('Delete this photo from gallery?')) return;
                        try {
                          await api.delete(`/gallery/${photo._id}`);
                          showNotification('Photo removed from gallery');
                          fetchAllAdminData();
                        } catch (e) {
                          showNotification(e.message, 'error');
                        }
                      }}
                      className="text-rose-600 hover:underline text-xs font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {galleryPhotos.length === 0 && (
            <div className="bg-white p-8 rounded-2xl border border-[#A8B9C8] text-center text-xs text-[#A8B9C8]">
              No photographs in gallery yet. Click "Add New Photo" to publish your first photo.
            </div>
          )}

          {/* Modal to add photo */}
          {galleryModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#A8B9C8] space-y-4">
                <div className="flex justify-between items-center border-b border-[#EAF1F7] pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#202020]">Add Photo to Gallery</h3>
                  <button onClick={() => setGalleryModal(false)} className="text-xs text-[#A8B9C8]">✕</button>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await api.post('/gallery', galleryForm);
                      showNotification('Photo added to gallery successfully');
                      setGalleryModal(false);
                      setGalleryForm({ title: '', imageUrl: '', caption: '', category: 'Events & Releases' });
                      fetchAllAdminData();
                    } catch (err) {
                      showNotification(err.message, 'error');
                    }
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block font-bold text-[#202020] mb-1">Photo Title *</label>
                    <input
                      required
                      value={galleryForm.title}
                      onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                      placeholder="e.g. National Book Fair 2026 Keynote"
                      className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#202020] mb-1">Image URL *</label>
                    <input
                      type="url"
                      required
                      value={galleryForm.imageUrl}
                      onChange={e => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... or hosted image URL"
                      className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#202020] mb-1">Category</label>
                    <select
                      value={galleryForm.category}
                      onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]"
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
                      value={galleryForm.caption}
                      onChange={e => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                      placeholder="Description of the occasion..."
                      className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setGalleryModal(false)}>Cancel</Button>
                    <Button type="submit" variant="primary">Add Photo</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          15. WEBSITE CONTENT MANAGEMENT
      ══════════════════════════════════════════════════════════════════ */}
      {currentTab === 'content' && (
        <div className="space-y-6 max-w-xl">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Website Content Management</h1>
          <form onSubmit={handleSaveContent} className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-[#202020]">Publish Banner / Announcement</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Content Category</label>
                <select value={contentCategory} onChange={e => setContentCategory(e.target.value)} className="w-full p-2 rounded border border-[#A8B9C8] bg-[#EAF1F7]">
                  <option value="announcement">Announcement Banner</option>
                  <option value="banner">Homepage Hero Banner</option>
                  <option value="about">About House Note</option>
                  <option value="faq">FAQ Snippet</option>
                </select>
              </div>
              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Key Identifier</label>
                <input required value={contentKey} onChange={e => setContentKey(e.target.value)} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>
              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Headline</label>
                <input placeholder="e.g. Annual Literary Fellowship Submissions Open" value={contentTitle} onChange={e => setContentTitle(e.target.value)} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>
              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Content Body / Value</label>
                <textarea required rows={4} placeholder="Full content text..." value={contentValue} onChange={e => setContentValue(e.target.value)} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>
            </div>
            <Button type="submit" variant="primary">Update Website Content</Button>
          </form>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          17. NOTIFICATIONS
      ══════════════════════════════════════════════════════════════════ */}
      {currentTab === 'notifications' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">System & Desk Notifications</h1>
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n._id} className="bg-white p-4 rounded-xl border border-[#A8B9C8] flex gap-3 items-start shadow-xs">
                <Bell className="w-4 h-4 text-[#48779E] shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-[#202020]">{n.title}</p>
                  <p className="text-[#202020]/75">{n.message}</p>
                  <span className="text-[10px] text-[#A8B9C8]">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          18. SETTINGS & 19. ADMIN PROFILE
      ══════════════════════════════════════════════════════════════════ */}
      {(currentTab === 'settings' || currentTab === 'profile') && (
        <div className="space-y-6 max-w-xl">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Publisher Security & Profile</h1>
          <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-3 shadow-xs">
            <h3 className="font-bold text-sm text-[#202020]">Administrator Credentials</h3>
            <div className="text-xs space-y-1">
              <p><strong className="text-[#A8B9C8]">Name:</strong> {user?.name}</p>
              <p><strong className="text-[#A8B9C8]">Email:</strong> {user?.email}</p>
              <p><strong className="text-[#A8B9C8]">Role:</strong> <span className="font-bold text-[#48779E]">ADMIN / PUBLISHER</span></p>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-[#202020]">Update Password</h3>
            <div className="space-y-3 text-xs">
              <input required type="password" placeholder="New Password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              <input required type="password" placeholder="Confirm Password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
            </div>
            <Button type="submit" variant="primary">Update Password</Button>
          </form>
        </div>
      )}

      {/* ── MODAL: BOOK CREATE / EDIT ── */}
      {bookModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <h3 className="font-serif font-bold text-lg text-[#202020]">
              {editingBookId ? 'Update Volume Details' : 'Publish New Book to Press'}
            </h3>
            <form onSubmit={handleSaveBook} className="space-y-3 text-xs">
              <input required placeholder="Book Title" value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              <input required placeholder="Author Name" value={bookForm.authorName} onChange={e => setBookForm({ ...bookForm, authorName: e.target.value })} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Category / Genre</label>
                  <select
                    value={bookForm.genre}
                    onChange={e => {
                      const selectedVal = e.target.value;
                      const matchedCat = categories.find(c => c.name === selectedVal);
                      setBookForm({
                        ...bookForm,
                        genre: selectedVal,
                        category: matchedCat ? matchedCat._id : undefined,
                      });
                    }}
                    className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7] text-xs font-medium"
                  >
                    <option value="">Select Category...</option>
                    {categories.map(c => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="Custom">Custom / Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Price (INR)</label>
                  <input required type="number" placeholder="Price (INR)" value={bookForm.price} onChange={e => setBookForm({ ...bookForm, price: e.target.value })} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
                </div>
              </div>
              {bookForm.genre === 'Custom' && (
                <input
                  required
                  placeholder="Type Custom Category Name"
                  onChange={e => setBookForm({ ...bookForm, genre: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]"
                />
              )}
              <div className="grid grid-cols-2 gap-2">
                <input required type="number" placeholder="Stock Inventory" value={bookForm.stock} onChange={e => setBookForm({ ...bookForm, stock: e.target.value })} className="p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
                <input placeholder="ISBN Number" value={bookForm.isbn} onChange={e => setBookForm({ ...bookForm, isbn: e.target.value })} className="p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>
              <input placeholder="Cover Image URL (or upload)" value={bookForm.coverImage} onChange={e => setBookForm({ ...bookForm, coverImage: e.target.value })} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              <textarea required rows={3} placeholder="Book Synopsis" value={bookForm.description} onChange={e => setBookForm({ ...bookForm, description: e.target.value })} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setBookModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Save Book</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: MANUSCRIPT REVIEW ── */}
      {reviewModal && selectedManuscript && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-[#202020]">Review: {selectedManuscript.title}</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Status Decision</label>
                <select value={reviewStatus} onChange={e => setReviewStatus(e.target.value)} className="w-full p-2 rounded border border-[#A8B9C8] bg-[#EAF1F7]">
                  <option value="under_review">Under Review</option>
                  <option value="accepted">Accepted / Approved for Publishing</option>
                  <option value="revision_required">Revision Required</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Editorial Feedback & Rejection Reason</label>
                <textarea required rows={4} placeholder="Constructive guidance for author..." value={reviewFeedback} onChange={e => setReviewFeedback(e.target.value)} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>

              {reviewStatus === 'accepted' && (
                <div className="p-3 bg-[#EAF1F7] rounded-xl space-y-2">
                  <label className="flex items-center gap-2 font-bold text-[#202020]">
                    <input type="checkbox" checked={publishBookToStore} onChange={e => setPublishBookToStore(e.target.checked)} />
                    Publish Volume Directly to Public Bookstore Catalogue
                  </label>
                  {publishBookToStore && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Retail Price (₹):</span>
                      <input type="number" value={storePrice} onChange={e => setStorePrice(e.target.value)} className="w-24 p-1.5 rounded border border-[#A8B9C8] bg-white text-xs font-bold" />
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setReviewModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Submit Decision</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DELIVERY & LOGISTICS ── */}
      {deliveryModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-[#202020]">Dispatch Order #{selectedOrder.orderNumber}</h3>
            <form onSubmit={handleAssignDelivery} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Courier Tracking Number</label>
                <input required placeholder="e.g. KA-DELIV-9823147" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7] font-mono" />
              </div>
              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Logistics Status</label>
                <select value={orderDeliveryStatus} onChange={e => setOrderDeliveryStatus(e.target.value)} className="w-full p-2 rounded border border-[#A8B9C8] bg-[#EAF1F7]">
                  <option value="processing">Processing</option>
                  <option value="printing">Printing</option>
                  <option value="shipped">Shipped / In Transit</option>
                  <option value="delivered">Delivered to Customer</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDeliveryModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Save Delivery Tracking</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: PACKAGE REGISTER / EDIT ── */}
      {pkgModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-[#202020]">
              {editingPkgId ? 'Update Publishing Package' : 'Create Publishing Package'}
            </h3>
            <form onSubmit={handleSavePackage} className="space-y-3 text-xs">
              <input required placeholder="Package Name" value={pkgForm.name} onChange={e => setPkgForm({ ...pkgForm, name: e.target.value })} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              <div className="grid grid-cols-2 gap-2">
                <input required type="number" placeholder="Price (INR)" value={pkgForm.price} onChange={e => setPkgForm({ ...pkgForm, price: e.target.value })} className="p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
                <input required type="number" placeholder="Royalty %" value={pkgForm.royaltyPercentage} onChange={e => setPkgForm({ ...pkgForm, royaltyPercentage: e.target.value })} className="p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>
              <textarea required rows={4} placeholder="Features (one per line)..." value={pkgForm.features} onChange={e => setPkgForm({ ...pkgForm, features: e.target.value })} className="w-full p-2.5 rounded border border-[#A8B9C8] bg-[#EAF1F7]" />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setPkgModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Save Package</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
