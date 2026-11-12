'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, X, ChevronDown, Check, Sparkles } from 'lucide-react';
import { CATEGORIES, ALLERGENS_LIST } from '@/lib/initialData';
import { Allergen, Product, ProductCategory } from '@/lib/types';
import { DataService } from '@/lib/store';
import { ProductCard } from '@/components/products/ProductCard';

function HomeCatalogContent() {
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
    // 1. Instant hydration from cached storage (0 ms delay on mobile)
    const cached = DataService.getCachedProducts();
    if (cached && cached.length > 0) {
      setProducts(cached);
      setLoading(false);
    }

    // 2. Fetch fresh catalog from Postgres
    DataService.getProducts()
      .then(items => {
        setProducts(items);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (initialCategoryParam) {
      setSelectedCategory(initialCategoryParam);
    }
  }, [initialCategoryParam]);

  // Derive dynamic category tabs based exclusively on products actually present in catalog
  const availableCategories = Array.from(new Set(products.map(p => p.category)));
  const categoriesTabs = [
    { id: 'all', name: 'Tutto il Catalogo' },
    ...availableCategories.map(catKey => {
      const found = CATEGORIES.find(c => c.id === catKey);
      return {
        id: catKey,
        name: found ? found.name : catKey.replace('-', ' ').toUpperCase(),
      };
    }),
  ];

  // Filter and sort logic
  const filteredProducts = products
    .filter(product => {
      // Category match
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search query match
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name?.toLowerCase().includes(q);
        const matchDesc = product.description?.toLowerCase().includes(q);
        const matchIngr = product.ingredients?.toLowerCase().includes(q);
        const matchSub = product.subCategory?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchIngr && !matchSub) return false;
      }

      // Exclusion filter for allergens
      if (selectedAllergensExclude.length > 0) {
        const containsExcluded = product.allergens?.some(a => selectedAllergensExclude.includes(a));
        if (containsExcluded) return false;
      }

      return true;
    })
    .sort((a, b) => {
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

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-6 space-y-3 sm:space-y-5 pb-32 sm:pb-16">
      {/* Sleek Mobile-First Catalog Header */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#57382E] tracking-tight flex items-center gap-2">
            <span>Il Nostro Forno</span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#FFE29A] text-[#57382E] text-[10px] font-bold uppercase">
              Torraccia • Roma
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs text-[#7E5649]">
            Sfornato fresco ogni giorno • Solo consegna a domicilio
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-white text-[#DE7E42] border border-[#F5A16C]/30 shadow-xs flex items-center gap-1">
            🛵 Consegna Roma
          </span>
        </div>
      </div>

      {/* Category Tabs: Real categories present in catalog */}
      {categoriesTabs.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
          {categoriesTabs.map(tab => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as ProductCategory | 'all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs shrink-0 ${
                  isActive
                    ? 'bg-[#F5A16C] text-white shadow-sm shadow-[#F5A16C]/30 scale-102'
                    : 'bg-white text-[#7E5649] hover:bg-[#FFE29A]/40 border border-[#F5A16C]/25'
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Search & Filter Compact Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#9E7D73]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cerca pane, pizza, dolci..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-[#F5A16C]/30 text-xs text-[#57382E] placeholder:text-[#9E7D73] focus:outline-hidden focus:border-[#F28BA6]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-[#9E7D73] hover:text-[#57382E]"
              aria-label="Cancella ricerca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Sorting Dropdown */}
        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="appearance-none pl-2.5 pr-6 py-2 rounded-xl bg-white border border-[#F5A16C]/30 text-xs font-bold text-[#57382E] focus:outline-hidden cursor-pointer"
            aria-label="Ordina prodotti"
          >
            <option value="featured">Consigliati</option>
            <option value="price-asc">Prezzo ↑</option>
            <option value="price-desc">Prezzo ↓</option>
            <option value="name">Nome (A-Z)</option>
          </select>
          <ChevronDown className="absolute right-1.5 top-2.5 w-3.5 h-3.5 text-[#7E5649] pointer-events-none" />
        </div>

        {/* Allergen Filter Toggle Button */}
        <button
          onClick={() => setShowFiltersModal(prev => !prev)}
          className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1 border transition-colors shrink-0 ${
            selectedAllergensExclude.length > 0
              ? 'bg-[#F28BA6] text-white border-[#F28BA6]'
              : 'bg-white text-[#57382E] border-[#F5A16C]/30 hover:bg-[#FFE29A]/30'
          }`}
          title="Filtra allergeni"
          aria-label="Filtra allergeni"
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Allergeni</span>
          {selectedAllergensExclude.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#DE7E42] sm:hidden"></span>
          )}
        </button>
      </div>

      {/* Allergen exclusion quick bar if open */}
      {showFiltersModal && (
        <div className="bg-[#FFF8EF] p-4 rounded-2xl sm:rounded-3xl border border-[#F5A16C]/30 space-y-2.5 animate-fadeIn">
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
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {ALLERGENS_LIST.map(a => {
              const isExcluded = selectedAllergensExclude.includes(a.key);
              return (
                <button
                  key={a.key}
                  onClick={() => toggleAllergenExclude(a.key)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    isExcluded
                      ? 'bg-[#F28BA6] text-white shadow-xs'
                      : 'bg-white text-[#7E5649] border border-[#F5A16C]/30 hover:bg-[#FFE29A]/30'
                  }`}
                >
                  <span>{a.icon}</span>
                  <span>Senza {a.name}</span>
                  {isExcluded && <Check className="w-3 h-3 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active filters pill list */}
      {(selectedCategory !== 'all' || searchQuery || selectedAllergensExclude.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#9E7D73] font-medium text-[11px]">Filtri:</span>

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFE29A] text-[#57382E] font-bold text-xs">
              {categoriesTabs.find(c => c.id === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFE29A] text-[#57382E] font-bold text-xs">
              "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedAllergensExclude.map(key => (
            <span
              key={key}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FDE8ED] text-[#D86B86] font-bold border border-[#F28BA6]/40 text-xs"
            >
              No {ALLERGENS_LIST.find(a => a.key === key)?.name}
              <button onClick={() => toggleAllergenExclude(key)} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            onClick={clearAllFilters}
            className="text-xs text-[#DE7E42] hover:underline font-bold ml-1"
          >
            Azzera filtri
          </button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="text-4xl animate-spin">🌾</div>
          <p className="text-xs font-bold text-[#57382E]">Caricamento catalogo...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border-2 border-dashed border-[#F5A16C]/30 p-6 space-y-3">
          <div className="text-5xl">🥐🔍</div>
          <h3 className="text-lg font-black text-[#57382E]">Nessuna bontà trovata</h3>
          <p className="text-xs text-[#7E5649] max-w-sm mx-auto">
            Nessun prodotto corrisponde ai criteri di ricerca o ai filtri selezionati.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2 rounded-full bg-[#F5A16C] text-white text-xs font-bold hover:bg-[#DE7E42] shadow-md transition-all"
          >
            Mostra tutti i prodotti
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#7E5649] px-1">
            Visualizzando <span className="text-[#57382E] font-black">{filteredProducts.length}</span> bontà artigianali
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center space-y-3">
          <div className="text-4xl animate-spin">🌾</div>
          <p className="text-xs font-bold text-[#57382E]">Caricamento catalogo...</p>
        </div>
      }
    >
      <HomeCatalogContent />
    </Suspense>
  );
}
