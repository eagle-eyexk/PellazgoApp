import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/i18n.jsx';
import { Link } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';

export default function AccountProfile() {
  const { t, lang } = useLanguage();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', address: '', city: '', country: 'Albania', postal_code: '', language: 'sq',
  });

  useEffect(() => {
    base44.entities.Customer.list('-created_date', 1).then(custs => {
      if (custs.length > 0) {
        const c = custs[0];
        setCustomer(c);
        setForm({
          full_name: c.full_name || '',
          email: c.email || '',
          phone: c.phone || '',
          address: c.address || '',
          city: c.city || '',
          country: c.country || 'Albania',
          postal_code: c.postal_code || '',
          language: c.language || 'sq',
        });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (customer) {
      await base44.entities.Customer.update(customer.id, form);
    } else {
      await base44.entities.Customer.create(form);
    }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass = "w-full border border-border bg-transparent px-4 py-3 text-sm font-body placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors";

  if (loading) {
    return <div className="py-12 pellazgo-container"><div className="h-64 bg-muted animate-pulse" /></div>;
  }

  return (
    <div className="py-12 md:py-20">
      <div className="pellazgo-container max-w-2xl mx-auto">
        <Link to="/account" className="inline-flex items-center gap-1 text-xs font-body tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ChevronLeft className="w-3.5 h-3.5" /> {t('common.back')}
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-light mb-8">{t('customer.edit_profile')}</h1>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-body tracking-widest uppercase text-muted-foreground mb-2 block">{lang === 'sq' ? 'Emri i Plotë' : 'Full Name'}</label>
              <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-body tracking-widest uppercase text-muted-foreground mb-2 block">Email</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="text-xs font-body tracking-widest uppercase text-muted-foreground mb-2 block">{lang === 'sq' ? 'Telefoni' : 'Phone'}</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-body tracking-widest uppercase text-muted-foreground mb-2 block">{lang === 'sq' ? 'Adresa' : 'Address'}</label>
            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={inputClass} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-body tracking-widest uppercase text-muted-foreground mb-2 block">{lang === 'sq' ? 'Qyteti' : 'City'}</label>
              <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-body tracking-widest uppercase text-muted-foreground mb-2 block">{lang === 'sq' ? 'Kodi Postar' : 'Postal Code'}</label>
              <input value={form.postal_code} onChange={e => setForm({ ...form, postal_code: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-body tracking-widest uppercase text-muted-foreground mb-2 block">{lang === 'sq' ? 'Shteti' : 'Country'}</label>
              <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="text-xs font-body tracking-widest uppercase text-muted-foreground mb-2 block">{t('common.language')}</label>
            <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} className={inputClass}>
              <option value="sq">Shqip</option>
              <option value="en">English</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-foreground text-background px-8 py-4 text-xs font-body tracking-widest uppercase hover:bg-foreground/90 transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? (lang === 'sq' ? 'Duke ruajtur...' : 'Saving...') : t('customer.save')}
          </button>
          {saved && (
            <p className="text-sm text-green-600 font-body">{lang === 'sq' ? 'Profili u ruajt me sukses!' : 'Profile saved successfully!'}</p>
          )}
        </div>
      </div>
    </div>
  );
}
