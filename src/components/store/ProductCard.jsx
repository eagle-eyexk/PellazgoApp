import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/lib/i18n.jsx';
import { useCart } from '@/lib/cartStore.jsx';
import { motion } from 'framer-motion';

export default function ProductCard({ product, dark = false }) {
  const { tf } = useLanguage();
  const { addItem } = useCart();
  const name = tf(product.name_sq, product.name_en);
  const hasSale = product.sale_price && product.sale_price < product.price;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group">
      <Link to={`/product/${product.id}`} className="block">
        <div className={`relative aspect-square overflow-hidden mb-3 ${dark ? 'bg-white/5' : 'bg-stone-100'}`}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-2xl opacity-20">P</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.is_new_arrival && (
              <span className="text-[9px] font-body tracking-[0.15em] uppercase px-2 py-0.5"
                style={{ background: 'hsl(155 48% 12%)', color: 'hsl(37 50% 60%)' }}>NEW</span>
            )}
            {hasSale && (
              <span className="text-[9px] font-body tracking-[0.15em] uppercase px-2 py-0.5"
                style={{ background: 'hsl(37 40% 46%)', color: 'white' }}>SALE</span>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end"
            style={{ background: 'linear-gradient(to top, hsl(155 48% 8% / 0.9) 0%, transparent 50%)' }}>
            <div className="flex">
              <button onClick={e => { e.preventDefault(); addItem(product); }}
                className="flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-body tracking-[0.15em] uppercase transition-colors"
                style={{ background: 'hsl(37 40% 46%)', color: 'white' }}>
                <ShoppingBag className="w-3 h-3" /> Shto
              </button>
              <button onClick={e => e.preventDefault()}
                className="px-4 py-3 border-l border-white/10 text-amber-300 hover:text-amber-200"
                style={{ background: 'hsl(155 48% 12%)' }}>
                <Heart className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Link>

      <div className="space-y-1">
        <h3 className={`font-heading text-sm leading-snug ${dark ? 'text-amber-100' : 'text-stone-800'}`}>{name}</h3>
        <div className="flex items-center gap-2">
          {hasSale ? (
            <>
              <span className="text-sm font-body" style={{ color: 'hsl(37 40% 46%)' }}>€{product.sale_price?.toFixed(2)}</span>
              <span className="text-xs font-body line-through" style={{ color: dark ? 'rgba(255,255,255,0.3)' : '#aaa' }}>€{product.price?.toFixed(2)}</span>
            </>
          ) : (
            <span className={`text-sm font-body ${dark ? 'text-amber-100/70' : 'text-stone-600'}`}>€{product.price?.toFixed(2)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
