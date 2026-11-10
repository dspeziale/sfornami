'use client';

import React, { useState } from 'react';
import { ShoppingBag, Eye, Plus, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { ProductModal } from './ProductModal';
import { ALLERGENS_LIST } from '@/lib/initialData';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;

    // If product has mandatory variants, open modal so user can choose
    if (product.variants && product.variants.length > 0) {
      setModalOpen(true);
      return;
    }

    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 900);
  };

  const allergenIcons = ALLERGENS_LIST.filter(a => product.allergens.includes(a.key));

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="group bg-white rounded-3xl overflow-hidden border-2 border-[#F5A16C]/20 hover:border-[#F28BA6] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 relative"
      >
        {/* Top visual image container */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-[#FFE29A]/20">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#F28BA6] text-white font-black text-[10px] uppercase tracking-wider shadow-md">
              {product.badge}
            </span>
          )}

          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <span className="px-3 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wide">
                Esaurito per oggi
              </span>
            </div>
          )}

          {/* Quick View Hover Pill */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="px-4 py-2 rounded-full bg-white/95 text-[#57382E] text-xs font-bold shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye className="w-3.5 h-3.5" />
              Scopri ingredienti
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#DE7E42]">
                {product.subCategory || product.category}
              </span>
              {allergenIcons.length > 0 && (
                <div className="flex gap-1" title="Allergeni presenti">
                  {allergenIcons.slice(0, 3).map(a => (
                    <span key={a.key} className="text-xs" title={a.name}>
                      {a.icon}
                    </span>
                  ))}
                  {allergenIcons.length > 3 && (
                    <span className="text-[10px] font-bold text-[#9E7D73]">
                      +{allergenIcons.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            <h4 className="text-base font-black text-[#57382E] group-hover:text-[#DE7E42] transition-colors line-clamp-1">
              {product.name}
            </h4>

            <p className="text-xs text-[#7E5649] line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Actions */}
          <div className="pt-3 border-t border-[#F5A16C]/15 flex items-center justify-between">
            <div>
              <span className="text-lg font-black text-[#57382E]">
                €{product.price.toFixed(2)}
              </span>
              {product.unit && (
                <span className="text-[11px] text-[#9E7D73] block -mt-0.5 font-medium">
                  {product.unit}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!product.isAvailable}
              className={`p-2.5 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                !product.isAvailable
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-600 text-white scale-95'
                  : 'bg-[#F5A16C] hover:bg-[#DE7E42] text-white hover:scale-110 active:scale-95 shadow-[#F5A16C]/30'
              }`}
              title={product.variants && product.variants.length > 0 ? 'Scegli variante' : 'Aggiungi al carrello'}
              aria-label="Aggiungi al carrello"
            >
              {isAdded ? (
                <Check className="w-5 h-5" />
              ) : product.variants && product.variants.length > 0 ? (
                <Plus className="w-5 h-5" />
              ) : (
                <ShoppingBag className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {modalOpen && <ProductModal product={product} onClose={() => setModalOpen(false)} />}
    </>
  );
};

