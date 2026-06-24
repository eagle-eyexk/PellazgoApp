import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n.jsx';
import { Instagram, Facebook, Mail, MapPin, Phone, Package } from 'lucide-react';

export default function Footer() {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState('');

  return (
    <footer style={{ background: 'hsl(155 48% 8%)' }}>
      {/* Top gold line */}
      <div className="gold-line" />

      <div className="pg-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-amber-400/30">
                <img src="https://media.base44.com/images/public/user_69ce8a155d877f66a5fbf561/717b6b136_IMG_0659.jpg" alt="Pellazgo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display text-xl text-amber-200 tracking-[0.25em]">PELLAZGO</span>
            </div>
            <p className="text-sm text-amber-100/40 leading-relaxed font-body mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/pellazgo.official" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-amber-400/20 text-amber-100/40 hover:text-amber-300 hover:border-amber-400/50 transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="https://www.facebook.com/p/Pellazgo-Offici-61590856476746/" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-amber-400/20 text-amber-100/40 hover:text-amber-300 hover:border-amber-400/50 transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="https://www.tiktok.com/@pellazgo.official" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-amber-400/20 text-amber-100/40 hover:text-amber-300 hover:border-amber-400/50 transition-colors">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
              </a>
              <a href="mailto:info@pellazgo.com"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-amber-400/20 text-amber-100/40 hover:text-amber-300 hover:border-amber-400/50 transition-colors">
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[10px] font-body tracking-[0.25em] uppercase mb-6 text-amber-300/50">{t('footer.quick_links')}</h4>
            <div className="flex flex-col gap-3">
              {[['/', t('nav.home')], ['/shop', t('nav.shop')], ['/about', t('nav.about')], ['/contact', t('nav.contact')], ['/blog', t('nav.blog')]].map(([to, lbl]) => (
                <Link key={to} to={to} className="text-sm text-amber-100/40 hover:text-amber-200 transition-colors font-body">{lbl}</Link>
              ))}
            </div>
          </div>

          {/* Customer */}
          <div>
            <h4 className="text-[10px] font-body tracking-[0.25em] uppercase mb-6 text-amber-300/50">{t('footer.customer_service')}</h4>
            <div className="flex flex-col gap-3">
              <Link to="/track-order" className="text-sm text-amber-100/40 hover:text-amber-200 transition-colors font-body flex items-center gap-2">
                <Package className="w-3 h-3" /> {lang === 'sq' ? 'Gjurmo Porosinë' : 'Track Order'}
              </Link>
              <Link to="/faq" className="text-sm text-amber-100/40 hover:text-amber-200 transition-colors font-body">{t('nav.faq')}</Link>
              <Link to="/shipping-policy" className="text-sm text-amber-100/40 hover:text-amber-200 transition-colors font-body">{t('footer.shipping_policy')}</Link>
              <Link to="/returns-policy" className="text-sm text-amber-100/40 hover:text-amber-200 transition-colors font-body">{t('footer.returns_policy')}</Link>
              <Link to="/privacy-policy" className="text-sm text-amber-100/40 hover:text-amber-200 transition-colors font-body">{t('footer.privacy_policy')}</Link>
            </div>
          </div>

          {/* Newsletter + contact */}
          <div>
            <h4 className="text-[10px] font-body tracking-[0.25em] uppercase mb-6 text-amber-300/50">{t('footer.newsletter')}</h4>
            <p className="text-sm text-amber-100/40 mb-4 font-body">{t('footer.newsletter_text')}</p>
            <div className="flex mb-8">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={t('footer.email_placeholder')}
                className="flex-1 bg-white/5 border border-amber-400/20 text-amber-100 text-xs px-3 py-2.5 placeholder:text-amber-100/20 focus:outline-none focus:border-amber-400/40 font-body" />
              <button className="px-4 text-xs font-body tracking-widest uppercase text-amber-900"
                style={{ background: 'hsl(37 40% 46%)' }}>
                {t('footer.subscribe')}
              </button>
            </div>
            <div className="space-y-2 text-xs font-body text-amber-100/30">
              <div className="flex items-start gap-2"><MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /><span>Rruga e Durrësit 45, Tiranë</span></div>
              <div className="flex items-center gap-2"><Phone className="w-3 h-3 flex-shrink-0" /><a href="tel:+355691234567" className="hover:text-amber-300 transition-colors">+355 69 123 4567</a></div>
              <div className="flex items-center gap-2"><Mail className="w-3 h-3 flex-shrink-0" /><a href="mailto:info@pellazgo.com" className="hover:text-amber-300 transition-colors">info@pellazgo.com</a></div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-amber-400/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-amber-100/25 font-body">© {new Date().getFullYear()} Pellazgo. {t('footer.rights')}</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="text-[11px] text-amber-100/25 hover:text-amber-300 font-body transition-colors">{t('footer.privacy_policy')}</Link>
            <Link to="/terms" className="text-[11px] text-amber-100/25 hover:text-amber-300 font-body transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
