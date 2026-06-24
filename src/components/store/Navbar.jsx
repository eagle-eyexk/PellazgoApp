import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Globe, User, Package, LogIn } from 'lucide-react';
import { useLanguage } from '@/lib/i18n.jsx';
import { useCart } from '@/lib/cartStore.jsx';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const { itemCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/blog', label: t('nav.blog') },
  ];

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'shadow-2xl' : ''}`}
        style={{ background: 'hsl(155 48% 12%)' }}>
        {/* Top gold accent line */}
        <div className="gold-line" />

        <div className="pg-container flex items-center justify-between h-16 md:h-[72px]">
          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 -ml-2 text-amber-100/80 hover:text-amber-200 transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          {/* Left links */}
          <div className="hidden md:flex items-center gap-8">
            {links.slice(0, 3).map(link => (
              <Link key={link.to} to={link.to}
                className={`text-[11px] font-body tracking-[0.18em] uppercase transition-colors ${isActive(link.to) ? 'text-amber-300' : 'text-amber-100/70 hover:text-amber-200'}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logo — centered */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-full overflow-hidden ring-1 ring-amber-400/30 shadow-lg shadow-black/40">
              <img
                src="https://media.base44.com/images/public/user_69ce8a155d877f66a5fbf561/717b6b136_IMG_0659.jpg"
                alt="Pellazgo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden lg:block font-display text-xl text-amber-200 tracking-widest" style={{ letterSpacing: '0.3em' }}>
              PELLAZGO
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {links.slice(3).map(link => (
              <Link key={link.to} to={link.to}
                className={`hidden md:block text-[11px] font-body tracking-[0.18em] uppercase transition-colors ${isActive(link.to) ? 'text-amber-300' : 'text-amber-100/70 hover:text-amber-200'}`}>
                {link.label}
              </Link>
            ))}

            <button onClick={() => setLang(lang === 'sq' ? 'en' : 'sq')}
              className="hidden sm:flex items-center gap-1 text-[10px] font-body tracking-widest text-amber-100/60 hover:text-amber-200 transition-colors border border-amber-400/20 px-2 py-1 rounded-sm">
              <Globe className="w-3 h-3" />
              {lang === 'sq' ? 'EN' : 'SQ'}
            </button>

            <button onClick={() => setSearchOpen(!searchOpen)} className="p-1.5 text-amber-100/70 hover:text-amber-200 transition-colors">
              <Search className="w-4 h-4" />
            </button>

            {isAuthenticated ? (
              <Link to="/account" className="p-1.5 hidden sm:flex items-center gap-1.5 text-amber-100/70 hover:text-amber-200 transition-colors">
                <User className="w-4 h-4" />
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-1.5 text-[10px] font-body tracking-[0.15em] uppercase text-amber-100/70 hover:text-amber-200 transition-colors border border-amber-400/20 px-2.5 py-1 rounded-sm">
                <LogIn className="w-3 h-3" />
                {lang === 'sq' ? 'Hyr' : 'Login'}
              </Link>
            )}

            <Link to="/track-order" className="p-1.5 hidden sm:block text-amber-100/70 hover:text-amber-200 transition-colors">
              <Package className="w-4 h-4" />
            </Link>

            <Link to="/cart" className="relative p-1.5 text-amber-100/70 hover:text-amber-200 transition-colors">
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full"
                  style={{ background: 'hsl(37 50% 56%)', color: 'hsl(155 48% 10%)' }}>
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="gold-line" />

        {/* Search dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-amber-400/10" style={{ background: 'hsl(155 48% 10%)' }}>
              <div className="pg-container py-4 flex items-center gap-3">
                <Search className="w-4 h-4 text-amber-400/50" />
                <input type="text" placeholder={t('shop.search_placeholder')} autoFocus
                  className="flex-1 bg-transparent text-amber-100 text-sm font-body placeholder:text-amber-100/30 focus:outline-none" />
                <button onClick={() => setSearchOpen(false)}><X className="w-4 h-4 text-amber-100/40" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-80 z-[70] flex flex-col" style={{ background: 'hsl(155 48% 10%)' }}>
            <div className="flex items-center justify-between p-6 border-b border-amber-400/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-amber-400/30">
                  <img src="https://media.base44.com/images/public/user_69ce8a155d877f66a5fbf561/717b6b136_IMG_0659.jpg" alt="Pellazgo" className="w-full h-full object-cover" />
                </div>
                <span className="font-display text-lg text-amber-200 tracking-widest">PELLAZGO</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-amber-100/60 hover:text-amber-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 py-8 px-6 space-y-1 overflow-y-auto">
              {[...links, { to: '/track-order', label: lang === 'sq' ? 'Gjurmo Porosinë' : 'Track Order' }].map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  className={`flex items-center py-3 text-sm font-body tracking-widest uppercase border-b border-amber-400/10 transition-colors ${isActive(link.to) ? 'text-amber-300' : 'text-amber-100/70 hover:text-amber-200'}`}>
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <Link to="/account" onClick={() => setMobileOpen(false)}
                  className={`flex items-center py-3 text-sm font-body tracking-widest uppercase border-b border-amber-400/10 transition-colors ${isActive('/account') ? 'text-amber-300' : 'text-amber-100/70 hover:text-amber-200'}`}>
                  {t('nav.account')}
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-3 text-sm font-body tracking-widest uppercase border-b border-amber-400/10 text-amber-100/70 hover:text-amber-200 transition-colors">
                    <LogIn className="w-3.5 h-3.5" />
                    {lang === 'sq' ? 'Hyr në Llogari' : 'Login'}
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-3 text-sm font-body tracking-widest uppercase border-b border-amber-400/10 text-amber-300 hover:text-amber-200 transition-colors">
                    {lang === 'sq' ? 'Regjistrohu' : 'Register'}
                  </Link>
                </>
              )}
            </div>
            <div className="p-6 border-t border-amber-400/10">
              <button onClick={() => { setLang(lang === 'sq' ? 'en' : 'sq'); setMobileOpen(false); }}
                className="flex items-center gap-2 text-xs font-body tracking-widest uppercase text-amber-100/50 hover:text-amber-200">
                <Globe className="w-3.5 h-3.5" />
                {lang === 'sq' ? 'Switch to English' : 'Kalo në Shqip'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {mobileOpen && <div className="fixed inset-0 z-[60] bg-black/60" onClick={() => setMobileOpen(false)} />}
    </>
  );
}
