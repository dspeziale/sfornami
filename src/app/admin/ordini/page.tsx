'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Filter,
  Printer,
  MessageCircle,
  Phone,
  Eye,
  CheckCircle2,
  XCircle,
  Truck,
  Store,
  RefreshCw,
  X,
} from 'lucide-react';
import { DataService } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

function OrdersContent() {
  const searchParams = useSearchParams();
  const highlightedId = searchParams.get('id');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    const data = await DataService.getOrders();
    setOrders(data);
    if (highlightedId) {
      const found = data.find(o => o.id === highlightedId || o.orderNumber === highlightedId);
      if (found) setSelectedOrder(found);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [highlightedId]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await DataService.updateOrderStatus(orderId, newStatus);
    await loadOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }
    return true;
  });

  const statusBadges: Record<OrderStatus, { bg: string; text: string; label: string }> = {
    nuovo: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Nuovo' },
    da_confermare: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Da Confermare' },
    confermato: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Confermato' },
    in_preparazione: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In Preparazione' },
    pronto: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Pronto per Ritiro' },
    consegnato: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Consegnato / Evaso' },
    annullato: { bg: 'bg-red-100', text: 'text-red-800', label: 'Annullato' },
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#DE7E42]">
            Backoffice Forno
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#57382E]">
            Gestione Ordini Ricevuti
          </h1>
          <p className="text-xs text-[#7E5649]">
            Visualizza, aggiorna gli stati, stampa la comanda o contatta i clienti con un tap.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="p-2.5 rounded-xl bg-white border border-[#F5A16C]/30 text-[#57382E] hover:bg-[#FFE29A]/30 text-xs font-bold flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Ricarica</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#F5A16C]/25 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#9E7D73]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cerca per n. ordine (es. SFN-2026-1001), nome o telefono..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(['all', 'nuovo', 'confermato', 'in_preparazione', 'pronto', 'consegnato', 'annullato'] as const).map(
            st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-[#57382E] text-white shadow-xs'
                    : 'bg-[#FFF8EF] text-[#7E5649] hover:bg-white border border-[#F5A16C]/25'
                }`}
              >
                {st === 'all' ? 'Tutti gli Stati' : statusBadges[st].label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border-2 border-[#F5A16C]/25 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#F5A16C]/20 bg-[#FFF8EF]/60 text-[#7E5649] font-black uppercase text-[10px]">
                <th className="py-3 px-4">Codice Ordine</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Tipo & Indirizzo</th>
                <th className="py-3 px-4">Data & Orario</th>
                <th className="py-3 px-4">Totale</th>
                <th className="py-3 px-4">Stato Lavorazione</th>
                <th className="py-3 px-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5A16C]/15">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#9E7D73]">
                    Nessun ordine trovato con i filtri correnti.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const badge = statusBadges[order.status] || statusBadges.nuovo;
                  const waCustomerLink = `https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Ciao ${order.customerName}! Ti contattiamo dal laboratorio SFORNAMÌ per il tuo ordine ${order.orderNumber}.`
                  )}`;

                  return (
                    <tr key={order.id} className="hover:bg-[#FFF8EF]/50 transition-colors">
                      <td className="py-3 px-4 font-black text-sm text-[#57382E]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-[#57382E]">{order.customerName}</p>
                        <p className="text-[10px] text-[#9E7D73]">{order.customerPhone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-[#57382E]">
                          {order.deliveryType === 'pickup' ? (
                            <>
                              <Store className="w-3.5 h-3.5 text-[#DE7E42]" /> Ritiro Forno
                            </>
                          ) : (
                            <>
                              <Truck className="w-3.5 h-3.5 text-blue-600" /> Domicilio: {order.deliveryCap}
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#57382E]">{order.requestedDate}</p>
                        <p className="text-[10px] text-[#9E7D73]">{order.requestedTimeSlot}</p>
                      </td>
                      <td className="py-3 px-4 font-black text-sm text-[#57382E]">
                        €{order.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border-0 cursor-pointer ${badge.bg} ${badge.text}`}
                        >
                          <option value="nuovo">Nuovo</option>
                          <option value="da_confermare">Da Confermare</option>
                          <option value="confermato">Confermato</option>
                          <option value="in_preparazione">In Preparazione</option>
                          <option value="pronto">Pronto per Ritiro</option>
                          <option value="consegnato">Consegnato</option>
                          <option value="annullato">Annullato</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={waCustomerLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                            title="WhatsApp al cliente"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 rounded-xl bg-[#57382E] text-white hover:bg-[#7E5649] transition-colors"
                            title="Apri scheda ordine"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center animate-fadeIn">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border-2 border-[#F5A16C]/30 shadow-2xl z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F5A16C]/20">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#9E7D73]">Scheda Comanda</span>
                <h3 className="text-xl font-black text-[#57382E]">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-[#57382E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Reception info */}
            <div className="grid grid-cols-2 gap-4 bg-[#FFF8EF] p-4 rounded-2xl text-xs">
              <div>
                <p className="font-bold text-[#DE7E42] uppercase text-[10px]">Cliente</p>
                <p className="font-bold text-[#57382E] text-sm">{selectedOrder.customerName}</p>
                <p className="text-[#7E5649]">{selectedOrder.customerPhone}</p>
                <p className="text-[#7E5649]">{selectedOrder.customerEmail}</p>
              </div>
              <div>
                <p className="font-bold text-[#DE7E42] uppercase text-[10px]">Ritiro / Consegna</p>
                <p className="font-bold text-[#57382E]">
                  {selectedOrder.deliveryType === 'pickup' ? '🏪 In Laboratorio' : '🛵 Consegna a Domicilio'}
                </p>
                {selectedOrder.deliveryAddress && (
                  <p className="text-[#7E5649]">{selectedOrder.deliveryAddress}, {selectedOrder.deliveryCap}</p>
                )}
                <p className="font-black text-[#DE7E42]">
                  {selectedOrder.requestedDate} • {selectedOrder.requestedTimeSlot}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-[#57382E]">Prodotti Ordinati:</h4>
              <div className="divide-y divide-[#F5A16C]/15 border-y border-[#F5A16C]/20">
                {selectedOrder.items.map(i => (
                  <div key={i.id} className="py-2.5 flex justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#57382E]">{i.quantity}x</span> {i.productName}
                      {i.variantName && (
                        <span className="block text-[10px] text-[#9E7D73]">Variante: {i.variantName}</span>
                      )}
                    </div>
                    <span className="font-black text-[#57382E]">€{i.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-between items-center text-sm font-black text-[#57382E] pt-2">
              <span>Totale da Incassare ({selectedOrder.paymentMethod}):</span>
              <span className="text-xl text-[#DE7E42]">€{selectedOrder.total.toFixed(2)}</span>
            </div>

            {selectedOrder.notes && (
              <div className="p-3 bg-[#FFF8EF] rounded-xl text-xs text-[#7E5649] border border-[#F5A16C]/20">
                <strong>Note cliente:</strong> "{selectedOrder.notes}"
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-[#F5A16C]/20 flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-white border border-[#F5A16C]/30 text-[#57382E] text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-[#DE7E42]" />
                <span>Stampa Comanda</span>
              </button>
              <a
                href={`https://wa.me/${selectedOrder.customerPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold">Caricamento ordini...</div>}>
      <OrdersContent />
    </Suspense>
  );
}

