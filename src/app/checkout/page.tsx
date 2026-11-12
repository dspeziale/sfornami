'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Truck,
  Clock,
  ShieldCheck,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { DataService } from '@/lib/store';
import { PaymentMethod, TimeSlot } from '@/lib/types';
import { INITIAL_TIME_SLOTS } from '@/lib/initialData';
import { generateWhatsAppOrderMessage } from '@/lib/whatsapp';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, clearCart } = useCart();
  const { settings } = useSettings();

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(INITIAL_TIME_SLOTS);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Laboratorio: Consegna a domicilio esclusiva
  const deliveryType = 'delivery';
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('Roma');
  const [deliveryCap, setDeliveryCap] = useState('00186');

  const [tomorrow, setTomorrow] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedTimeSlot, setRequestedTimeSlot] = useState('10:30 - 12:30 (Mattina)');

  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');

  useEffect(() => {
    const tmr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    setTomorrow(tmr);
    setRequestedDate(tmr);

    DataService.getTimeSlots().then(slots => {
      setTimeSlots(slots);
      const deliverySlots = slots.filter(s => s.type === 'delivery' && s.isActive);
      if (deliverySlots.length > 0) {
        setRequestedTimeSlot(deliverySlots[0].label);
      }
    });
  }, []);

  // Delivery fee calculation
  const deliveryFee = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  // Validate CAP
  const isCapServito = settings.servedCaps.includes(deliveryCap.trim());

  // Handle Form Submission
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Il carrello è vuoto. Aggiungi prima dei prodotti.');
      return;
    }

    if (!customerName || !customerPhone || !customerEmail) {
      setErrorMsg('Compila tutti i dati del cliente (Nome, Telefono, Email).');
      return;
    }

    if (!deliveryAddress) {
      setErrorMsg('Inserisci l’indirizzo completo per la consegna a domicilio a Roma.');
      return;
    }

    if (subtotal < settings.minOrderDelivery) {
      setErrorMsg(`L'ordine minimo per la consegna a domicilio è di €${settings.minOrderDelivery.toFixed(2)}.`);
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map(item => {
        const unitPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);
        return {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          productId: item.product.id,
          productName: item.product.name,
          variantName: item.selectedVariant?.name,
          price: unitPrice,
          quantity: item.quantity,
          total: unitPrice * item.quantity,
        };
      });

      const newOrder = await DataService.createOrder({
        customerName,
        customerEmail,
        customerPhone,
        deliveryType: 'delivery',
        deliveryAddress,
        deliveryCity,
        deliveryCap,
        requestedDate,
        requestedTimeSlot,
        notes,
        items: orderItems,
        subtotal,
        deliveryFee,
        discount,
        total,
        paymentMethod,
        paymentStatus: 'pending',
        status: 'nuovo',
      });

      // Clear cart
      clearCart();

      // Redirect to confirmation page with unique order number
      router.push(`/ordine-confermato?id=${newOrder.orderNumber}`);
    } catch (err) {
      console.error('Order creation error', err);
      setErrorMsg('Si è verificato un errore durante la registrazione dell’ordine. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!customerName || !customerPhone) {
      setErrorMsg('Inserisci almeno Nome e Numero di Telefono per compilare il messaggio WhatsApp.');
      return;
    }

    if (!deliveryAddress) {
      setErrorMsg('Inserisci l’indirizzo di consegna a Roma prima di ordinare su WhatsApp.');
      return;
    }

    const waUrl = generateWhatsAppOrderMessage({
      items,
      customerName,
      customerPhone,
      deliveryType: 'delivery',
      deliveryAddress,
      deliveryCity,
      deliveryCap,
      requestedDate,
      requestedTimeSlot,
      notes,
      subtotal,
      deliveryFee,
      total,
      settings,
    });

    window.open(waUrl, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-6xl animate-bounce">🥐</div>
        <h2 className="text-2xl font-black text-[#57382E]">Nessun prodotto nel carrello</h2>
        <p className="text-xs text-[#7E5649]">
          Per procedere al checkout, seleziona le tue bontà preferite dal catalogo artigianale.
        </p>
        <Link
          href="/menu"
          className="inline-block mt-4 px-6 py-3 rounded-full bg-[#F5A16C] text-white font-bold text-xs hover:bg-[#DE7E42]"
        >
          Vai al Catalogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      <div>
        <span className="text-xs font-black uppercase tracking-wider text-[#DE7E42]">
          Consegna a Domicilio a Roma
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#57382E]">
          Completa il Tuo Ordine
        </h1>
        <p className="text-xs text-[#7E5649] mt-1">
          Laboratorio artigianale di produzione: tutti i prodotti vengono sfornati freschi su ordinazione e consegnati direttamente a casa tua.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Mobile-First: Order summary on top on mobile, on the right on desktop */}
        <div className="lg:hidden w-full">
          <div className="bg-white rounded-3xl p-5 border-2 border-[#F5A16C]/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5A16C]/20">
              <h3 className="text-base font-black text-[#57382E]">Riepilogo Ordine ({items.length} {items.length === 1 ? 'prodotto' : 'prodotti'})</h3>
              <Link href="/carrello" className="text-xs font-bold text-[#DE7E42] hover:underline flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Modifica
              </Link>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1 divide-y divide-[#F5A16C]/10 text-xs">
              {items.map(item => {
                const uPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);
                return (
                  <div key={item.id} className="pt-2 first:pt-0 flex justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-[#57382E] truncate">
                        {item.quantity}x {item.product.name}
                      </p>
                      {item.selectedVariant && (
                        <p className="text-[10px] text-[#DE7E42]">{item.selectedVariant.name}</p>
                      )}
                    </div>
                    <span className="font-semibold text-[#57382E] shrink-0">
                      €{(uPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#F5A16C]/20 flex justify-between items-baseline text-sm font-black text-[#57382E]">
              <span>Totale da Pagare:</span>
              <span className="text-xl text-[#DE7E42]">€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Left Form: Details, Delivery, Time, Payment */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Dati del Cliente */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-xs space-y-4">
            <h3 className="text-base font-black text-[#57382E] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FFE29A] text-xs font-black flex items-center justify-center">1</span>
              <span>I Tuoi Dati di Contatto</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#57382E] block mb-1">
                  Nome e Cognome*
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Giulia De Angelis"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-medium text-[#57382E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#57382E] block mb-1">
                  Cellulare / WhatsApp*
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+39 347 1234567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-medium text-[#57382E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#57382E] block mb-1">
                  Email (per conferma)*
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  placeholder="giulia@email.it"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-medium text-[#57382E]"
                />
              </div>
            </div>
          </div>

          {/* 2. Indirizzo e Consegna a Domicilio */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-xs space-y-5">
            <h3 className="text-base font-black text-[#57382E] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FFE29A] text-xs font-black flex items-center justify-center">2</span>
              <span>Consegna a Domicilio a Roma</span>
            </h3>

            {/* Informative notice */}
            <div className="p-4 rounded-2xl bg-[#FFE29A]/30 border border-[#F5A16C]/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#DE7E42] text-white flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#57382E]">Laboratorio Artigianale con Consegna Diretta</p>
                <p className="text-[#7E5649]">
                  Prepariamo il pane e i dolci freschi nel nostro laboratorio e li consegniamo fragranti all'indirizzo indicato.
                </p>
              </div>
            </div>

            {/* Address input */}
            <div className="p-4 bg-[#FFF8EF] rounded-2xl border border-[#F5A16C]/30 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="text-[11px] font-bold text-[#57382E] block mb-1">
                    Indirizzo di Consegna (Via, Civico, Scala, Piano, Citofono)*
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    placeholder="Corso Vittorio Emanuele II, 142, int. 4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F5A16C]/30 text-xs font-medium text-[#57382E]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="text-[11px] font-bold text-[#57382E] block mb-1">
                    CAP Roma (Es. 00186)*
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryCap}
                    onChange={e => setDeliveryCap(e.target.value)}
                    placeholder="00186"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F5A16C]/30 text-xs font-medium text-[#57382E]"
                  />
                </div>
              </div>

              {deliveryCap && !isCapServito && (
                <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  ℹ️ Il CAP {deliveryCap} non è nell'elenco standard express ({settings.servedCaps.join(', ')}). Puoi comunque confermare l'ordine: verificheremo la consegna con te via WhatsApp.
                </p>
              )}
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F5A16C]/15">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#57382E] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#DE7E42]" />
                  <span>Data Richiesta di Consegna*</span>
                </label>
                <input
                  type="date"
                  min={tomorrow}
                  required
                  value={requestedDate}
                  onChange={e => setRequestedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-bold text-[#57382E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#57382E] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#DE7E42]" />
                  <span>Fascia Oraria di Consegna*</span>
                </label>
                <select
                  value={requestedTimeSlot}
                  onChange={e => setRequestedTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-bold text-[#57382E]"
                >
                  {timeSlots
                    .filter(s => s.type === 'delivery' && s.isActive)
                    .map(slot => (
                      <option key={slot.id} value={slot.label}>
                        {slot.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[11px] font-bold text-[#57382E] block mb-1">
                Note per la preparazione o indicazioni per il corriere
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Es. Citofonare De Angelis int. 4, pane con mollica ben cotta..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
              />
            </div>
          </div>

          {/* 3. Metodo di Pagamento */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-xs space-y-4">
            <h3 className="text-base font-black text-[#57382E] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FFE29A] text-xs font-black flex items-center justify-center">3</span>
              <span>Modalità di Pagamento</span>
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8EF] border border-[#F5A16C]/30 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                  className="text-[#DE7E42]"
                />
                <div className="text-xs">
                  <p className="font-black text-[#57382E] flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Contanti alla consegna</span>
                  </p>
                  <p className="text-[#7E5649]">Paga comodamente al corriere al momento della consegna.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8EF] border border-[#F5A16C]/30 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card_on_delivery'}
                  onChange={() => setPaymentMethod('card_on_delivery')}
                  className="text-[#DE7E42]"
                />
                <div className="text-xs">
                  <p className="font-black text-[#57382E] flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>POS / Carta alla consegna</span>
                  </p>
                  <p className="text-[#7E5649]">Il nostro corriere è dotato di POS contactless portatile.</p>
                </div>
              </label>

              {/* Stripe notification badge */}
              <div className="p-3 bg-white rounded-2xl border border-dashed border-[#F5A16C]/40 text-[11px] text-[#7E5649] flex items-center justify-between">
                <span>💳 Pagamento online con Carta di Credito (Stripe):</span>
                <span className="font-bold text-[#DE7E42]">Configurabile dal Laboratorio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Sidebar (Desktop right, Mobile bottom) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/30 shadow-md space-y-5">
            <div className="hidden lg:flex items-center justify-between pb-4 border-b border-[#F5A16C]/20">
              <h3 className="text-base font-black text-[#57382E]">Riepilogo Ordine</h3>
              <Link href="/carrello" className="text-xs font-bold text-[#DE7E42] hover:underline flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Modifica
              </Link>
            </div>

            {/* Items mini list (Desktop) */}
            <div className="hidden lg:block space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-[#F5A16C]/10 text-xs">
              {items.map(item => {
                const uPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);
                return (
                  <div key={item.id} className="pt-2 first:pt-0 flex justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-[#57382E] truncate">
                        {item.quantity}x {item.product.name}
                      </p>
                      {item.selectedVariant && (
                        <p className="text-[10px] text-[#DE7E42]">{item.selectedVariant.name}</p>
                      )}
                    </div>
                    <span className="font-semibold text-[#57382E] shrink-0">
                      €{(uPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="pt-0 lg:pt-4 lg:border-t border-[#F5A16C]/20 space-y-2 text-xs">
              <div className="flex justify-between text-[#7E5649]">
                <span>Subtotale prodotti</span>
                <span className="font-bold text-[#57382E]">€{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Sconto promozionale</span>
                  <span className="font-bold">-€{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#7E5649]">
                <span>Spese di consegna a Roma</span>
                <span className="font-bold text-[#57382E]">
                  {deliveryFee === 0 ? 'GRATIS' : `€${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-3 border-t border-[#F5A16C]/20 flex justify-between text-base font-black text-[#57382E]">
                <span>Totale da Pagare</span>
                <span className="text-2xl text-[#DE7E42]">€{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Dual CTAs: Web Order or WhatsApp Direct */}
            <div className="space-y-3 pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-[#F28BA6] hover:bg-[#D86B86] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#F28BA6]/30 transition-all hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{loading ? 'Salvataggio...' : 'CONFERMA ORDINE SUL SITO'}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full py-3 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>INVIA E ORDINA SU WHATSAPP</span>
              </button>
            </div>

            <div className="pt-2 text-[10px] text-[#9E7D73] text-center space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ordine registrato istantaneamente nel laboratorio.</span>
              </p>
              <p>Nessun addebito preventivo. Paghi al momento della consegna.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
