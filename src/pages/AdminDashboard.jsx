import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [traffic, setTraffic] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Order.list('-created_date', 50),
      base44.entities.Product.list('-created_date', 50),
      base44.entities.Customer.list('-created_date', 50),
      base44.entities.TrafficAnalytics.list('-created_date', 100),
    ]).then(([o, p, c, t]) => {
      setOrders(o); setProducts(p); setCustomers(c); setTraffic(t);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'paid').length;
  const failedOrders = orders.filter(o => o.status === 'cancelled').length;

  // Revenue chart data (last 7 days simulated from orders)
  const revenueData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayOrders = orders.filter(o => {
      const od = new Date(o.created_date);
      return od.toDateString() === date.toDateString();
    });
    return {
      name: date.toLocaleDateString('sq-AL', { weekday: 'short' }),
      revenue: dayOrders.reduce((s, o) => s + (o.total || 0), 0),
    };
  });

  // Traffic source pie
  const sourceCounts = {};
  traffic.forEach(t => { sourceCounts[t.source] = (sourceCounts[t.source] || 0) + 1; });
  const pieData = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));
  const pieColors = ['#8C764E', '#5B8C5A', '#4E7A8C', '#8C4E5B', '#7A5B8C', '#8C7A4E', '#4E8C7A'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/10 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-white/5 animate-pulse rounded" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-white">Dashboard</h1>
        <span className="text-xs font-body text-white/40">
          {new Date().toLocaleDateString('sq-AL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Të Ardhura Totale', value: `€${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: 'text-green-400', change: '+12%' },
          { label: 'Porosi Totale', value: orders.length, icon: ShoppingCart, color: 'text-blue-400', change: `${pendingOrders} në pritje` },
          { label: 'Klientë', value: customers.length, icon: Users, color: 'text-purple-400', change: '+5%' },
          { label: 'Produkte', value: products.length, icon: Package, color: 'text-amber-400', change: `${products.filter(p => p.stock <= (p.low_stock_threshold || 5)).length} stok i ulët` },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-body text-white/40 uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="font-heading text-2xl text-white">{stat.value}</p>
            <p className="text-xs font-body text-white/30 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded p-5">
          <h3 className="text-sm font-body text-white/60 mb-4">Të Ardhurat (7 ditët e fundit)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8C764E" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8C764E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#ffffff20" tick={{ fill: '#ffffff40', fontSize: 11 }} />
              <YAxis stroke="#ffffff20" tick={{ fill: '#ffffff40', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #ffffff15', borderRadius: 4, color: '#fff', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#8C764E" fill="url(#goldGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic sources */}
        <div className="bg-white/5 border border-white/10 rounded p-5">
          <h3 className="text-sm font-body text-white/60 mb-4">Burimet e Trafikut</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={2}>
                    {pieData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #ffffff15', borderRadius: 4, color: '#fff', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs font-body">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                      <span className="text-white/60 capitalize">{d.name}</span>
                    </div>
                    <span className="text-white/80">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-white/30 font-body text-center py-12">Nuk ka të dhëna trafiku</p>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white/5 border border-white/10 rounded">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="text-sm font-body text-white/60">Porositë e Fundit</h3>
          <Link to="/admin/orders" className="text-xs font-body text-[#8C764E] hover:text-[#a68b5b] transition-colors">Shiko të Gjitha →</Link>
        </div>
        <div className="divide-y divide-white/5">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div>
                <p className="text-sm font-body text-white">{order.order_number || `#${order.id?.slice(0, 8)}`}</p>
                <p className="text-xs font-body text-white/40">{order.customer_name || order.customer_email}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-body tracking-widest uppercase px-2 py-1 rounded ${
                  order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                  order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {order.status}
                </span>
                <span className="text-sm font-body text-white">€{order.total?.toFixed(2)}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="p-8 text-center text-white/30 text-sm font-body">Nuk ka porosi ende</div>
          )}
        </div>
      </div>

      {/* Low stock alert */}
      {products.filter(p => p.stock <= (p.low_stock_threshold || 5)).length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-body text-red-400">Alarme Stoku i Ulët</h3>
          </div>
          <div className="space-y-2">
            {products.filter(p => p.stock <= (p.low_stock_threshold || 5)).map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm font-body">
                <span className="text-white/70">{p.name_sq}</span>
                <span className="text-red-400">{p.stock} në stok</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
