import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/i18n.jsx';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const statusSteps = ['pending', 'paid', 'processing', 'shipped', 'delivered'];

const statusConfig = {
  pending:    { icon: Clock,         color: 'text-amber-500',   bg: 'bg-amber-500/10',   sq: 'Në Pritje',    en: 'Pending' },
  paid:       { icon: CheckCircle,   color: 'text-blue-400',    bg: 'bg-blue-400/10',    sq: 'Paguar',       en: 'Paid' },
  processing: { icon: Package,       color: 'text-purple-400',  bg: 'bg-purple-400/10',  sq: 'Në Përpunim', en: 'Processing' },
  shipped:    { icon: Truck,         color: 'text-green-400',   bg: 'bg-green-400/10',   sq: 'Dërguar',      en: 'Shipped' },
  delivered:  { icon: CheckCircle,   color: 'text-emerald-400', bg: 'bg-emerald-400/10', sq: 'Dorëzuar',     en: 'Delivered' },
  cancelled:  { icon: XCircle,       color: 'text-red-400',     bg: 'bg-red-400/10',     sq: 'Anuluar',      en: 'Cancelled' },
  returned:   { icon: XCircle,       color: 'text-orange-400',  bg: 'bg-orange-400/10',  sq: 'Kthyer',       en: 'Returned' },
};

export default function TrackOrder() {
  const { lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    const orders = await base44.entities.Order.filter({ order_number: query.trim().toUpperCase() });
    const found = orders.find(o =>
      o.order_number === query.trim().toUpperCase() &&
      (!email || o.customer_email?.toLowerCase() === email.toLowerCase())
    );
    if (found) setOrder(found);
    else setNotFound(true);
    setLoading(false);
  };

  const currentStep = order ? statusSteps.indexOf(order.status) : -1;
  const cfg = order ? statusConfig[order.status] || statusConfig.pending : null;

  return (
    <div className="min-h-screen py-16 md:py-24" style={{ background: '#f7f6f2' }}>
      <div className="pg-container max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'hsl(155 48% 12%)' }}>
              <Package className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-light" style={{ color: 'hsl(155 48% 12%)' }}>
            {lang === 'sq' ? 'Gjurmo Porosinë' : 'Track Your Order'}
          </h1>
