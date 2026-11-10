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
  Upload,
  Image as ImageIcon,
  Star,
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
  const [formImages, setFormImages] = useState<string[]>([]);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsWeeklySpecial, setFormIsWeeklySpecial] = useState(false);
  const [formIsSeasonal, setFormIsSeasonal] = useState(false);
  const [formDailyQuota, setFormDailyQuota] = useState<number>(30);
  const [formBadge, setFormBadge] = useState('');

  // Helper client-side image resizer to keep storage optimized and fast
  const resizeImageFile = (file: File, maxDim = 1200, quality = 0.85): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        const img = new window.Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);

    const newImgs: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const resized = await resizeImageFile(files[i]);
        newImgs.push(resized);
      } catch (err) {
        console.warn('Errore lettura immagine:', err);
      }
    }

    setFormImages(prev => {
      const updated = [...prev, ...newImgs];
      if (updated.length > 0 && !formImageUrl) {
        setFormImageUrl(updated[0]);
      }
      return updated;
    });

    setUploadingImage(false);
    e.target.value = '';
  };

  const handleAddCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setFormImages(prev => [...prev, customUrlInput.trim()]);
    if (!formImageUrl) setFormImageUrl(customUrlInput.trim());
    setCustomUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (formImageUrl === prev[index]) {
        setFormImageUrl(updated[0] || '');
      }
      return updated;
    });
  };

  const handleSetPrimary = (index: number) => {
    setFormImages(prev => {
      const item = prev[index];
      const without = prev.filter((_, i) => i !== index);
      const reordered = [item, ...without];
      setFormImageUrl(item);
      return reordered;
    });
  };

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
    setFormImages(['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80']);
    setCustomUrlInput('');
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
    const initialImgs = product.images && product.images.length > 0
      ? product.images
      : product.imageUrl ? [product.imageUrl] : [];
    setFormImages(initialImgs);
    setFormImageUrl(product.imageUrl || initialImgs[0] || '');
    setCustomUrlInput('');
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
    const mainImg = formImages[0] || formImageUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';
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
      imageUrl: mainImg,
      images: formImages.length > 0 ? formImages : [mainImg],
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

              {/* Caricamento Immagini Multiple */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5A16C]/30">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#57382E] text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#DE7E42]" />
                    <span>Fotografie del Prodotto (una o più immagini)*</span>
                  </label>
                  <span className="text-[11px] font-bold text-[#7E5649]">
                    {formImages.length} {formImages.length === 1 ? 'foto caricata' : 'foto caricate'}
                  </span>
                </div>

                {/* Upload Button & Dropzone */}
                <div className="relative border-2 border-dashed border-[#F5A16C]/40 rounded-2xl p-4 text-center hover:bg-white/80 transition-colors bg-white/50">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFilesUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Seleziona una o più foto dal dispositivo"
                  />
                  <div className="flex flex-col items-center gap-1 text-xs text-[#7E5649]">
                    <div className="w-10 h-10 rounded-full bg-[#FFE29A] text-[#DE7E42] flex items-center justify-center mb-1">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="font-black text-[#57382E]">
                      {uploadingImage ? 'Elaborazione foto in corso...' : 'Trascina o clicca per caricare una o più foto'}
                    </p>
                    <p className="text-[10px] text-[#9E7D73]">
                      Puoi selezionare più file contemporaneamente (JPEG, PNG, WebP) dallo smartphone o PC.
                    </p>
                  </div>
                </div>

                {/* Optional URL addition */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={e => setCustomUrlInput(e.target.value)}
                    placeholder="Oppure incolla URL esterno (es. https://...)"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#F5A16C]/30 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomUrl}
                    className="px-3 py-1.5 rounded-xl bg-[#57382E] hover:bg-[#7E5649] text-white text-xs font-bold"
                  >
                    Aggiungi URL
                  </button>
                </div>

                {/* Image Gallery Thumbnails */}
                {formImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {formImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative group rounded-xl overflow-hidden aspect-square border-2 ${
                          idx === 0 ? 'border-[#DE7E42] shadow-md ring-2 ring-[#DE7E42]/20' : 'border-[#F5A16C]/30 bg-white'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Primary badge */}
                        {idx === 0 ? (
                          <span className="absolute top-1 left-1 px-2 py-0.5 rounded-md bg-[#DE7E42] text-white text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-white" /> Copertina
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(idx)}
                            className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded-md bg-black/70 hover:bg-[#DE7E42] text-white text-[9px] font-bold shadow-sm"
                          >
                            Rendi Principale
                          </button>
                        )}

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 shadow-sm transition-opacity"
                          title="Rimuovi foto"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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

