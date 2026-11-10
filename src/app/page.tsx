'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Star,
  Clock,
  MapPin,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Award,
  ChevronRight,
  Flame,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/initialData';
import { Product } from '@/lib/types';
import { DataService } from '@/lib/store';
import { ProductCard } from '@/components/products/ProductCard';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getProducts().then(items => {
      setProducts(items);
      setLoading(false);
    });
  }, []);

  const bestsellers = products.filter(p => p.isFeatured).slice(0, 4);
  const weeklySpecials = products.filter(p => p.isWeeklySpecial || p.isSeasonal).slice(0, 3);

  const reviews = [
    {
      name: 'Flaminia R.',
      zone: 'Campo de’ Fiori, Roma',
      rating: 5,
      date: 'Ieri',
      text: 'Il miglior pane casereccio di Roma centro! Crosta croccante e mollica profumata che dura giorni. E il maritozzo con la panna montata sul momento è commovente!',
    },
    {
      name: 'Lorenzo M.',
      zone: 'Trastevere, Roma',
      rating: 5,
      date: '3 giorni fa',
      text: 'Abbiamo ordinato la Millefoglie con fragoline per la laurea di mia sorella: un capolavoro assoluto. Ordinata comodamente da WhatsApp e ritirata puntuale senza fare la fila.',
    },
    {
      name: 'Serena & Matteo',
      zone: 'Prati, Roma',
      rating: 5,
      date: 'La settimana scorsa',
      text: 'La pizza bianca alla pala appena sfornata è una droga! Fragrante, salata al punto giusto, digeribilissima grazie alla lievitazione naturale. Bravi davvero!',
    },
  ];

  const instagramPosts = [
    {
      img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      caption: 'Ore 06:30 • Maritozzi caldi pronti per la panna fresca! 🥐✨',
      likes: 342,
    },
    {
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      caption: '36 ore di lievito madre vivo. Il profumo del pane vero in via dei Banchi Vecchi. 🥖',
      likes: 489,
    },
    {
      img: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80',
      caption: 'Frolla burrosa e visciole selvatiche: la tradizione delle nonne romane non mente mai. ❤️',
      likes: 512,
    },
    {
      img: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80',
      caption: 'Millefoglie caramellata per una festa speciale a Roma. Auguri Camilla! 🎂🍓',
      likes: 670,
    },
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-4 pb-12 md:py-20 bg-linear-to-b from-[#FFF8EF] via-[#FEEFE6]/60 to-[#FFF8EF]">
        {/* Soft decorative background circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FFE29A]/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#F28BA6]/20 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE29A] text-[#57382E] text-xs font-black tracking-wide shadow-xs">
                <Sparkles className="w-4 h-4 text-[#DE7E42]" />
                <span>LABORATORIO ARTIGIANALE • CONSEGNA A DOMICILIO A ROMA</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#57382E] tracking-tight leading-[1.1]">
                LA FELICITÀ HA IL PROFUMO DELLE{' '}
                <span className="text-[#DE7E42] underline decoration-[#F28BA6] decoration-wavy decoration-2">
                  COSE BUONE!
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#7E5649] max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Ogni giorno impastiamo, inforniamo e prepariamo con amore tante bontà fatte a mano. Benvenuti nel mondo{' '}
                <strong className="text-[#57382E] font-black">SFORNAMÌ</strong>!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#F5A16C] hover:bg-[#DE7E42] text-white font-black text-sm tracking-wide shadow-xl shadow-[#F5A16C]/35 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ORDINA ONLINE</span>
                </Link>

                <Link
                  href="/panetteria"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-[#FFE29A]/50 text-[#57382E] font-black text-sm border-2 border-[#F5A16C]/40 shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>SCOPRI LE NOSTRE BONTÀ</span>
                  <ArrowRight className="w-4 h-4 text-[#DE7E42]" />
                </Link>
              </div>

              {/* Fast trust highlights */}
              <div className="pt-6 border-t border-[#F5A16C]/25 grid grid-cols-3 gap-2 text-center lg:text-left">
                <div>
                  <p className="text-lg md:text-xl font-black text-[#57382E]">100%</p>
                  <p className="text-[11px] text-[#7E5649] font-semibold">Lievito Madre Naturale</p>
                </div>
                <div>
                  <p className="text-lg md:text-xl font-black text-[#57382E]">48 Ore</p>
                  <p className="text-[11px] text-[#7E5649] font-semibold">Lenta Lievitazione</p>
                </div>
                <div>
                  <p className="text-lg md:text-xl font-black text-[#57382E]">Torraccia (00156)</p>
                  <p className="text-[11px] text-[#7E5649] font-semibold">Solo Consegna a Domicilio</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Photo: Table full of fresh bread, tarts, cookies and brioches */}
                <div className="relative aspect-4/3 sm:aspect-square rounded-[36px] overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85"
                    alt="Tavolo artigianale SFORNAMÌ pieno di pane appena sfornato, crostate e brioche"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="px-3 py-1 rounded-full bg-[#F28BA6] text-white text-[10px] font-black uppercase tracking-wider">
                      Appena Sfornato
                    </span>
                    <h3 className="text-lg font-black mt-1">L'Autentico Pane Romano Cotto su Pietra</h3>
                  </div>
                </div>

                {/* Floating badge top right */}
                <div className="absolute -top-4 -right-4 bg-white p-3.5 rounded-3xl shadow-xl border border-[#FFE29A] flex items-center gap-3 animate-float">
                  <span className="text-3xl">🥐</span>
                  <div>
                    <p className="text-xs font-black text-[#57382E]">Maritozzi Caldi</p>
                    <p className="text-[10px] font-bold text-[#DE7E42]">Con panna montata fresca</p>
                  </div>
                </div>

                {/* Floating badge bottom left */}
                <div className="absolute -bottom-5 -left-4 bg-white p-3.5 rounded-3xl shadow-xl border border-[#A8D8BD] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#A8D8BD]/30 flex items-center justify-center text-emerald-700">
                    <Truck className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#57382E]">Consegna Rapida a Roma</p>
                    <p className="text-[10px] text-[#7E5649]">Oppure ritira caldo in forno</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LE 4 CATEGORIE GRAFICHE PRINCIPALI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-[#FFE29A] text-[#57382E] text-xs font-black tracking-wider uppercase">
            Il Nostro Mondo Artigianale
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#57382E]">
            Esplora le Categorie
          </h2>
          <p className="text-sm text-[#7E5649]">
            Dalla colazione alla cena: ogni giorno prepariamo impasti freschi, frolle friabili e ricette della tradizione romana.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. IL PANE */}
          <Link
            href="/panetteria"
            className="group relative rounded-3xl overflow-hidden aspect-4/5 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-[#F5A16C]/20"
          >
            <img
              src="https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80"
              alt="Il Pane SFORNAMÌ"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#57382E]/90 via-[#57382E]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs font-bold text-[#FFE29A] uppercase tracking-wider">
                1. Tradizione & Farine
              </span>
              <h3 className="text-2xl font-black">IL PANE</h3>
              <p className="text-xs text-white/90">La bontà della tradizione.</p>
              <div className="pt-2 flex items-center text-xs font-bold text-[#FFE29A] gap-1 group-hover:translate-x-1 transition-transform">
                <span>Scopri il pane</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* 2. I DOLCI */}
          <Link
            href="/pasticceria"
            className="group relative rounded-3xl overflow-hidden aspect-4/5 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-[#F28BA6]/30"
          >
            <img
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80"
              alt="I Dolci SFORNAMÌ"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#57382E]/90 via-[#57382E]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs font-bold text-[#F28BA6] uppercase tracking-wider">
                2. Pasticceria Fresca
              </span>
              <h3 className="text-2xl font-black">I DOLCI</h3>
              <p className="text-xs text-white/90">Piccoli momenti di felicità.</p>
              <div className="pt-2 flex items-center text-xs font-bold text-[#FFE29A] gap-1 group-hover:translate-x-1 transition-transform">
                <span>Assaggia i dolci</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* 3. LE TORTE */}
          <Link
            href="/torte-personalizzate"
            className="group relative rounded-3xl overflow-hidden aspect-4/5 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-[#FFE29A]/60"
          >
            <img
              src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80"
              alt="Le Torte SFORNAMÌ"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#57382E]/90 via-[#57382E]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs font-bold text-[#FFE29A] uppercase tracking-wider">
                3. Su Ordinazione
              </span>
              <h3 className="text-2xl font-black">LE TORTE</h3>
              <p className="text-xs text-white/90">Speciali come le tue occasioni.</p>
              <div className="pt-2 flex items-center text-xs font-bold text-[#FFE29A] gap-1 group-hover:translate-x-1 transition-transform">
                <span>Personalizza la tua torta</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* 4. LE NOSTRE GOLOSITÀ */}
          <Link
            href="/menu"
            className="group relative rounded-3xl overflow-hidden aspect-4/5 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-[#A8D8BD]/40"
          >
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
              alt="Le Nostre Golosità"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#57382E]/90 via-[#57382E]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs font-bold text-[#A8D8BD] uppercase tracking-wider">
                4. Pizza & Specialità
              </span>
              <h3 className="text-2xl font-black">LE NOSTRE GOLOSITÀ</h3>
              <p className="text-xs text-white/90">Tutto da scoprire.</p>
              <div className="pt-2 flex items-center text-xs font-bold text-[#FFE29A] gap-1 group-hover:translate-x-1 transition-transform">
                <span>Vedi tutte le bontà</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. I PIÙ AMATI DAI NOSTRI CLIENTI (BESTSELLERS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F28BA6]/20 text-[#D86B86] text-xs font-black uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#D86B86]" />
              <span>I Preferiti di Sempre</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#57382E]">
              I Più Amati dai Nostri Clienti
            </h2>
            <p className="text-sm text-[#7E5649] mt-1">
              I prodotti che ogni giorno vanno a ruba nel nostro laboratorio a Roma.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-black text-[#DE7E42] hover:text-[#57382E] transition-colors"
          >
            <span>Vedi tutto il catalogo ({products.length} prodotti)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. LE BONTÀ DELLA SETTIMANA & SPOTLIGHT ARTIGIANALE */}
      <section className="bg-linear-to-r from-[#FDE8ED] via-[#FFF8EF] to-[#FFE29A]/30 py-16 border-y border-[#F5A16C]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-[#F5A16C] text-white text-xs font-black tracking-wider uppercase shadow-xs">
              Sfornati Questa Settimana
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#57382E]">
              Le Bontà della Settimana
            </h2>
            <p className="text-sm text-[#7E5649]">
              Specialità del momento preparate con ingredienti stagionali a tiratura limitata.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {weeklySpecials.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. LA STORIA DI SFORNAMÌ ("DIETRO OGNI BUONA COSA C'È UNA STORIA") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[40px] p-8 sm:p-12 md:p-16 border-2 border-[#F5A16C]/25 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFE29A] text-[#57382E] text-xs font-black uppercase tracking-wider">
              <span>Passione per le cose buone</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#57382E] leading-tight">
              DIETRO OGNI BUONA COSA C'È UNA STORIA.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#7E5649] leading-relaxed">
              <p>
                <strong>SFORNAMÌ</strong> nasce dal sogno semplice e profondo di riportare sulle tavole di Roma il sapore autentico delle cose fatte a mano, con pazienza, rispetto dei tempi e materie prime d’eccellenza.
              </p>
              <p>
                Non usiamo semilavorati, conservanti o acceleratori di lievitazione. Il nostro laboratorio è vivo: la farina nell’aria, il profumo della scorza d’arancia negli impasti mattutini e il lievito madre che rinfreschiamo ogni singolo giorno da generazioni.
              </p>
              <p>
                Che si tratti di una pagnotta di Lariano croccante, di una teglia di pizza bianca appena oliata o di un vassoio di maritozzi con panna fresca, il nostro obiettivo è uno solo: regalarvi un pizzico di felicità autentica.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/chi-siamo"
                className="px-6 py-3 rounded-full bg-[#57382E] hover:bg-[#7E5649] text-white font-bold text-sm transition-all shadow-md"
              >
                Scopri la nostra storia completa
              </Link>
              <Link
                href="/torte-personalizzate"
                className="px-6 py-3 rounded-full bg-[#F28BA6] hover:bg-[#D86B86] text-white font-bold text-sm transition-all shadow-md"
              >
                Richiedi una torta speciale
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
                alt="Impasti artigianali"
                className="w-full h-48 sm:h-56 object-cover rounded-3xl shadow-md"
              />
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
                alt="Pane sfornato"
                className="w-full h-64 sm:h-72 object-cover rounded-3xl shadow-md"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src="https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80"
                alt="Preparazione crostata"
                className="w-full h-64 sm:h-72 object-cover rounded-3xl shadow-md"
              />
              <img
                src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80"
                alt="Torta decorata a mano"
                className="w-full h-48 sm:h-56 object-cover rounded-3xl shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. LA QUALITÀ DEGLI INGREDIENTI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-[#A8D8BD]/40 text-[#57382E] text-xs font-black tracking-wider uppercase">
            Senza Scorciatoie
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#57382E]">
            La Qualità dei Nostri Ingredienti
          </h2>
          <p className="text-sm text-[#7E5649]">
            Selezioniamo con cura maniacale fornitori locali, farine italiane e materie prime pure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-[#F5A16C]/25 shadow-xs hover:shadow-lg transition-all space-y-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE29A] mx-auto flex items-center justify-center text-3xl">
              🌾
            </div>
            <h4 className="text-lg font-black text-[#57382E]">Lievito Madre Centenario</h4>
            <p className="text-xs text-[#7E5649] leading-relaxed">
              Il cuore pulsante del nostro forno. Fermentazione naturale che dona digeribilità straordinaria e profumi inconfondibili.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-[#F5A16C]/25 shadow-xs hover:shadow-lg transition-all space-y-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F5A16C]/20 mx-auto flex items-center justify-center text-3xl">
              🪵
            </div>
            <h4 className="text-lg font-black text-[#57382E]">Farine Macinate a Pietra</h4>
            <p className="text-xs text-[#7E5649] leading-relaxed">
              Grani 100% italiani non raffinati, ricchi di germe di grano vivo, fibre naturali e sapore vero della terra.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-[#F5A16C]/25 shadow-xs hover:shadow-lg transition-all space-y-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE29A] mx-auto flex items-center justify-center text-3xl">
              🥚
            </div>
            <h4 className="text-lg font-black text-[#57382E]">Uova Biologiche Laziali</h4>
            <p className="text-xs text-[#7E5649] leading-relaxed">
              Da galline allevate all’aperto a terra. Tuorli dorati e ricchi che donano alle nostre creme e brioche un colore inimitabile.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-[#F5A16C]/25 shadow-xs hover:shadow-lg transition-all space-y-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F28BA6]/20 mx-auto flex items-center justify-center text-3xl">
              🧈
            </div>
            <h4 className="text-lg font-black text-[#57382E]">Burro di Centrifuga</h4>
            <p className="text-xs text-[#7E5649] leading-relaxed">
              Puro burro di latteria ad alto punto di fusione. Niente margarina o oli idrogenati, solo fragranza e leggerezza.
            </p>
          </div>
        </div>
      </section>

      {/* 7. COME FUNZIONA ORDINARE (INVITO A ORDINARE ONLINE) */}
      <section className="bg-[#FFE29A]/30 py-16 border-y border-[#F5A16C]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-[#DE7E42] text-white text-xs font-black tracking-wider uppercase">
              Semplice, Veloce e Senza File
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#57382E]">
              Ordinare da SFORNAMÌ è Semplicissimo
            </h2>
            <p className="text-sm text-[#7E5649]">
              Scegli dal catalogo o chatta con noi: prepariamo tutto caldo per l'orario che preferisci.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-[#F5A16C]/30 shadow-sm relative text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F5A16C] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                1
              </div>
              <h4 className="text-lg font-black text-[#57382E]">Scegli le tue bontà</h4>
              <p className="text-xs text-[#7E5649] leading-relaxed">
                Naviga tra pane, pizza alla pala, crostate, maritozzi e biscotti freschi sul catalogo interattivo.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-[#F5A16C]/30 shadow-sm relative text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F28BA6] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                2
              </div>
              <h4 className="text-lg font-black text-[#57382E]">Ordina dal Sito o WhatsApp</h4>
              <p className="text-xs text-[#7E5649] leading-relaxed">
                Conferma in un click sul sito oppure invia direttamente il carrello già compilato su WhatsApp al nostro laboratorio.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-[#F5A16C]/30 shadow-sm relative text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#A8D8BD] text-[#57382E] font-black text-lg flex items-center justify-center mx-auto shadow-md">
                3
              </div>
              <h4 className="text-lg font-black text-[#57382E]">Consegna Diretta a Casa</h4>
              <p className="text-xs text-[#7E5649] leading-relaxed">
                Dal nostro laboratorio artigianale nel quartiere Torraccia (00156 Roma) direttamente a casa tua: ricevi il tuo ordine caldo e fragrante a domicilio.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F5A16C] hover:bg-[#DE7E42] text-white font-black text-base shadow-xl transition-all hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>INIZIA IL TUO ORDINE ADESSO</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. RECENSIONI DEI CLIENTI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-[#FFE29A] text-[#57382E] text-xs font-black tracking-wider uppercase">
            Dicono di Noi
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#57382E]">
            Chi Ha Già Assaggiato SFORNAMÌ
          </h2>
          <p className="text-sm text-[#7E5649]">
            I sorrisi e le parole dei nostri affezionati clienti a Roma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 border-2 border-[#F5A16C]/20 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#DE7E42]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#DE7E42]" />
                  ))}
                </div>
                <p className="text-xs text-[#57382E] leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F5A16C]/15 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-black text-[#57382E]">{rev.name}</h5>
                  <p className="text-[10px] text-[#9E7D73]">{rev.zone}</p>
                </div>
                <span className="text-[10px] font-semibold text-[#A8D8BD] px-2 py-0.5 rounded-md bg-[#A8D8BD]/20">
                  Verificato
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. INSTAGRAM FEED INTERATTIVO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F28BA6]">
              Seguici nel Backstage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#57382E]">
              Dal Nostro Profilo Instagram
            </h2>
            <p className="text-xs text-[#7E5649]">
              Ogni giorno storie di impasti, sfornate in diretta e nuove creazioni.
            </p>
          </div>

          <a
            href={`https://instagram.com/${INITIAL_STORE_SETTINGS.instagramHandle.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#F28BA6] text-[#D86B86] hover:bg-[#F28BA6] hover:text-white font-bold text-xs shadow-xs transition-all"
          >
            <span>{INITIAL_STORE_SETTINGS.instagramHandle}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {instagramPosts.map((post, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl overflow-hidden aspect-square bg-[#FFE29A]/30 shadow-xs hover:shadow-xl transition-all"
            >
              <img
                src={post.img}
                alt="Post Instagram SFORNAMÌ"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white text-xs">
                <p className="line-clamp-2 text-[11px] font-medium leading-snug">
                  {post.caption}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[#FFE29A] font-bold text-[10px]">
                  <Heart className="w-3.5 h-3.5 fill-[#F28BA6] text-[#F28BA6]" />
                  <span>{post.likes} Mi piace</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
