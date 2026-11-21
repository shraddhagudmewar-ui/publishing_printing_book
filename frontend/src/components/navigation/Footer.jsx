import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#202020] text-white border-t-2 border-[#48779E] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column with Logo */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 border border-[#48779E] shrink-0">
                <img
                  src="/logo-emblem.png"
                  alt="KA Group Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-brand font-bold text-sm tracking-wider text-white">
                KA GROUP
              </span>
            </div>
            <p className="text-xs text-[#A8B9C8] tracking-widest uppercase font-sans">
              Where Words Become Legacy.
            </p>
            <p className="text-xs text-[#EAF1F7]/80 leading-relaxed">
              Committed to preserving intellectual rigour, timeless literature, and thought-provoking voices across continents.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A8B9C8] mb-4">
              Self-Publishing
            </h4>
            <ul className="space-y-2 text-xs text-[#EAF1F7]/80">
              <li>
                <Link to="/submissions" className="hover:text-white transition-colors">
                  Publish a Book (Step-by-Step)
                </Link>
              </li>
              <li>
                <Link to="/submissions" className="hover:text-white transition-colors">
                  ISBN & Copyright Registration
                </Link>
              </li>
              <li>
                <Link to="/submissions" className="hover:text-white transition-colors">
                  Book Cover & Typesetting
                </Link>
              </li>
              <li>
                <Link to="/submissions" className="hover:text-white transition-colors">
                  Author Royalties Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A8B9C8] mb-4">
              Author & Reader Portals
            </h4>
            <ul className="space-y-2 text-xs text-[#EAF1F7]/80">
              <li>
                <Link to="/author/dashboard" className="hover:text-white transition-colors">
                  Author Manuscript Studio
                </Link>
              </li>
              <li>
                <Link to="/customer/dashboard" className="hover:text-white transition-colors">
                  Reader Library & Orders
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition-colors">
                  Publisher Administrative Console
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Portal Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A8B9C8] mb-4">
              Editorial Offices
            </h4>
            <div className="space-y-2.5 text-xs text-[#EAF1F7]/80">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#48779E]" />
                <span>Publishing Quarter, Chancery Row</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#48779E]" />
                <span>press@kagroup.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#48779E]" />
                <span>+1 (800) 555-KAPUB</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-[#A8B9C8]">
          <p>© {new Date().getFullYear()} KA Group of Publications. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-heading italic text-[#A8B9C8]/80">
            "Where Words Become Legacy."
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
