import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function AdminAnalytics() {
  const [orders, setOrders] = useState([]);
  const [traffic, setTraffic] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('weekly');

  useEffect(() => {
    Promise.all([
      base44.entities.Order.list('-created_date', 100),
      base44.entities.TrafficAnalytics.list('-created_date', 200),
      base44.entities.Customer.list('-created_date', 100),
    ]).then(([o, t, c]) => { setOrders(o); setTraffic(t); setCustomers(c); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const conversionRate = traffic.length ? ((traffic.filter(t => t.converted).length / traffic.length) * 100) : 0;

  // Revenue by source
  const revenueBySource = {};
  orders.forEach(o => {
    const src = o.traffic_source || 'direct';
    revenueBySource[src] = (revenueBySource[src] || 0) + (o.total || 0);
  });
  const sourceData = Object.entries(revenueBySource).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));

  // Traffic sources
  const sourceCounts = {};
  traffic.forEach(t => { sourceCounts[t.source] = (sourceCounts[t.source] || 0) + 1; });
  const trafficPie = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

  // Conversion by source
  const convBySource = {};
  traffic.forEach(t => {
    if (!convBySource[t.source]) convBySource[t.source] = { total: 0, converted: 0 };
    convBySource[t.source].total++;
    if (t.converted) convBySource[t.source].converted++;
  });
  const convData = Object.entries(convBySource).map(([name, d]) => ({
    name, rate: d.total > 0 ? Math.round((d.converted / d.total) * 100) : 0,
  }));

  // Daily orders (last 14 days)
  const dailyOrders = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(); date.setDate(date.getDate() - (13 - i));
    const dayOrds = orders.filter(o => new Date(o.created_date).toDateString() === date.toDateString());
    return { name: `${date.getDate()}/${date.getMonth() + 1}`, orders: dayOrds.length, revenue: dayOrds.reduce((s, o) => s + (o.total || 0), 0) };
  });

  const colors = ['#8C764E', '#5B8C5A', '#4E7A8C', '#8C4E5B', '#7A5B8C', '#8C7A4E', '#4E8C7A'];

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-48 bg-white/5 animate-pulse rounded" />)}</div>;

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl text-white">Analitika</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Të Ardhura Totale', value: `€${totalRevenue.toFixed(2)}` },
          { label: 'Mesatarja e Porosisë', value: `€${avgOrderValue.toFixed(2)}` },
          { label: 'Konvertimet', value: `${conversionRate.toFixed(1)}%` },
          { label: 'Klientë të Rinj', value: customers.length },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded p-5">
            <span className="text-xs font-body text-white/40 uppercase tracking-wider">{s.label}</span>
            <p className="font-heading text-2xl text-white mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Orders over time */}
      <div className="bg-white/5 border border-white/10 rounded p-5">
        <h3 className="text-sm font-body text-white/60 mb-4">Porositë & Të Ardhurat (14 ditët e fundit)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={dailyOrders}>
            <XAxis dataKey="name" stroke="#ffffff20" tick={{ fill: '#ffffff40', fontSize: 10 }} />
            <YAxis stroke="#ffffff20" tick={{ fill: '#ffffff40', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #ffffff15', borderRadius: 4, color: '#fff', fontSize: 12 }} />
            <Bar dataKey="revenue" fill="#8C764E" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic pie */}
        <div className="bg-white/5 border border-white/10 rounded p-5">
          <h3 className="text-sm font-body text-white/60 mb-4">Burimet e Vizitorëve</h3>
          {trafficPie.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={trafficPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={2}>
                    {trafficPie.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #ffffff15', borderRadius: 4, color: '#fff', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {trafficPie.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs font-body">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length] }} />
                    <span className="text-white/50 capitalize">{d.name}</span>
                    <span className="text-white/80 ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-center text-white/30 text-sm py-12">Nuk ka të dhëna</p>}
        </div>

        {/* Conversion by source */}
        <div className="bg-white/5 border border-white/10 rounded p-5">
          <h3 className="text-sm font-body text-white/60 mb-4">Konvertimet sipas Burimit</h3>
          {convData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={convData} layout="vertical">
                <XAxis type="number" stroke="#ffffff20" tick={{ fill: '#ffffff40', fontSize: 10 }} unit="%" />
                <YAxis type="category" dataKey="name" stroke="#ffffff20" tick={{ fill: '#ffffff60', fontSize: 11 }} width={80} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #ffffff15', borderRadius: 4, color: '#fff', fontSize: 12 }} formatter={v => `${v}%`} />
                <Bar dataKey="rate" fill="#5B8C5A" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-white/30 text-sm py-12">Nuk ka të dhëna</p>}
        </div>
      </div>

      {/* Revenue by source */}
      <div className="bg-white/5 border border-white/10 rounded p-5">
        <h3 className="text-sm font-body text-white/60 mb-4">Të Ardhurat sipas Burimit</h3>
        {sourceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sourceData}>
              <XAxis dataKey="name" stroke="#ffffff20" tick={{ fill: '#ffffff40', fontSize: 11 }} />
              <YAxis stroke="#ffffff20" tick={{ fill: '#ffffff40', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #ffffff15', borderRadius: 4, color: '#fff', fontSize: 12 }} formatter={v => `€${v}`} />
              <Bar dataKey="value" fill="#8C764E" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-white/30 text-sm py-12">Nuk ka të dhëna</p>}
      </div>
    </div>
  );
}
