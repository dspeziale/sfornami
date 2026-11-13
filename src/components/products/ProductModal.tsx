'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Check, ShieldAlert, Sparkles, Plus, Minus } from 'lucide-react';
import { Product, ProductVariant, ProductAddon, SelectedAddon } from '@/lib/types';
import { ALLERGENS_LIST } from '@/lib/initialData';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addItem } = useCart();
  const { settings } = useSettings();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : [product.imageUrl];
  const activeImageUrl = galleryImages[activeImageIndex] || product.imageUrl;

  const availableAddons: ProductAddon[] = (product.addons && product.addons.length > 0)
    ? product.addons
    : (settings?.defaultAddons || []);

  const toggleAddon = (addon: ProductAddon) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.addonId === addon.id);
      if (exists) {
        return prev.filter(a => a.addonId !== addon.id);
      } else {
        return [...prev, { addonId: addon.id, name: addon.name, price: Number(addon.price), customText: '' }];
      }
    });
  };

  const updateAddonText = (addonId: string, text: string) => {
    setSelectedAddons(prev =>
      prev.map(a => (a.addonId === addonId ? { ...a, customText: text } : a))
    );
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  const currentPrice = product.price + (selectedVariant?.priceModifier || 0) + addonsTotal;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant, notes, selectedAddons);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  const productAllergenDetails = ALLERGENS_LIST.filter(a => product.allergens.includes(a.key));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-6 md:p-10 flex items-center justify-center animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-[#FFF8EF] rounded-2xl sm:rounded-3xl max-w-xl md:max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border-2 border-[#F5A16C]/40 z-10 my-auto">
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 text-[#57382E] hover:bg-[#F28BA6] hover:text-white flex items-center justify-center shadow-md transition-all"
          aria-label="Chiudi finestra"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2">
          {/* Image & Gallery */}
          <div className="relative flex flex-col bg-[#FFE29A]/30 shrink-0">
            <div className="relative h-36 sm:h-64 md:h-full min-h-[140px] sm:min-h-[260px]">
              <img
                src={activeImageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.badge && (
                <span className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#F28BA6] text-white font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Gallery Thumbnails (if multiple images uploaded) */}
            {galleryImages.length > 1 && (
              <div className="p-2 sm:p-3 bg-white/70 backdrop-blur-xs border-t border-[#F5A16C]/30 flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
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
          <div className="p-3.5 sm:p-6 md:p-8 flex flex-col justify-between space-y-3">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-[#DE7E42]">
                  {product.category} {product.subCategory && `• ${product.subCategory}`}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-[#57382E]">
                    €{currentPrice.toFixed(2)}
                  </span>
                  {product.unit && (
                    <span className="text-[10px] sm:text-xs font-semibold text-[#7E5649]">
                      {product.unit}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg sm:text-2xl font-black text-[#57382E] leading-tight">
                {product.name}
              </h3>

              <p className="text-xs sm:text-sm text-[#7E5649] leading-relaxed line-clamp-3 sm:line-clamp-none">
                {product.description}
              </p>

              {/* Variants selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="pt-1">
                  <label className="text-[11px] sm:text-xs font-bold text-[#57382E] block mb-1">
                    Scegli la tua variante:
                  </label>
                  <div className="space-y-1">
                    {product.variants.map((v, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`w-full text-left px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all ${
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

              {/* Personalizzazioni & Aggiunte (Confezione regalo, scritte, etc.) */}
              {availableAddons.length > 0 && (
                <div className="pt-2 border-t border-[#F5A16C]/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] sm:text-xs font-bold text-[#57382E] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#DE7E42]" />
                      <span>Aggiunte & Personalizzazioni:</span>
                    </label>
                    {selectedAddons.length > 0 && (
                      <span className="text-[10px] font-bold text-[#DE7E42]">
                        +{selectedAddons.length} {selectedAddons.length === 1 ? 'selezionata' : 'selezionate'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {availableAddons.map(addon => {
                      const isSelected = selectedAddons.some(a => a.addonId === addon.id);
                      const selectedItem = selectedAddons.find(a => a.addonId === addon.id);
                      return (
                        <div
                          key={addon.id}
                          className={`p-2 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-[#FFE29A]/50 border-[#DE7E42] shadow-xs'
                              : 'bg-white border-[#F5A16C]/25 hover:bg-[#FFF8EF]'
                          }`}
                        >
                          <label className="flex items-center justify-between cursor-pointer gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleAddon(addon)}
                                className="rounded text-[#DE7E42] focus:ring-[#DE7E42] w-4 h-4 shrink-0"
                              />
                              <span className="text-xs font-bold text-[#57382E] truncate">
                                {addon.name}
                              </span>
                            </div>
                            <span className="text-xs font-black text-[#DE7E42] shrink-0">
                              +€{Number(addon.price).toFixed(2)}
                            </span>
                          </label>

                          {isSelected && addon.allowsCustomText && (
                            <div className="mt-1.5 pt-1.5 border-t border-[#F5A16C]/20 pl-6">
                              <input
                                type="text"
                                value={selectedItem?.customText || ''}
                                onChange={e => updateAddonText(addon.id, e.target.value)}
                                placeholder="Scrivi il testo desiderato (es. 'Buon Compleanno Marco!')"
                                className="w-full px-2.5 py-1 text-xs rounded-lg bg-white border border-[#F5A16C]/40 text-[#57382E] placeholder:text-[#9E7D73] focus:outline-none focus:ring-1 focus:ring-[#DE7E42]"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ingredients & Allergens Accordion style */}
              <div className="pt-2 border-t border-[#F5A16C]/20 space-y-1.5">
                {product.ingredients && (
                  <div className="bg-white/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-[#F5A16C]/20 text-xs">
                    <p className="font-bold text-[#57382E] text-[11px] mb-0.5 flex items-center gap-1">
                      <span>🌾 Ingredienti artigianali:</span>
                    </p>
                    <p className="text-[#7E5649] text-[10px] sm:text-[11px] leading-relaxed">
                      {product.ingredients}
                    </p>
                  </div>
                )}

                {productAllergenDetails.length > 0 && (
                  <div className="bg-[#FDE8ED] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-[#F28BA6]/40 text-xs">
                    <p className="font-bold text-[#D86B86] text-[11px] mb-1 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Allergeni presenti:</span>
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {productAllergenDetails.map(a => (
                        <span
                          key={a.key}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white text-[#57382E] text-[10px] font-bold shadow-xs"
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
              <div className="pt-0.5">
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Note particolari? (es. confezione regalo)"
                  className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white border border-[#F5A16C]/30 text-xs text-[#57382E] placeholder:text-[#9E7D73] focus:outline-hidden focus:border-[#F28BA6]"
                />
              </div>
            </div>

            {/* Actions: Quantity + Add to Cart - STICKY AT BOTTOM OF MODAL ON MOBILE */}
            <div className="pt-2 sm:pt-3 border-t border-[#F5A16C]/20 flex items-center gap-2 sm:gap-3 sticky bottom-0 bg-[#FFF8EF] pb-1">
              <div className="flex items-center border border-[#F5A16C]/40 rounded-xl sm:rounded-2xl bg-white px-1.5 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-1 hover:text-[#F28BA6] text-[#57382E]"
                  aria-label="Diminuisci quantità"
                >
                  <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <span className="px-2 sm:px-3 text-xs sm:text-sm font-black text-[#57382E] min-w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-1 hover:text-[#A8D8BD] text-[#57382E]"
                  aria-label="Aumenta quantità"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg transition-all ${
                  !product.isAvailable
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : addedAnimation
                    ? 'bg-emerald-600 text-white scale-95'
                    : 'bg-[#F28BA6] hover:bg-[#D86B86] text-white hover:scale-[1.01] active:scale-95 shadow-[#F28BA6]/30'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Aggiunto!</span>
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

