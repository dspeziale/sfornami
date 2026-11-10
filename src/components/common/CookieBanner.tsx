'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('sfornami_cookie_consent');
      if (!consent) {
        // Small delay for clean entrance
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('sfornami_cookie_consent', JSON.stringify({ technical: true, marketing: true }));
    setVisible(false);
  };

  const handleAcceptTechnicalOnly = () => {
    localStorage.setItem('sfornami_cookie_consent', JSON.stringify({ technical: true, marketing: false }));
    setVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      'sfornami_cookie_consent',
      JSON.stringify({ technical: true, marketing: marketingConsent })
    );
    setVisible(false);
    setPreferencesOpen(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl p-5 shadow-2xl border-2 border-[#FFE29A] text-[#57382E]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFE29A] flex items-center justify-center shrink-0 text-[#57382E]">
            <Cookie className="w-5 h-5 text-[#DE7E42]" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-[#57382E] flex items-center gap-1.5">
              <span>Un pizzico di cookie per una navigazione migliore</span>
            </h4>
            <p className="text-xs text-[#7E5649] mt-1 leading-relaxed">
              Utilizziamo cookie tecnici indispensabili per il carrello e gli ordini, e cookie opzionali per migliorare la tua esperienza nel nostro forno.{' '}
              <Link href="/privacy" className="text-[#DE7E42] underline font-medium">
                Informativa Privacy
              </Link>
            </p>
          </div>
        </div>

        {preferencesOpen && (
          <div className="mt-4 pt-3 border-t border-[#F5A16C]/20 space-y-2 text-xs">
            <label className="flex items-center justify-between text-xs font-semibold text-[#57382E]">
              <span>Cookie Tecnici & Carrello (Necessari)</span>
              <input type="checkbox" checked disabled className="rounded text-[#DE7E42]" />
            </label>
            <label className="flex items-center justify-between text-xs font-semibold text-[#57382E]">
              <span>Preferenze e Offerte Promozionali</span>
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={e => setMarketingConsent(e.target.checked)}
                className="rounded text-[#DE7E42]"
              />
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {preferencesOpen ? (
            <button
              onClick={handleSavePreferences}
              className="flex-1 py-2 px-3 rounded-xl bg-[#57382E] text-white text-xs font-bold hover:bg-[#7E5649] transition-colors"
            >
              Salva Preferenze
            </button>
          ) : (
            <>
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-2 px-3 rounded-xl bg-[#F5A16C] text-white text-xs font-bold hover:bg-[#DE7E42] shadow-sm transition-all hover:scale-105"
              >
                Accetta Tutti
              </button>
              <button
                onClick={handleAcceptTechnicalOnly}
                className="py-2 px-3 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/40 text-[#57382E] text-xs font-semibold hover:bg-white transition-colors"
              >
                Solo Necessari
              </button>
              <button
                onClick={() => setPreferencesOpen(true)}
                className="text-[11px] text-[#9E7D73] hover:underline px-1"
              >
                Personalizza
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

