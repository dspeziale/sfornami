'use client';

import React, { useEffect, useState } from 'react';
import { Eye, ShoppingBag, Clock, Sparkles, ChevronRight, X, Heart } from 'lucide-react';
import { DataService } from '@/lib/store';
import { LiveActivityStats } from '@/lib/types';

export function LiveActivityBanner() {
  const [stats, setStats] = useState<LiveActivityStats | null>(null);
  const [showRecentModal, setShowRecentModal] = useState(false);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);

  useEffect(() => {
    // 1. Fetch live activity stats & record visit
    DataService.getActivityStats(true)
      .then(data => setStats(data))
      .catch(console.warn);

    // 2. Poll every 60 seconds without page reload
    const interval = setInterval(() => {
      DataService.getActivityStats(false)
        .then(data => setStats(data))
        .catch(console.warn);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Cycle through recent orders in ticker if available
  useEffect(() => {
    if (!stats?.recentOrders || stats.recentOrders.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentOrderIndex(prev => (prev + 1) % stats.recentOrders.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [stats?.recentOrders]);

  if (!stats) {
    return (
      <div className="w-full bg-white/70 backdrop-blur-xs rounded-2xl p-2.5 sm:px-4 sm:py-2 border border-[#F5A16C]/20 flex items-center justify-between text-xs animate-pulse">
        <div className="h-4 w-32 bg-[#FFE29A]/40 rounded-full" />
        <div className="h-4 w-44 bg-[#FFE29A]/40 rounded-full hidden sm:block" />
      </div>
    );
  }

  const activeOrder = stats.recentOrders && stats.recentOrders.length > 0
    ? stats.recentOrders[currentOrderIndex]
    : null;

  return (
    <>
      <div className="w-full bg-gradient-to-r from-[#FFF8EF] via-white to-[#FFE29A]/20 rounded-2xl p-2.5 sm:px-4 sm:py-2 border border-[#F5A16C]/25 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Live status and Today's Views */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Live pulsing green dot */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-black text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>OGGI NEL FORNO</span>
          </div>

          {/* Visitors today */}
          <div className="flex items-center gap-1.5 font-bold text-[#57382E]">
            <Eye className="w-3.5 h-3.5 text-[#DE7E42]" />
            <span>
              <strong className="font-black text-[#DE7E42]">{stats.viewsToday}</strong>{' '}
              {stats.viewsToday === 1 ? 'persona ha visitato il catalogo oggi' : 'persone hanno visitato il catalogo oggi'}
            </span>
          </div>
        </div>

        {/* Right: Orders today & Live Ticker */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-[#7E5649]">
          {/* Orders count today */}
          <div className="flex items-center gap-1.5 font-bold text-[#57382E] bg-white/90 px-2.5 py-1 rounded-xl border border-[#F5A16C]/20 shadow-2xs">
            <ShoppingBag className="w-3.5 h-3.5 text-[#DE7E42]" />
            <span>
              {stats.ordersToday > 0 ? (
                <>
                  <strong className="font-black text-[#DE7E42]">{stats.ordersToday}</strong> {stats.ordersToday === 1 ? 'ordine ricevuto oggi' : 'ordini ricevuti oggi'}
                </>
              ) : (
                <>
                  <strong className="font-black text-[#DE7E42]">{stats.totalOrders || 8}</strong> ordini sfornati
                </>
              )}
            </span>
          </div>

          {/* Recent order ticker pill */}
          {activeOrder && (
            <button
              onClick={() => setShowRecentModal(true)}
              className="flex items-center gap-1.5 font-semibold text-[#57382E] hover:text-[#DE7E42] hover:bg-white/80 px-2 py-1 rounded-xl transition-all group"
              title="Clicca per vedere le ultime ordinazioni"
            >
              <Clock className="w-3 h-3 text-[#DE7E42]" />
              <span className="line-clamp-1 text-[11px]">
                Ultimo ordine: <strong>{activeOrder.customerName}</strong> ({activeOrder.productSummary}) • <em>{activeOrder.timeAgo}</em>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#DE7E42] group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* POPUP MODAL: ULTIMI ORDINI RICEVUTI */}
      {showRecentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-[#F5A16C]/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5A16C]/20">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎂</span>
                <div>
                  <h3 className="text-base font-black text-[#57382E]">Attività & Ordini Recenti</h3>
                  <p className="text-[11px] text-[#7E5649]">Dolci artigianali appena ordinati a Roma</p>
                </div>
              </div>
              <button
                onClick={() => setShowRecentModal(false)}
                className="w-8 h-8 rounded-full bg-[#FFF8EF] text-[#7E5649] flex items-center justify-center font-black hover:bg-[#FFE29A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map(ord => (
                  <div
                    key={ord.id}
                    className="p-3 rounded-2xl bg-[#FFF8EF] border border-[#F5A16C]/20 space-y-1 text-xs"
                  >
                    <div className="flex justify-between items-center font-bold text-[#57382E]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <strong>{ord.customerName}</strong> da {ord.city}
                      </span>
                      <span className="text-[10px] text-[#7E5649]">{ord.timeAgo}</span>
                    </div>
                    <p className="text-[11px] text-[#DE7E42] font-black pl-3.5">
                      {ord.productSummary}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#7E5649] text-center py-4">
                  Nessun ordine recente registrato.
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-[#F5A16C]/15 flex items-center justify-between text-[11px] text-[#7E5649]">
              <span>Totale visite registrate oggi: <strong>{stats.viewsToday}</strong></span>
              <button
                onClick={() => setShowRecentModal(false)}
                className="px-3 py-1.5 rounded-xl bg-[#57382E] text-white font-black hover:bg-[#3d2720]"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
