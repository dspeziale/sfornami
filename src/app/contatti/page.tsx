'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '@/components/common/SocialIcons';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

export default function ContattiPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Richiesta generale',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const waLink = `https://wa.me/${INITIAL_STORE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
    'Ciao SFORNAMÌ! Vi contatto dal sito per informazioni sul vostro laboratorio a Roma.'
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-4 py-1.5 rounded-full bg-[#FFE29A] text-[#57382E] text-xs font-black tracking-wider uppercase inline-flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#DE7E42]" />
          Nel Cuore di Roma
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#57382E] tracking-tight">
          Vieni a Trovarci o Scrivici
        </h1>
        <p className="text-sm sm:text-base text-[#7E5649] leading-relaxed">
          Il nostro forno è sempre aperto a un saluto, a una chiacchierata sugli impasti e a una fetta di torta appena sfornata.
        </p>
      </div>

      {/* Main Grid: Info Cards + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Contact Info & Opening Hours */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-md space-y-6">
            <h3 className="text-lg font-black text-[#57382E]">Laboratorio & Punto Vendita</h3>

            <div className="space-y-4 text-xs sm:text-sm text-[#7E5649]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFE29A] flex items-center justify-center text-[#57382E] shrink-0">
                  <MapPin className="w-5 h-5 text-[#DE7E42]" />
                </div>
                <div>
                  <span className="font-bold text-[#57382E] block">Indirizzo a Roma:</span>
                  <p>{INITIAL_STORE_SETTINGS.address}</p>
                  <p>{INITIAL_STORE_SETTINGS.cap} Roma (Centro Storico - Banchi Vecchi)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#A8D8BD]/40 flex items-center justify-center text-emerald-700 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#57382E] block">Telefono Laboratorio:</span>
                  <p className="font-semibold text-[#57382E]">{INITIAL_STORE_SETTINGS.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#25D366]/20 flex items-center justify-center text-[#25D366] shrink-0">
                  <MessageCircle className="w-5 h-5 fill-[#25D366]" />
                </div>
                <div>
                  <span className="font-bold text-[#57382E] block">WhatsApp Business:</span>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="font-bold text-[#25D366] hover:underline">
                    +{INITIAL_STORE_SETTINGS.whatsappNumber} (Chat Rapida)
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F28BA6]/25 flex items-center justify-center text-[#D86B86] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#57382E] block">Email:</span>
                  <p className="text-[#57382E]">{INITIAL_STORE_SETTINGS.email}</p>
                </div>
              </div>
            </div>

            {/* Hours Table */}
            <div className="pt-6 border-t border-[#F5A16C]/20 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#57382E] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#DE7E42]" />
                <span>Orari di Apertura del Forno:</span>
              </h4>
              <div className="space-y-1.5 text-xs text-[#7E5649]">
                <div className="flex justify-between py-1 border-b border-[#F5A16C]/10">
                  <span>Martedì - Sabato:</span>
                  <span className="font-black text-[#57382E]">07:30 - 19:30</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5A16C]/10">
                  <span>Domenica:</span>
                  <span className="font-black text-[#57382E]">08:00 - 13:30</span>
                </div>
                <div className="flex justify-between py-1 text-[#DE7E42]">
                  <span>Lunedì:</span>
                  <span className="font-black">Chiuso per impasti</span>
                </div>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="pt-4 flex items-center gap-3">
              <a
                href={INITIAL_STORE_SETTINGS.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-bold text-[#57382E] flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                <FacebookIcon className="w-4 h-4 text-[#1877F2]" />
                <span>Facebook</span>
              </a>
              <a
                href={`https://instagram.com/${INITIAL_STORE_SETTINGS.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-bold text-[#57382E] flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-[#E4405F]" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#F5A16C]/25 shadow-lg space-y-6">
          <h3 className="text-xl font-black text-[#57382E]">Inviaci un Messaggio</h3>
          <p className="text-xs text-[#7E5649]">
            Vuoi informazioni su catering per feste, rinfreschi, forniture per locali o personalizzazioni? Rispondiamo entro poche ore.
          </p>

          {formSubmitted ? (
            <div className="bg-[#A8D8BD]/20 border border-[#A8D8BD] rounded-2xl p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-black text-[#57382E]">Messaggio Inviato!</h4>
              <p className="text-xs text-[#7E5649] max-w-sm mx-auto">
                Grazie {contactData.name}, abbiamo ricevuto la tua richiesta. Ti risponderemo a breve via email o WhatsApp.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="text-xs font-bold text-[#DE7E42] underline pt-2"
              >
                Invia un altro messaggio
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#57382E] block mb-1">Il tuo Nome*</label>
                  <input
                    type="text"
                    required
                    value={contactData.name}
                    onChange={e => setContactData({ ...contactData, name: e.target.value })}
                    placeholder="Marco Bianchi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#57382E] block mb-1">Telefono / WhatsApp*</label>
                  <input
                    type="tel"
                    required
                    value={contactData.phone}
                    onChange={e => setContactData({ ...contactData, phone: e.target.value })}
                    placeholder="+39 333 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#57382E] block mb-1">Email*</label>
                  <input
                    type="email"
                    required
                    value={contactData.email}
                    onChange={e => setContactData({ ...contactData, email: e.target.value })}
                    placeholder="marco@email.it"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#57382E] block mb-1">Motivo del Contatto</label>
                  <select
                    value={contactData.subject}
                    onChange={e => setContactData({ ...contactData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-medium text-[#57382E]"
                  >
                    <option value="Richiesta generale">Richiesta generale</option>
                    <option value="Rinfreschi e Buffet per feste">Rinfreschi e Buffet per feste</option>
                    <option value="Torte speciali su misura">Torte speciali su misura</option>
                    <option value="Forniture B2B / Bar">Forniture per locali / B2B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#57382E] block mb-1">Messaggio*</label>
                <textarea
                  rows={4}
                  required
                  value={contactData.message}
                  onChange={e => setContactData({ ...contactData, message: e.target.value })}
                  placeholder="Scrivi qui la tua richiesta..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#F5A16C] hover:bg-[#DE7E42] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <Send className="w-4 h-4" />
                <span>INVIA MESSAGGIO</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Interactive Google Maps Embed for Rome Location */}
      <div className="bg-white rounded-[36px] overflow-hidden border-2 border-[#F5A16C]/30 shadow-xl space-y-4 p-4 sm:p-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <h3 className="text-base font-black text-[#57382E]">Mappa & Indicazioni Stradali</h3>
            <p className="text-xs text-[#7E5649]">Via dei Banchi Vecchi, 48 - Roma Centro</p>
          </div>
          <a
            href="https://maps.google.com/?q=Via+dei+Banchi+Vecchi+48+Roma"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-black text-[#DE7E42] hover:underline"
          >
            Apri in Google Maps ↗
          </a>
        </div>

        <div className="w-full h-80 rounded-2xl overflow-hidden bg-[#FFF8EF] relative">
          <iframe
            title="Posizione SFORNAMÌ Roma"
            src="https://maps.google.com/maps?q=Via%20dei%20Banchi%20Vecchi%2048%20Roma&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
