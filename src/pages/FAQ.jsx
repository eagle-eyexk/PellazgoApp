import React from 'react';
import { useLanguage } from '@/lib/i18n.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = {
  sq: [
    { q: 'Si mund të porosis?', a: 'Mund të porositni drejtpërdrejt nga faqja jonë duke shtuar produktet në shportë dhe duke ndjekur hapat e blerjes. Nuk keni nevojë për llogari — mund të blini si vizitor.' },
    { q: 'Cilat janë metodat e pagesës?', a: 'Pranojmë Stripe, PayPal dhe transferta bankare. Të gjitha pagesat janë të sigurta dhe të koduara.' },
    { q: 'Sa kohë zgjat dërgesa?', a: 'Dërgesa brenda Shqipërisë zgjat 2-5 ditë pune. Dërgesa ndërkombëtare zgjat 7-14 ditë pune.' },
    { q: 'A mund ta kthej produktin?', a: 'Po, pranojmë kthime brenda 30 ditëve nga data e blerjes. Produkti duhet të jetë i papërdorur dhe në paketimin origjinal.' },
    { q: 'Si mund ta gjurmoj porosinë time?', a: 'Do të merrni një email me numrin e gjurmimit sapo porosia juaj të dërgohet. Mund ta gjurmoni edhe nga paneli i llogarisë suaj.' },
    { q: 'A ofrohet transport falas?', a: 'Po, transporti është falas për porosi mbi €50 brenda Shqipërisë.' },
  ],
  en: [
    { q: 'How can I place an order?', a: 'You can order directly from our website by adding products to cart and following the checkout steps. No account needed — you can buy as a guest.' },
    { q: 'What payment methods do you accept?', a: 'We accept Stripe, PayPal and bank transfers. All payments are secure and encrypted.' },
    { q: 'How long does delivery take?', a: 'Delivery within Albania takes 2-5 business days. International delivery takes 7-14 business days.' },
    { q: 'Can I return a product?', a: 'Yes, we accept returns within 30 days of purchase. The product must be unused and in original packaging.' },
    { q: 'How can I track my order?', a: 'You will receive an email with the tracking number once your order is shipped. You can also track from your account dashboard.' },
    { q: 'Is free shipping offered?', a: 'Yes, shipping is free for orders over €50 within Albania.' },
  ],
};

export default function FAQ() {
  const { t, lang } = useLanguage();
  const items = faqs[lang] || faqs.sq;

  return (
    <div className="py-12 md:py-20">
      <div className="pellazgo-container max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-6xl font-light mb-4">{t('nav.faq')}</h1>
        <p className="text-muted-foreground font-body mb-12">
          {lang === 'sq' ? 'Pyetjet më të shpeshta' : 'Frequently Asked Questions'}
        </p>
        <Accordion type="single" collapsible className="space-y-2">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-border px-6">
              <AccordionTrigger className="font-heading text-base py-5 hover:no-underline">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm font-body text-foreground/60 pb-5 leading-relaxed">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
