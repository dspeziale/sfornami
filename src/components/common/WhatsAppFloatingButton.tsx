'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { getWhatsAppLink } = useSettings();

  const waLink = getWhatsAppLink(
    'Ciao SFORNAMÌ! Vorrei fare un ordine con consegna a domicilio o chiedere informazioni sulle vostre bontà appena sfornate.'
  );

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-30 flex flex-col items-end gap-2 group">
      {/* Friendly pop-up balloon */}
      {showTooltip && (
        <div className="bg-white text-[#57382E] p-3 rounded-2xl shadow-xl border border-[#A8D8BD] max-w-xs text-xs font-medium animate-bounce flex items-start gap-2 relative">
          <span className="text-lg">👋</span>
          <div>
            <p className="font-bold text-[#57382E]">Hai voglia di qualcosa di buono?</p>
            <p className="text-[11px] text-[#7E5649]">Scrivici su WhatsApp per info o ordini con consegna a domicilio!</p>
          </div>
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-[#9E7D73] hover:text-[#57382E] p-0.5 rounded-full"
            aria-label="Chiudi avviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contattaci su WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-2xl hover:shadow-[#25D366]/50 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
      </a>
    </div>
  );
};
