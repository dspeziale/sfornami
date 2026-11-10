'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Cake,
  Calendar,
  Clock,
  MessageCircle,
  CheckCircle2,
  Send,
  Heart,
  Palette,
  Camera,
  Info,
} from 'lucide-react';
import { DataService } from '@/lib/store';
import { generateWhatsAppCustomCakeMessage } from '@/lib/whatsapp';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

const CAKE_TYPES = [
  { id: 'millefoglie', name: 'Millefoglie Tradizionale Caramellata', desc: 'Sfoglia croccante tirata al burro e chantilly' },
  { id: 'pan_di_spagna', name: 'Torta Classica con Pan di Spagna', desc: 'Morbida e soffice, ideale per decorazioni e scritte' },
  { id: 'crostata_moderna', name: 'Crostata Moderna Sablée', desc: 'Guscio friabile, ganache montata e frutta fresca' },
  { id: 'red_velvet', name: 'Torta Red Velvet', desc: 'Impasto vellutato color rubino e frosting al mascarpone' },
  { id: 'naked_cake', name: 'Naked Cake Floreale', desc: 'Look rustico ed elegante a strati a vista, perfetta per cerimonie' },
  { id: 'sacher', name: 'Sacher Artigianale', desc: 'Cioccolato fondente Valrhona e confettura di albicocche' },
];

const FLAVOR_BASES = [
  'Pan di Spagna Classico alla Vaniglia Bourbon',
  'Pan di Spagna al Cacao Olandese Extra Dark',
  'Sfoglia Caramellata al Burro Francese',
  'Frolla Sablée Rustica alle Mandorle',
  'Base Red Velvet Tradizionale',
];

const FILLINGS = [
  'Crema Chantilly alla Vaniglia e Fragoline di Nemi',
  'Crema Pasticcera Tradizionale con Gocce di Fondente',
  'Crema al Pistacchio Puro di Bronte DOP',
  'Ganache Montata al Cioccolato Fondente 70%',
  'Crema Diplomatica Leggera con Frutti di Bosco Freschi',
  'Crema al Mascarpone e Caffè Espresso',
];

const DECORATIONS = [
  'Cascata di Frutti di Bosco Freschi e Zucchero a Velo',
  'Fiori Edibili Naturali e Rametti di Rosmarino',
  'Decorazione Elegante con Macarons e Ciuffi di Crema',
  'Ghiaccia Reale e Scritta Artistica Personalizzata',
  'Ostia / Cialda con Disegno o Foto per Bambini',
  'Glassa a Specchio Lucida al Cioccolato',
];

export default function TortePersonalizzatePage() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    cakeType: CAKE_TYPES[0].name,
    servings: 10,
    flavorBase: FLAVOR_BASES[0],
    filling: FILLINGS[0],
    decoration: DECORATIONS[0],
    customText: '',
    requestedDate: '',
    requestedTime: '11:00',
    referenceImageUrl: '',
    notes: '',
  });

  const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [tomorrow, setTomorrow] = useState('');

  React.useEffect(() => {
    setTomorrow(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  }, []);

  const handleSubmitSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customerName || !formData.customerPhone) {
      setErrorMsg('Inserisci almeno Nome e Numero di Telefono per essere ricontattato.');
      return;
    }

    if (!formData.requestedDate) {
      setErrorMsg('Seleziona la data desiderata per il ritiro o consegna della torta.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await DataService.createCustomCakeRequest(formData);
      setSubmittedRequest(created);
    } catch (err) {
      console.error(err);
      setErrorMsg('Si è verificato un errore durante l’invio. Riprova o contattaci su WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendWhatsAppDirect = () => {
    if (!formData.customerName || !formData.customerPhone) {
      setErrorMsg('Compila almeno il tuo nome e numero di telefono prima di inviare.');
      return;
    }
    const fakeReq: any = {
      ...formData,
      id: 'cake-draft',
      status: 'in_valutazione',
      createdAt: new Date().toISOString(),
    };
    const url = generateWhatsAppCustomCakeMessage({
      cakeRequest: fakeReq,
      settings: INITIAL_STORE_SETTINGS,
    });
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-4 py-1.5 rounded-full bg-[#F28BA6]/20 text-[#D86B86] text-xs font-black tracking-wider uppercase inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Laboratorio su Ordinazione a Roma
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#57382E] tracking-tight">
          Crea la Tua Torta dei Sogni
        </h1>
        <p className="text-sm sm:text-base text-[#7E5649] leading-relaxed">
          Compleanni, battesimi, lauree, anniversari o una domenica speciale in famiglia. Raccontaci la tua idea e i nostri maestri pasticceri realizzeranno una torta artigianale unica.
        </p>
      </div>

      {submittedRequest ? (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#A8D8BD] shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 bg-[#A8D8BD]/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl">
            🎂
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#FFE29A] text-[#57382E] text-xs font-black uppercase">
              Richiesta Ricevuta!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#57382E]">
              Grazie {submittedRequest.customerName}!
            </h2>
            <p className="text-sm text-[#7E5649] leading-relaxed max-w-md mx-auto">
              La tua richiesta per una <strong>{submittedRequest.cakeType}</strong> da {submittedRequest.servings} persone è stata presa in carico dal nostro laboratorio.
            </p>
          </div>

          <div className="bg-[#FFF8EF] rounded-2xl p-4 text-xs text-[#57382E] border border-[#F5A16C]/25 text-left space-y-1.5 max-w-md mx-auto">
            <p><strong>📅 Data richiesta:</strong> {submittedRequest.requestedDate} alle ore {submittedRequest.requestedTime}</p>
            <p><strong>🍓 Farcitura:</strong> {submittedRequest.filling}</p>
            {submittedRequest.customText && (
              <p><strong>✍️ Scritta personalizzata:</strong> "{submittedRequest.customText}"</p>
            )}
            <p><strong>📍 Stato:</strong> In valutazione (ti contatteremo entro poche ore con disponibilità e preventivo)</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={generateWhatsAppCustomCakeMessage({
                cakeRequest: submittedRequest,
                settings: INITIAL_STORE_SETTINGS,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] text-white font-bold text-xs hover:bg-[#1EBE5D] shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Conferma o invia dettagli su WhatsApp</span>
            </a>

            <button
              onClick={() => setSubmittedRequest(null)}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FFF8EF] border border-[#F5A16C]/40 text-[#57382E] font-bold text-xs hover:bg-white"
            >
              Invia un'altra richiesta
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Form */}
          <form
            onSubmit={handleSubmitSite}
            className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#F5A16C]/25 shadow-lg space-y-8"
          >
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* 1. Tipo di Torta */}
            <div className="space-y-3">
              <label className="text-sm font-black text-[#57382E] flex items-center gap-2">
                <Cake className="w-4 h-4 text-[#DE7E42]" />
                <span>1. Scegli la Tipologia di Torta</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAKE_TYPES.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, cakeType: type.name })}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      formData.cakeType === type.name
                        ? 'bg-[#FFE29A] border-[#DE7E42] shadow-sm'
                        : 'bg-[#FFF8EF]/50 border-[#F5A16C]/20 hover:bg-white'
                    }`}
                  >
                    <p className="text-xs font-black text-[#57382E]">{type.name}</p>
                    <p className="text-[11px] text-[#7E5649] mt-0.5">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Numero di Persone / Porzioni */}
            <div className="space-y-3">
              <label className="text-sm font-black text-[#57382E] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#DE7E42]" />
                <span>2. Numero di Persone / Porzioni: {formData.servings} fette</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[6, 8, 10, 12, 15, 20, 25, 30].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFormData({ ...formData, servings: n })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      formData.servings === n
                        ? 'bg-[#F28BA6] text-white border-[#F28BA6] shadow-xs'
                        : 'bg-[#FFF8EF] text-[#57382E] border-[#F5A16C]/30 hover:bg-white'
                    }`}
                  >
                    {n} persone (~{(n * 0.12).toFixed(1)} kg)
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Base & Farcitura */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-[#57382E] block">
                  3. Base & Pan di Spagna
                </label>
                <select
                  value={formData.flavorBase}
                  onChange={e => setFormData({ ...formData, flavorBase: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-medium text-[#57382E] focus:outline-hidden focus:border-[#F28BA6]"
                >
                  {FLAVOR_BASES.map((b, i) => (
                    <option key={i} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-[#57382E] block">
                  4. Farcitura e Creme
                </label>
                <select
                  value={formData.filling}
                  onChange={e => setFormData({ ...formData, filling: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-medium text-[#57382E] focus:outline-hidden focus:border-[#F28BA6]"
                >
                  {FILLINGS.map((f, i) => (
                    <option key={i} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Decorazione & Scritta */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-[#57382E] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#DE7E42]" />
                  <span>5. Stile di Decorazione</span>
                </label>
                <select
                  value={formData.decoration}
                  onChange={e => setFormData({ ...formData, decoration: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-medium text-[#57382E] focus:outline-hidden focus:border-[#F28BA6]"
                >
                  {DECORATIONS.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#57382E] block">
                  Scritta personalizzata sulla torta (Facoltativa)
                </label>
                <input
                  type="text"
                  value={formData.customText}
                  onChange={e => setFormData({ ...formData, customText: e.target.value })}
                  placeholder="Es. 'Buon Compleanno Chiara!' oppure 'Auguri Mamma 50'"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E] placeholder:text-[#9E7D73] focus:outline-hidden focus:border-[#F28BA6]"
                />
              </div>
            </div>

            {/* 5. Data & Orario */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F5A16C]/20">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#57382E] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#DE7E42]" />
                  <span>Data Richiesta (Ritiro o Consegna)*</span>
                </label>
                <input
                  type="date"
                  min={tomorrow}
                  value={formData.requestedDate}
                  onChange={e => setFormData({ ...formData, requestedDate: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-bold text-[#57382E] focus:outline-hidden focus:border-[#F28BA6]"
                />
                <span className="text-[10px] text-[#9E7D73]">
                  Consigliamo almeno 24-48h di preavviso per le torte artigianali.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#57382E] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#DE7E42]" />
                  <span>Orario Indicativo</span>
                </label>
                <input
                  type="time"
                  value={formData.requestedTime}
                  onChange={e => setFormData({ ...formData, requestedTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-bold text-[#57382E] focus:outline-hidden focus:border-[#F28BA6]"
                />
              </div>
            </div>

            {/* 6. Dati Contatto */}
            <div className="space-y-4 pt-2 border-t border-[#F5A16C]/20">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#DE7E42]">
                I Tuoi Dati per il Preventivo
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#57382E] block mb-1">
                    Nome e Cognome*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Mario Rossi"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#57382E] block mb-1">
                    Cellulare / WhatsApp*
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+39 333 1234567"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#57382E] block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="mario@email.it"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#57382E] block mb-1">
                  Note aggiuntive, intolleranze o link foto ispirazione
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Es. Invito per 3 celiaci, gradita frutta ben visibile, ecc."
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                />
              </div>
            </div>

            {/* Dual CTAs: Send via Site or Direct WhatsApp */}
            <div className="pt-4 border-t border-[#F5A16C]/20 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#F5A16C] hover:bg-[#DE7E42] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Invio in corso...' : 'INVIA RICHIESTA AL LABORATORIO'}</span>
              </button>

              <button
                type="button"
                onClick={handleSendWhatsAppDirect}
                className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>INVIA SU WHATSAPP</span>
              </button>
            </div>
          </form>

          {/* Right Live Summary Sticky Card */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-[#FFF8EF] rounded-3xl p-6 border-2 border-[#FFE29A] shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍰</span>
                <div>
                  <h3 className="text-base font-black text-[#57382E]">La Tua Torta SFORNAMÌ</h3>
                  <p className="text-[11px] text-[#7E5649]">Riepilogo in tempo reale</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#57382E] pt-3 border-t border-[#F5A16C]/20">
                <div>
                  <span className="text-[#9E7D73] block text-[10px] uppercase font-bold">Tipologia:</span>
                  <span className="font-bold">{formData.cakeType}</span>
                </div>
                <div>
                  <span className="text-[#9E7D73] block text-[10px] uppercase font-bold">Porzioni:</span>
                  <span className="font-bold">{formData.servings} persone (~{(formData.servings * 0.12).toFixed(1)} kg)</span>
                </div>
                <div>
                  <span className="text-[#9E7D73] block text-[10px] uppercase font-bold">Base:</span>
                  <span>{formData.flavorBase}</span>
                </div>
                <div>
                  <span className="text-[#9E7D73] block text-[10px] uppercase font-bold">Farcitura:</span>
                  <span className="text-[#DE7E42] font-semibold">{formData.filling}</span>
                </div>
                <div>
                  <span className="text-[#9E7D73] block text-[10px] uppercase font-bold">Decorazione:</span>
                  <span>{formData.decoration}</span>
                </div>
                {formData.customText && (
                  <div>
                    <span className="text-[#9E7D73] block text-[10px] uppercase font-bold">Scritta:</span>
                    <span className="italic font-bold text-[#F28BA6]">"{formData.customText}"</span>
                  </div>
                )}
                {formData.requestedDate && (
                  <div>
                    <span className="text-[#9E7D73] block text-[10px] uppercase font-bold">Per il giorno:</span>
                    <span className="font-bold text-[#57382E]">{formData.requestedDate} ({formData.requestedTime})</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#F5A16C]/20 bg-white/70 rounded-2xl p-3 text-[11px] text-[#7E5649] space-y-1">
                <p className="font-bold text-[#57382E] flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-[#DE7E42]" />
                  <span>Come funziona il preventivo?</span>
                </p>
                <p>
                  Ricevuta la richiesta, il mastro pasticcere valuterà gli ingredienti e ti risponderà su WhatsApp con il prezzo esatto e la conferma dell'orario di ritiro a Roma.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
