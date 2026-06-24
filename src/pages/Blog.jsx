import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/i18n.jsx';
import { motion } from 'framer-motion';

export default function Blog() {
  const { t, tf, lang } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.BlogPost.filter({ status: 'published' }, '-created_date')
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 md:py-20">
      <div className="pellazgo-container">
        <h1 className="font-display text-4xl md:text-6xl font-light mb-4">{t('nav.blog')}</h1>
        <p className="text-muted-foreground font-body mb-16">
          {lang === 'sq' ? 'Lajme, histori dhe frymëzim nga bota e Pellazgo' : 'News, stories and inspiration from the world of Pellazgo'}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="space-y-4"><div className="aspect-[3/2] bg-muted animate-pulse" /><div className="h-4 w-3/4 bg-muted animate-pulse" /></div>)}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map(post => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="aspect-[3/2] overflow-hidden bg-muted mb-4">
                  {post.cover_image && (
                    <img src={post.cover_image} alt={tf(post.title_sq, post.title_en)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                </div>
                <p className="text-xs font-body text-muted-foreground mb-2">
                  {new Date(post.created_date).toLocaleDateString(lang === 'sq' ? 'sq-AL' : 'en-US')}
                </p>
                <h2 className="font-display text-xl">{tf(post.title_sq, post.title_en)}</h2>
                <p className="mt-2 text-sm font-body text-foreground/60 line-clamp-2">
                  {tf(post.excerpt_sq, post.excerpt_en)}
                </p>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-muted-foreground font-body">{lang === 'sq' ? 'Nuk ka artikuj ende.' : 'No articles yet.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
