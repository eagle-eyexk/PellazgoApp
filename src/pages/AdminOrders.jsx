import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Edit, Eye, X, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const statuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'returned', 'cancelled'];
const paymentStatuses = ['unpaid', 'paid', 'refunded', 'partial_refund'];
const statusLabels = {
  pending: 'Në Pritje', paid: 'Paguar', processing: 'Në Përpunim',
  shipped: 'Dërguar', delivered: 'Dorëzuar', returned: 'Kthyer', cancelled: 'Anuluar',
};
const paymentLabels = {
  unpaid: 'Pa Paguar', paid: 'Paguar', refunded: 'Rimbursuar', partial_refund: 'Rimbursim Parcial',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({});

  const load = () => {
    setLoading(true);
    base44.entities.Order.list('-created_date').then(setOrders).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openOrder = (o) => {
    setSelected(o);
    setEditForm({
      status: o.status || 'pending',
      payment_status: o.payment_status || 'unpaid',
      tracking_number: o.tracking_number || '',
      admin_notes: o.admin_notes || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Order.update(selected.id, editForm);
    setDialogOpen(false);
    setSaving(false);
    load();
  };

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (o.order_number || '').toLowerCase().includes(q) ||
        (o.customer_email || '').toLowerCase().includes(q) ||
        (o.customer_name || '').toLowerCase().includes(q);
    }
    return true;
  });

  const inputClass = "w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#8C764E] transition-colors font-body";

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-white">Porositë</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input placeholder="Kërko porosi..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#8C764E] font-body" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={inputClass + " md:w-48"}>
          <option value="all">Të Gjitha</option>
          {statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
      </div>

      <div className="bg-white/5 border border-white/10 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Porosia', 'Klienti', 'Data', 'Statusi', 'Pagesa', 'Totali', 'Veprimet'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-body tracking-widest uppercase text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-white/5 animate-pulse rounded" /></td></tr>)
              ) : filtered.map(o => (
                <tr key={o.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm font-body text-white">{o.order_number || `#${o.id?.slice(0, 8)}`}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-body text-white">{o.customer_name || '—'}</p>
                    <p className="text-xs font-body text-white/40">{o.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-body text-white/60">
                    {new Date(o.created_date).toLocaleDateString('sq-AL')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-body tracking-widest uppercase px-2 py-1 rounded ${
                      o.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                      o.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                      o.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      o.status === 'processing' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>{statusLabels[o.status] || o.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-body tracking-widest uppercase px-2 py-1 rounded ${
                      o.payment_status === 'paid' ? 'bg-green-500/20 text-green-400' :
                      o.payment_status === 'refunded' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>{paymentLabels[o.payment_status] || o.payment_status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-body text-white font-medium">€{o.total?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openOrder(o)} className="p-1.5 hover:bg-white/10 rounded transition-colors">
                      <Eye className="w-3.5 h-3.5 text-white/50" />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-white/30 text-sm font-body">Nuk ka porosi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#141414] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Porosia {selected?.order_number}</DialogTitle>
          </DialogHeader>
          {selected && (
