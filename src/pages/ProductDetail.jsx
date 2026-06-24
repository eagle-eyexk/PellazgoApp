import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/i18n.jsx';
import { useCart } from '@/lib/cartStore.jsx';
import ProductCard from '@/components/store/ProductCard';
import { Heart, Minus, Plus, ChevronLeft, Star, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { id } = useParams();
  const { t, tf, lang } = useLanguage();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    setLoading(true);
    base44.entities.Product.get(id).then(prod => {
      setProduct(prod);
      setSelectedImage(0);
      setQuantity(1);
      if (prod.category_id) {
        base44.entities.Product.filter({ category_id: prod.category_id, status: 'active' }, '-created_date', 5)
          .then(r => setRelated(r.filter(p => p.id !== id)))
          .catch(() => {});
      }
      base44.entities.Review.filter({ product_id: id, is_approved: true })
        .then(setReviews)
        .catch(() => {});
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-12 pellazgo-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-muted animate-pulse" />
          <div className="space-y-6">
            <div className="h-8 w-3/4 bg-muted animate-pulse" />
            <div className="h-6 w-1/4 bg-muted animate-pulse" />
            <div className="h-32 bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center pellazgo-container">
        <p className="text-muted-foreground font-body">{lang === 'sq' ? 'Produkti nuk u gjet' : 'Product not found'}</p>
        <Link to="/shop" className="inline-flex items-center gap-2 mt-4 text-xs font-body tracking-widest uppercase text-primary">
          <ChevronLeft className="w-3.5 h-3.5" /> {t('cart.continue_shopping')}
        </Link>
      </div>
    );
  }

  const name = tf(product.name_sq, product.name_en);
  const hasSale = product.sale_price && product.sale_price < product.price;
  const images = product.images?.length > 0 ? product.images : [];

  return (
    <div className="py-12 md:py-20">
      <div className="pellazgo-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs font-body text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">{t('nav.home')}</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground transition-colors">{t('nav.shop')}</Link>
          <span>/</span>
          <span className="text-foreground">{name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Images */}
          <div>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-muted overflow-hidden mb-4"
            >
              {images[selectedImage] ? (
                <img src={images[selectedImage]} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground font-heading text-2xl">Pellazgo</div>
              )}
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 border-2 overflow-hidden transition-colors ${i === selectedImage ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info - sticky */}
          <div className="md:sticky md:top-24 md:self-start space-y-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-light">{name}</h1>
              <div className="flex items-center gap-3 mt-3">
                {hasSale ? (
                  <>
                    <span className="text-2xl font-body font-medium text-primary">€{product.sale_price.toFixed(2)}</span>
                    <span className="text-lg font-body text-muted-foreground line-through">€{product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-2xl font-body">€{product.price.toFixed(2)}</span>
                )}
              </div>
            </div>

            {/* Rating */}
            {product.review_count > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
                  ))}
                </div>
                <span className="text-xs font-body text-muted-foreground">({product.review_count})</span>
              </div>
            )}

            {/* Meta */}
            <div className="space-y-2 text-sm font-body">
              {product.sku && <p className="text-muted-foreground">{t('product.sku')}: {product.sku}</p>}
              <p className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                {product.stock > 0 ? `${t('product.in_stock')} (${product.stock})` : t('shop.out_of_stock')}
              </p>
            </div>

            <div className="pellazgo-gold-line" />

            {/* Quantity & Add to cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-body tracking-widest uppercase">{t('product.quantity')}</span>
                <div className="flex items-center border border-border">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-muted transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-body">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-muted transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => addItem(product, quantity)}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-foreground text-background py-4 text-xs font-body tracking-widest uppercase hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {t('product.add_to_cart')}
                </button>
                <button className="border border-border p-4 hover:bg-muted transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pellazgo-gold-line" />

            {/* Tabs */}
            <div>
              <div className="flex gap-6 border-b border-border">
                {['description', 'specifications', 'reviews'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-xs font-body tracking-widest uppercase transition-colors ${activeTab === tab ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {t(`product.${tab}`)}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                {activeTab === 'description' && (
                  <p className="text-sm font-body leading-relaxed text-foreground/70">
                    {tf(product.description_sq, product.description_en) || (lang === 'sq' ? 'Përshkrimi i produktit nuk është i disponueshëm.' : 'Product description not available.')}
                  </p>
                )}
                {activeTab === 'specifications' && (
                  <p className="text-sm font-body leading-relaxed text-foreground/70">
                    {tf(product.specifications_sq, product.specifications_en) || (lang === 'sq' ? 'Specifikimet nuk janë të disponueshme.' : 'Specifications not available.')}
                  </p>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-sm text-muted-foreground font-body">{lang === 'sq' ? 'Ende nuk ka vlerësime.' : 'No reviews yet.'}</p>
                    ) : reviews.map(r => (
                      <div key={r.id} className="p-4 border border-border">
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
                          ))}
                        </div>
                        <p className="text-sm font-body text-foreground/70">{r.comment}</p>
                        <p className="text-xs font-body text-muted-foreground mt-2">{r.customer_name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-24">
