'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Trash2, Plus, Minus, ArrowLeft, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { generateWhatsAppOrderMessage } from '@/lib/whatsapp';

export default function CarrelloPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    discount,
    promoCode,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const { settings } = useSettings();
  const [promoInput, setPromoInput] = React.useState('');
  const [promoFeedback, setPromoFeedback] = React.useState<{ success: boolean; message: string } | null>(null);

  const total = Math.max(0, subtotal - discount);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res);
    if (res.success) setPromoInput('');
  };

  const deliveryFee = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;

  const waUrl = generateWhatsAppOrderMessage({
    items,
    customerName: 'Cliente dal Carrello',
    deliveryType: 'delivery',
    requestedDate: 'Da concordare',
    requestedTimeSlot: 'Consegna a Domicilio Roma',
    subtotal,
    deliveryFee,
    total: total + deliveryFee,
    settings,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      {/* Breadcrumb & Header */}
      <div>
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DE7E42] hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continua a fare acquisti</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-[#57382E]">
          Il Tuo Cestino di Bontà
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#F5A16C]/30 space-y-4 max-w-lg mx-auto">
          <div className="text-6xl animate-bounce">🥐</div>
          <h3 className="text-xl font-black text-[#57382E]">Il tuo carrello è vuoto</h3>
          <p className="text-xs text-[#7E5649]">
            Aggiungi pane caldo, pizza scrocchiarella, maritozzi o biscotti artigianali prima di procedere.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F5A16C] text-white font-bold text-xs hover:bg-[#DE7E42] shadow-md transition-all hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Sfoglia il catalogo</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Items Table / Cards */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl p-6 border-2 border-[#F5A16C]/20 shadow-sm divide-y divide-[#F5A16C]/15">
              {items.map(item => {
                const unitPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);
                const itemTotal = unitPrice * item.quantity;

                return (
                  <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-[#FFE29A]/30 border border-[#F5A16C]/20"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-sm font-black text-[#57382E]">{item.product.name}</h4>
                      {item.selectedVariant && (
                        <p className="text-xs text-[#DE7E42] font-semibold">
                          Variante: {item.selectedVariant.name}
                        </p>
                      )}
                      <p className="text-xs text-[#7E5649]">
                        €{unitPrice.toFixed(2)} {item.product.unit && `• ${item.product.unit}`}
                      </p>
                      {item.notes && (
                        <p className="text-[11px] text-[#9E7D73] italic">
                          Nota: "{item.notes}"
                        </p>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center border border-[#F5A16C]/40 rounded-full bg-[#FFF8EF] px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-[#57382E] hover:text-[#F28BA6]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-black text-[#57382E] min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-[#57382E] hover:text-[#A8D8BD]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-black text-[#57382E] min-w-16 text-right">
                        €{itemTotal.toFixed(2)}
                      </span>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-[#9E7D73] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Rimuovi prodotto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-[#7E5649] px-2">
              <button
                onClick={clearCart}
                className="text-red-600 hover:underline font-semibold"
              >
                Svuota completamente il carrello
              </button>
              <Link href="/menu" className="text-[#DE7E42] hover:underline font-semibold">
                + Aggiungi altri prodotti dal forno
              </Link>
            </div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-lg space-y-6">
            <h3 className="text-base font-black text-[#57382E]">Riepilogo Ordine</h3>

            <div className="space-y-3 text-xs text-[#7E5649]">
              <div className="flex justify-between">
                <span>Subtotale prodotti</span>
                <span className="font-bold text-[#57382E]">€{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Sconto promozionale</span>
                  <span className="font-bold">-€{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#F5A16C]/20 flex justify-between text-base font-black text-[#57382E]">
                <span>Totale provvisorio</span>
                <span className="text-xl text-[#DE7E42]">€{total.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-[#9E7D73]">
                * Consegna a domicilio (€3.50, gratuita sopra €40) o Ritiro Gratuito al forno.
              </p>
            </div>

            {/* Promo Code */}
            <div className="pt-2">
              {promoCode ? (
                <div className="flex items-center justify-between bg-[#A8D8BD]/30 border border-[#A8D8BD] rounded-xl px-3 py-2 text-xs">
                  <span className="font-bold text-[#57382E]">Coupon {promoCode} attivo</span>
                  <button onClick={removePromoCode} className="text-red-600 font-bold hover:underline">
                    Rimuovi
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    placeholder="Codice promo (BENVENUTO10)"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#57382E] text-white text-xs font-bold rounded-xl hover:bg-[#7E5649]"
                  >
                    Applica
                  </button>
                </form>
              )}
              {promoFeedback && (
                <p className={`text-[11px] mt-1 ${promoFeedback.success ? 'text-emerald-700' : 'text-red-600'}`}>
                  {promoFeedback.message}
                </p>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <Link
                href="/checkout"
                className="w-full py-4 px-6 rounded-2xl bg-[#F28BA6] hover:bg-[#D86B86] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#F28BA6]/30 transition-all hover:scale-[1.02]"
              >
                <span>PROCEDI AL CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>ORDINA SU WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

