'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Truck,
  Store,
  CreditCard,
  Banknote,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { DataService } from '@/lib/store';
import { DeliveryType, PaymentMethod, TimeSlot, StoreSettings } from '@/lib/types';
import { INITIAL_STORE_SETTINGS, INITIAL_TIME_SLOTS } from '@/lib/initialData';
import { generateWhatsAppOrderMessage } from '@/lib/whatsapp';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, clearCart } = useCart();

  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(INITIAL_TIME_SLOTS);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('Roma');
  const [deliveryCap, setDeliveryCap] = useState('00186');

  const [tomorrow, setTomorrow] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedTimeSlot, setRequestedTimeSlot] = useState(
    INITIAL_TIME_SLOTS.filter(s => s.type === 'pickup')[0]?.label || '09:00 - 10:30'
  );

  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pickup');

  useEffect(() => {
    const tmr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    setTomorrow(tmr);
    setRequestedDate(tmr);
    DataService.getSettings().then(s => setSettings(s));
    DataService.getTimeSlots().then(slots => setTimeSlots(slots));
  }, []);

  // Update available slot when delivery type switches
  useEffect(() => {
    const validSlots = timeSlots.filter(s => s.type === deliveryType && s.isActive);
    if (validSlots.length > 0) {
      setRequestedTimeSlot(validSlots[0].label);
    }
  }, [deliveryType, timeSlots]);

  // Delivery fee calculation
  const deliveryFee =
    deliveryType === 'delivery'
      ? subtotal >= settings.freeDeliveryThreshold
        ? 0
        : settings.deliveryFee
      : 0;

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

    if (deliveryType === 'delivery') {
      if (!deliveryAddress) {
        setErrorMsg('Inserisci l’indirizzo completo per la consegna a domicilio a Roma.');
        return;
      }
      if (subtotal < settings.minOrderDelivery) {
        setErrorMsg(`L'ordine minimo per la consegna a domicilio è di €${settings.minOrderDelivery.toFixed(2)}.`);
        return;
      }
      if (!isCapServito) {
        setErrorMsg(`Il CAP ${deliveryCap} non è al momento coperto dal nostro servizio express. Contattaci su WhatsApp per accordi speciali.`);
        return;
      }
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
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
        deliveryCity: deliveryType === 'delivery' ? deliveryCity : undefined,
        deliveryCap: deliveryType === 'delivery' ? deliveryCap : undefined,
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

    const waUrl = generateWhatsAppOrderMessage({
      items,
      customerName,
      customerPhone,
      deliveryType,
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
          Scegli dal catalogo le tue prelibatezze artigianali prima di procedere al checkout.
        </p>
        <Link
          href="/menu"
          className="inline-flex px-6 py-3 rounded-full bg-[#F5A16C] text-white font-bold text-xs"
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
          Passo Finale
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#57382E]">
          Completa il Tuo Ordine
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
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

          {/* 2. Modalità di Ricezione */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-xs space-y-5">
            <h3 className="text-base font-black text-[#57382E] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FFE29A] text-xs font-black flex items-center justify-center">2</span>
              <span>Modalità di Ricezione</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pickup Option */}
              <button
                type="button"
                onClick={() => {
                  setDeliveryType('pickup');
                  setPaymentMethod('pickup');
                }}
                className={`p-5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between space-y-2 ${
                  deliveryType === 'pickup'
                    ? 'bg-[#FFE29A]/50 border-[#DE7E42] shadow-sm'
                    : 'bg-[#FFF8EF]/50 border-[#F5A16C]/25 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#57382E]">
                    <Store className="w-5 h-5 text-[#DE7E42]" />
                    <span className="text-sm font-black">RITIRO IN LABORATORIO</span>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    GRATIS
                  </span>
                </div>
                <p className="text-[11px] text-[#7E5649] leading-relaxed">
                  Passa a trovarci in <strong>{settings.address}, Roma</strong>. Salta la fila, il tuo pacco ti aspetta pronto e caldo!
                </p>
              </button>

              {/* Home Delivery Option */}
              <button
                type="button"
                onClick={() => {
                  setDeliveryType('delivery');
                  setPaymentMethod('cash_on_delivery');
                }}
                className={`p-5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between space-y-2 ${
                  deliveryType === 'delivery'
                    ? 'bg-[#FFE29A]/50 border-[#DE7E42] shadow-sm'
                    : 'bg-[#FFF8EF]/50 border-[#F5A16C]/25 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#57382E]">
                    <Truck className="w-5 h-5 text-[#DE7E42]" />
                    <span className="text-sm font-black">CONSEGNA A DOMICILIO</span>
                  </div>
                  <span className="text-xs font-black text-[#57382E]">
                    {subtotal >= settings.freeDeliveryThreshold ? 'GRATIS' : `€${settings.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <p className="text-[11px] text-[#7E5649] leading-relaxed">
                  Consegna rapida a Roma centro e quartieri serviti. Gratuita per ordini sopra €{settings.freeDeliveryThreshold}.
                </p>
              </button>
            </div>

            {/* Address input if Delivery */}
            {deliveryType === 'delivery' && (
              <div className="p-4 bg-[#FFF8EF] rounded-2xl border border-[#F5A16C]/30 space-y-3 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8">
                    <label className="text-[11px] font-bold text-[#57382E] block mb-1">
                      Indirizzo di Consegna (Via, Civico, Piano, Scala)*
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
                    ⚠️ Il CAP {deliveryCap} non è nell'elenco standard express ({settings.servedCaps.join(', ')}). Puoi comunque inviarci l'ordine o scriverci su WhatsApp per verificare la consegna speciale.
                  </p>
                )}
              </div>
            )}

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F5A16C]/15">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#57382E] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#DE7E42]" />
                  <span>Data Richiesta*</span>
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
                  <span>Fascia Oraria Desiderata*</span>
                </label>
                <select
                  value={requestedTimeSlot}
                  onChange={e => setRequestedTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-bold text-[#57382E]"
                >
                  {timeSlots
                    .filter(s => s.type === deliveryType && s.isActive)
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
                Note per il forno o per il fattorino
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Es. Citofono De Angelis scala B, gradita mollica ben cotta per il pane..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
              />
            </div>
          </div>

          {/* 3. Metodo di Pagamento */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-xs space-y-4">
            <h3 className="text-base font-black text-[#57382E] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FFE29A] text-xs font-black flex items-center justify-center">3</span>
              <span>Metodo di Pagamento</span>
            </h3>

            <div className="space-y-2">
              {deliveryType === 'pickup' ? (
                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFE29A]/40 border border-[#DE7E42] cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'pickup'}
                    onChange={() => setPaymentMethod('pickup')}
                    className="text-[#DE7E42]"
                  />
                  <div className="text-xs">
                    <p className="font-black text-[#57382E]">Pagamento al ritiro in laboratorio</p>
                    <p className="text-[#7E5649]">Contanti, Bancomat, Carta di Credito o Satispay alla cassa del forno.</p>
                  </div>
                </label>
              ) : (
                <>
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
                      <p className="text-[#7E5649]">Paga direttamente al fattorino al momento della ricezione.</p>
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
                      <p className="text-[#7E5649]">Il nostro corriere dispone di POS contactless portatile.</p>
                    </div>
                  </label>
                </>
              )}

              {/* Stripe notification badge */}
              <div className="p-3 bg-white rounded-2xl border border-dashed border-[#F5A16C]/40 text-[11px] text-[#7E5649] flex items-center justify-between">
                <span>💳 Pagamento con Carta Online (Stripe):</span>
                <span className="font-bold text-[#DE7E42]">Attivabile da Pannello Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Card & Confirm Buttons */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-lg space-y-5">
            <h3 className="text-base font-black text-[#57382E]">Riepilogo Ordine ({items.reduce((acc, i) => acc + i.quantity, 0)} pezzi)</h3>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="truncate max-w-[190px]">
                    <span className="font-bold text-[#57382E]">{item.quantity}x</span> {item.product.name}
                    {item.selectedVariant && (
                      <span className="block text-[10px] text-[#9E7D73]">
                        {item.selectedVariant.name}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-[#57382E]">
                    €{((item.product.price + (item.selectedVariant?.priceModifier || 0)) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-[#7E5649] pt-3 border-t border-[#F5A16C]/20">
              <div className="flex justify-between">
                <span>Subtotale</span>
                <span className="font-bold text-[#57382E]">€{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Sconto</span>
                  <span>-€{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Spese di consegna</span>
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
              <p>Nessun addebito preventivo. Paghi al momento della ricezione.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
