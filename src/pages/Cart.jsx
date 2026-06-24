import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n.jsx';
import { useCart } from '@/lib/cartStore.jsx';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { t, tf, lang } = useLanguage();
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const [coupon, setCoupon] = useState('');
  const shipping = subtotal > 50 ? 0 : 5;

  if (items.length === 0) {
    return (
      <div className="py-24 text-center pellazgo-container">
        <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
        <h1 className="font-display text-3xl font-light mb-2">{t('cart.title')}</h1>
        <p className="text-muted-foreground font-body mb-8">{t('cart.empty')}</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 text-xs font-body tracking-widest uppercase hover:bg-foreground/90 transition-colors"
        >
          {t('cart.continue_shopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20">
      <div className="pellazgo-container">
        <h1 className="font-display text-4xl md:text-5xl font-light mb-12">{t('cart.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-0">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-xs font-body tracking-widest uppercase text-muted-foreground">
              <span className="col-span-6">{lang === 'sq' ? 'Produkti' : 'Product'}</span>
              <span className="col-span-2 text-center">{t('product.quantity')}</span>
              <span className="col-span-2 text-right">{lang === 'sq' ? 'Çmimi' : 'Price'}</span>
              <span className="col-span-2 text-right">Total</span>
            </div>
            {items.map(item => (
              <div key={item.product_id} className="grid grid-cols-12 gap-4 py-6 border-b border-border items-center">
                <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                  <div className="w-20 h-20 bg-muted flex-shrink-0 overflow-hidden">
                    {item.image && <img src={item.image} alt={lang === 'sq' ? item.name : (item.name_en || item.name)} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <h3 className="font-heading text-sm">{lang === 'sq' ? item.name : (item.name_en || item.name)}</h3>
                    <button onClick={() => removeItem(item.product_id)} className="text-xs font-body text-muted-foreground hover:text-destructive transition-colors mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {t('cart.remove')}
                    </button>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 flex items-center justify-center">
                  <div className="flex items-center border border-border">
                    <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-2"><Minus className="w-3 h-3" /></button>
                    <span className="w-8 text-center text-sm font-body">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-2"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 text-right text-sm font-body">€{item.price.toFixed(2)}</div>
                <div className="col-span-4 md:col-span-2 text-right text-sm font-body font-medium">€{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-muted/50 p-8 border border-border sticky top-24">
              <h3 className="text-xs font-body tracking-widest uppercase mb-6">{lang === 'sq' ? 'Përmbledhja' : 'Order Summary'}</h3>

              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  placeholder={t('cart.coupon_placeholder')}
                  className="flex-1 border border-border bg-transparent px-3 py-2 text-sm font-body placeholder:text-foreground/30 focus:outline-none"
                />
                <button className="border border-foreground px-4 py-2 text-xs font-body tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors">
                  {t('cart.apply_coupon')}
                </button>
              </div>

              <div className="space-y-3 text-sm font-body">
                <div className="flex justify-between">
                  <span className="text-foreground/60">{t('cart.subtotal')}</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">{t('cart.shipping')}</span>
                  <span>{shipping === 0 ? (lang === 'sq' ? 'Falas' : 'Free') : `€${shipping.toFixed(2)}`}</span>
                </div>
                <div className="pellazgo-gold-line my-4" />
                <div className="flex justify-between text-base font-medium">
                  <span>{t('cart.total')}</span>
                  <span>€{(subtotal + shipping).toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-8 w-full bg-foreground text-background py-4 text-xs font-body tracking-widest uppercase hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
              >
                {t('cart.checkout')} <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
