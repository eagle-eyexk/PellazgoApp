import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/i18n.jsx';
import { useCart } from '@/lib/cartStore.jsx';
import { useAuth } from '@/lib/AuthContext';
import { CheckCircle, User, Package, Phone, Mail, MapPin, CreditCard, Truck } from 'lucide-react';

export default function Checkout() {
  const { t, lang } = useLanguage();
  const { items, subtotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [form, setForm] = useState({
    first_name: user?.full_name?.split(' ')[0] || '',
    last_name: user?.full_name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Albania',
    same_shipping: true,
    // Separate shipping if different
    ship_address: '',
    ship_city: '',
    ship_postal_code: '',
    ship_country: 'Albania',
    payment_method: 'bank_transfer',
    notes: '',
  });

  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + shipping;

  const upd = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const placeOrder = async () => {
    setPlacing(true);
    const num = 'PLZ-' + Date.now().toString(36).toUpperCase();
    const billingAddr = { address: form.address, city: form.city, postal_code: form.postal_code, country: form.country };
    const shippingAddr = form.same_shipping
      ? billingAddr
      : { address: form.ship_address, city: form.ship_city, postal_code: form.ship_postal_code, country: form.ship_country };

    await base44.entities.Order.create({
      order_number: num,
      customer_email: form.email,
      customer_name: `${form.first_name} ${form.last_name}`.trim(),
      customer_phone: form.phone,
      items: items.map(i => ({ product_id: i.product_id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
      subtotal, shipping_cost: shipping, total,
      status: 'pending',
      payment_status: 'unpaid',
      payment_method: form.payment_method,
      is_guest: !isAuthenticated,
      billing_address: billingAddr,
      shipping_address: shippingAddr,
      notes: form.notes,
      traffic_source: 'direct',
    });
    setOrderNumber(num);
    clearCart();
    setStep(4);
    setPlacing(false);
  };

  if (items.length === 0 && step < 4) {
    navigate('/cart');
    return null;
  }

  const inputClass = "w-full border border-stone-200 bg-transparent px-4 py-3 text-sm font-body placeholder:text-stone-400/60 focus:outline-none focus:border-amber-600/50 transition-colors rounded-none";
  const sectionTitle = (icon, title) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-stone-200">
      {React.createElement(icon, { className: 'w-4 h-4 text-amber-700' })}
      <h3 className="text-xs font-body tracking-[0.2em] uppercase text-stone-500">{title}</h3>
    </div>
  );

  return (
    <div className="py-12 md:py-20 min-h-screen" style={{ background: '#f7f6f2' }}>
      <div className="pg-container max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-light" style={{ color: 'hsl(155 48% 12%)' }}>
            {t('checkout.title')}
          </h1>
          {!isAuthenticated && (
            <p className="mt-2 text-sm font-body text-stone-500">
              {lang === 'sq' ? 'Po blini si mysafir. ' : 'Ordering as guest. '}
              <Link to="/login" className="text-amber-700 hover:underline">
                {lang === 'sq' ? 'Hyni' : 'Sign in'}
              </Link>
              {' '}{lang === 'sq' ? 'ose' : 'or'}
              {' '}<Link to="/register" className="text-amber-700 hover:underline">
                {lang === 'sq' ? 'regjistrohu' : 'register'}
            </p>
          )}
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-10 text-[10px] font-body tracking-widest uppercase">

            {[
              { n: 1, label: lang === 'sq' ? 'Kontakti & Dërgesa' : 'Contact & Delivery' },
              { n: 2, label: lang === 'sq' ? 'Pagesa' : 'Payment' },
              { n: 3, label: lang === 'sq' ? 'Konfirmimi' : 'Review' },
            ].map((s, i) => (
              <React.Fragment key={s.n}>
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                    step >= s.n
                      ? 'text-amber-100'
                      : 'text-stone-400'
                  }`} style={step >= s.n ? { background: 'hsl(155 48% 18%)' } : { background: '#e7e5e4' }}>
                    {s.n}
                  </span>
                  <span className={step >= s.n ? 'text-stone-700' : 'text-stone-400'}>{s.label}</span>
                </div>
                {i < 2 && <span className="text-stone-300 mx-1">—</span>}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2">

            {/* Step 1: Contact + Delivery */}
            {step === 1 && (
              <div className="bg-white border border-stone-200 p-6 md:p-8 space-y-6">
                {/* Contact info */}
                <div>
                  {sectionTitle(User, lang === 'sq' ? 'Informacioni i Kontaktit' : 'Contact Information')}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder={t('checkout.first_name')} value={form.first_name} onChange={e => upd('first_name', e.target.value)} className={inputClass} required />
                      <input placeholder={t('checkout.last_name')} value={form.last_name} onChange={e => upd('last_name', e.target.value)} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                        <input placeholder={t('checkout.email')} type="email" value={form.email} onChange={e => upd('email', e.target.value)}
                          className={`${inputClass} pl-9`} required />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                        <input placeholder={t('checkout.phone')} value={form.phone} onChange={e => upd('phone', e.target.value)}
                          className={`${inputClass} pl-9`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing/Delivery address */}
                <div>
                  {sectionTitle(MapPin, lang === 'sq' ? 'Adresa e Faturimit & Dërgimit' : 'Billing & Delivery Address')}
                  <div className="space-y-3">
                    <input placeholder={t('checkout.address')} value={form.address} onChange={e => upd('address', e.target.value)} className={inputClass} required />
                    <div className="grid grid-cols-3 gap-3">
                      <input placeholder={t('checkout.city')} value={form.city} onChange={e => upd('city', e.target.value)} className={inputClass} required />
                      <input placeholder={t('checkout.postal_code')} value={form.postal_code} onChange={e => upd('postal_code', e.target.value)} className={inputClass} />
                      <input placeholder={t('checkout.country')} value={form.country} onChange={e => upd('country', e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Same shipping checkbox */}
                <label className="flex items-center gap-2 text-sm font-body cursor-pointer text-stone-600">
                  <input type="checkbox" checked={form.same_shipping} onChange={e => upd('same_shipping', e.target.checked)}
                    className="accent-amber-600 w-4 h-4" />
                  {t('checkout.same_as_billing')}
                </label>

                {/* Different shipping address */}
                {!form.same_shipping && (
                  <div>
                    {sectionTitle(Truck, lang === 'sq' ? 'Adresa e Dërgimit' : 'Shipping Address')}
                    <div className="space-y-3">
                      <input placeholder={t('checkout.address')} value={form.ship_address} onChange={e => upd('ship_address', e.target.value)} className={inputClass} />

