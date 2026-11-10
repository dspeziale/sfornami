import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-8">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DE7E42] hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Torna alla home</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-[#57382E]">
          Informativa sulla Privacy (GDPR - Reg. UE 2016/679)
        </h1>
        <p className="text-xs text-[#7E5649] mt-1">Ultimo aggiornamento: Febbraio 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#F5A16C]/25 shadow-sm space-y-6 text-xs sm:text-sm text-[#7E5649] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-black text-[#57382E]">1. Titolare del Trattamento</h2>
          <p>
            Il Titolare del trattamento dei dati è il laboratorio artigianale <strong>{INITIAL_STORE_SETTINGS.storeName}</strong> con sede operativa a Roma in {INITIAL_STORE_SETTINGS.address}, {INITIAL_STORE_SETTINGS.cap} Roma (RM).
            Email di contatto: <a href={`mailto:${INITIAL_STORE_SETTINGS.email}`} className="text-[#DE7E42] underline">{INITIAL_STORE_SETTINGS.email}</a>.
            <br />
            <em>(I dati societari completi, P.IVA e numero REA verranno integrati prima del lancio ufficiale al pubblico).</em>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#57382E]">2. Tipologia di Dati Raccolti</h2>
          <p>
            Raccogliamo unicamente i dati necessari alla gestione ed evasione degli ordini online e delle richieste di preventivo per torte:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Nome e cognome del cliente</li>
            <li>Indirizzo email e numero di cellulare per aggiornamenti su stato dell'ordine o comunicazioni via WhatsApp</li>
            <li>Indirizzo di consegna (qualora si scelga la consegna a domicilio a Roma)</li>
            <li>Dati di fatturazione se espressamente richiesti</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#57382E]">3. Finalità del Trattamento e Base Giuridica</h2>
          <p>
            I dati sono trattati esclusivamente per:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Esecuzione del contratto di acquisto e fornitura dei prodotti di panetteria e pasticceria (Art. 6.1.b GDPR).</li>
            <li>Adempimento di obblighi legali e fiscali (Art. 6.1.c GDPR).</li>
            <li>Invio di comunicazioni transazionali sull'ordine (es. notifica di ordine pronto per il ritiro).</li>
            <li>Invio di newsletter e promozioni speciali solo previo espresso e separato consenso facoltativo dell'utente.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#57382E]">4. Conservazione e Sicurezza dei Dati</h2>
          <p>
            I dati personali vengono conservati per il tempo strettamente necessario all'evasione dell'ordine e all'adempimento degli obblighi fiscali previsti dalla legge italiana (10 anni per le scritture contabili). Adottiamo standard di sicurezza moderni con crittografia SSL/TLS e Row Level Security sul database.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#57382E]">5. Diritti dell'Interessato</h2>
          <p>
            In qualsiasi momento l'utente ha diritto di richiedere l'accesso, la rettifica, la cancellazione o la limitazione del trattamento dei propri dati personali scrivendo a {INITIAL_STORE_SETTINGS.email}.
          </p>
        </section>
      </div>
    </div>
  );
}
