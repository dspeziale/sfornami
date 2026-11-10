'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, Sparkles, X, ChevronDown, Check } from 'lucide-react';
import { CATEGORIES, ALLERGENS_LIST } from '@/lib/initialData';
import { Allergen, Product, ProductCategory } from '@/lib/types';
import { DataService } from '@/lib/store';
import { ProductCard } from '@/components/products/ProductCard';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('cat') as ProductCategory | null;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(
    initialCategoryParam || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAllergensExclude, setSelectedAllergensExclude] = useState<Allergen[]>([]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  useEffect(() => {
    DataService.getProducts().then(items => {
      setProducts(items);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (initialCategoryParam) {
      setSelectedCategory(initialCategoryParam);
    }
  }, [initialCategoryParam]);

  // Filter and sort logic
  const filteredProducts = products.filter(product => {
    // Category match
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // Search query match in name, description, ingredients or subcategory
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchIngr = product.ingredients.toLowerCase().includes(q);
      const matchSub = product.subCategory?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchIngr && !matchSub) return false;
    }

    // Exclusion filter for allergens (e.g. show only products WITHOUT specific allergens)
    if (selectedAllergensExclude.length > 0) {
      const containsExcluded = product.allergens.some(a => selectedAllergensExclude.includes(a));
      if (containsExcluded) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    // Default 'featured'
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  const toggleAllergenExclude = (key: Allergen) => {
    setSelectedAllergensExclude(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedAllergensExclude([]);
    setSortBy('featured');
  };

  const categoriesTabs = [
    { id: 'all', name: 'Tutto il Catalogo' },
    ...CATEGORIES.map(c => ({ id: c.id, name: c.name })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-4 py-1.5 rounded-full bg-[#FFE29A] text-[#57382E] text-xs font-black tracking-wider uppercase">
          Freschezza e Artigianalità Quotidiana
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#57382E] tracking-tight">
          Il Catalogo di SFORNAMÌ
        </h1>
        <p className="text-sm sm:text-base text-[#7E5649] leading-relaxed">
          Pane cotto su pietra, focacce romane scrocchiarelle, biscotti della nonna, torte fresche e le specialità della tradizione capitolina.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-2 scrollbar-none">
        {categoriesTabs.map(tab => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as ProductCategory | 'all')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs ${
                isActive
                  ? 'bg-[#F5A16C] text-white shadow-md shadow-[#F5A16C]/30 scale-105'
                  : 'bg-white text-[#7E5649] hover:bg-[#FFE29A]/40 border border-[#F5A16C]/20'
              }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Search, Filter bar & Sorting Controls */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#F5A16C]/25 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 w-4 h-4 text-[#9E7D73]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cerca pane, pizza, maritozzo, visciole, ingredienti..."
            className="w-full pl-11 pr-10 py-2.5 rounded-2xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs sm:text-sm text-[#57382E] placeholder:text-[#9E7D73] focus:outline-hidden focus:border-[#F28BA6]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-[#9E7D73] hover:text-[#57382E]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sorting Dropdown & Filter toggle */}
        <div className="flex items-center gap-3">
          {/* Sorting */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-2xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-bold text-[#57382E] focus:outline-hidden focus:border-[#F28BA6] cursor-pointer"
            >
              <option value="featured">Consigliati da noi</option>
              <option value="price-asc">Prezzo: dal più basso</option>
              <option value="price-desc">Prezzo: dal più alto</option>
              <option value="name">Nome (A - Z)</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-[#7E5649] pointer-events-none" />
          </div>

          {/* Allergen Filter Toggle Button */}
          <button
            onClick={() => setShowFiltersModal(prev => !prev)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-colors ${
              selectedAllergensExclude.length > 0
                ? 'bg-[#F28BA6] text-white border-[#F28BA6]'
                : 'bg-[#FFF8EF] text-[#57382E] border-[#F5A16C]/30 hover:bg-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>
              Allergeni
              {selectedAllergensExclude.length > 0 && ` (${selectedAllergensExclude.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Allergen exclusion quick bar if open */}
      {showFiltersModal && (
        <div className="bg-[#FFF8EF] p-5 rounded-3xl border border-[#F5A16C]/30 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#57382E]">
              Mostra solo prodotti SENZA i seguenti allergeni:
            </p>
            {selectedAllergensExclude.length > 0 && (
              <button
                onClick={() => setSelectedAllergensExclude([])}
                className="text-[11px] text-[#DE7E42] hover:underline font-bold"
              >
                Reset filtri allergeni
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {ALLERGENS_LIST.map(a => {
              const isExcluded = selectedAllergensExclude.includes(a.key);
              return (
                <button
                  key={a.key}
                  onClick={() => toggleAllergenExclude(a.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isExcluded
                      ? 'bg-[#F28BA6] text-white shadow-xs'
                      : 'bg-white text-[#7E5649] border border-[#F5A16C]/30 hover:bg-[#FFE29A]/30'
                  }`}
                >
                  <span>{a.icon}</span>
                  <span>Senza {a.name}</span>
                  {isExcluded && <Check className="w-3.5 h-3.5 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active filters pill list */}
      {(selectedCategory !== 'all' || searchQuery || selectedAllergensExclude.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#9E7D73] font-medium">Filtri attivi:</span>

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFE29A] text-[#57382E] font-bold">
              Categoria: {categoriesTabs.find(c => c.id === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFE29A] text-[#57382E] font-bold">
              Ricerca: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedAllergensExclude.map(key => (
            <span
              key={key}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FDE8ED] text-[#D86B86] font-bold border border-[#F28BA6]/40"
            >
              No {ALLERGENS_LIST.find(a => a.key === key)?.name}
              <button onClick={() => toggleAllergenExclude(key)} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            onClick={clearAllFilters}
            className="text-xs text-[#DE7E42] hover:underline font-bold ml-2"
          >
            Azzera tutti i filtri
          </button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="text-5xl animate-spin">🌾</div>
          <p className="text-sm font-bold text-[#57382E]">Caricamento del forno in corso...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-[#F5A16C]/30 p-8 space-y-4">
          <div className="text-6xl">🥐🔍</div>
          <h3 className="text-xl font-black text-[#57382E]">Nessuna bontà trovata</h3>
          <p className="text-xs text-[#7E5649] max-w-sm mx-auto">
            Nessun prodotto corrisponde ai criteri di ricerca o ai filtri allergeni selezionati.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2.5 rounded-full bg-[#F5A16C] text-white text-xs font-bold hover:bg-[#DE7E42] shadow-md transition-all"
          >
            Mostra tutti i prodotti
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-bold text-[#7E5649]">
            Visualizzando <span className="text-[#57382E] font-black">{filteredProducts.length}</span> bontà artigianali
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-4">
          <div className="text-5xl animate-spin">🌾</div>
          <p className="text-sm font-bold text-[#57382E]">Caricamento catalogo...</p>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
