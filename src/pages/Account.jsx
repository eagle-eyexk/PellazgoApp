import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/i18n.jsx';
import { useAuth } from '@/lib/AuthContext';
import { Package, Heart, User, Settings, ChevronRight, Award, ShoppingBag, LogIn, UserPlus } from 'lucide-react';

export default function Account() {
  const { t, lang } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    Promise.all([
      base44.entities.Order.filter({ customer_email: user?.email }, '-created_date', 10),
      base44.entities.Customer.filter({ email: user?.email }, '-created_date', 1),
    ]).then(([ords, custs]) => {
      setOrders(ords);
      if (custs.length > 0) setCustomer(custs[0]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated, user?.email]);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    returned: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };
  const statusLabels = {
    pending: lang === 'sq' ? 'Në Pritje' : 'Pending',
    paid: lang === 'sq' ? 'Paguar' : 'Paid',
    processing: lang === 'sq' ? 'Në Përpunim' : 'Processing',
    shipped: lang === 'sq' ? 'Dërguar' : 'Shipped',
    delivered: lang === 'sq' ? 'Dorëzuar' : 'Delivered',
    returned: lang === 'sq' ? 'Kthyer' : 'Returned',
    cancelled: lang === 'sq' ? 'Anuluar' : 'Cancelled',
  };

  // Not logged in — show login/register prompt
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-6" style={{ background: '#f7f6f2' }}>
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'hsl(155 48% 12%)' }}>
            <User className="w-7 h-7 text-amber-300" />
          </div>
          <h1 className="font-display text-4xl font-light mb-3" style={{ color: 'hsl(155 48% 12%)' }}>
            {lang === 'sq' ? 'Llogaria Juaj' : 'Your Account'}
          </h1>
          <p className="font-body text-stone-500 text-sm mb-8">
            {lang === 'sq'
              ? 'Hyni ose regjistrohu për të parë porositë, listën e dëshirave dhe profilin tuaj.'
              : 'Sign in or register to view your orders, wishlist and profile.'}
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/login"
              className="btn-gold flex items-center justify-center gap-2 rounded-none">
              <LogIn className="w-4 h-4" />
              {lang === 'sq' ? 'Hyr në Llogari' : 'Sign In'}
            </Link>
            <Link to="/register"
              className="flex items-center justify-center gap-2 border border-stone-300 px-6 py-3 text-xs font-body tracking-widest uppercase hover:bg-stone-100 transition-colors text-stone-600">
              <UserPlus className="w-4 h-4" />
              {lang === 'sq' ? 'Krijo Llogari' : 'Create Account'}
            </Link>
          </div>
          <div className="mt-8 pt-6 border-t border-stone-200">
            <p className="text-xs text-stone-400 font-body">
              {lang === 'sq' ? 'Keni blerë si mysafir? ' : 'Ordered as guest? '}
              <Link to="/track-order" className="text-amber-700 hover:underline">
                {lang === 'sq' ? 'Gjurmoni porosinë tuaj' : 'Track your order'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-20 pg-container">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 bg-stone-200 rounded" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-28 bg-stone-200 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 min-h-screen" style={{ background: '#f7f6f2' }}>
      <div className="pg-container">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-light" style={{ color: 'hsl(155 48% 12%)' }}>
              {t('customer.dashboard')}
            </h1>
            {user?.full_name && (
              <p className="mt-2 font-body text-stone-500 text-sm">
                {lang === 'sq' ? 'Mirë se vini, ' : 'Welcome back, '}{user.full_name}
              </p>
            )}
          </div>
          <button onClick={() => logout()}
            className="text-xs font-body tracking-widest uppercase text-stone-400 hover:text-red-500 transition-colors border border-stone-200 px-3 py-2">
            {lang === 'sq' ? 'Dil' : 'Sign Out'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: ShoppingBag, label: t('customer.orders'), value: orders.length },
            { icon: Package, label: t('customer.total_spent'), value: `€${orders.reduce((s, o) => s + (o.total || 0), 0).toFixed(2)}` },
            { icon: Award, label: t('customer.rewards'), value: customer?.rewards_points || 0 },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-stone-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <item.icon className="w-4 h-4 text-amber-700" />
                <span className="text-[10px] font-body tracking-widest uppercase text-stone-400">{item.label}</span>
              </div>
              <p className="font-display text-3xl font-light" style={{ color: 'hsl(155 48% 12%)' }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {[
            { icon: Package, label: t('customer.orders'), to: '/account/orders' },
            { icon: Heart, label: t('customer.wishlist'), to: '/wishlist' },
            { icon: User, label: t('customer.profile'), to: '/account/profile' },
            { icon: Settings, label: t('customer.settings'), to: '/account/settings' },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="flex items-center justify-between p-5 bg-white border border-stone-200 hover:border-amber-600/30 transition-colors group">
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-amber-700" />
                <span className="text-sm font-body text-stone-700">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div>
          <h2 className="font-display text-2xl font-light mb-5" style={{ color: 'hsl(155 48% 12%)' }}>
            {t('customer.recent_orders')}
          </h2>
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white border border-stone-200">
              <Package className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-400 font-body text-sm">{t('customer.no_orders')}</p>
              <Link to="/shop" className="inline-flex items-center gap-2 mt-4 text-xs font-body tracking-widest uppercase text-amber-700">
                {t('cart.continue_shopping')} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 divide-y divide-stone-100">
              {orders.map(order => (
                <div key={order.id} className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-sm font-body font-medium font-mono text-stone-700">{order.order_number}</p>
                    <p className="text-xs font-body text-stone-400 mt-0.5">
                      {new Date(order.created_date).toLocaleDateString(lang === 'sq' ? 'sq-AL' : 'en-US')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 text-[10px] font-body tracking-widest uppercase rounded-sm ${statusColors[order.status] || 'bg-stone-100'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                    <span className="text-sm font-body font-medium text-stone-700">€{order.total?.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
