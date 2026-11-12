'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Star,
  ShoppingBag,
  ChevronRight,
  Truck,
} from 'lucide-react';
import { HomePageContent, Product } from '@/lib/types';
import { DataService } from '@/lib/store';
import { ProductCard } from '@/components/products/ProductCard';
import { INITIAL_HOMEPAGE_CONTENT, INITIAL_STORE_SETTINGS } from '@/lib/initialData';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [homeContent, setHomeContent] = useState<HomePageContent>(INITIAL_HOMEPAGE_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Instant hydration from cached storage if present
    const cachedProducts = DataService.getCachedProducts();
    if (cachedProducts && cachedProducts.length > 0) {
      setProducts(cachedProducts);
      setLoading(false);
    }

    Promise.all([
      DataService.getProducts(),
      DataService.getHomepageContent(),
    ]).then(([items, content]) => {
      setProducts(items);
      if (content) setHomeContent(content);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const handleUpdate = (e: any) => {
      if (e.detail) setHomeContent(e.detail);
    };
    window.addEventListener('sfornami_homepage_updated', handleUpdate);
    return () => window.removeEventListener('sfornami_homepage_updated', handleUpdate);
  }, []);

  const bestsellers = products.filter(p => p.isFeatured).slice(0, 4);
  const weeklySpecials = products.filter(p => p.isWeeklySpecial || p.isSeasonal).slice(0, 3);

  const hc = homeContent || INITIAL_HOMEPAGE_CONTENT;

  return (
    <div className="space-y-16 md:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-4 pb-12 md:py-20 bg-linear-to-b from-[#FFF8EF] via-[#FEEFE6]/60 to-[#FFF8EF]">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FFE29A]/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#F28BA6]/20 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE29A] text-[#57382E] text-xs font-black tracking-wide shadow-xs">
                <Sparkles className="w-4 h-4 text-[#DE7E42]" />
                <span>{hc.heroBadge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#57382E] tracking-tight leading-[1.1]">
                {hc.heroTitle}{' '}
                <span className="text-[#DE7E42] underline decoration-[#F28BA6] decoration-wavy decoration-2">
                  {hc.heroTitleHighlight}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#7E5649] max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                {hc.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href={hc.heroPrimaryBtnLink || '/menu'}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#F5A16C] hover:bg-[#DE7E42] text-white font-black text-sm tracking-wide shadow-xl shadow-[#F5A16C]/35 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{hc.heroPrimaryBtnText}</span>
                </Link>

                <Link
                  href={hc.heroSecondaryBtnLink || '/panetteria'}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-[#FFE29A]/50 text-[#57382E] font-black text-sm border-2 border-[#F5A16C]/40 shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>{hc.heroSecondaryBtnText}</span>
                  <ArrowRight className="w-4 h-4 text-[#DE7E42]" />
                </Link>
              </div>

              {/* Fast trust highlights */}
              <div className="pt-6 border-t border-[#F5A16C]/25 grid grid-cols-3 gap-2 text-center lg:text-left">
                <div>
                  <p className="text-lg md:text-xl font-black text-[#57382E]">{hc.trustItem1Value}</p>
                  <p className="text-[11px] text-[#7E5649] font-semibold">{hc.trustItem1Label}</p>
                </div>
                <div>
                  <p className="text-lg md:text-xl font-black text-[#57382E]">{hc.trustItem2Value}</p>
                  <p className="text-[11px] text-[#7E5649] font-semibold">{hc.trustItem2Label}</p>
                </div>
                <div>
                  <p className="text-lg md:text-xl font-black text-[#57382E]">{hc.trustItem3Value}</p>
                  <p className="text-[11px] text-[#7E5649] font-semibold">{hc.trustItem3Label}</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative aspect-4/3 sm:aspect-square rounded-[36px] overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src={hc.heroImageUrl}
                    alt={hc.heroImageTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="px-3 py-1 rounded-full bg-[#F28BA6] text-white text-[10px] font-black uppercase tracking-wider">
                      {hc.heroImageTag}
                    </span>
                    <h3 className="text-lg font-black mt-1">{hc.heroImageTitle}</h3>
                  </div>
                </div>

                {/* Floating badge top right */}
                <div className="absolute -top-4 -right-4 bg-white p-3.5 rounded-3xl shadow-xl border border-[#FFE29A] flex items-center gap-3">
                  <span className="text-3xl">🥐</span>
                  <div>
                    <p className="text-xs font-black text-[#57382E]">{hc.heroFloatBadge1Text}</p>
                    <p className="text-[10px] font-bold text-[#DE7E42]">{hc.heroFloatBadge1Sub}</p>
                  </div>
                </div>

                {/* Floating badge bottom left */}
                <div className="absolute -bottom-5 -left-4 bg-white p-3.5 rounded-3xl shadow-xl border border-[#A8D8BD] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#A8D8BD]/30 flex items-center justify-center text-emerald-700">
                    <Truck className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#57382E]">{hc.heroFloatBadge2Text}</p>
                    <p className="text-[10px] text-[#7E5649]">{hc.heroFloatBadge2Sub}</p>
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
            {hc.categoriesBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#57382E]">
            {hc.categoriesTitle}
          </h2>
          <p className="text-sm text-[#7E5649]">
            {hc.categoriesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(hc.categoriesCards || []).map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className="group relative rounded-3xl overflow-hidden aspect-4/5 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-[#F5A16C]/20"
            >
              <img
                src={cat.imageUrl}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#57382E]/90 via-[#57382E]/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs font-bold text-[#FFE29A] uppercase tracking-wider">
                  {cat.tag}
                </span>
                <h3 className="text-2xl font-black">{cat.title}</h3>
                <p className="text-xs text-white/90">{cat.subtitle}</p>
                <div className="pt-2 flex items-center text-xs font-bold text-[#FFE29A] gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Esplora</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. I PIÙ AMATI DAI NOSTRI CLIENTI (BESTSELLERS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F28BA6]/20 text-[#D86B86] text-xs font-black uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#D86B86]" />
              <span>{hc.bestsellersBadge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#57382E]">
              {hc.bestsellersTitle}
            </h2>
            <p className="text-sm text-[#7E5649] mt-1">
              {hc.bestsellersSubtitle}
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

      {/* 4. LE BONTÀ DELLA SETTIMANA */}
      <section className="bg-linear-to-r from-[#FDE8ED] via-[#FFF8EF] to-[#FFE29A]/30 py-16 border-y border-[#F5A16C]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-[#F5A16C] text-white text-xs font-black tracking-wider uppercase shadow-xs">
              {hc.weeklyBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#57382E]">
              {hc.weeklyTitle}
            </h2>
            <p className="text-sm text-[#7E5649]">
              {hc.weeklySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {weeklySpecials.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. LA STORIA DI SFORNAMÌ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[40px] p-8 sm:p-12 md:p-16 border-2 border-[#F5A16C]/25 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFE29A] text-[#57382E] text-xs font-black uppercase tracking-wider">
              <span>{hc.storyBadge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#57382E] leading-tight">
              {hc.storyTitle}
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#7E5649] leading-relaxed">
              <p>{hc.storyParagraph1}</p>
              <p>{hc.storyParagraph2}</p>
              <p>{hc.storyParagraph3}</p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href={hc.storyBtn1Link || '/chi-siamo'}
                className="px-6 py-3 rounded-full bg-[#57382E] hover:bg-[#7E5649] text-white font-bold text-sm transition-all shadow-md"
              >
                {hc.storyBtn1Text}
              </Link>
              <Link
                href={hc.storyBtn2Link || '/torte-personalizzate'}
                className="px-6 py-3 rounded-full bg-[#F28BA6] hover:bg-[#D86B86] text-white font-bold text-sm transition-all shadow-md"
              >
                {hc.storyBtn2Text}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src={hc.storyImages?.[0] || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80'}
                alt="Impasti artigianali"
                className="w-full h-48 sm:h-56 object-cover rounded-3xl shadow-md"
              />
              <img
                src={hc.storyImages?.[1] || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'}
                alt="Pane sfornato"
                className="w-full h-64 sm:h-72 object-cover rounded-3xl shadow-md"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src={hc.storyImages?.[2] || 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80'}
                alt="Preparazione crostata"
                className="w-full h-64 sm:h-72 object-cover rounded-3xl shadow-md"
              />
              <img
                src={hc.storyImages?.[3] || 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80'}
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
            {hc.ingredientsBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#57382E]">
            {hc.ingredientsTitle}
          </h2>
          <p className="text-sm text-[#7E5649]">
            {hc.ingredientsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(hc.ingredients || []).map((ing, idx) => (
            <div key={idx} className="bg-white p-7 rounded-3xl border border-[#F5A16C]/25 shadow-xs hover:shadow-lg transition-all space-y-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#FFE29A] mx-auto flex items-center justify-center text-3xl">
                {ing.icon}
              </div>
              <h4 className="text-lg font-black text-[#57382E]">{ing.title}</h4>
              <p className="text-xs text-[#7E5649] leading-relaxed">
                {ing.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. COME FUNZIONA ORDINARE */}
      <section className="bg-[#FFE29A]/30 py-16 border-y border-[#F5A16C]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-[#DE7E42] text-white text-xs font-black tracking-wider uppercase">
              {hc.howItWorksBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#57382E]">
              {hc.howItWorksTitle}
            </h2>
            <p className="text-sm text-[#7E5649]">
              {hc.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(hc.howItWorksSteps || []).map((step, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-[#F5A16C]/30 shadow-sm relative text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#F5A16C] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                  {step.step || idx + 1}
                </div>
                <h4 className="text-lg font-black text-[#57382E]">{step.title}</h4>
                <p className="text-xs text-[#7E5649] leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
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
            {hc.reviewsBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#57382E]">
            {hc.reviewsTitle}
          </h2>
          <p className="text-sm text-[#7E5649]">
            {hc.reviewsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(hc.reviews || []).map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 border-2 border-[#F5A16C]/20 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#DE7E42]">
                  {[...Array(rev.rating || 5)].map((_, i) => (
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
              {hc.instagramBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#57382E]">
              {hc.instagramTitle}
            </h2>
            <p className="text-xs text-[#7E5649]">
              {hc.instagramSubtitle}
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
          {(hc.instagramPosts || []).map((post, idx) => (
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
