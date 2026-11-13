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
  RefreshCw,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { DataService } from '@/lib/store';
import { Allergen, Product, ProductCategory, ProductAddon } from '@/lib/types';
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
  const [formAddons, setFormAddons] = useState<ProductAddon[]>([]);

  // Helper client-side image resizer to keep storage light and snappy on mobile networks
  const resizeImageFile = (file: File, maxDim = 800, quality = 0.75): Promise<string> => {
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

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [hasPendingLocal, setHasPendingLocal] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    // Check if client localStorage has products
    if (typeof window !== 'undefined') {
      try {
        const localRaw = window.localStorage.getItem('sfornami_products_v1');
        if (localRaw) {
          const localParsed = JSON.parse(localRaw);
          if (Array.isArray(localParsed) && localParsed.length > 0) {
            setHasPendingLocal(true);
          }
        }
      } catch (err) {
        console.warn('Error reading local catalog:', err);
      }
    }
    const data = await DataService.getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleSyncToServer = async () => {
    setSyncing(true);
    try {
      await DataService.saveAllProducts(products);
      setSyncMessage('✅ Catalogo sincronizzato con successo con il server! Ora è visibile su smartphone, tablet e a tutti i clienti.');
      setHasPendingLocal(false);
      setTimeout(() => setSyncMessage(null), 8000);
    } catch (e) {
      setSyncMessage('❌ Errore durante la sincronizzazione con il server.');
      setTimeout(() => setSyncMessage(null), 5000);
    } finally {
      setSyncing(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sfornami-catalogo-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (confirm(`Vuoi importare ${parsed.length} prodotti e sincronizzarli immediatamente sul server per renderli visibili a tutti?`)) {
            setLoading(true);
            await DataService.saveAllProducts(parsed);
            setProducts(parsed);
            setSyncMessage(`✅ Importati con successo ${parsed.length} prodotti e salvati sul server!`);
            setTimeout(() => setSyncMessage(null), 8000);
            setLoading(false);
          }
        } else {
          alert('Il file non contiene un catalogo prodotti valido.');
        }
      } catch (err) {
        alert('Errore nella lettura del file JSON selezionato.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
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
    setFormAddons([]);
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
    setFormAddons(product.addons ? JSON.parse(JSON.stringify(product.addons)) : []);
    setModalOpen(true);
  };

  const handleAddAddon = (name = '', price = 2.50, allowsCustomText = false) => {
    setFormAddons(prev => [
      ...prev,
      {
        id: `addon-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name,
        price,
        allowsCustomText,
      },
    ]);
  };

  const handleUpdateAddon = (idx: number, field: keyof ProductAddon, value: any) => {
    setFormAddons(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleRemoveAddon = (idx: number) => {
    setFormAddons(prev => prev.filter((_, i) => i !== idx));
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
      addons: formAddons.length > 0 ? formAddons : undefined,
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

      {/* Server Synchronization & Multi-Device Bar */}
      <div className="bg-[#FFE29A]/30 border-2 border-[#FFE29A] rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFE29A] text-[#DE7E42] flex items-center justify-center shrink-0">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#57382E] uppercase tracking-wider">
                Database PostgreSQL & Multi-Dispositivo
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Postgres Active
              </span>
            </div>
            <p className="text-[11px] text-[#7E5649] mt-0.5">
              I prodotti modificati vengono salvati direttamente nel database PostgreSQL e sincronizzati in tempo reale su smartphone, tablet e a tutti i clienti.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handleSyncToServer}
            disabled={syncing}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#57382E] hover:bg-[#7E5649] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            title="Invia tutti i prodotti attuali al database PostgreSQL per renderli subito visibili su mobile"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Salvataggio in Postgres...' : 'Salva in PostgreSQL (Mobile)'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="px-3 py-2 rounded-xl bg-white hover:bg-[#FFF8EF] border border-[#F5A16C]/40 text-[#57382E] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            title="Scarica un file di backup JSON del catalogo attuale"
          >
            <Download className="w-3.5 h-3.5 text-[#DE7E42]" />
            <span>Esporta Backup</span>
          </button>

          <label
            className="px-3 py-2 rounded-xl bg-white hover:bg-[#FFF8EF] border border-[#F5A16C]/40 text-[#57382E] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Importa un file di catalogo JSON salvato in precedenza"
          >
            <Upload className="w-3.5 h-3.5 text-[#DE7E42]" />
            <span>Importa</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
        </div>
      </div>

      {syncMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

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

              {/* Personalizzazioni & Aggiunte a Pagamento (Confezione regalo, scritte, etc.) */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FFE29A]/20 border border-[#F5A16C]/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="font-black text-[#57382E] text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#DE7E42]" />
                      <span>Aggiunte & Personalizzazioni a Pagamento</span>
                    </label>
                    <p className="text-[11px] text-[#7E5649]">
                      Permetti al cliente di aggiungere confezioni regalo, scritte personalizzate o dediche con sovrapprezzo.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddAddon('', 2.50, false)}
                    className="px-3 py-1.5 rounded-xl bg-[#57382E] hover:bg-[#7E5649] text-white text-xs font-bold flex items-center gap-1 shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Aggiungi Voce</span>
                  </button>
                </div>

                {/* Quick Presets Buttons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-[#7E5649] self-center mr-1">Preset rapidi:</span>
                  <button
                    type="button"
                    onClick={() => handleAddAddon('Confezione regalo con fiocco artigianale', 2.50, false)}
                    className="px-2 py-1 rounded-lg bg-white border border-[#F5A16C]/40 text-[#57382E] text-[10px] font-bold hover:bg-[#FFE29A]/40"
                  >
                    + Confezione Regalo (€2.50)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddAddon('Scritta personalizzata su cialda/targhetta', 3.00, true)}
                    className="px-2 py-1 rounded-lg bg-white border border-[#F5A16C]/40 text-[#57382E] text-[10px] font-bold hover:bg-[#FFE29A]/40"
                  >
                    + Scritta su Cialda (€3.00 con testo)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddAddon('Biglietto di auguri con dedica a mano', 1.50, true)}
                    className="px-2 py-1 rounded-lg bg-white border border-[#F5A16C]/40 text-[#57382E] text-[10px] font-bold hover:bg-[#FFE29A]/40"
                  >
                    + Biglietto Auguri (€1.50 con dedica)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddAddon('Candeline compleanno scintillanti', 1.50, false)}
                    className="px-2 py-1 rounded-lg bg-white border border-[#F5A16C]/40 text-[#57382E] text-[10px] font-bold hover:bg-[#FFE29A]/40"
                  >
                    + Candeline (€1.50)
                  </button>
                </div>

                {/* Addons List */}
                {formAddons.length === 0 ? (
                  <p className="text-[11px] text-[#9E7D73] italic bg-white/60 p-2.5 rounded-xl border border-dashed border-[#F5A16C]/30 text-center">
                    Nessuna aggiunta specifica configurata per questo prodotto. (Verranno mostrate le aggiunte predefinite del negozio, se attive nelle Impostazioni).
                  </p>
                ) : (
                  <div className="space-y-2">
                    {formAddons.map((addon, aIdx) => (
                      <div
                        key={addon.id}
                        className="bg-white p-2.5 rounded-xl border border-[#F5A16C]/30 flex flex-col sm:flex-row items-start sm:items-center gap-2 shadow-xs"
                      >
                        <div className="flex-1 min-w-0 w-full sm:w-auto">
                          <input
                            type="text"
                            required
                            value={addon.name}
                            onChange={e => handleUpdateAddon(aIdx, 'name', e.target.value)}
                            placeholder="Nome aggiunta (es. Confezione regalo)"
                            className="w-full px-2.5 py-1 text-xs rounded-lg bg-[#FFF8EF] border border-[#F5A16C]/30 font-bold text-[#57382E]"
                          />
                        </div>
                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-[#57382E]">€</span>
                            <input
                              type="number"
                              step="0.50"
                              min="0"
                              required
                              value={addon.price}
                              onChange={e => handleUpdateAddon(aIdx, 'price', parseFloat(e.target.value) || 0)}
                              className="w-16 px-2 py-1 text-xs rounded-lg bg-[#FFF8EF] border border-[#F5A16C]/30 font-black text-[#DE7E42]"
                            />
                          </div>
                          <label className="flex items-center gap-1 text-[11px] font-bold text-[#57382E] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(addon.allowsCustomText)}
                              onChange={e => handleUpdateAddon(aIdx, 'allowsCustomText', e.target.checked)}
                              className="rounded text-[#DE7E42]"
                            />
                            <span>Chiedi testo</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveAddon(aIdx)}
                            className="p-1 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700"
                            title="Elimina aggiunta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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

