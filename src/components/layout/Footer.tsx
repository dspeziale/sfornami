'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Phone, Mail, Clock, MessageCircle, Sparkles } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '@/components/common/SocialIcons';
import { Logo } from '@/components/brand/Logo';
import { useSettings } from '@/context/SettingsContext';

export const Footer: React.FC = () => {
  const currentYear = 2026;
  const { settings, getWhatsAppLink } = useSettings();

  const waLink = getWhatsAppLink(
    'Ciao SFORNAMÌ! Vorrei fare un ordine con consegna a domicilio a Roma.'
  );

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
                Solo Consegna a Domicilio a Roma
              </h4>
              <p className="text-xs text-[#FFF8EF]/80">
                Ordina online o su WhatsApp e ricevi le bontà calde e fragranti a casa tua.
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
              SFORNAMÌ è il laboratorio artigianale di panetteria e pasticceria a Roma. Operiamo esclusivamente con ordini online e comoda consegna a domicilio in tutta la città.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#7E5649] hover:bg-[#F28BA6] flex items-center justify-center text-white transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href={`https://instagram.com/${settings.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#7E5649] hover:bg-[#F28BA6] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] flex items-center justify-center text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
              </a>
            </div>
          </div>

          {/* Navigazione */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm uppercase tracking-wider text-[#FFE29A]">
              Bontà da Forno
            </h5>
            <ul className="space-y-2 text-xs text-[#FFF8EF]/80">
              <li>
                <Link href="/panetteria" className="hover:text-[#FFE29A] transition-colors">
                  Pane a lievito madre
                </Link>
              </li>
              <li>
                <Link href="/panetteria" className="hover:text-[#FFE29A] transition-colors">
                  Pizza e focacce alla pala
                </Link>
              </li>
              <li>
                <Link href="/pasticceria" className="hover:text-[#FFE29A] transition-colors">
                  Maritozzi romani
                </Link>
              </li>
              <li>
                <Link href="/pasticceria" className="hover:text-[#FFE29A] transition-colors">
                  Crostate e biscotti
                </Link>
              </li>
              <li>
                <Link href="/torte-personalizzate" className="hover:text-[#FFE29A] transition-colors text-[#F5A16C] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Torte su ordinazione
                </Link>
              </li>
            </ul>
          </div>

          {/* Servizio & Consegna */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm uppercase tracking-wider text-[#FFE29A]">
              Info & Ordini
            </h5>
            <ul className="space-y-2 text-xs text-[#FFF8EF]/80">
              <li>
                <Link href="/chi-siamo" className="hover:text-[#FFE29A] transition-colors">
                  Il nostro laboratorio
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="hover:text-[#FFE29A] transition-colors">
                  Zone di consegna a Roma
                </Link>
              </li>
              <li>
                <Link href="/allergeni" className="hover:text-[#FFE29A] transition-colors">
                  Tabella allergeni (Reg. UE)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#FFE29A] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/termini" className="hover:text-[#FFE29A] transition-colors">
                  Termini & Condizioni
                </Link>
              </li>
              <li>
                <Link href="/cookie" className="hover:text-[#FFE29A] transition-colors">
                  Informativa Cookie
                </Link>
              </li>
            </ul>
          </div>

          {/* Contatti & Orari Consegna */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm uppercase tracking-wider text-[#FFE29A]">
              Laboratorio Roma
            </h5>
            <div className="space-y-2.5 text-xs text-[#FFF8EF]/80">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#F5A16C] shrink-0 mt-0.5" />
                <span>Solo Consegna a Domicilio a Roma e zone coperte</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F5A16C] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:underline">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 fill-[#25D366]" />
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:underline font-bold text-[#25D366]">
                  WhatsApp: +{settings.whatsappNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F5A16C] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:underline">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-[#7E5649]/40">
                <Clock className="w-4 h-4 text-[#FFE29A] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight text-[#FFE29A]">
                  Fasce di consegna: Mattina 10:30-12:30 | Pomeriggio 17:00-19:00 (Mar-Dom)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-[#7E5649]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF8EF]/60">
          <p>© {currentYear} SFORNAMÌ Roma. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px]">Laboratorio artigianale con consegna a domicilio</span>
            <span>•</span>
            <Link href="/admin" className="hover:text-white transition-colors">
              Area Riservata Staff
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
