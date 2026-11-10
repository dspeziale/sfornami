import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Award, Clock, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function ChiSiamoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20 space-y-16">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-4 py-1.5 rounded-full bg-[#FFE29A] text-[#57382E] text-xs font-black tracking-wider uppercase inline-flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 fill-[#F28BA6] text-[#F28BA6]" />
          Il Nostro Laboratorio Artigianale a Roma
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#57382E] tracking-tight leading-tight">
          DIETRO OGNI BUONA COSA C'È UNA STORIA.
        </h1>
        <p className="text-base sm:text-lg text-[#7E5649] leading-relaxed">
          Niente semilavorati industriali, niente scorciatoie. Solo mani infarinate, farine selezionate e il tempo necessario per far lievitare la felicità.
        </p>
      </div>

      {/* Main Story Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6 text-sm sm:text-base text-[#7E5649] leading-relaxed">
          <h2 className="text-2xl sm:text-3xl font-black text-[#57382E]">
            L'Amore per le Ricette di Casa e la Farina Vera
          </h2>
          <p>
            <strong>SFORNAMÌ</strong> nasce da una passione autentica per l'arte bianca e la pasticceria fatta in casa: il profumo del burro che fonde al mattino presto, la crosta del pane che "canta" appena uscita dal forno a legna, e il rito sacro della domenica con i dolci di famiglia.
          </p>
          <p>
            Nel nostro laboratorio nel centro storico di Roma, ogni impasto inizia con rispetto: selezioniamo grani antichi e farine 100% italiane macinate a pietra, ricche di crusca nobile e germe di grano vivo. Non utilizziamo additivi chimici né grassi idrogenati: soltanto uova fresche di galline allevate all’aperto, latte fresco intero, burro di fattoria e frutta di stagione.
          </p>
          <p>
            I testi e i dettagli di questa pagina sono pensati per essere personalizzati con la biografia e le fotografie reali della proprietaria e del team del laboratorio prima del lancio ufficiale.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/menu"
              className="px-6 py-3.5 rounded-full bg-[#F5A16C] hover:bg-[#DE7E42] text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105"
            >
              Assaggia le nostre creazioni
            </Link>
            <Link
              href="/contatti"
              className="px-6 py-3.5 rounded-full bg-white border border-[#F5A16C]/40 text-[#57382E] font-bold text-xs sm:text-sm hover:bg-[#FFE29A]/30 transition-colors"
            >
              Vieni a trovarci a Roma
            </Link>
          </div>
        </div>

        {/* Photography Collage of Bakery, Master Baker, Doughs */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden aspect-4/5 shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80"
                alt="La preparazione dei dolci"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                Mani in pasta
              </span>
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-square shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
                alt="Il pane appena sfornato"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                Pane caldo su pietra
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <div className="relative rounded-3xl overflow-hidden aspect-square shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80"
                alt="La crostata di visciole"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                Frolle della nonna
              </span>
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-4/5 shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80"
                alt="Torte decorate a mano"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                Torte speciali
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pilastri della Filosofia */}
      <div id="ingredienti" className="pt-10 border-t border-[#F5A16C]/25">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#DE7E42]">I Nostri Valori</span>
          <h3 className="text-3xl font-black text-[#57382E]">I 4 Pilastri del Nostro Forno</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#F5A16C]/25 shadow-xs space-y-2 text-center">
            <span className="text-4xl block mb-2">⏱️</span>
            <h4 className="text-base font-black text-[#57382E]">Il Tempo</h4>
            <p className="text-xs text-[#7E5649] leading-relaxed">
              La lievitazione non si forza. Ogni nostro impasto riposa dalle 24 alle 48 ore a temperatura controllata.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#F5A16C]/25 shadow-xs space-y-2 text-center">
            <span className="text-4xl block mb-2">🌱</span>
            <h4 className="text-base font-black text-[#57382E]">Lievito Madre Vivo</h4>
            <p className="text-xs text-[#7E5649] leading-relaxed">
              Rinfrescato quotidianamente con farina e acqua, regala alveolature soffici e una digeribilità senza paragoni.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#F5A16C]/25 shadow-xs space-y-2 text-center">
            <span className="text-4xl block mb-2">📍</span>
            <h4 className="text-base font-black text-[#57382E]">Filiera Corta</h4>
            <p className="text-xs text-[#7E5649] leading-relaxed">
              Privilegiamo mulini regionali laziali, uova biologiche del territorio e visciole selvatiche dei Castelli Romani.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#F5A16C]/25 shadow-xs space-y-2 text-center">
            <span className="text-4xl block mb-2">💛</span>
            <h4 className="text-base font-black text-[#57382E]">Fatto con Gioia</h4>
            <p className="text-xs text-[#7E5649] leading-relaxed">
              Perché il segreto per far venire le cose buone è farle con il sorriso e con il desiderio di condividere felicità.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
