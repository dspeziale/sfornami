import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

export default function TerminiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-8">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DE7E42] hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Torna alla home</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-[#57382E]">
          Termini e Condizioni Generali di Vendita
        </h1>
        <p className="text-xs text-[#7E5649] mt-1">Prodotti freschi artigianali da forno e pasticceria</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#F5A16C]/25 shadow-sm space-y-6 text-xs sm:text-sm text-[#7E5649] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-black text-[#57382E]">1. Oggetto del Servizio</h2>
          <p>
            Le presenti condizioni regolano l'acquisto e la prenotazione di prodotti da forno, pane, focacce, dolci e torte artigianali preparati freschi dal laboratorio <strong>{INITIAL_STORE_SETTINGS.storeName}</strong> a Roma.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#57382E]">2. Prodotti Freschi e Deperibili</h2>
          <p>
            Tutti i nostri prodotti sono freschi, preparati a mano e senza conservanti industriali. Ai sensi dell'art. 59, comma 1, lett. d) ed e) del Codice del Consumo (D.Lgs. 206/2005), <strong>il diritto di recesso è escluso</strong> per la fornitura di beni che rischiano di deteriorarsi o scadere rapidamente, o sigillati che non si prestano ad essere restituiti per motivi igienici.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#57382E]">3. Ritiro e Consegna a Roma</h2>
          <p>
            Gli ordini con modalità "Ritiro in Laboratorio" devono essere ritirati presso il nostro forno entro la fascia oraria concordata. Gli ordini a domicilio vengono consegnati nella fascia oraria selezionata. In caso di assenza del cliente all'indirizzo indicato, l'ordine rimarrà a disposizione per il ritiro diretto presso il laboratorio.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#57382E]">4. Torte Personalizzate</h2>
          <p>
            Le richieste inviate tramite la sezione "Torte Personalizzate" costituiscono una richiesta di preventivo non vincolante. Il contratto si intende perfezionato solo dopo la conferma esplicita della fattibilità e del prezzo concordato tra il cliente e il laboratorio (via email o WhatsApp).
          </p>
        </section>
      </div>
    </div>
  );
}

