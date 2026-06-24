import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name_sq: '', name_en: '', slug: '', description_sq: '', description_en: '', parent_id: '', sort_order: 0, is_active: true });

  const load = () => {
    setLoading(true);
    base44.entities.Category.list('sort_order').then(setCategories).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm({ name_sq: '', name_en: '', slug: '', description_sq: '', description_en: '', parent_id: '', sort_order: 0, is_active: true }); setDialogOpen(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ name_sq: c.name_sq || '', name_en: c.name_en || '', slug: c.slug || '', description_sq: c.description_sq || '', description_en: c.description_en || '', parent_id: c.parent_id || '', sort_order: c.sort_order || 0, is_active: c.is_active !== false });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, sort_order: parseInt(form.sort_order) || 0, slug: form.slug || form.name_sq.toLowerCase().replace(/[^a-z0-9]+/g, '-'), parent_id: form.parent_id || null };
    if (editing) await base44.entities.Category.update(editing.id, data);
    else await base44.entities.Category.create(data);
    setDialogOpen(false); setSaving(false); load();
  };

  const deleteCategory = async (c) => { await base44.entities.Category.delete(c.id); load(); };

  const getParentName = (id) => categories.find(c => c.id === id)?.name_sq || '—';
  const inputClass = "w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#8C764E] transition-colors font-body";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-white">Kategoritë</h1>
        <button onClick={openNew} className="bg-[#8C764E] text-white px-4 py-2.5 rounded text-xs font-body tracking-widest uppercase hover:bg-[#a68b5b] flex items-center gap-2">
          <Plus className="w-3.5 h-3.5" /> Shto Kategori
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/10">
            {['Emri', 'Slug', 'Prindi', 'Renditja', 'Statusi', 'Veprimet'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-[10px] font-body tracking-widest uppercase text-white/40">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-white/5">
            {loading ? [...Array(3)].map((_, i) => <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-4 bg-white/5 animate-pulse rounded" /></td></tr>) :
            categories.map(c => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-body text-white">{c.name_sq}</p>
                  {c.name_en && <p className="text-xs font-body text-white/40">{c.name_en}</p>}
                </td>
                <td className="px-4 py-3 text-sm font-body text-white/50">{c.slug || '—'}</td>
                <td className="px-4 py-3 text-sm font-body text-white/50">{c.parent_id ? getParentName(c.parent_id) : '—'}</td>
                <td className="px-4 py-3 text-sm font-body text-white/50">{c.sort_order}</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-body px-2 py-1 rounded ${c.is_active !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{c.is_active !== false ? 'Aktiv' : 'Joaktiv'}</span></td>
                <td className="px-4 py-3 flex gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-white/10 rounded"><Edit className="w-3.5 h-3.5 text-white/50" /></button>
                  <button onClick={() => deleteCategory(c)} className="p-1.5 hover:bg-red-500/20 rounded"><Trash2 className="w-3.5 h-3.5 text-red-400/50" /></button>
                </td>
              </tr>
            ))}
            {!loading && categories.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-white/30 text-sm font-body">Nuk ka kategori</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#141414] border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle className="font-heading text-xl">{editing ? 'Ndrysho Kategorinë' : 'Kategori e Re'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-body text-white/40 mb-1 block">Emri (SQ)</label><input value={form.name_sq} onChange={e => setForm({ ...form, name_sq: e.target.value })} className={inputClass} /></div>
              <div><label className="text-xs font-body text-white/40 mb-1 block">Name (EN)</label><input value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} className={inputClass} /></div>
            </div>
            <div><label className="text-xs font-body text-white/40 mb-1 block">Slug</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="do-krijohet-automatikisht" className={inputClass} /></div>
            <div><label className="text-xs font-body text-white/40 mb-1 block">Kategoria Prind</label>
              <select value={form.parent_id} onChange={e => setForm({ ...form, parent_id: e.target.value })} className={inputClass}>
                <option value="">— Asnjë (Kryesore) —</option>
                {categories.filter(c => c.id !== editing?.id).map(c => <option key={c.id} value={c.id}>{c.name_sq}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-body text-white/40 mb-1 block">Renditja</label><input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} className={inputClass} /></div>
              <div className="flex items-end"><label className="flex items-center gap-2 text-sm font-body cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="accent-[#8C764E]" /> Aktiv</label></div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button onClick={() => setDialogOpen(false)} className="px-4 py-2.5 text-xs font-body text-white/50 hover:text-white">Anulo</button>
              <button onClick={handleSave} disabled={saving || !form.name_sq} className="bg-[#8C764E] text-white px-6 py-2.5 rounded text-xs font-body tracking-widest uppercase hover:bg-[#a68b5b] disabled:opacity-40">{saving ? 'Duke ruajtur...' : 'Ruaj'}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
