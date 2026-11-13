'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cake,
  ArrowRight,
  MessageCircle,
  Plus,
  RefreshCw,
  Truck,
  Store,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { DataService } from '@/lib/store';
import { CustomCakeRequest, Order, OrderStatus } from '@/lib/types';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cakeRequests, setCakeRequests] = useState<CustomCakeRequest[]>([]);
  const [settings, setSettings] = useState(INITIAL_STORE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [todayStr, setTodayStr] = useState('');

  const loadData = async () => {
    setLoading(true);
    setTodayStr(new Date().toISOString().split('T')[0]);
    const [fetchedOrders, fetchedCakes, fetchedSettings] = await Promise.all([
      DataService.getOrders(),
      DataService.getCustomCakeRequests(),
      DataService.getSettings(),
    ]);
    setOrders(fetchedOrders);
    setCakeRequests(fetchedCakes);
    if (fetchedSettings) setSettings(fetchedSettings);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await DataService.updateOrderStatus(orderId, newStatus);
    await loadData();
  };

  // KPIs
  const todayOrders = orders.filter(o => o.requestedDate === todayStr || (todayStr && o.createdAt.startsWith(todayStr)));
  const newOrdersCount = orders.filter(o => o.status === 'nuovo').length;
  const inPrepCount = orders.filter(o => o.status === 'in_preparazione').length;
  const readyCount = orders.filter(o => o.status === 'pronto').length;
  const completedCount = orders.filter(o => o.status === 'consegnato').length;
  const pendingCakesCount = cakeRequests.filter(c => c.status === 'in_valutazione').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'annullato')
    .reduce((acc, o) => acc + o.total, 0);

  const statusColors: Record<OrderStatus, { bg: string; text: string; label: string }> = {
    nuovo: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Nuovo' },
    da_confermare: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Da Confermare' },
    confermato: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Confermato' },
    in_preparazione: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In Preparazione' },
    pronto: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Pronto per il Ritiro' },
    consegnato: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completato / Consegnato' },
    annullato: { bg: 'bg-red-100', text: 'text-red-800', label: 'Annullato' },
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#DE7E42]">
            Panoramica Laboratorio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#57382E]">
            Buongiorno, SFORNAMÌ! 🥖
          </h1>
          <p className="text-xs text-[#7E5649]">
            Ecco la situazione aggiornata degli ordini e delle preparazioni in tempo reale.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-white border border-[#F5A16C]/30 text-[#57382E] hover:bg-[#FFE29A]/30 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            title="Ricarica dati"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Aggiorna</span>
          </button>

          <Link
            href="/admin/homepage"
            className="px-4 py-2.5 rounded-xl bg-[#57382E] hover:bg-[#7E5649] text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE29A]" />
            <span>Modifica Homepage</span>
          </Link>

          <Link
            href="/admin/prodotti"
            className="px-4 py-2.5 rounded-xl bg-[#F5A16C] hover:bg-[#DE7E42] text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Nuovo Prodotto</span>
          </Link>
        </div>
      </div>

      {/* Delivery & Addons quick summary bar */}
      <div className="bg-linear-to-r from-[#FFE29A]/40 via-[#FFF8EF] to-[#FEEFE6]/60 rounded-3xl p-4 sm:p-5 border border-[#F5A16C]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#DE7E42] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-[#57382E] tracking-wider">
              Regole Consegna a Domicilio Attive
            </h4>
            <p className="text-xs text-[#7E5649]">
              Costo Consegna: <strong className="text-[#DE7E42]">€{settings.deliveryFee.toFixed(2)}</strong> • Spedizione GRATIS da: <strong className="text-emerald-700">€{settings.freeDeliveryThreshold.toFixed(2)}</strong> • Minimo d'ordine: <strong>€{settings.minOrderDelivery.toFixed(2)}</strong>
            </p>
          </div>
        </div>

        <Link
          href="/admin/impostazioni"
          className="px-4 py-2 rounded-xl bg-white text-[#57382E] hover:bg-[#FFE29A] border border-[#F5A16C]/40 text-xs font-bold transition-all shadow-xs shrink-0"
        >
          ⚙️ Configura Spese di Consegna
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Ordini Oggi */}
        <div className="bg-white p-4 rounded-3xl border border-[#F5A16C]/20 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#9E7D73] block">Ordini di Oggi</span>
          <p className="text-2xl font-black text-[#57382E]">{todayOrders.length}</p>
          <span className="text-[10px] text-[#DE7E42] font-semibold">Per ritiro/consegna</span>
        </div>

        {/* Nuovi Ordini */}
        <div className="bg-white p-4 rounded-3xl border border-blue-200 shadow-xs space-y-1 bg-blue-50/30">
          <span className="text-[10px] font-bold uppercase text-blue-700 block">Nuovi da gestire</span>
          <p className="text-2xl font-black text-blue-700">{newOrdersCount}</p>
          <span className="text-[10px] text-blue-600 font-semibold">In attesa</span>
        </div>

        {/* In Preparazione */}
        <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-xs space-y-1 bg-amber-50/30">
          <span className="text-[10px] font-bold uppercase text-amber-700 block">Da Preparare</span>
          <p className="text-2xl font-black text-amber-700">{inPrepCount}</p>
          <span className="text-[10px] text-amber-600 font-semibold">In forno / laboratorio</span>
        </div>

        {/* Pronti */}
        <div className="bg-white p-4 rounded-3xl border border-emerald-200 shadow-xs space-y-1 bg-emerald-50/30">
          <span className="text-[10px] font-bold uppercase text-emerald-700 block">Ordini Pronti</span>
          <p className="text-2xl font-black text-emerald-700">{readyCount}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Pronti per ritiro/invio</span>
        </div>

        {/* Torte su Misura */}
        <div className="bg-white p-4 rounded-3xl border border-[#F28BA6]/40 shadow-xs space-y-1 bg-[#FDE8ED]/30">
          <span className="text-[10px] font-bold uppercase text-[#D86B86] block">Torte su Misura</span>
          <p className="text-2xl font-black text-[#D86B86]">{pendingCakesCount}</p>
          <span className="text-[10px] text-[#D86B86] font-semibold">Richieste da valutare</span>
        </div>

        {/* Totale Vendite */}
        <div className="bg-white p-4 rounded-3xl border border-[#FFE29A] shadow-xs space-y-1 bg-[#FFE29A]/20">
          <span className="text-[10px] font-bold uppercase text-[#57382E] block">Totale Vendite</span>
          <p className="text-2xl font-black text-[#57382E]">€{totalRevenue.toFixed(0)}</p>
          <span className="text-[10px] text-emerald-700 font-bold">{completedCount} evasi</span>
        </div>
      </div>

      {/* Live Orders Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-[#F5A16C]/25 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#DE7E42]" />
            <h2 className="text-base sm:text-lg font-black text-[#57382E]">
              Ultimi Ordini Ricevuti ({orders.length})
            </h2>
          </div>
          <Link
            href="/admin/ordini"
            className="text-xs font-bold text-[#DE7E42] hover:underline flex items-center gap-1"
          >
            <span>Tutti gli ordini</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#F5A16C]/20 text-[#7E5649] font-black uppercase text-[10px]">
                <th className="py-2.5 px-3">Ordine</th>
                <th className="py-2.5 px-3">Cliente</th>
                <th className="py-2.5 px-3">Ritiro / Consegna</th>
                <th className="py-2.5 px-3">Data & Ora</th>
                <th className="py-2.5 px-3">Importo</th>
                <th className="py-2.5 px-3">Stato</th>
                <th className="py-2.5 px-3 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5A16C]/15">
              {orders.slice(0, 5).map(order => {
                const badge = statusColors[order.status] || statusColors.nuovo;
                const waCustomerLink = `https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Ciao ${order.customerName}! Ti contattiamo dal laboratorio SFORNAMÌ in merito al tuo ordine ${order.orderNumber}.`
                )}`;

                return (
                  <tr key={order.id} className="hover:bg-[#FFF8EF]/50 transition-colors">
                    <td className="py-3 px-3 font-black text-[#57382E]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#57382E]">{order.customerName}</p>
                      <p className="text-[10px] text-[#9E7D73]">{order.customerPhone}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#57382E]">
                        {order.deliveryType === 'pickup' ? (
                          <>
                            <Store className="w-3.5 h-3.5 text-[#DE7E42]" /> Ritiro Forno
                          </>
                        ) : (
                          <>
                            <Truck className="w-3.5 h-3.5 text-blue-600" /> A Domicilio
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-[#57382E]">{order.requestedDate}</p>
                      <p className="text-[10px] text-[#9E7D73]">{order.requestedTimeSlot}</p>
                    </td>
                    <td className="py-3 px-3 font-black text-sm text-[#57382E]">
                      €{order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      {/* Interactive Status Changer directly from dashboard */}
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-xl border-0 cursor-pointer ${badge.bg} ${badge.text}`}
                      >
                        <option value="nuovo">Nuovo</option>
                        <option value="confermato">Confermato</option>
                        <option value="in_preparazione">In Preparazione</option>
                        <option value="pronto">Pronto</option>
                        <option value="consegnato">Consegnato</option>
                        <option value="annullato">Annullato</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={waCustomerLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                          title="Scrivi su WhatsApp al cliente"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          href={`/admin/ordini?id=${order.id}`}
                          className="px-2.5 py-1 rounded-lg bg-[#57382E] text-white text-[11px] font-bold hover:bg-[#7E5649]"
                        >
                          Dettagli
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Cakes Pending Evaluation */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-[#F5A16C]/25 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cake className="w-5 h-5 text-[#F28BA6]" />
            <h2 className="text-base sm:text-lg font-black text-[#57382E]">
              Richieste Torte Personalizzate da Valutare ({pendingCakesCount})
            </h2>
          </div>
          <Link
            href="/admin/torte"
            className="text-xs font-bold text-[#DE7E42] hover:underline flex items-center gap-1"
          >
            <span>Tutte le richieste</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {cakeRequests.length === 0 ? (
          <p className="text-xs text-[#9E7D73] py-4 text-center">Nessuna richiesta torte presente.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cakeRequests.slice(0, 2).map(cake => (
              <div
                key={cake.id}
                className="bg-[#FFF8EF] rounded-2xl p-4 border border-[#F5A16C]/25 space-y-2 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-[#57382E] text-sm">{cake.cakeType}</h4>
                    <p className="text-[11px] text-[#7E5649] font-medium">
                      Cliente: {cake.customerName} ({cake.customerPhone})
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {cake.status}
                  </span>
                </div>

                <p className="text-[#57382E]">
                  <strong>Porzioni:</strong> {cake.servings} fette • <strong>Data:</strong> {cake.requestedDate} ({cake.requestedTime})
                </p>
                <p className="text-[#7E5649] line-clamp-1">
                  <strong>Farcitura:</strong> {cake.filling}
                </p>
                {cake.customText && (
                  <p className="text-[#D86B86] italic font-semibold">
                    Scritta: "{cake.customText}"
                  </p>
                )}

                <div className="pt-2 flex justify-end">
                  <Link
                    href="/admin/torte"
                    className="px-3 py-1.5 rounded-xl bg-[#DE7E42] text-white text-[11px] font-bold hover:bg-[#DE7E42]/90"
                  >
                    Valuta & Invia Preventivo
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
