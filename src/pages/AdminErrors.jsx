import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, XCircle, ShoppingCart, CreditCard } from 'lucide-react';

export default function AdminErrors() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Order.list('-created_date', 100).then(setOrders).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const failedPayments = orders.filter(o => o.payment_status === 'unpaid' && o.status !== 'pending');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');
  const pendingTooLong = orders.filter(o => {
    if (o.status !== 'pending') return false;
    const created = new Date(o.created_date);
    const now = new Date();
    return (now - created) > 24 * 60 * 60 * 1000; // older than 24h
  });

  const errorCategories = [
    { label: 'Pagesa të Dështuara', icon: CreditCard, count: failedPayments.length, color: 'text-red-400', bg: 'bg-red-500/10', items: failedPayments },
    { label: 'Porosi të Anuluara', icon: XCircle, count: cancelledOrders.length, color: 'text-orange-400', bg: 'bg-orange-500/10', items: cancelledOrders },
    { label: 'Porosi në Pritje (24h+)', icon: ShoppingCart, count: pendingTooLong.length, color: 'text-yellow-400', bg: 'bg-yellow-500/10', items: pendingTooLong },
  ];

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-white/5 animate-pulse rounded" />)}</div>;

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl text-white">Monitorimi i Gabimeve</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {errorCategories.map((cat, i) => (
          <div key={i} className={`${cat.bg} border border-white/10 rounded p-5`}>
            <div className="flex items-center gap-3 mb-3">
              <cat.icon className={`w-5 h-5 ${cat.color}`} />
              <span className="text-xs font-body tracking-widest uppercase text-white/40">{cat.label}</span>
            </div>
            <p className={`font-heading text-3xl ${cat.color}`}>{cat.count}</p>
          </div>
        ))}
      </div>

      {/* Detail lists */}
      {errorCategories.map((cat, ci) => (
        <div key={ci} className="bg-white/5 border border-white/10 rounded">
          <div className="flex items-center gap-2 p-5 border-b border-white/10">
            <cat.icon className={`w-4 h-4 ${cat.color}`} />
            <h3 className="text-sm font-body text-white/60">{cat.label}</h3>
            <span className={`ml-auto text-xs font-body ${cat.color}`}>{cat.count}</span>
          </div>
          {cat.items.length > 0 ? (
            <div className="divide-y divide-white/5">
              {cat.items.slice(0, 10).map(o => (
                <div key={o.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-sm font-body text-white">{o.order_number || `#${o.id?.slice(0, 8)}`}</p>
                    <p className="text-xs font-body text-white/40">{o.customer_email} · {new Date(o.created_date).toLocaleDateString('sq-AL')}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-body text-white">€{o.total?.toFixed(2)}</span>
                    <p className="text-[10px] font-body text-white/30 uppercase">{o.status} / {o.payment_status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-white/20 text-sm font-body">Nuk ka gabime në këtë kategori ✓</div>
          )}
        </div>
      ))}
    </div>
  );
}
