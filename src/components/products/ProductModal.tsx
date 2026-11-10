'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Check, ShieldAlert, Sparkles, Plus, Minus } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/types';
import { ALLERGENS_LIST } from '@/lib/initialData';
import { useCart } from '@/context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : [product.imageUrl];
  const activeImageUrl = galleryImages[activeImageIndex] || product.imageUrl;

  const currentPrice = product.price + (selectedVariant?.priceModifier || 0);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant, notes);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  const productAllergenDetails = ALLERGENS_LIST.filter(a => product.allergens.includes(a.key));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-[#FFF8EF] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-2 border-[#F5A16C]/40 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 text-[#57382E] hover:bg-[#F28BA6] hover:text-white flex items-center justify-center shadow-md transition-all"
          aria-label="Chiudi finestra"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Gallery */}
          <div className="relative flex flex-col bg-[#FFE29A]/30">
            <div className="relative h-64 md:h-full min-h-[260px]">
              <img
                src={activeImageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#F28BA6] text-white font-black text-xs uppercase tracking-wider shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Gallery Thumbnails (if multiple images uploaded) */}
            {galleryImages.length > 1 && (
              <div className="p-3 bg-white/70 backdrop-blur-xs border-t border-[#F5A16C]/30 flex items-center gap-2 overflow-x-auto">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#DE7E42] scale-105 shadow-md ring-2 ring-[#DE7E42]/20'
                        : 'border-[#F5A16C]/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-[#DE7E42]">
                {product.category} {product.subCategory && `• ${product.subCategory}`}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-[#57382E] leading-tight">
                {product.name}
              </h3>
              <p className="text-sm text-[#7E5649] leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-black text-[#57382E]">
                  €{currentPrice.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-[#7E5649]">
                  {product.unit}
                </span>
              </div>

              {/* Variants selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="pt-2">
                  <label className="text-xs font-bold text-[#57382E] block mb-1.5">
                    Scegli la tua variante preferita:
                  </label>
                  <div className="space-y-1.5">
                    {product.variants.map((v, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all ${
                          selectedVariant?.name === v.name
                            ? 'bg-[#FFE29A] border-[#DE7E42] text-[#57382E] shadow-xs'
                            : 'bg-white border-[#F5A16C]/30 text-[#7E5649] hover:bg-[#FFF8EF]'
                        }`}
                      >
                        <span>{v.name}</span>
                        {v.priceModifier > 0 && (
                          <span className="font-bold text-[#DE7E42]">
                            +€{v.priceModifier.toFixed(2)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients & Allergens Accordion style */}
              <div className="pt-3 border-t border-[#F5A16C]/20 space-y-2">
                <div className="bg-white/80 rounded-2xl p-3 border border-[#F5A16C]/20 text-xs">
                  <p className="font-bold text-[#57382E] mb-1 flex items-center gap-1">
                    <span>🌾 Ingredienti artigianali:</span>
                  </p>
                  <p className="text-[#7E5649] text-[11px] leading-relaxed">
                    {product.ingredients}
                  </p>
                </div>

                {productAllergenDetails.length > 0 && (
                  <div className="bg-[#FDE8ED] rounded-2xl p-3 border border-[#F28BA6]/40 text-xs">
                    <p className="font-bold text-[#D86B86] mb-1.5 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Allergeni presenti (Reg. UE 1169/2011):</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {productAllergenDetails.map(a => (
                        <span
                          key={a.key}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-[#57382E] text-[10px] font-bold shadow-xs"
                          title={a.description}
                        >
                          <span>{a.icon}</span>
                          <span>{a.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Special notes for bakery */}
              <div className="pt-1">
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Note particolari? (es. fette spesse, confezione regalo)"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#F5A16C]/30 text-xs text-[#57382E] placeholder:text-[#9E7D73] focus:outline-hidden focus:border-[#F28BA6]"
                />
              </div>
            </div>

            {/* Actions: Quantity + Add to Cart */}
            <div className="pt-3 border-t border-[#F5A16C]/20 flex items-center gap-3">
              <div className="flex items-center border border-[#F5A16C]/40 rounded-2xl bg-white px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-1 hover:text-[#F28BA6] text-[#57382E]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-black text-[#57382E] min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-1 hover:text-[#A8D8BD] text-[#57382E]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className={`flex-1 py-3 px-5 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  !product.isAvailable
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : addedAnimation
                    ? 'bg-emerald-600 text-white scale-95'
                    : 'bg-[#F28BA6] hover:bg-[#D86B86] text-white hover:scale-[1.02] active:scale-95 shadow-[#F28BA6]/30'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Aggiunto al carrello!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Aggiungi • €{(currentPrice * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

