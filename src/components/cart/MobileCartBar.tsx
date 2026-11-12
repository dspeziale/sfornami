'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const MobileCartBar: React.FC = () => {
  const pathname = usePathname();
  const { totalItemsCount, subtotal, discount, toggleCart } = useCart();

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
      <div className="bg-[#57382E] text-white rounded-2xl shadow-2xl p-3 border border-[#F5A16C]/40 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={toggleCart}
          className="flex items-center gap-3 text-left focus:outline-hidden"
          aria-label="Vedi carrello"
        >
          <div className="relative w-10 h-10 rounded-xl bg-[#F28BA6] text-white flex items-center justify-center shrink-0 shadow-md">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-[#57382E] font-black text-[11px] flex items-center justify-center shadow-xs">
              {totalItemsCount}
            </span>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#FFE29A] font-bold">
              Carrello ({totalItemsCount} {totalItemsCount === 1 ? 'prodotto' : 'prodotti'})
            </p>
            <p className="text-base font-black leading-tight text-white">
              €{total.toFixed(2)}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <Link
            href="/checkout"
            className="px-4 py-2.5 rounded-xl bg-[#F5A16C] hover:bg-[#DE7E42] text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <span>ORDINA</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
