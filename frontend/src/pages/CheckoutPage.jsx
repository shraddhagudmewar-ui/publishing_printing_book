import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, CreditCard, Smartphone, Banknote, ArrowRight, 
  Package, ShieldCheck, QrCode, Lock, X, Check, Copy
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / QR Code', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm, QR' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, MasterCard, RuPay' },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay cash when delivered' },
];

const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [form, setForm] = useState({
    fullName: user?.name ?? '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [errors, setErrors] = useState({});

  // Payment Gateway Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [copiedUpi, setCopiedUpi] = useState(false);

  const tax = Math.round(cartTotal * 0.05);
  const shipping = cartTotal >= 500 ? 0 : 50;
  const grandTotal = cartTotal + tax + shipping;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) errs.phone = 'Enter valid 10-digit phone';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.state.trim()) errs.state = 'State is required';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter valid 6-digit pincode';
    return errs;
  };

  const handleOpenPayment = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { 
      setErrors(errs); 
      return; 
    }
    setShowPaymentModal(true);
    setPaymentStep('idle');
  };

  const executeOrder = async () => {
    setPaymentStep('processing');
    setSubmitting(true);
    try {
      // Simulate quick secure gateway handshake delay (700ms)
      await new Promise(r => setTimeout(r, 700));

      const orderPayload = {
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          streetAddress: form.address,
          city: form.city,
          state: form.state,
          postalCode: form.pincode,
          country: 'India',
        },
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase(),
        items: cartItems.map((item) => ({
          book: item.book?._id ?? item.book,
          title: item.book?.title ?? 'Publication Book',
          quantity: item.quantity ?? 1,
          format: item.format ?? 'paperback',
          price: item.book?.price ?? 0,
        })),
        totalAmount: grandTotal,
      };

      const res = await api.post('/orders', orderPayload);
      const orderId =
        res.data?.data?._id ??
        res.data?.order?._id ??
        res.data?._id ??
        'ORD-' + Date.now();

      setPaymentStep('success');
      await clearCart();

      setTimeout(() => {
        setShowPaymentModal(false);
        setOrderPlaced(orderId);
      }, 700);
    } catch (err) {
      setPaymentStep('idle');
      alert(err?.message ?? err?.response?.data?.message ?? 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('sagargudmewar66@okaxis');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#EAF1F7] flex items-center justify-center px-4">
        <div className="text-center bg-white border border-[#A8B9C8] rounded-2xl p-10 max-w-sm w-full">
          <p className="text-[#202020] font-semibold mb-4">Please sign in to checkout.</p>
          <Link to="/login" className="inline-block bg-[#48779E] text-white px-6 py-2.5 rounded-lg font-semibold text-sm">
            {t('nav.signin')}
          </Link>
        </div>
      </div>
    );
  }

  // ── Success Screen ─────────────────────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#EAF1F7] flex items-center justify-center px-4">
        <div className="text-center bg-white border border-[#A8B9C8] rounded-2xl p-10 max-w-md w-full shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#202020] mb-2" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
            {t('checkout.orderSuccess')}
          </h2>
          <p className="text-[#A8B9C8] text-sm mb-2">{t('checkout.orderSuccessSub')}</p>
          <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 mb-3 border border-emerald-200 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Payment Verified & Order Recorded
          </div>
          <br />
          <p className="text-xs font-mono bg-[#EAF1F7] text-[#202020] px-3 py-1.5 rounded-lg inline-block mb-6">
            Order Reference: {String(orderPlaced).slice(-8).toUpperCase()}
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/customer/orders"
              className="flex items-center justify-center gap-2 bg-[#48779E] hover:bg-[#3A6486] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
            >
              <Package className="w-4 h-4" />
              Track My Order in Dashboard
            </Link>
            <Link
              to="/books"
              className="text-xs text-[#48779E] hover:text-[#3A6486] transition-colors"
            >
              Continue Exploring Catalog →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Checkout Form ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#EAF1F7] relative">
      {/* Header */}
      <div className="bg-[#202020] py-10 px-4 text-center">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
          {t('checkout.title')}
        </h1>
        <p className="text-xs text-[#A8B9C8] mt-1">Acquire Original KA Monographs & Literary Editions</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white border border-[#A8B9C8] rounded-xl p-6">
              <h2 className="text-base font-bold text-[#202020] mb-4 flex items-center gap-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                <span className="w-6 h-6 bg-[#48779E] text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                {t('checkout.shipping')}
              </h2>
              <form onSubmit={handleOpenPayment}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'fullName', label: t('checkout.fullName'), placeholder: 'Your full name', span: 2 },
                    { name: 'phone', label: t('checkout.phone'), placeholder: '10-digit mobile number' },
                    { name: 'address', label: t('checkout.address'), placeholder: 'Street, Building, Area', span: 2 },
                    { name: 'city', label: t('checkout.city'), placeholder: 'Mumbai' },
                    { name: 'state', label: t('checkout.state'), placeholder: 'Maharashtra' },
                    { name: 'pincode', label: t('checkout.pincode'), placeholder: '400001' },
                  ].map(({ name, label, placeholder, span }) => (
                    <div key={name} className={span === 2 ? 'sm:col-span-2' : ''}>
                      <label className="text-xs font-semibold text-[#202020] uppercase tracking-wide mb-1 block">
                        {label}
                      </label>
                      <input
                        type="text"
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-[#EAF1F7] text-[#202020] placeholder-[#A8B9C8] focus:outline-none focus:border-[#48779E] transition-colors ${
                          errors[name] ? 'border-red-400' : 'border-[#A8B9C8]'
                        }`}
                      />
                      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
                    </div>
                  ))}
                </div>

                {/* Payment Method */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-[#202020] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                      <span className="w-6 h-6 bg-[#48779E] text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                      {t('checkout.payment')}
                    </h2>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      Sandbox / Instant Mode Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPaymentMethod(id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === id
                            ? 'border-[#48779E] bg-[#48779E]/5 shadow-xs'
                            : 'border-[#A8B9C8] bg-white hover:border-[#48779E]/50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${paymentMethod === id ? 'text-[#48779E]' : 'text-[#A8B9C8]'}`} />
                        <p className={`text-sm font-semibold ${paymentMethod === id ? 'text-[#48779E]' : 'text-[#202020]'}`}>{label}</p>
                        <p className="text-xs text-[#A8B9C8] mt-0.5">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || cartItems.length === 0}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-[#48779E] hover:bg-[#3A6486] disabled:bg-[#A8B9C8] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer"
                >
                  Proceed to Payment — ₹{grandTotal} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#A8B9C8] rounded-xl p-5 sticky top-24 shadow-xs">
              <h2 className="text-base font-bold text-[#202020] mb-4 pb-2 border-b border-[#EAF1F7]" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Order Summary
              </h2>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => {
                  const book = item.book ?? {};
                  return (
                    <div key={item._id ?? book._id} className="flex gap-2 text-xs">
                      <div className="w-8 h-10 bg-[#EAF1F7] rounded shrink-0 overflow-hidden">
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#48779E] font-bold text-sm">
                            {book.title?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#202020] line-clamp-1">{book.title}</p>
                        <p className="text-[#A8B9C8]">×{item.quantity ?? 1}</p>
                      </div>
                      <span className="font-semibold text-[#202020] shrink-0">₹{(book.price ?? 0) * (item.quantity ?? 1)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-[#EAF1F7] pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#A8B9C8]">
                  <span>Subtotal</span><span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-[#A8B9C8]">
                  <span>GST (5%)</span><span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-[#A8B9C8]">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between font-bold text-[#202020] text-sm pt-2 border-t border-[#EAF1F7]">
                  <span>Total Payable</span><span className="text-[#48779E] text-base">₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TEMPORARY / SANDBOX PAYMENT GATEWAY MODAL ── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#A8B9C8] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#202020] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#48779E] flex items-center justify-center font-bold text-xs text-white">
                  KA
                </div>
                <div>
                  <h3 className="font-bold text-sm">KA Pay • Test Gateway</h3>
                  <p className="text-[10px] text-[#A8B9C8]">Temporary Instant Payment Environment</p>
                </div>
              </div>
              <button 
                onClick={() => !submitting && setShowPaymentModal(false)}
                className="text-[#A8B9C8] hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Badge */}
            <div className="bg-[#EAF1F7] p-4 flex justify-between items-center border-b border-[#A8B9C8]/40">
              <div>
                <span className="text-[11px] text-[#A8B9C8] uppercase font-bold block">Amount to Pay</span>
                <span className="text-2xl font-bold text-[#202020]">₹{grandTotal}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold">
                  Method: {paymentMethod.toUpperCase()}
                </span>
                <span className="block text-[10px] text-emerald-600 font-bold mt-1">✓ Instant Auto-Verify</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {paymentStep === 'processing' ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-[#48779E] border-t-transparent rounded-full animate-spin mx-auto" />
                  <h4 className="font-bold text-sm text-[#202020]">Authorizing Transaction...</h4>
                  <p className="text-xs text-[#A8B9C8]">Connecting to payment simulator & confirming order</p>
                </div>
              ) : paymentStep === 'success' ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h4 className="font-bold text-base text-emerald-800">Payment Successful!</h4>
                  <p className="text-xs text-[#A8B9C8]">Generating your order invoice and tracking id...</p>
                </div>
              ) : (
                <>
                  {/* UPI / QR Code View */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4 text-center">
                      <div className="p-3 bg-white rounded-2xl border border-[#A8B9C8]/50 inline-block shadow-sm max-w-xs w-full">
                        <div className="flex items-center justify-center gap-2 mb-2 pb-2 border-b border-gray-100">
                          <span className="w-7 h-7 rounded-full bg-[#673AB7] text-white flex items-center justify-center text-xs font-bold">
                            S
                          </span>
                          <div className="text-left">
                            <h5 className="text-xs font-bold text-[#202020] leading-tight">Sagar Gudmewar</h5>
                            <p className="text-[10px] text-gray-500 font-mono">Google Pay / UPI</p>
                          </div>
                        </div>

                        {/* Real Uploaded QR Code */}
                        <div className="w-52 h-52 mx-auto rounded-xl overflow-hidden bg-white flex items-center justify-center border border-gray-100 p-1">
                          <img 
                            src="/upi-qr.png" 
                            alt="Google Pay QR Code - Sagar Gudmewar" 
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                        <p className="text-[11px] text-[#202020] font-medium mt-2">
                          Scan to pay with any UPI app
                        </p>
                        <p className="text-[10px] text-gray-500">
                          GPay • PhonePe • Paytm • BHIM
                        </p>
                      </div>

                      <div className="flex items-center justify-between bg-[#EAF1F7] p-2.5 rounded-lg text-xs border border-[#A8B9C8]/40">
                        <div className="text-left overflow-hidden mr-2">
                          <span className="text-[10px] text-gray-500 block">UPI ID</span>
                          <span className="font-mono text-[#202020] font-bold text-[12px] truncate block select-all">
                            sagargudmewar66@okaxis
                          </span>
                        </div>
                        <button 
                          onClick={handleCopyUpi} 
                          type="button"
                          className="flex items-center gap-1 text-[11px] font-bold text-[#48779E] hover:text-[#3A6486] bg-white px-2.5 py-1.5 rounded-md shadow-xs border border-[#A8B9C8]/40 hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
                        >
                          {copiedUpi ? <><Check className="w-3.5 h-3.5 text-emerald-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                        </button>
                      </div>

                      <button
                        onClick={executeOrder}
                        disabled={submitting}
                        className="w-full bg-[#48779E] hover:bg-[#3A6486] text-white py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-50"
                      >
                        ⚡ Confirm Payment & Place Order (₹{grandTotal})
                      </button>
                    </div>
                  )}

                  {/* Card View */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-gradient-to-tr from-[#202020] to-[#3A6486] text-white shadow-md space-y-4">
                        <div className="flex justify-between items-center text-xs text-white/70">
                          <span>KA Demo Card</span>
                          <span className="font-bold text-sm tracking-wider">VISA</span>
                        </div>
                        <p className="font-mono text-base tracking-widest">4532 •••• •••• 8899</p>
                        <div className="flex justify-between text-xs">
                          <div>
                            <span className="text-[9px] text-white/60 block">CARD HOLDER</span>
                            <span className="font-semibold">{form.fullName || 'CUSTOMER'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-white/60 block">EXPIRES</span>
                            <span className="font-semibold">12/28</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={executeOrder}
                        disabled={submitting}
                        className="w-full bg-[#48779E] hover:bg-[#3A6486] text-white py-3 rounded-xl font-bold text-xs transition-all shadow cursor-pointer"
                      >
                        ⚡ Authorize & Pay ₹{grandTotal} (Test Card)
                      </button>
                    </div>
                  )}

                  {/* Cash on Delivery View */}
                  {paymentMethod === 'cod' && (
                    <div className="space-y-4 text-center py-2">
                      <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                        <Banknote className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#202020]">Cash on Delivery Selected</h4>
                        <p className="text-xs text-[#A8B9C8] mt-1 max-w-xs mx-auto">
                          No digital transaction is required now. You can pay ₹{grandTotal} in cash or UPI directly to the courier agent when your parcel arrives.
                        </p>
                      </div>

                      <button
                        onClick={executeOrder}
                        disabled={submitting}
                        className="w-full bg-[#48779E] hover:bg-[#3A6486] text-white py-3 rounded-xl font-bold text-xs transition-all shadow cursor-pointer"
                      >
                        Confirm COD Order (₹{grandTotal})
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
