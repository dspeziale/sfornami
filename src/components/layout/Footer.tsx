'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, MessageCircle, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '@/components/common/SocialIcons';
import { Logo } from '@/components/brand/Logo';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

export const Footer: React.FC = () => {
  const currentYear = 2026;

  return (
    <footer className="bg-[#57382E] text-[#FFF8EF] border-t-4 border-[#F5A16C] mt-20">
      {/* Top Value Banner */}
      <div className="bg-[#432A22] py-8 border-b border-[#7E5649]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE29A] flex items-center justify-center text-2xl shrink-0">
              🌾
            </div>
            <div>
              <h4 className="font-bold text-[#FFE29A] text-sm uppercase tracking-wide">
                100% Lievito Madre & Grani Italiani
              </h4>
              <p className="text-xs text-[#FFF8EF]/80">
                Impasti digeribili a fermentazione naturale lenta di 24-48 ore.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#F28BA6] flex items-center justify-center text-2xl shrink-0">
              🧁
            </div>
            <div>
              <h4 className="font-bold text-[#FFE29A] text-sm uppercase tracking-wide">
                Fatto a Mano a Roma
              </h4>
              <p className="text-xs text-[#FFF8EF]/80">
                Pasticceria fresca ogni mattina, burro di fattoria e uova biologiche.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#A8D8BD] flex items-center justify-center text-2xl shrink-0">
              🛵
            </div>
            <div>
              <h4 className="font-bold text-[#FFE29A] text-sm uppercase tracking-wide">
                Ritiro Rapido & Consegna a Roma
              </h4>
              <p className="text-xs text-[#FFF8EF]/80">
                Prenota online o su WhatsApp e ritira caldo senza attese.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="main" size="md" className="brightness-125" />
            <p className="text-sm text-[#FFF8EF]/80 leading-relaxed max-w-sm">
              SFORNAMÌ è il laboratorio artigianale di panetteria e pasticceria nel cuore di Roma. Uniamo la grande tradizione dei forni romani con un tocco contemporaneo, allegro e genuino.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={INITIAL_STORE_SETTINGS.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#7E5649] hover:bg-[#F28BA6] flex items-center justify-center text-white transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href={`https://instagram.com/${INITIAL_STORE_SETTINGS.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#7E5649] hover:bg-[#F28BA6] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${INITIAL_STORE_SETTINGS.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] flex items-center justify-center text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
              </a>
            </div>
          </div>

          {/* Catalogo Bontà */}
          <div className="space-y-3">
            <h5 className="text-sm font-black uppercase tracking-wider text-[#FFE29A]">
              Le Nostre Bontà
            </h5>
            <ul className="space-y-2 text-sm text-[#FFF8EF]/80">
              <li>
                <Link href="/panetteria" className="hover:text-[#F28BA6] transition-colors">
                  Pane Casereccio & Integrale
                </Link>
              </li>
              <li>
                <Link href="/panetteria" className="hover:text-[#F28BA6] transition-colors">
                  Pizza Bianca Romana alla Pala
                </Link>
              </li>
              <li>
                <Link href="/pasticceria" className="hover:text-[#F28BA6] transition-colors">
                  Maritozzi Romani con Panna
                </Link>
              </li>
              <li>
                <Link href="/pasticceria" className="hover:text-[#F28BA6] transition-colors">
                  Crostate & Biscotti da Tè
                </Link>
              </li>
              <li>
                <Link href="/torte-personalizzate" className="hover:text-[#F28BA6] transition-colors flex items-center gap-1 font-semibold text-[#FFE29A]">
                  <Sparkles className="w-3.5 h-3.5 text-[#F28BA6]" />
                  Torte su Ordinazione
                </Link>
              </li>
              <li>
                <Link href="/menu?cat=specialita-stagionali" className="hover:text-[#F28BA6] transition-colors">
                  Specialità Stagionali
                </Link>
              </li>
            </ul>
          </div>

          {/* Il Laboratorio */}
          <div className="space-y-3">
            <h5 className="text-sm font-black uppercase tracking-wider text-[#FFE29A]">
              SFORNAMÌ
            </h5>
            <ul className="space-y-2 text-sm text-[#FFF8EF]/80">
              <li>
                <Link href="/chi-siamo" className="hover:text-[#F28BA6] transition-colors">
                  La Nostra Storia
                </Link>
              </li>
              <li>
                <Link href="/chi-siamo#ingredienti" className="hover:text-[#F28BA6] transition-colors">
                  Lievito Madre & Ingredienti
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="hover:text-[#F28BA6] transition-colors">
                  Dove Siamo a Roma
                </Link>
              </li>
              <li>
                <Link href="/allergeni" className="hover:text-[#F28BA6] transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A8D8BD]" />
                  Tabella Allergeni UE
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#FFE29A] text-xs text-[#FFF8EF]/60 pt-2 block">
                  Pannello Amministratore
                </Link>
              </li>
            </ul>
          </div>

          {/* Orari e Dove Trovarci */}
          <div className="space-y-3">
            <h5 className="text-sm font-black uppercase tracking-wider text-[#FFE29A]">
              Vieni a Trovarci
            </h5>
            <div className="space-y-2 text-xs text-[#FFF8EF]/80 leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F5A16C] shrink-0 mt-0.5" />
                <span>
                  {INITIAL_STORE_SETTINGS.address}
                  <br />
                  {INITIAL_STORE_SETTINGS.cap} {INITIAL_STORE_SETTINGS.city} (Centro Storico)
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F5A16C] shrink-0" />
                <span>{INITIAL_STORE_SETTINGS.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F5A16C] shrink-0" />
                <span>{INITIAL_STORE_SETTINGS.email}</span>
              </p>
              <div className="pt-2 border-t border-[#7E5649]/40 mt-2">
                <p className="font-bold text-[#FFE29A] flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  Orari Laboratorio:
                </p>
                <p>Mar - Sab: 07:30 - 19:30</p>
                <p>Domenica: 08:00 - 13:30</p>
                <p className="text-[#F28BA6] font-semibold">Lunedì: Chiuso per impasti</p>
              </div>
            </div>
          </div>
        </div>

        {/* Local SEO keywords pill badges */}
        <div className="mt-12 pt-8 border-t border-[#7E5649]/40">
          <p className="text-[11px] text-[#FFF8EF]/60 mb-2 font-medium">Specialità artigianali a Roma:</p>
          <div className="flex flex-wrap gap-2 text-[10px] text-[#FFE29A]/80">
            <span className="px-2.5 py-1 rounded-full bg-[#432A22]">Panetteria artigianale Roma centro</span>
            <span className="px-2.5 py-1 rounded-full bg-[#432A22]">Pizza bianca romana alla pala</span>
            <span className="px-2.5 py-1 rounded-full bg-[#432A22]">Maritozzo con panna fresca Roma</span>
            <span className="px-2.5 py-1 rounded-full bg-[#432A22]">Torte compleanno su ordinazione Roma</span>
            <span className="px-2.5 py-1 rounded-full bg-[#432A22]">Crostata di visciole romane</span>
            <span className="px-2.5 py-1 rounded-full bg-[#432A22]">Pane a lievitazione naturale 48h</span>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="mt-8 pt-6 border-t border-[#7E5649]/40 flex flex-col md:flex-row items-center justify-between text-xs text-[#FFF8EF]/60 gap-4">
          <p>
            © {currentYear} SFORNAMÌ Roma. Tutti i diritti riservati. P.IVA e Dati societari in allestimento pre-lancio.
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookie" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <Link href="/termini" className="hover:text-white transition-colors">
              Condizioni di Vendita
            </Link>
            <Link href="/allergeni" className="hover:text-white transition-colors">
              Informazioni Allergeni
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
