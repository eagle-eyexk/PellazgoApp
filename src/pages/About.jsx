import React from 'react';
import { useLanguage } from '@/lib/i18n.jsx';
import { motion } from 'framer-motion';

const storyImg = 'https://media.base44.com/images/public/6a3435ca74b90f776117d0b5/2aa685ad7_generated_c2f7c3b3.png';
const collectionImg = 'https://media.base44.com/images/public/6a3435ca74b90f776117d0b5/23208001c_generated_7b546890.png';

export default function About() {
  const { t, lang } = useLanguage();

  const values = [
    { icon: '◆', title: lang === 'sq' ? 'Artizanat' : 'Craftsmanship', desc: lang === 'sq' ? 'Çdo produkt krijohet me kujdes të jashtëzakonshëm nga artizanë të aftë shqiptarë.' : 'Every product is crafted with extraordinary care by skilled Albanian artisans.' },
    { icon: '◇', title: lang === 'sq' ? 'Autenticitet' : 'Authenticity', desc: lang === 'sq' ? 'Përdorim vetëm materiale origjinale të cilësisë më të lartë.' : 'We use only genuine materials of the highest quality.' },
    { icon: '○', title: lang === 'sq' ? 'Qëndrueshmëri' : 'Sustainability', desc: lang === 'sq' ? 'Angazhohemi për praktika prodhimi etike dhe të qëndrueshme.' : 'We are committed to ethical and sustainable production practices.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <img src={collectionImg} alt="Pellazgo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        <div className="pellazgo-container relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-7xl font-light text-background"
          >
            {t('about.title')}
          </motion.h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-32">
        <div className="pellazgo-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-body tracking-widest uppercase text-primary">{t('about.history_title')}</span>
              <h2 className="font-display text-3xl md:text-4xl font-light mt-4 leading-tight">
                {lang === 'sq' ? 'Një Udhëtim nga Tradita në Elegancë' : 'A Journey from Tradition to Elegance'}
              </h2>
              <p className="mt-6 text-foreground/60 font-body leading-relaxed">{t('about.history_text')}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-[3/2] overflow-hidden"
            >
              <img src={storyImg} alt="Pellazgo artizanat" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>

      </section>

      {/* Mission / Vision */}
      <section className="py-20 md:py-32 bg-muted/30">

        <div className="pellazgo-container grid grid-cols-1 md:grid-cols-2 gap-16">

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-xs font-body tracking-widest uppercase text-primary">{t('about.mission_title')}</span>
            <p className="mt-4 font-display text-2xl font-light leading-relaxed">{t('about.mission_text')}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <span className="text-xs font-body tracking-widest uppercase text-primary">{t('about.vision_title')}</span>
            <p className="mt-4 font-display text-2xl font-light leading-relaxed">{t('about.vision_text')}</p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32">
        <div className="pellazgo-container">
          <h2 className="font-display text-3xl md:text-4xl font-light text-center mb-16">
            {lang === 'sq' ? 'Vlerat Tona' : 'Our Values'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span className="text-3xl text-primary">{v.icon}</span>
                <h3 className="font-display text-xl mt-4 mb-3">{v.title}</h3>
                <p className="text-sm font-body text-foreground/60 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="pellazgo-container text-center max-w-3xl mx-auto">
          <span className="text-xs font-body tracking-widest uppercase text-primary">{t('about.sustainability_title')}</span>
          <p className="mt-6 font-display text-2xl md:text-3xl font-light leading-relaxed">{t('about.sustainability_text')}</p>
        </div>
      </section>
    </div>
  );
}
