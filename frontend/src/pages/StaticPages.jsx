import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Feather, Award, Users, CheckCircle2, ChevronDown, 
  Mail, Phone, MapPin, Send, HelpCircle, Printer, Sparkles, ArrowRight 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

// 1. ABOUT US PAGE
export const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#EAF1F7]">
      <div className="bg-[#202020] text-white py-16 px-4 border-b-2 border-[#48779E] text-center">
        <span className="text-xs font-semibold tracking-widest text-[#48779E] uppercase">Heritage & Vision</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          KA Group of Publications
        </h1>
        <p className="text-lg italic text-[#A8B9C8] mt-2">"Where Words Become Legacy."</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#202020]">Our Mission & Editorial Legacy</h2>
            <p className="text-sm text-[#202020]/80 leading-relaxed">
              Founded with the conviction that great thoughts deserve immortality, KA Group of Publications bridges the gap between aspiring storytellers and widespread readership. Inspired by modern self-publishing pioneers, we empower authors with full creative rights, world-class editorial polish, and high-impact physical distribution.
            </p>
            <p className="text-sm text-[#202020]/80 leading-relaxed">
              From academic treatises to sweeping poetry and genre fiction, our imprint represents uncompromising quality in print, binding, design, and market reach.
            </p>
            <div className="pt-2">
              <Link to="/submissions">
                <Button variant="primary">Start Your Publishing Journey</Button>
              </Link>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#EAF1F7] pb-3">
              <Award className="w-8 h-8 text-[#48779E]" />
              <div>
                <h3 className="font-bold text-[#202020]">100% Author Royalty & Rights</h3>
                <p className="text-xs text-[#A8B9C8]">Retain full creative control and copyright over your craft.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-[#EAF1F7] pb-3">
              <Users className="w-8 h-8 text-[#48779E]" />
              <div>
                <h3 className="font-bold text-[#202020]">Dedicated Editorial Mentorship</h3>
                <p className="text-xs text-[#A8B9C8]">Direct one-on-one consultation with seasoned editors and typographers.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-[#48779E]" />
              <div>
                <h3 className="font-bold text-[#202020]">Global & Domestic Distribution</h3>
                <p className="text-xs text-[#A8B9C8]">Available across Amazon, Flipkart, Kindle, and bookstore chains nationwide.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. PUBLISHING SERVICES PAGE
export const PublishingServicesPage = () => {
  const services = [
    {
      title: "Manuscript Editing & Proofreading",
      desc: "Comprehensive line editing, grammar corrections, structural restructuring, and tone perfection by seasoned literature specialists.",
      icon: Feather
    },
    {
      title: "Custom Cover & Interior Typography",
      desc: "Bespoke illustrations, spine calculations, gold-embossed options, and international standard layout formatting.",
      icon: Sparkles
    },
    {
      title: "ISBN Allocation & Copyright Safeguards",
      desc: "Government-registered legal ISBN numbers, barcode creation, and national repository archiving.",
      icon: CheckCircle2
    },
    {
      title: "Print On Demand (POD) & Bulk Offset",
      desc: "Zero inventory risk with high-speed print-on-demand plus bulk runs for book launch ceremonies.",
      icon: Printer
    },
    {
      title: "Digital & eCommerce Marketing",
      desc: "Amazon A+ content, author interview reels, social media press releases, and bookstore distribution campaigns.",
      icon: Award
    },
    {
      title: "Multilingual Translation Services",
      desc: "Translate and publish your manuscript in Hindi, Marathi, English, and regional languages with native linguistic nuance.",
      icon: BookOpen
    }
  ];

  return (
    <div className="min-h-screen bg-[#EAF1F7]">
      <div className="bg-[#202020] text-white py-16 px-4 border-b-2 border-[#48779E] text-center">
        <h1 className="text-4xl font-serif font-bold" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Publishing Services</h1>
        <p className="text-[#A8B9C8] text-sm mt-2 max-w-xl mx-auto">
          Comprehensive 360-degree author support crafted for discerning writers, scholars, and poets.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#A8B9C8] hover:shadow-md transition-shadow space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#EAF1F7] flex items-center justify-center text-[#48779E]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#202020]">{srv.title}</h3>
                <p className="text-xs text-[#202020]/75 leading-relaxed">{srv.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-2xl border border-[#A8B9C8] p-8 text-center space-y-4">
          <h2 className="text-2xl font-serif font-bold text-[#202020]">Ready to Bring Your Folio to Life?</h2>
          <p className="text-xs text-[#A8B9C8] max-w-lg mx-auto">
            Choose a tailored package or request custom consultation with our executive editor.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/packages">
              <Button variant="primary">View Packages</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline">Consult Editorial Team</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. SELF PUBLISHING PROCESS PAGE
export const SelfPublishingPage = () => {
  const steps = [
    { step: "01", title: "Submit Manuscript", desc: "Upload your draft via DOCX, PDF or plain text in our secure author portal." },
    { step: "02", title: "Editorial Assessment", desc: "Our team evaluates formatting, word count, genre, and suggests the ideal package." },
    { step: "03", title: "Cover Design & Typesetting", desc: "Our illustrators craft 3 custom cover samples and format elegant interior folios." },
    { step: "04", title: "Author Approval & ISBN", desc: "You review the digital proof copy. Once signed off, ISBN and barcodes are assigned." },
    { step: "05", title: "Printing & Global Distribution", desc: "Your volume goes live on Amazon, Flipkart, Kindle and physical retail distribution." },
    { step: "06", title: "Royalties & Marketing", desc: "Receive 100% author net profits deposited directly to your bank every month." },
  ];

  return (
    <div className="min-h-screen bg-[#EAF1F7]">
      <div className="bg-[#202020] text-white py-16 px-4 border-b-2 border-[#48779E] text-center">
        <h1 className="text-4xl font-serif font-bold" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Self-Publishing Roadmap</h1>
        <p className="text-[#A8B9C8] text-sm mt-2 max-w-xl mx-auto">
          Six seamless phases from initial manuscript to worldwide bookstore shelves.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((st, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-[#A8B9C8] flex gap-4 items-start shadow-sm">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-[#48779E] text-white font-bold text-lg flex items-center justify-center font-serif">
                {st.step}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#202020]">{st.title}</h3>
                <p className="text-xs text-[#202020]/75 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/register">
            <Button variant="primary" size="lg">Open Author Account & Submit Manuscript</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// 4. PUBLISHING PACKAGES PAGE
export const PublishingPackagesPage = () => {
  const packages = [
    {
      name: "Starter Imprint",
      price: "₹7,999",
      ideal: "Ideal for debut poets and short story collections",
      features: [
        "ISBN Allocation & Barcode Generation",
        "Standard Cover Design (2 Concepts)",
        "Interior Typesetting (Up to 120 Pages)",
        "Amazon & Flipkart Listing",
        "10 Free Author Author Copies",
        "100% Royalty Share",
      ],
      popular: false
    },
    {
      name: "Classic Scholar",
      price: "₹18,500",
      ideal: "Most popular for fiction, non-fiction & memoirs",
      features: [
        "Government ISBN & Copyright Filing Guidance",
        "Artisanal Illustrated Cover Design",
        "Comprehensive Copyediting & Proofreading",
        "eBook (Kindle) + Paperback Publishing",
        "25 Complimentary Author Hardcopies",
        "National Press Release Distribution",
        "Dedicated Author Dashboard & Royalty Portal"
      ],
      popular: true
    },
    {
      name: "Monarch Deluxe",
      price: "₹38,990",
      ideal: "Designed for bestselling authors and luxury hardcovers",
      features: [
        "Hardcover Dust-Jacket Edition + Paperback + eBook",
        "Complete Developmental & Structural Editing",
        "Amazon Sponsored Ads Initial Campaign",
        "Video Book Trailer & Author Podcast Interview",
        "50 Deluxe Copies Delivered to Doorstep",
        "Physical Bookstore Pitching across Metro Outlets",
        "Lifetime Literary Support & Re-print Discounts"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#EAF1F7]">
      <div className="bg-[#202020] text-white py-16 px-4 border-b-2 border-[#48779E] text-center">
        <h1 className="text-4xl font-serif font-bold" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Publishing Packages</h1>
        <p className="text-[#A8B9C8] text-sm mt-2 max-w-xl mx-auto">
          Transparent, all-inclusive publication tiers with zero hidden royalty commissions.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-2xl border ${pkg.popular ? 'border-[#48779E] shadow-xl relative ring-2 ring-[#48779E]' : 'border-[#A8B9C8] shadow-sm'} p-6 flex flex-col justify-between`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#48779E] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Author Choice
                </span>
              )}
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#202020]">{pkg.name}</h3>
                  <p className="text-xs text-[#A8B9C8] mt-1">{pkg.ideal}</p>
                </div>
                <div className="text-3xl font-bold text-[#202020]">{pkg.price}</div>
                <div className="border-t border-[#EAF1F7] pt-4 space-y-2">
                  {pkg.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-center gap-2 text-xs text-[#202020]/80">
                      <CheckCircle2 className="w-4 h-4 text-[#48779E] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6">
                <Link to="/contact">
                  <Button variant={pkg.popular ? 'primary' : 'outline'} className="w-full">
                    Select {pkg.name}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. PRINTING SERVICES PAGE
export const PrintingServicesPage = () => {
  return (
    <div className="min-h-screen bg-[#EAF1F7]">
      <div className="bg-[#202020] text-white py-16 px-4 border-b-2 border-[#48779E] text-center">
        <h1 className="text-4xl font-serif font-bold" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Custom Printing & Binding</h1>
        <p className="text-[#A8B9C8] text-sm mt-2 max-w-xl mx-auto">
          State-of-the-art offset and digital presses offering premium paper stocks, finishes, and bindings.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-2">
            <h3 className="font-bold text-lg text-[#202020]">Paper Stocks</h3>
            <p className="text-xs text-[#202020]/75 leading-relaxed">
              70 GSM Natural Shade Book Paper, 80 GSM Maplitho White, 100 GSM Art Gloss / Matte for vibrant colour photobooks.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-2">
            <h3 className="font-bold text-lg text-[#202020]">Cover Finishes</h3>
            <p className="text-xs text-[#202020]/75 leading-relaxed">
              Thermal Matte, Velvet Soft-Touch Lamination, Spot UV Gloss, Gold/Silver Hot Foil Stamping, and French Flaps.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-2">
            <h3 className="font-bold text-lg text-[#202020]">Binding Types</h3>
            <p className="text-xs text-[#202020]/75 leading-relaxed">
              Perfect Bound (Paperback), Case Bound Deluxe Hardcover, Saddle Stitch, and Section-Sewn Archival Binding.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#A8B9C8] p-8 text-center space-y-4">
          <h2 className="text-2xl font-serif font-bold text-[#202020]">Need a Custom Bulk Print Quotation?</h2>
          <p className="text-xs text-[#A8B9C8] max-w-lg mx-auto">
            From 25 copies to 50,000 unit print runs, we ensure prompt logistics and sample proofs.
          </p>
          <Link to="/contact">
            <Button variant="primary">Get Printing Quote</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// 6. CONTACT US PAGE
export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#EAF1F7]">
      <div className="bg-[#202020] text-white py-16 px-4 border-b-2 border-[#48779E] text-center">
        <h1 className="text-4xl font-serif font-bold" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Contact Customer Support & Sales</h1>
        <p className="text-[#A8B9C8] text-sm mt-2 max-w-xl mx-auto">
          Have questions regarding book orders, bookstore catalog, or custom printing batches? We are here to assist.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-4">
              <h3 className="font-bold text-lg text-[#202020]">Direct Inquiries</h3>
              <div className="space-y-3 text-xs text-[#202020]/80">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#48779E]" />
                  <span>support@kagroup.com / sales@kagroup.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#48779E]" />
                  <span>+91 98765 43210 / +91 80123 45678</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#48779E]" />
                  <span>KA Tower, Literary Enclave, Pune, Maharashtra - 411001</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8] space-y-2">
              <h3 className="font-bold text-sm text-[#202020]">Office & Helpdesk Hours</h3>
              <p className="text-xs text-[#202020]/75">Monday to Saturday: 9:30 AM – 6:30 PM IST</p>
              <p className="text-xs text-[#A8B9C8]">Customer support & order queries resolved within 24 business hours.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#A8B9C8]">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold text-[#202020]">Message Dispatched</h3>
                <p className="text-xs text-[#A8B9C8]">A support representative will reply to your email within 24 business hours.</p>
              </div>
            ) : (
              <form 
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-[#202020] uppercase mb-1">Your Full Name</label>
                  <input required type="text" className="w-full text-xs p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7] focus:outline-none focus:border-[#48779E]" placeholder="e.g. Radhika Sharma" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#202020] uppercase mb-1">Email Address</label>
                  <input required type="email" className="w-full text-xs p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7] focus:outline-none focus:border-[#48779E]" placeholder="radhika@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#202020] uppercase mb-1">Subject / Inquiry Type</label>
                  <input type="text" className="w-full text-xs p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7] focus:outline-none focus:border-[#48779E]" placeholder="Order Tracking, Printing Inquiry, etc." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#202020] uppercase mb-1">Message / Query</label>
                  <textarea required rows={4} className="w-full text-xs p-2.5 rounded-lg border border-[#A8B9C8] bg-[#EAF1F7] focus:outline-none focus:border-[#48779E]" placeholder="Tell us how we can assist you..."></textarea>
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  <Send className="w-4 h-4 mr-1 inline" /> Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. FAQ PAGE
export const FAQPage = () => {
  const faqs = [
    {
      q: "Who retains the copyright of the published book?",
      a: "The author retains 100% of all intellectual property, copyright, and distribution rights. KA Group acts as your publishing facilitator."
    },
    {
      q: "How are royalties calculated and deposited?",
      a: "Authors earn 100% of net profit from all print-on-demand and eCommerce sales. Royalties are calculated live in your Author Dashboard and transferred to your bank monthly."
    },
    {
      q: "How long does the entire publishing process take?",
      a: "Standard self-publishing spans between 14 to 28 days depending on the chosen tier, editing cycles, and author approval speed."
    },
    {
      q: "Can I publish in languages other than English?",
      a: "Yes! We specialize in Hindi, Marathi, Sanskrit, and English literature with native typographical formatting."
    },
    {
      q: "Will my book be available in physical bookstores?",
      a: "Yes, our Classic Scholar and Monarch tiers include bookstore distribution partnerships and library placement across major Indian cities."
    }
  ];

  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="min-h-screen bg-[#EAF1F7]">
      <div className="bg-[#202020] text-white py-16 px-4 border-b-2 border-[#48779E] text-center">
        <h1 className="text-4xl font-serif font-bold" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Frequently Asked Questions</h1>
        <p className="text-[#A8B9C8] text-sm mt-2 max-w-xl mx-auto">
          Key clarifications on author royalties, timelines, distribution, and rights.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#A8B9C8] overflow-hidden">
            <button 
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              className="w-full text-left p-4 font-semibold text-sm text-[#202020] flex items-center justify-between hover:bg-[#EAF1F7]/50"
            >
              <span>{f.q}</span>
              <ChevronDown className={`w-4 h-4 text-[#48779E] transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === i && (
              <div className="p-4 pt-0 text-xs text-[#202020]/75 border-t border-[#EAF1F7] bg-[#EAF1F7]/20 leading-relaxed">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
