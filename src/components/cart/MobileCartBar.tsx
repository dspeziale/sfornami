'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';

export const MobileCartBar: React.FC = () => {
  const pathname = usePathname();
  const { totalItemsCount, subtotal, discount, toggleCart } = useCart();
  const { settings } = useSettings();

  // Don't show the bar if cart is empty or user is already in /checkout or /carrello or /admin
  if (totalItemsCount === 0) return null;
  if (pathname === '/checkout' || pathname === '/carrello' || pathname?.startsWith('/admin')) {
    return null;
  }

  const total = Math.max(0, subtotal - discount);

  return (
    <aside
      aria-label="Riepilogo carrello mobile"
      className="lg:hidden fixed bottom-3 left-3 right-3 z-30 animate-fadeIn"
    >
      <div className="bg-[#57382E] text-white rounded-2xl shadow-2xl p-2.5 sm:p-3 border border-[#F5A16C]/40 flex items-center justify-between gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleCart}
          className="flex items-center gap-2 sm:gap-3 text-left focus:outline-hidden min-w-0"
          aria-label="Vedi carrello"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F28BA6] text-white flex items-center justify-center shrink-0 shadow-md">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white text-[#57382E] font-black text-[10px] sm:text-[11px] flex items-center justify-center shadow-xs">
              {totalItemsCount}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#FFE29A] font-bold truncate">
                Carrello ({totalItemsCount} {totalItemsCount === 1 ? 'pz' : 'pz'})
              </p>
              {subtotal >= settings.freeDeliveryThreshold && (
                <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase leading-none">
                  Consegna Gratis
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base font-black leading-tight text-white">
              €{total.toFixed(2)}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href="/checkout"
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#F5A16C] hover:bg-[#DE7E42] text-white font-black text-xs flex items-center gap-1 sm:gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <span>VAI AL CHECKOUT</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
};

