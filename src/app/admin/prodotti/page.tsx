'use client';

import React, { useEffect, useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { DataService } from '@/lib/store';
import { Allergen, Product, ProductCategory } from '@/lib/types';
import { ALLERGENS_LIST, CATEGORIES } from '@/lib/initialData';

export default function AdminProdottiPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');

  // Modal State for Create / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('panetteria');
  const [formSubCategory, setFormSubCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIngredients, setFormIngredients] = useState('');
  const [formAllergens, setFormAllergens] = useState<Allergen[]>(['glutine']);
  const [formPrice, setFormPrice] = useState<number>(3.50);
  const [formUnit, setFormUnit] = useState('Al pezzo');
  const [formWeight, setFormWeight] = useState('500g');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsWeeklySpecial, setFormIsWeeklySpecial] = useState(false);
  const [formIsSeasonal, setFormIsSeasonal] = useState(false);
  const [formDailyQuota, setFormDailyQuota] = useState<number>(30);
  const [formBadge, setFormBadge] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    const data = await DataService.getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSlug('');
    setFormCategory('panetteria');
    setFormSubCategory('');
    setFormDescription('');
    setFormIngredients('Farina di grano tipo 1, acqua, lievito madre naturale, sale.');
    setFormAllergens(['glutine']);
    setFormPrice(3.50);
    setFormUnit('Al pezzo');
    setFormWeight('500g');
    setFormImageUrl('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80');
    setFormIsAvailable(true);
    setFormIsFeatured(false);
    setFormIsWeeklySpecial(false);
    setFormIsSeasonal(false);
    setFormDailyQuota(30);
    setFormBadge('');
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSlug(product.slug);
    setFormCategory(product.category);
    setFormSubCategory(product.subCategory || '');
    setFormDescription(product.description);
    setFormIngredients(product.ingredients);
    setFormAllergens(product.allergens);
    setFormPrice(product.price);
    setFormUnit(product.unit);
    setFormWeight(product.weight || '');
    setFormImageUrl(product.imageUrl);
    setFormIsAvailable(product.isAvailable);
    setFormIsFeatured(Boolean(product.isFeatured));
    setFormIsWeeklySpecial(Boolean(product.isWeeklySpecial));
    setFormIsSeasonal(Boolean(product.isSeasonal));
    setFormDailyQuota(product.dailyQuota || 30);
    setFormBadge(product.badge || '');
    setModalOpen(true);
  };

  const handleToggleAvailability = async (productId: string) => {
    await DataService.toggleProductAvailability(productId);
    await loadProducts();
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Sei sicuro di voler eliminare questo prodotto dal catalogo?')) {
      await DataService.deleteProduct(productId);
      await loadProducts();
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const productData: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      slug,
      name: formName,
      category: formCategory,
      subCategory: formSubCategory || undefined,
      description: formDescription,
      ingredients: formIngredients,
      allergens: formAllergens,
      price: Number(formPrice),
      unit: formUnit,
      weight: formWeight || undefined,
      imageUrl: formImageUrl,
      isAvailable: formIsAvailable,
      isFeatured: formIsFeatured,
      isWeeklySpecial: formIsWeeklySpecial,
      isSeasonal: formIsSeasonal,
      dailyQuota: Number(formDailyQuota),
      badge: formBadge || undefined,
      variants: editingProduct?.variants,
    };

    await DataService.saveProduct(productData);
    setModalOpen(false);
    await loadProducts();
  };

  const toggleAllergen = (key: Allergen) => {
    setFormAllergens(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const filteredProducts = products.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#DE7E42]">
            Catalogo Laboratorio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#57382E]">
            Gestione Prodotti & Prezzi
          </h1>
          <p className="text-xs text-[#7E5649]">
            Aggiungi nuove creazioni, modifica i prezzi e attiva/disattiva la disponibilità con un solo click.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-2xl bg-[#F5A16C] hover:bg-[#DE7E42] text-white font-black text-xs flex items-center gap-2 shadow-md transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>AGGIUNGI PRODOTTO</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#F5A16C]/25 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#9E7D73]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cerca prodotto per nome..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === 'all'
                ? 'bg-[#57382E] text-white'
                : 'bg-[#FFF8EF] text-[#7E5649] hover:bg-white border border-[#F5A16C]/25'
            }`}
          >
            Tutti ({products.length})
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                categoryFilter === c.id
                  ? 'bg-[#57382E] text-white'
                  : 'bg-[#FFF8EF] text-[#7E5649] hover:bg-white border border-[#F5A16C]/25'
              }`}
            >
              {c.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className={`bg-white rounded-3xl p-4 border-2 transition-all flex gap-3.5 ${
              product.isAvailable
                ? 'border-[#F5A16C]/25 shadow-xs hover:shadow-md'
                : 'border-gray-200 opacity-60 bg-gray-50'
            }`}
          >
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-[#FFE29A]/30 border border-[#F5A16C]/20">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isFeatured && (
                <span className="absolute top-1 left-1 p-0.5 rounded-md bg-[#FFE29A] text-[9px] font-black text-[#57382E]">
                  ★
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-[#DE7E42]">
                  {product.category}
                </span>
                <span className="text-sm font-black text-[#57382E]">
                  €{product.price.toFixed(2)}
                </span>
              </div>

              <h4 className="text-xs font-black text-[#57382E] truncate">
                {product.name}
              </h4>
              <p className="text-[11px] text-[#7E5649] line-clamp-1">
                {product.description}
              </p>

              {/* Controls */}
              <div className="pt-2 flex items-center justify-between">
                {/* 1-Click Availability Toggle */}
                <button
                  onClick={() => handleToggleAvailability(product.id)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1.5 ${
                    product.isAvailable
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-700'
                  }`}
                  title="Cambia disponibilità con 1 click"
                >
                  <span className={`w-2 h-2 rounded-full ${product.isAvailable ? 'bg-emerald-600' : 'bg-red-600'}`} />
                  <span>{product.isAvailable ? 'Disponibile' : 'Esaurito'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(product)}
                    className="p-1.5 rounded-lg text-[#57382E] hover:bg-[#FFF8EF] border border-[#F5A16C]/25"
                    title="Modifica"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 border border-red-200"
                    title="Elimina"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal for Create / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center animate-fadeIn">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <form
            onSubmit={handleSaveProduct}
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border-2 border-[#F5A16C]/30 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F5A16C]/20">
              <h3 className="text-lg font-black text-[#57382E]">
                {editingProduct ? 'Modifica Prodotto' : 'Aggiungi Nuovo Prodotto al Forno'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#57382E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#57382E] block mb-1">Nome del Prodotto*</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="Es. Maritozzo con Panna Montata"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#57382E] block mb-1">Categoria*</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 font-bold"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#57382E] block mb-1">Prezzo (€)*</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={formPrice}
                    onChange={e => setFormPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 font-black text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#57382E] block mb-1">Unità di Vendita</label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={e => setFormUnit(e.target.value)}
                    placeholder="Al pezzo, Pagnotta 800g..."
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#57382E] block mb-1">Quota Giornaliera Max</label>
                  <input
                    type="number"
                    value={formDailyQuota}
                    onChange={e => setFormDailyQuota(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#57382E] block mb-1">Descrizione Appetitosa*</label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Descrivi la friabilità, i profumi e la ricetta..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
                />
              </div>

              <div>
                <label className="font-bold text-[#57382E] block mb-1">Ingredienti Artigianali*</label>
                <input
                  type="text"
                  required
                  value={formIngredients}
                  onChange={e => setFormIngredients(e.target.value)}
                  placeholder="Farina di grano tipo 1, lievito madre, acqua..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
                />
              </div>

              {/* Allergen Checkboxes */}
              <div>
                <label className="font-bold text-[#57382E] block mb-1.5">
                  Allergeni Presenti (Reg. UE 1169/2011):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALLERGENS_LIST.map(a => {
                    const isChecked = formAllergens.includes(a.key);
                    return (
                      <button
                        key={a.key}
                        type="button"
                        onClick={() => toggleAllergen(a.key)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                          isChecked
                            ? 'bg-[#F28BA6] text-white border-[#F28BA6]'
                            : 'bg-[#FFF8EF] text-[#7E5649] border-[#F5A16C]/30'
                        }`}
                      >
                        {a.icon} {a.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#57382E] block mb-1">URL Fotografia Prodotto*</label>
                <input
                  type="url"
                  required
                  value={formImageUrl}
                  onChange={e => setFormImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-mono"
                />
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-[#F5A16C]/20 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-[#FFF8EF] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsAvailable}
                    onChange={e => setFormIsAvailable(e.target.checked)}
                    className="rounded text-[#DE7E42]"
                  />
                  <span className="font-bold text-[11px]">Disponibile</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-[#FFF8EF] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={e => setFormIsFeatured(e.target.checked)}
                    className="rounded text-[#DE7E42]"
                  />
                  <span className="font-bold text-[11px]">In Evidenza (Home)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-[#FFF8EF] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsWeeklySpecial}
                    onChange={e => setFormIsWeeklySpecial(e.target.checked)}
                    className="rounded text-[#DE7E42]"
                  />
                  <span className="font-bold text-[11px]">Bontà Settimana</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-[#FFF8EF] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsSeasonal}
                    onChange={e => setFormIsSeasonal(e.target.checked)}
                    className="rounded text-[#DE7E42]"
                  />
                  <span className="font-bold text-[11px]">Stagionale</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F5A16C]/20 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-bold text-[#57382E]"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#F5A16C] hover:bg-[#DE7E42] text-white text-xs font-black shadow-md"
              >
                Salva Prodotto
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

