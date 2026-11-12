'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, MessageCircle, Menu, X, Truck, Sparkles, ChevronRight, PackageCheck } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalItemsCount, toggleCart } = useCart();
  const { getWhatsAppLink } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Il nostro laboratorio', href: '/chi-siamo' },
    { name: 'Panetteria', href: '/panetteria' },
    { name: 'Pasticceria', href: '/pasticceria' },
    { name: 'Torte su ordinazione', href: '/torte-personalizzate', highlight: true },
    { name: 'Contatti', href: '/contatti' },
  ];

  const waLink = getWhatsAppLink(
    'Ciao SFORNAMÌ! Vorrei informazioni sulle vostre bontà artigianali e ordinare con consegna a domicilio.'
  );

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#FFE29A] text-[#57382E] text-xs font-semibold py-1.5 px-3 sm:px-4 border-b border-[#F5A16C]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F28BA6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DE7E42]"></span>
            </span>
            <span className="text-[11px] sm:text-xs leading-tight">
              🥖 Laboratorio artigianale di panetteria e pasticceria a Roma
              <span className="block sm:inline sm:before:content-['•_'] font-bold text-[#DE7E42]">
                Solo ordini online con consegna a domicilio
              </span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-[#DE7E42]">
              <Truck className="w-3.5 h-3.5" />
              Solo Consegna a Domicilio a Roma
            </span>
            <span className="flex items-center gap-1 text-[#57382E]">
              <PackageCheck className="w-3.5 h-3.5 text-[#DE7E42]" />
              Consegne Mar - Dom
            </span>
            <Link href="/admin" className="hover:underline text-[#7E5649]">
              Area Riservata
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#FFF8EF]/95 backdrop-blur-md border-b border-[#F5A16C]/25 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="hover:opacity-95 transition-opacity">
            <Logo variant="main" size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-sm font-bold transition-all relative ${
                    isActive
                      ? 'text-[#57382E] bg-[#FFE29A]/60 shadow-xs'
                      : 'text-[#7E5649] hover:text-[#57382E] hover:bg-white/60'
                  } ${link.highlight ? 'text-[#DE7E42]' : ''}`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.highlight && <Sparkles className="w-3.5 h-3.5 text-[#F28BA6]" />}
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp Icon */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contattaci su WhatsApp"
              className="p-2.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] transition-all hover:scale-105"
              title="Chatta con noi su WhatsApp"
            >
              <MessageCircle className="w-5 h-5 fill-[#25D366] text-white" />
            </a>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 rounded-full bg-white hover:bg-[#FFE29A]/40 text-[#57382E] border border-[#F5A16C]/30 shadow-xs transition-all hover:scale-105"
              aria-label="Apri carrello"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#F28BA6] text-white font-black text-[11px] flex items-center justify-center animate-bounce shadow-md">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* ORDINA ONLINE CTA */}
            <Link
              href="/menu"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-[#F5A16C] hover:bg-[#DE7E42] text-white font-black text-xs md:text-sm tracking-wide shadow-md shadow-[#F5A16C]/30 transition-all hover:scale-105 active:scale-95"
            >
              ORDINA CON CONSEGNA
            </Link>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-xl text-[#57382E] hover:bg-white/80"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFF8EF] border-b border-[#F5A16C]/30 px-5 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
            <div className="space-y-1">
              {navLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold transition-colors ${
                      isActive
                        ? 'bg-[#FFE29A] text-[#57382E]'
                        : 'text-[#7E5649] hover:bg-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.highlight && <Sparkles className="w-4 h-4 text-[#F28BA6]" />}
                      {link.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#9E7D73]" />
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#F5A16C]/20 flex flex-col gap-2.5">
              <Link
                href="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-2xl bg-[#F5A16C] text-white text-center font-black text-sm shadow-md"
              >
                SCOPRI IL CATALOGO E ORDINA A DOMICILIO
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-[#25D366] text-white text-center font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                ORDINA SU WHATSAPP
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-xs text-[#9E7D73] hover:underline pt-1"
              >
                Accesso Amministratore Laboratorio
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
