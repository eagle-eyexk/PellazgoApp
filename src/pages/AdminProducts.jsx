import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Search, Edit, Copy, Archive, Trash2, X, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(getEmptyForm());

  function getEmptyForm() {
    return {
      name_sq: '', name_en: '', slug: '', sku: '', category_id: '', brand: '',
      description_sq: '', description_en: '', price: '', sale_price: '', cost_price: '',
      images: [], stock: 0, low_stock_threshold: 5, status: 'active',
      featured: false, is_new_arrival: false, is_best_seller: false,
      tags: [], specifications_sq: '', specifications_en: '',
    };
  }

  const load = () => {
    setLoading(true);
    Promise.all([
      base44.entities.Product.list('-created_date'),
      base44.entities.Category.list(),
    ]).then(([p, c]) => { setProducts(p); setCategories(c); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(getEmptyForm()); setDialogOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name_sq: p.name_sq || '', name_en: p.name_en || '', slug: p.slug || '', sku: p.sku || '',
      category_id: p.category_id || '', brand: p.brand || '',
      description_sq: p.description_sq || '', description_en: p.description_en || '',
      price: p.price || '', sale_price: p.sale_price || '', cost_price: p.cost_price || '',
      images: p.images || [], stock: p.stock || 0, low_stock_threshold: p.low_stock_threshold || 5,
      status: p.status || 'active', featured: p.featured || false,
      is_new_arrival: p.is_new_arrival || false, is_best_seller: p.is_best_seller || false,
      tags: p.tags || [], specifications_sq: p.specifications_sq || '', specifications_en: p.specifications_en || '',
    });
    setDialogOpen(true);
  };

  const duplicate = async (p) => {
    const { id, created_date, updated_date, created_by_id, ...data } = p;
    data.name_sq = (data.name_sq || '') + ' (Kopje)';
    data.sku = (data.sku || '') + '-COPY';
    await base44.entities.Product.create(data);
    load();
  };

  const archive = async (p) => {
    await base44.entities.Product.update(p.id, { status: 'archived' });
    load();
  };

  const deleteProduct = async (p) => {
    await base44.entities.Product.delete(p.id);
    load();
  };

  const handleSave = async () => {
    setSaving(true);
    const data = {
      ...form,
      price: parseFloat(form.price) || 0,
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      cost_price: form.cost_price ? parseFloat(form.cost_price) : null,
      stock: parseInt(form.stock) || 0,
      low_stock_threshold: parseInt(form.low_stock_threshold) || 5,
      slug: form.slug || form.name_sq.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    if (editing) {
      await base44.entities.Product.update(editing.id, data);
    } else {
      await base44.entities.Product.create(data);
    }
    setDialogOpen(false);
    setSaving(false);
    load();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, images: [...prev.images, file_url] }));
  };

  const filtered = products.filter(p =>
    (p.name_sq || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(search.toLowerCase())
  );

  const inputClass = "w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#8C764E] transition-colors font-body";
