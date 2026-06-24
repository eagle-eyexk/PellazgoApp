import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Eye, UserX, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      base44.entities.Customer.list('-created_date'),
      base44.entities.Order.list('-created_date'),
    ]).then(([c, o]) => { setCustomers(c); setOrders(o); })
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const getCustomerOrders = (email) => orders.filter(o => o.customer_email === email);
  const getLifetimeValue = (email) => getCustomerOrders(email).reduce((s, o) => s + (o.total || 0), 0);

  const openCustomer = (c) => {
    setSelected(c);
    setEditForm({
      full_name: c.full_name || '', phone: c.phone || '',
      address: c.address || '', city: c.city || '', country: c.country || 'Albania',
      status: c.status || 'active',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Customer.update(selected.id, editForm);
    setDialogOpen(false); setSaving(false); load();
  };

  const filtered = customers.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (c.full_name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q);
  });

  const inputClass = "w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#8C764E] transition-colors font-body";

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-white">Klientët</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input placeholder="Kërko klientë..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#8C764E] font-body" />
      </div>

      <div className="bg-white/5 border border-white/10 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Emri', 'Email', 'Telefoni', 'Porosi', 'Vlera Totale', 'Statusi', 'Veprimet'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-body tracking-widest uppercase text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-white/5 animate-pulse rounded" /></td></tr>)
              ) : filtered.map(c => {
                const custOrders = getCustomerOrders(c.email);
                const ltv = getLifetimeValue(c.email);
                return (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm font-body text-white">{c.full_name || '—'}</td>
                    <td className="px-4 py-3 text-sm font-body text-white/60">{c.email}</td>
                    <td className="px-4 py-3 text-sm font-body text-white/60">{c.phone || '—'}</td>
                    <td className="px-4 py-3 text-sm font-body text-white/60">{custOrders.length}</td>
                    <td className="px-4 py-3 text-sm font-body text-white font-medium">€{ltv.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-body tracking-widest uppercase px-2 py-1 rounded ${c.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {c.status === 'active' ? 'Aktiv' : 'Çaktivizuar'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openCustomer(c)} className="p-1.5 hover:bg-white/10 rounded transition-colors">
                        <Eye className="w-3.5 h-3.5 text-white/50" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#141414] border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">{selected?.full_name || selected?.email}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-6 mt-4">
              <div className="bg-white/5 rounded p-4 space-y-2 text-sm font-body">
                <p><span className="text-white/40">Email:</span> {selected.email}</p>
                <p><span className="text-white/40">Regjistruar:</span> {new Date(selected.created_date).toLocaleDateString('sq-AL')}</p>
                <p><span className="text-white/40">Porosi:</span> {getCustomerOrders(selected.email).length}</p>
                <p><span className="text-white/40">Vlera Totale:</span> €{getLifetimeValue(selected.email).toFixed(2)}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-body text-white/40 mb-1 block">Emri</label>
                  <input value={editForm.full_name} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-body text-white/40 mb-1 block">Telefoni</label>
                  <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-body text-white/40 mb-1 block">Adresa</label>
                  <input value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-body text-white/40 mb-1 block">Qyteti</label>
                    <input value={editForm.city} onChange={e => setEditForm({ ...editForm, city: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-body text-white/40 mb-1 block">Statusi</label>
                    <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className={inputClass}>
                      <option value="active">Aktiv</option>
                      <option value="disabled">Çaktivizuar</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order history */}
              {getCustomerOrders(selected.email).length > 0 && (
                <div>
                  <h3 className="text-xs font-body text-white/40 uppercase tracking-wider mb-3">Historiku i Porosive</h3>
                  <div className="space-y-2">
                    {getCustomerOrders(selected.email).slice(0, 5).map(o => (
                      <div key={o.id} className="flex items-center justify-between bg-white/5 rounded p-3 text-sm font-body">
                        <div>
                          <p className="text-white">{o.order_number}</p>
                          <p className="text-xs text-white/40">{new Date(o.created_date).toLocaleDateString('sq-AL')}</p>
                        </div>
                        <span className="text-white">€{o.total?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button onClick={() => setDialogOpen(false)} className="px-4 py-2.5 text-xs font-body text-white/50 hover:text-white">Mbyll</button>
                <button onClick={handleSave} disabled={saving} className="bg-[#8C764E] text-white px-6 py-2.5 rounded text-xs font-body tracking-widest uppercase hover:bg-[#a68b5b] disabled:opacity-40">
                  {saving ? 'Duke ruajtur...' : 'Ruaj'}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
