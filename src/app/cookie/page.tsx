import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

export default function CookiePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-8">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DE7E42] hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Torna alla home</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-[#57382E]">
          Informativa sui Cookie
        </h1>
        <p className="text-xs text-[#7E5649] mt-1">Conforme alle Linee Guida del Garante Privacy</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#F5A16C]/25 shadow-sm space-y-6 text-xs sm:text-sm text-[#7E5649] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-black text-[#57382E]">1. Cosa sono i Cookie</h2>
          <p>
            I cookie sono piccoli file di testo memorizzati nel tuo browser che permettono al sito di ricordare i prodotti nel carrello, mantenere lo stato della sessione e migliorare la tua esperienza di navigazione.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#57382E]">2. Cookie Utilizzati da SFORNAMÌ</h2>
          <div className="space-y-2">
            <p><strong>A. Cookie Tecnici Necessari:</strong></p>
            <p>
              Indispensabili per il funzionamento dell'e-commerce (persistenza del carrello della spesa, preferenze di ritiro/consegna, token di sicurezza). Non richiedono consenso preventivo.
            </p>
            <p><strong>B. Cookie Analitici e di Preferenza:</strong></p>
            <p>
              Utilizzati per comprendere in forma aggregata e anonima le pagine più visitate o per ricordare promozioni speciali. Vengono attivati solo in presenza di consenso espresso dall'utente tramite il banner.
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#57382E]">3. Come Gestire o Disattivare i Cookie</h2>
          <p>
            Puoi modificare in qualsiasi momento le preferenze attraverso le impostazioni del tuo browser (Chrome, Safari, Firefox, Edge) o cancellando i dati di navigazione memorizzati in locale.
          </p>
        </section>
      </div>
    </div>
  );
}

