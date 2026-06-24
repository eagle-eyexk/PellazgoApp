import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/i18n.jsx';
import ProductCard from '@/components/store/ProductCard';
import { SlidersHorizontal, X } from 'lucide-react';

export default function Shop() {
  const { t, tf, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([
      base44.entities.Product.filter({ status: 'active' }),
      base44.entities.Category.filter({ is_active: true })
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  let filtered = products;
  if (selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.category_id === selectedCategory);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      (p.name_sq || '').toLowerCase().includes(q) ||
      (p.name_en || '').toLowerCase().includes(q)
    );
  }
  if (sortBy === 'price_low') filtered = [...filtered].sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
  else if (sortBy === 'price_high') filtered = [...filtered].sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
  else filtered = [...filtered].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  return (
    <div className="py-12 md:py-20">
      <div className="pellazgo-container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-6xl font-light">{t('shop.title')}</h1>
          <p className="mt-2 text-muted-foreground font-body text-sm">{filtered.length} {lang === 'sq' ? 'produkte' : 'products'}</p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 text-xs font-body tracking-widest uppercase text-foreground/70 hover:text-foreground transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {t('shop.filter')}
            </button>
            <input
              type="text"
              placeholder={t('shop.search_placeholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="hidden md:block bg-transparent text-sm font-body border-b border-transparent focus:border-foreground/20 px-2 py-1 placeholder:text-foreground/30 focus:outline-none transition-colors w-48"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-xs font-body tracking-widest uppercase bg-transparent text-foreground/70 focus:outline-none cursor-pointer"
          >
            <option value="newest">{t('shop.sort_newest')}</option>
            <option value="price_low">{t('shop.sort_price_low')}</option>
            <option value="price_high">{t('shop.sort_price_high')}</option>
          </select>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div className="mb-8 p-6 border border-border bg-background">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-body tracking-widest uppercase">{t('shop.filter')}</h3>
              <button onClick={() => setFilterOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 text-xs font-body tracking-wide border transition-colors ${selectedCategory === 'all' ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground/30'}`}
              >
                {t('shop.all_products')}
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-body tracking-wide border transition-colors ${selectedCategory === cat.id ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground/30'}`}
                >
                  {tf(cat.name_sq, cat.name_en)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-muted-foreground font-body text-lg">{t('shop.no_products')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
