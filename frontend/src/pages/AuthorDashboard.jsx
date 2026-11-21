import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  FileUp, FileText, Image, BookCheck, Package, 
  GitPullRequest, MessageSquareText, BookOpen, BarChart3, 
  DollarSign, Bell, CheckCircle2, Clock, Upload, AlertCircle 
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthorDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const currentTab = location.pathname.split('/')[2] || 'dashboard';

  const [manuscripts, setManuscripts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [books, setBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Manuscript Submission Form State
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    genre: 'Fiction',
    description: '',
    language: 'English',
    targetWordCount: 45000,
    packageSelected: '',
    manuscriptFileUrl: '',
    sampleChapterUrl: '',
    authorBio: user?.bio || '',
    isbn: '',
    format: 'Paperback'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pubRes, pkgRes, bkRes, notifRes, catRes] = await Promise.allSettled([
        api.get('/publishing'),
        api.get('/packages'),
        api.get('/books'),
        api.get('/notifications'),
        api.get('/categories'),
      ]);

      if (pubRes.status === 'fulfilled') setManuscripts(pubRes.value.data.data || []);
      if (pkgRes.status === 'fulfilled') setPackages(pkgRes.value.data.packages || []);
      if (bkRes.status === 'fulfilled') {
        const allBooks = bkRes.value.data.books || [];
        // Filter by author if author id matches
        setBooks(allBooks.filter(b => b.authorName?.toLowerCase() === user?.name?.toLowerCase() || b.author === user?.id));
      }
      if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data.notifications || []);
      if (catRes.status === 'fulfilled') {
        const catList = catRes.value.data.categories || catRes.value.data.data || [];
        setCategories(Array.isArray(catList) ? catList : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentTab]);

  const handleSubmitManuscript = async (e) => {
    e.preventDefault();
    try {
      await api.post('/publishing', {
        title: form.title,
        genre: form.genre,
        abstract: `${form.subtitle ? form.subtitle + ' — ' : ''}${form.description}\nAuthor Bio: ${form.authorBio}`,
        targetWordCount: Number(form.targetWordCount),
        packageSelected: form.packageSelected || undefined,
        manuscriptFileUrl: form.manuscriptFileUrl || 'https://storage.kagroup.com/manuscripts/sample-draft.docx',
        sampleChapterUrl: form.sampleChapterUrl,
      });

      setStatusMsg({ type: 'success', text: 'Manuscript submitted successfully to KA Editorial Board!' });
      setForm({
        title: '', subtitle: '', genre: 'Fiction', description: '', language: 'English',
        targetWordCount: 45000, packageSelected: '', manuscriptFileUrl: '', sampleChapterUrl: '',
        authorBio: '', isbn: '', format: 'Paperback'
      });
      fetchData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err?.response?.data?.message || 'Submission failed.' });
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner message="Loading Author Studio..." />
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#202020]">Author Manuscript Studio</h1>
              <p className="text-xs text-[#A8B9C8]">Craft, Track and Monetize Your Literary Creations • {user?.name}</p>
            </div>
            <Link to="/author/submit">
              <Button variant="primary" icon={FileUp}>Submit New Manuscript</Button>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#A8B9C8] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#A8B9C8]">Manuscripts</span>
              <p className="text-2xl font-bold text-[#202020]">{manuscripts.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#A8B9C8] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#A8B9C8]">Published Titles</span>
              <p className="text-2xl font-bold text-[#202020]">{books.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#A8B9C8] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#A8B9C8]">Total Royalty Due</span>
              <p className="text-2xl font-bold text-emerald-600">₹42,850</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#A8B9C8] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#A8B9C8]">Editorial Notes</span>
              <p className="text-2xl font-bold text-[#48779E]">{manuscripts.filter(m => m.editorialFeedback).length}</p>
            </div>
          </div>

          {/* Status Tracker of Recent Submissions */}
          <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#202020]">Recent Manuscript Lifecycles</h2>
            {manuscripts.length === 0 ? (
              <p className="text-xs text-[#A8B9C8]">No manuscripts submitted yet. Ready to submit your first chapter?</p>
            ) : (
              <div className="space-y-4">
                {manuscripts.slice(0, 3).map((m) => (
                  <div key={m._id} className="border border-[#EAF1F7] p-4 rounded-xl space-y-2 bg-[#EAF1F7]/30">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#202020] text-sm">{m.title}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[#48779E] text-white">
                        {m.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#202020]/75 line-clamp-2">{m.abstract}</p>
                    {m.editorialFeedback && (
                      <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                        <strong>Editorial Desk:</strong> {m.editorialFeedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 2. SUBMIT NEW MANUSCRIPT (FULL FORM) ── */}
      {currentTab === 'submit' && (
        <div className="space-y-6">
          <div className="border-b border-[#A8B9C8]/40 pb-4">
            <h1 className="text-2xl font-serif font-bold text-[#202020]">Manuscript Submission Portal</h1>
            <p className="text-xs text-[#A8B9C8]">Submit your draft for editorial board review, cover design, and ISBN indexing.</p>
          </div>

          <form onSubmit={handleSubmitManuscript} className="bg-white p-6 md:p-8 rounded-2xl border border-[#A8B9C8] space-y-5">
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Book Title *</label>
                <input required placeholder="The Chronicle of Fire and Stone" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Subtitle / Series</label>
                <input placeholder="Volume 1: The Gathering Tempest" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Genre & Category *</label>
                <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]">
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Poetry">Poetry</option>
                  <option value="Academic">Academic</option>
                  <option value="Memoir">Memoir</option>
                  <option value="Philosophy">Philosophy</option>
                </select>
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Primary Language *</label>
                <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]">
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Bilingual">Bilingual</option>
                </select>
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Estimated Word Count</label>
                <input type="number" value={form.targetWordCount} onChange={(e) => setForm({ ...form, targetWordCount: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Select Publishing Tier</label>
                <select value={form.packageSelected} onChange={(e) => setForm({ ...form, packageSelected: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]">
                  <option value="">-- Choose Publication Package --</option>
                  {packages.map(p => (
                    <option key={p._id} value={p._id}>{p.name} (₹{p.price} • {p.royaltyPercentage}% Royalty)</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block uppercase font-bold text-[#202020] mb-1">Book Description & Synopsis *</label>
                <textarea required rows={4} placeholder="Summarize your narrative, chapter arc, and thematic core..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Manuscript File URL (PDF/DOCX) *</label>
                <input placeholder="https://storage.cloud/draft.docx" value={form.manuscriptFileUrl} onChange={(e) => setForm({ ...form, manuscriptFileUrl: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>

              <div>
                <label className="block uppercase font-bold text-[#202020] mb-1">Sample Chapter URL (Optional)</label>
                <input placeholder="https://storage.cloud/chapter1.pdf" value={form.sampleChapterUrl} onChange={(e) => setForm({ ...form, sampleChapterUrl: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>

              <div className="col-span-2">
                <label className="block uppercase font-bold text-[#202020] mb-1">Author Bio for Back-Cover</label>
                <textarea rows={2} placeholder="Brief biographical introduction..." value={form.authorBio} onChange={(e) => setForm({ ...form, authorBio: e.target.value })} className="w-full p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7]" />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Submit Manuscript for Review
            </Button>
          </form>
        </div>
      )}

      {/* ── 3. MY MANUSCRIPTS & STATUS ── */}
      {(currentTab === 'manuscripts' || currentTab === 'requests') && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">My Submitted Manuscripts</h1>
          <div className="space-y-4">
            {manuscripts.length === 0 ? (
              <p className="text-xs text-[#A8B9C8] bg-white p-6 rounded-xl border border-[#A8B9C8]">No submissions found.</p>
            ) : (
              manuscripts.map((m) => (
                <div key={m._id} className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base text-[#202020]">{m.title}</h3>
                      <p className="text-xs text-[#A8B9C8]">Genre: {m.genre} • Words: {m.targetWordCount}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#48779E]/10 text-[#48779E]">
                      {m.status?.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-[#202020]/80">{m.abstract}</p>

                  {m.editorialFeedback && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                      <strong>Editorial Feedback:</strong> {m.editorialFeedback}
                    </div>
                  )}

                  <div className="text-[11px] text-[#A8B9C8] pt-2 border-t border-[#EAF1F7] flex justify-between">
                    <span>Submitted on: {new Date(m.createdAt).toLocaleDateString()}</span>
                    <span>Tier: {m.packageSelected?.name || 'Standard Inquest'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── 4. PUBLISHED BOOKS ── */}
      {currentTab === 'published-books' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">My Published Catalog</h1>
          {books.length === 0 ? (
            <p className="text-xs text-[#A8B9C8] bg-white p-6 rounded-xl border border-[#A8B9C8]">No published books linked to your profile yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {books.map(b => (
                <div key={b._id} className="bg-white p-4 rounded-xl border border-[#A8B9C8] flex gap-3">
                  <img src={b.coverImage} alt={b.title} className="w-16 h-22 object-cover rounded bg-[#EAF1F7]" />
                  <div className="space-y-1 text-xs">
                    <h4 className="font-bold text-sm text-[#202020]">{b.title}</h4>
                    <p className="text-[#A8B9C8]">ISBN: {b.isbn || 'Pending'}</p>
                    <p className="text-[#48779E] font-bold">List Price: ₹{b.price}</p>
                    <p className="text-emerald-600 font-medium">In Circulation • {b.stock} Copies in Reserve</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 5. SALES ANALYTICS & ROYALTIES ── */}
      {(currentTab === 'sales-analytics' || currentTab === 'royalties') && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Sales Analytics & Royalty Ledger</h1>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#A8B9C8]">
              <span className="text-[10px] uppercase font-bold text-[#A8B9C8]">Copies Sold (Gross)</span>
              <p className="text-2xl font-bold text-[#202020]">418</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#A8B9C8]">
              <span className="text-[10px] uppercase font-bold text-[#A8B9C8]">Net Gross Revenue</span>
              <p className="text-2xl font-bold text-[#202020]">₹1,24,650</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#A8B9C8]">
              <span className="text-[10px] uppercase font-bold text-[#A8B9C8]">Net Author Royalty (100%)</span>
              <p className="text-2xl font-bold text-emerald-600">₹42,850</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-3">
            <h3 className="font-bold text-sm text-[#202020]">Monthly Royalty Statements</h3>
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EAF1F7] text-[#202020] font-bold">
                <tr>
                  <th className="p-2.5">Cycle Period</th>
                  <th className="p-2.5">Units Dispatched</th>
                  <th className="p-2.5">Royalty Amount</th>
                  <th className="p-2.5">Disbursement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF1F7]">
                <tr>
                  <td className="p-2.5">October 2026</td>
                  <td className="p-2.5">142 units</td>
                  <td className="p-2.5 font-bold text-emerald-700">₹14,200</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">DISBURSED</span></td>
                </tr>
                <tr>
                  <td className="p-2.5">September 2026</td>
                  <td className="p-2.5">188 units</td>
                  <td className="p-2.5 font-bold text-emerald-700">₹18,800</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">DISBURSED</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 6. AUTHOR PROFILE ── */}
      {currentTab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4 max-w-xl">
          <h1 className="text-2xl font-serif font-bold text-[#202020]">Author Credentials & Pen Name</h1>
          <div className="text-xs space-y-2">
            <p><strong className="text-[#A8B9C8]">Legal Name:</strong> {user?.name}</p>
            <p><strong className="text-[#A8B9C8]">Registered Email:</strong> {user?.email}</p>
            <p><strong className="text-[#A8B9C8]">Author Bio:</strong> {user?.bio || 'Prolific storyteller registered with KA Group.'}</p>
            <p><strong className="text-[#A8B9C8]">Editorial Status:</strong> <span className="text-emerald-600 font-bold">Active Verified Author</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorDashboard;
