import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(getEmpty());

  function getEmpty() {
    return { title_sq: '', title_en: '', slug: '', content_sq: '', content_en: '', excerpt_sq: '', excerpt_en: '', category: '', status: 'draft', author: '', meta_title_sq: '', meta_description_sq: '' };
  }

  const load = () => { setLoading(true); base44.entities.BlogPost.list('-created_date').then(setPosts).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(getEmpty()); setDialogOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title_sq: p.title_sq || '', title_en: p.title_en || '', slug: p.slug || '',
      content_sq: p.content_sq || '', content_en: p.content_en || '',
      category: p.category || '', status: p.status || 'draft', author: p.author || '',
      meta_title_sq: p.meta_title_sq || '', meta_description_sq: p.meta_description_sq || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, slug: form.slug || form.title_sq.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
    if (editing) await base44.entities.BlogPost.update(editing.id, data);
    else await base44.entities.BlogPost.create(data);
    setDialogOpen(false); setSaving(false); load();
  };

  const deletePost = async (p) => { await base44.entities.BlogPost.delete(p.id); load(); };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#8C764E] transition-colors font-body";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-white">Blog</h1>
        <button onClick={openNew} className="bg-[#8C764E] text-white px-4 py-2.5 rounded text-xs font-body tracking-widest uppercase hover:bg-[#a68b5b] flex items-center gap-2"><Plus className="w-3.5 h-3.5" /> Artikull i Ri</button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/10">
            {['Titulli', 'Kategoria', 'Statusi', 'Data', 'Veprimet'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-[10px] font-body tracking-widest uppercase text-white/40">{h}</th>

