'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageCircle, Tag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { generateWhatsAppOrderMessage } from '@/lib/whatsapp';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

export const CartDrawer: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    discount,
    promoCode,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const total = Math.max(0, subtotal - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res);
    if (res.success) setPromoInput('');
  };

  // Direct WhatsApp order link from current cart
  const waUrl = generateWhatsAppOrderMessage({
    items,
    customerName: 'Cliente dal Sito',
    deliveryType: 'pickup',
    requestedDate: 'Da concordare',
    requestedTimeSlot: 'Da concordare',
    subtotal,
    deliveryFee: 0,
    total,
    settings: INITIAL_STORE_SETTINGS,
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF8EF] border-l border-[#F5A16C]/30 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#F5A16C]/20 bg-white/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#FFE29A] flex items-center justify-center text-[#57382E]">
                <ShoppingBag className="w-5 h-5 text-[#57382E]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#57382E]">Il tuo Carrello</h3>
                <p className="text-xs text-[#7E5649]">
                  {items.length === 0
                    ? 'Nessun prodotto selezionato'
                    : `${items.reduce((acc, i) => acc + i.quantity, 0)} bontà nel cestino`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-[#F28BA6]/20 text-[#57382E] transition-colors"
              aria-label="Chiudi carrello"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="text-6xl animate-bounce">🥐</div>
                <h4 className="text-lg font-bold text-[#57382E]">Il tuo cestino è ancora vuoto!</h4>
                <p className="text-sm text-[#7E5649] max-w-xs mx-auto">
                  Pane caldo, maritozzi con panna, crostate e biscotti ti stanno aspettando.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#F5A16C] text-white font-bold text-sm hover:bg-[#DE7E42] shadow-md transition-all hover:scale-105"
                >
                  Sfoglia il catalogo
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {items.map(item => {
                    const unitPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);
                    const itemTotal = unitPrice * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-3.5 border border-[#F5A16C]/20 shadow-xs flex gap-3 items-center"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#FFE29A]/30">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-bold text-[#57382E] truncate">
                            {item.product.name}
                          </h5>
                          {item.selectedVariant && (
                            <p className="text-xs text-[#F28BA6] font-medium truncate">
                              Variante: {item.selectedVariant.name}
                            </p>
                          )}
                          <p className="text-xs text-[#7E5649] font-semibold mt-0.5">
                            €{unitPrice.toFixed(2)} {item.product.unit && `• ${item.product.unit}`}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center border border-[#F5A16C]/40 rounded-full bg-[#FFF8EF] px-1 py-0.5">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:text-[#F28BA6] text-[#57382E]"
                                aria-label="Diminuisci quantità"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2 text-xs font-bold text-[#57382E] min-w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:text-[#A8D8BD] text-[#57382E]"
                                aria-label="Aumenta quantità"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-xs font-black text-[#57382E] ml-auto">
                              €{itemTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg text-[#9E7D73] hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Rimuovi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Promo Code Input */}
                <div className="mt-4 pt-3 border-t border-[#F5A16C]/20">
                  {promoCode ? (
                    <div className="flex items-center justify-between bg-[#A8D8BD]/30 border border-[#A8D8BD] rounded-xl px-3 py-2 text-xs">
                      <div className="flex items-center gap-1.5 text-[#57382E] font-bold">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Coupon {promoCode} attivo (-€{discount.toFixed(2)})</span>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-red-600 hover:underline font-semibold"
                      >
                        Rimuovi
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-2.5 w-4 h-4 text-[#7E5649]" />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={e => setPromoInput(e.target.value)}
                          placeholder="Hai un codice sconto? (es. BENVENUTO10)"
                          className="w-full pl-9 pr-3 py-2 bg-white rounded-xl text-xs border border-[#F5A16C]/30 text-[#57382E] placeholder:text-[#9E7D73] focus:outline-hidden focus:border-[#F28BA6]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-[#57382E] text-white text-xs font-bold rounded-xl hover:bg-[#7E5649] transition-colors"
                      >
                        Applica
                      </button>
                    </form>
                  )}
                  {promoFeedback && (
                    <p
                      className={`text-[11px] mt-1 font-medium ${
                        promoFeedback.success ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {promoFeedback.message}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer with totals and dual checkout CTAs */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#F5A16C]/20 bg-white/90 space-y-3">
              <div className="space-y-1.5 text-xs text-[#7E5649]">
                <div className="flex justify-between">
                  <span>Subtotale</span>
                  <span className="font-bold text-[#57382E]">€{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Sconto applicato</span>
                    <span className="font-bold">-€{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-[#57382E] pt-2 border-t border-dashed border-[#F5A16C]/30">
                  <span>Totale stimato</span>
                  <span className="text-lg text-[#DE7E42]">€{total.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-[#9E7D73]">
                  * Eventuali spese di consegna (€3.50) calcolate al checkout. Gratuite sopra €40.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {/* Primary Button: Standard Website Checkout */}
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#F28BA6] text-white font-black text-sm hover:bg-[#D86B86] shadow-lg shadow-[#F28BA6]/30 transition-all hover:scale-[1.01]"
                >
                  <span>PROCEDI AL CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Secondary Button: Direct WhatsApp Order */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#25D366] text-white font-bold text-xs hover:bg-[#1EBE5D] shadow-md transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>ORDINA DIRETTAMENTE SU WHATSAPP</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
