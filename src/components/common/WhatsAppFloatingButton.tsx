'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export const WhatsAppFloatingButton: React.FC = () => {
  const { getWhatsAppLink } = useSettings();

  const waLink = getWhatsAppLink(
    'Ciao SFORNAMÌ! Vorrei fare un ordine con consegna a domicilio o chiedere informazioni sulle vostre bontà appena sfornate.'
  );

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-3 sm:right-6 z-20 flex flex-col items-end gap-2 group">
      {/* Floating Action Button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contattaci su WhatsApp"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-xl hover:shadow-[#25D366]/50 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-[#25D366]" />
      </a>
    </div>
  );
};
