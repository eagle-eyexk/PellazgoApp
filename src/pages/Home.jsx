import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/i18n.jsx';
import ProductCard from '@/components/store/ProductCard';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Package, Shield, Truck, RefreshCw } from 'lucide-react';

const heroImg = 'https://media.base44.com/images/public/6a3435ca74b90f776117d0b5/86eb9a2c4_generated_3672f857.png';
const collectionImg1 = 'https://media.base44.com/images/public/6a3435ca74b90f776117d0b5/69a43ca6e_generated_6f6803fd.png';
const collectionImg2 = 'https://media.base44.com/images/public/6a3435ca74b90f776117d0b5/23208001c_generated_7b546890.png';
const storyImg = 'https://media.base44.com/images/public/6a3435ca74b90f776117d0b5/2aa685ad7_generated_c2f7c3b3.png';

const testimonials = [
  { name: 'Arjeta M.', city: 'Tiranë', text_sq: 'Cilësia e produkteve të Pellazgo është e jashtëzakonshme. Çanta ime e lëkurës duket akoma si e re pas dy vjetësh.', text_en: 'The quality of Pellazgo products is extraordinary. My leather bag still looks brand new after two years.', rating: 5 },
  { name: 'Besnik K.', city: 'Prishtinë', text_sq: 'Shërbimi i klientit është i shkëlqyer. Porositë arrijnë gjithmonë në kohë dhe paketimi është i mrekullueshëm.', text_en: 'Customer service is excellent. Orders always arrive on time and the packaging is wonderful.', rating: 5 },
  { name: 'Dorina L.', city: 'Durrës', text_sq: 'Pellazgo përfaqëson vërtet artizanatin shqiptar në nivelin më të lartë. Jam krenare që mbështes këtë markë.', text_en: 'Pellazgo truly represents Albanian craftsmanship at its finest. I am proud to support this brand.', rating: 5 },
];

const features = [
  { icon: Truck, sq: 'Transport Falas', en: 'Free Shipping', sq2: 'Mbi €50 brenda Shqipërisë', en2: 'On orders over €50' },
  { icon: Shield, sq: 'Garanci Cilësie', en: 'Quality Guarantee', sq2: 'Çdo produkt i certifikuar', en2: 'Every product certified' },
  { icon: RefreshCw, sq: 'Kthim 30 Ditë', en: '30-Day Returns', sq2: 'Kthim pa pyetje', en2: 'No questions asked' },
  { icon: Package, sq: 'Gjurmo Porosinë', en: 'Track Your Order', sq2: 'Gjurmim në kohë reale', en2: 'Real-time tracking' },
];

export default function Home() {
  const { t, tf, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product.filter({ status: 'active' }, '-created_date', 8)
      .then(setProducts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const displayProducts = products.filter(p => p.featured).length > 0
    ? products.filter(p => p.featured)
    : products.slice(0, 4);

  return (
    <div className="bg-[#f7f6f2]">
      {/* ── HERO ────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Pellazgo" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, hsl(155 48% 8% / 0.85) 0%, hsl(155 48% 8% / 0.5) 50%, hsl(155 48% 8% / 0.2) 100%)' }} />
        </div>

        {/* Decorative gold circle */}
        <div className="absolute top-1/2 right-16 -translate-y-1/2 hidden xl:block w-[420px] h-[420px] rounded-full border border-amber-400/10 opacity-40" />
        <div className="absolute top-1/2 right-16 -translate-y-1/2 hidden xl:block w-[320px] h-[320px] rounded-full border border-amber-400/15 opacity-50" />

        <div className="pg-container relative z-10 pb-20 md:pb-32 pt-40">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px" style={{ background: 'hsl(37 40% 56%)' }} />
              <span className="text-[10px] font-body tracking-[0.3em] uppercase text-amber-300/80">
                {lang === 'sq' ? 'Koleksioni Eksluziv 2025' : 'Exclusive Collection 2025'}
              </span>
            </div>

            <h1 className="font-display font-light text-amber-50 leading-[1.0] tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}>
              {lang === 'sq' ? <>Elegancë<br /><em className="text-amber-300">e Përjetshme</em></> : <>Timeless<br /><em className="text-amber-300">Elegance</em></>}
            </h1>

            <p className="mt-6 text-amber-100/60 text-base md:text-lg font-body font-light leading-relaxed max-w-lg">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link to="/shop" className="btn-gold inline-flex items-center justify-center gap-3 rounded-none">
                {t('hero.cta')} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/about" className="btn-outline-cream inline-flex items-center justify-center gap-3 rounded-none">
                {t('hero.secondary_cta')}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to bottom, transparent, #f7f6f2)' }} />
      </section>

      {/* ── FEATURES BAR ─────────────────────────── */}
      <section className="py-8 border-y border-stone-200" style={{ background: 'hsl(155 48% 12%)' }}>
        <div className="pg-container grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'hsl(37 40% 46% / 0.2)' }}>
                <f.icon className="w-4 h-4" style={{ color: 'hsl(37 50% 60%)' }} />
              </div>
              <div>
                <p className="text-xs font-body font-medium text-amber-200">{lang === 'sq' ? f.sq : f.en}</p>
                <p className="text-[10px] font-body text-amber-100/40">{lang === 'sq' ? f.sq2 : f.en2}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COLLECTIONS ──────────────────────────── */}
      <section className="py-24 md:py-36">
        <div className="pg-container">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-px bg-amber-700/30" />
              <span className="text-[10px] font-body tracking-[0.25em] uppercase text-amber-700/70">
                {lang === 'sq' ? 'Koleksionet Tona' : 'Our Collections'}
              </span>
              <div className="w-12 h-px bg-amber-700/30" />
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-light text-obsidian" style={{ color: 'hsl(155 48% 12%)' }}>
              {t('collections.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="group relative overflow-hidden md:col-span-2 aspect-[16/9]">
              <img src={collectionImg1} alt="Premium" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 transition-all duration-300" style={{ background: 'linear-gradient(to top, hsl(155 48% 8% / 0.8) 0%, transparent 60%)' }} />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="font-display text-3xl font-light text-amber-50">
                  {lang === 'sq' ? 'Aksesore Premium' : 'Premium Accessories'}
                </h3>
                <Link to="/shop" className="inline-flex items-center gap-2 mt-2 text-[10px] font-body tracking-[0.2em] uppercase text-amber-300 hover:text-amber-200 transition-colors">
                  {t('collections.view_all')} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="group relative overflow-hidden aspect-[9/9] md:aspect-auto">
              <img src={collectionImg2} alt="Leather" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 transition-all duration-300" style={{ background: 'linear-gradient(to top, hsl(155 48% 8% / 0.8) 0%, transparent 60%)' }} />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="font-display text-2xl font-light text-amber-50">
                  {lang === 'sq' ? 'Koleksioni Lëkurës' : 'Leather Collection'}
                </h3>
                <Link to="/shop" className="inline-flex items-center gap-2 mt-2 text-[10px] font-body tracking-[0.2em] uppercase text-amber-300 hover:text-amber-200 transition-colors">
                  {t('collections.view_all')} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ─────────────────────────────── */}
      <section className="py-16 md:py-24" style={{ background: 'hsl(155 48% 12%)' }}>
        <div className="pg-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-px" style={{ background: 'hsl(37 40% 56%)' }} />
                <span className="text-[10px] font-body tracking-[0.25em] uppercase text-amber-300/70">
                  {lang === 'sq' ? 'Të Zgjedhura' : 'Curated'}
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-light text-amber-50">
                {lang === 'sq' ? 'Produktet Tona' : 'Our Products'}
              </h2>
            </div>
            <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-[10px] font-body tracking-[0.2em] uppercase text-amber-300 hover:text-amber-200 transition-colors">
              {t('collections.view_all')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="aspect-square rounded" style={{ background: 'hsl(155 40% 18%)' }} />)}
            </div>
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {displayProducts.map(p => <ProductCard key={p.id} product={p} dark />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-amber-100/30 font-body mb-4">{t('shop.no_products')}</p>
              <Link to="/shop" className="btn-gold inline-flex items-center gap-2 rounded-none text-xs">
                {lang === 'sq' ? 'Shto Produkte' : 'Add Products'} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── BRAND STORY ──────────────────────────── */}
      <section className="py-24 md:py-36">
        <div className="pg-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28 items-center">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="relative">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={storyImg} alt="Pellazgo craft" className="w-full h-full object-cover" />
              </div>
              {/* Gold corner accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-amber-600/40" />
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-amber-600/40" />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-amber-700" />
                <span className="text-[10px] font-body tracking-[0.25em] uppercase text-amber-700">{t('about.history_title')}</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-tight" style={{ color: 'hsl(155 48% 12%)' }}>
                {lang === 'sq' ? 'Artizanat që\nRrëfen Histori' : 'Craft that\nTells Stories'}
              </h2>
              <p className="mt-6 font-body leading-loose text-stone-500 text-base">{t('about.history_text')}</p>

              <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-stone-200">
                {[['15+', lang === 'sq' ? 'Vite Eksperiencë' : 'Years Experience'],
                  ['2K+', lang === 'sq' ? 'Klientë të Kënaqur' : 'Happy Clients'],
                  ['100%', lang === 'sq' ? 'Lëkurë Origjinale' : 'Genuine Leather']].map(([val, lbl]) => (
                  <div key={val}>
                    <p className="font-display text-3xl font-light" style={{ color: 'hsl(37 40% 46%)' }}>{val}</p>
                    <p className="text-[10px] font-body text-stone-400 mt-1 leading-tight">{lbl}</p>
                  </div>
                ))}
              </div>

              <Link to="/about" className="inline-flex items-center gap-2 mt-10 text-[11px] font-body tracking-[0.2em] uppercase hover:gap-3 transition-all"
                style={{ color: 'hsl(155 48% 18%)' }}>
                {t('hero.secondary_cta')} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <section className="py-24" style={{ background: 'hsl(40 20% 94%)' }}>
        <div className="pg-container">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-px bg-amber-700/30" />
              <span className="text-[10px] font-body tracking-[0.25em] uppercase text-amber-700/70">Testimonials</span>
              <div className="w-12 h-px bg-amber-700/30" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light" style={{ color: 'hsl(155 48% 12%)' }}>
              {t('testimonials.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 border-l-2 border-amber-600/40 shadow-sm">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(item.rating)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="font-display text-lg font-light leading-relaxed italic" style={{ color: 'hsl(155 20% 20%)' }}>
                  "{tf(item.text_sq, item.text_en)}"
                </p>
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-semibold text-amber-100"
                    style={{ background: 'hsl(155 48% 18%)' }}>
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-body font-medium" style={{ color: 'hsl(155 48% 12%)' }}>{item.name}</p>
                    <p className="text-[10px] font-body text-stone-400">{item.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────── */}
      <section className="py-24" style={{ background: 'hsl(155 48% 12%)' }}>
        <div className="pg-container text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'hsl(37 40% 46% / 0.15)' }}>
            <img src="https://media.base44.com/images/public/user_69ce8a155d877f66a5fbf561/717b6b136_IMG_0659.jpg" alt="" className="w-8 h-8 rounded-full object-cover" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-light text-amber-50">{t('newsletter.title')}</h2>
          <p className="mt-4 text-amber-100/50 font-body text-sm">{t('newsletter.subtitle')}</p>
          <div className="flex mt-8 max-w-md mx-auto">
            <input type="email" placeholder={t('footer.email_placeholder')}
              className="flex-1 bg-white/5 border border-amber-400/20 text-amber-100 text-sm font-body px-5 py-3.5 placeholder:text-amber-100/25 focus:outline-none focus:border-amber-400/50 transition-colors" />
            <button className="btn-gold whitespace-nowrap rounded-none border-0"
              style={{ padding: '0 1.5rem' }}>
              {t('footer.subscribe')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
