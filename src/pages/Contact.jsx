import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n.jsx';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const { t, lang } = useLanguage();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="py-12 md:py-20">
      <div className="pellazgo-container">
        <h1 className="font-display text-4xl md:text-6xl font-light mb-4">{t('contact.title')}</h1>
        <p className="text-muted-foreground font-body mb-16 max-w-lg">
          {lang === 'sq' ? 'Keni pyetje? Na shkruani dhe do t\'ju përgjigjemi brenda 24 orëve.' : 'Have a question? Write to us and we\'ll respond within 24 hours.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            {sent ? (
              <div className="text-center py-16">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="font-display text-2xl">{t('contact.success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  placeholder={t('contact.name')}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  placeholder={t('contact.email')}
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  placeholder={t('contact.subject')}
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors"
                />
                <textarea
                  placeholder={t('contact.message')}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <button
                  type="submit"
                  className="bg-foreground text-background px-8 py-4 text-xs font-body tracking-widest uppercase hover:bg-foreground/90 transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {t('contact.send')}
                </button>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-10">
            <div className="flex gap-4">
            <div className="flex gap-4">
              <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-body tracking-widest uppercase mb-2">{t('contact.phone')}</h3>
                <a href="tel:+355691234567" className="text-sm font-body text-foreground/60 hover:text-foreground transition-colors">+355 69 123 4567</a>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-body tracking-widest uppercase mb-2">{t('contact.email_label')}</h3>
                <a href="mailto:info@pellazgo.com" className="text-sm font-body text-foreground/60 hover:text-foreground transition-colors">info@pellazgo.com</a>
              </div>
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              </div>
            </div>
            </div>

            <div className="mt-8">
              <div className="aspect-video bg-muted overflow-hidden">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=19.78%2C41.31%2C19.85%2C41.35&layer=mapnik"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  title="Pellazgo Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}              <div>
                <h3 className="text-xs font-body tracking-widest uppercase mb-2">{t('contact.address')}</h3>
                <p className="text-sm font-body text-foreground/60">Rruga e Durrësit, Nr. 45<br />Tiranë, 1001<br />Shqipëri</p>

