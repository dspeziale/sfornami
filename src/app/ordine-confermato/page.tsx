'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Printer,
  MessageCircle,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DataService } from '@/lib/store';
import { Order } from '@/lib/types';
import { useSettings } from '@/context/SettingsContext';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const { getWhatsAppLink } = useSettings();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire festive celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F28BA6', '#FFE29A', '#F5A16C', '#A8D8BD', '#57382E'],
    });

    if (orderId) {
      DataService.getOrderById(orderId).then(found => {
        setOrder(found);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const waConfirmLink = order
    ? getWhatsAppLink(
        `Ciao SFORNAMÌ! Ho appena confermato l'ordine ${order.orderNumber} sul sito a nome di ${order.customerName}. Grazie!`
      )
    : getWhatsAppLink('Ciao SFORNAMÌ! Ho appena completato un ordine sul vostro sito.');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-8 animate-fadeIn">
      {/* Top Success Badge */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#A8D8BD]/30 border-2 border-[#A8D8BD] flex items-center justify-center text-emerald-600 mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="px-3.5 py-1 rounded-full bg-[#FFE29A] text-[#57382E] text-xs font-black uppercase tracking-wider">
          Ordine Ricevuto con Successo!
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#57382E]">
          Grazie dal Laboratorio SFORNAMÌ!
        </h1>
        <p className="text-sm text-[#7E5649] max-w-md mx-auto">
          Il tuo ordine è stato registrato nel nostro laboratorio. I nostri mastri fornai stanno già scaldando i forni!
        </p>
      </div>

      {/* Main Order Docket Card */}
      {order ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#F5A16C]/25 shadow-xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#F5A16C]/20 gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E7D73]">
                Numero Ordine Univoco
              </span>
              <h2 className="text-2xl font-black text-[#DE7E42]">
                {order.orderNumber}
              </h2>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-[11px] text-[#9E7D73] block">Data ordine</span>
              <span className="text-xs font-bold text-[#57382E]">
                {new Date(order.createdAt).toLocaleString('it-IT')}
              </span>
            </div>
          </div>

          {/* Customer & Reception details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FFF8EF] p-5 rounded-2xl border border-[#F5A16C]/20 text-xs">
            <div className="space-y-1.5">
              <span className="font-bold text-[#DE7E42] uppercase text-[10px] block">
                Dati Cliente
              </span>
              <p className="font-black text-sm text-[#57382E]">{order.customerName}</p>
              <p className="text-[#7E5649]">{order.customerPhone}</p>
              <p className="text-[#7E5649]">{order.customerEmail}</p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-[#DE7E42] uppercase text-[10px] block">
                Modalità di Ricezione
              </span>
              <p className="font-black text-sm text-[#57382E] flex items-center gap-1.5">
                {order.deliveryType === 'pickup' ? '🏪 Ritiro in Laboratorio' : '🛵 Consegna a Domicilio'}
              </p>
              {order.deliveryType === 'pickup' ? (
                <p className="text-[#7E5649]">{INITIAL_STORE_SETTINGS.address}, Roma</p>
              ) : (
                <p className="text-[#7E5649]">
                  {order.deliveryAddress}, {order.deliveryCap} Roma
                </p>
              )}
              <p className="font-bold text-[#57382E]">
                📅 {order.requestedDate} • Fascia: {order.requestedTimeSlot}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#57382E]">
              Prodotti nel pacco:
            </h4>
            <div className="divide-y divide-[#F5A16C]/15 border-y border-[#F5A16C]/20">
              {order.items.map(item => (
                <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#57382E]">{item.quantity}x</span>{' '}
                    <span className="font-semibold text-[#57382E]">{item.productName}</span>
                    {item.variantName && (
                      <span className="block text-[10px] text-[#9E7D73]">
                        {item.variantName}
                      </span>
                    )}
                  </div>
                  <span className="font-black text-[#57382E]">€{item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-xs pt-2">
            <div className="flex justify-between text-[#7E5649]">
              <span>Subtotale</span>
              <span className="font-bold">€{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Sconto applicato</span>
                <span className="font-bold">-€{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#7E5649]">
              <span>Costo consegna</span>
              <span className="font-bold">
                {order.deliveryFee === 0 ? 'GRATIS' : `€${order.deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-lg font-black text-[#57382E] pt-3 border-t border-[#F5A16C]/20">
              <span>Totale Pagamento ({order.paymentMethod === 'pickup' ? 'Al Ritiro' : 'Alla Consegna'})</span>
              <span className="text-2xl text-[#DE7E42]">€{order.total.toFixed(2)}</span>
            </div>
          </div>

          {order.notes && (
            <div className="p-3 bg-[#FFF8EF] rounded-xl text-xs text-[#7E5649] border border-[#F5A16C]/20">
              <strong>Note indicate:</strong> "{order.notes}"
            </div>
          )}

          {/* Actions: Print & WhatsApp */}
          <div className="pt-4 border-t border-[#F5A16C]/20 flex flex-col sm:flex-row items-center gap-3 no-print">
            <a
              href={waConfirmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Avvisa il Forno su WhatsApp con il tuo Codice</span>
            </a>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-[#FFF8EF] hover:bg-white text-[#57382E] border border-[#F5A16C]/30 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-[#DE7E42]" />
              <span>Stampa Ricevuta</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center text-xs text-[#7E5649]">
          Dettagli ordine completati con successo.
        </div>
      )}

      {/* Back to Home CTA */}
      <div className="text-center pt-4 no-print">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#DE7E42] hover:underline"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          <span>Torna alla Homepage di SFORNAMÌ</span>
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-4">
          <div className="text-5xl animate-spin">🌾</div>
          <p className="text-sm font-bold text-[#57382E]">Caricamento conferma...</p>
        </div>
      }
    >
      <OrderConfirmedContent />
    </Suspense>
  );
}

