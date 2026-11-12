'use client';

import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  Image as ImageIcon,
  Star,
  Plus,
  Trash2,
  Layers,
  BookOpen,
  MessageSquare,
  Camera,
  ShoppingBag,
} from 'lucide-react';
import { DataService } from '@/lib/store';
import { HomePageContent } from '@/lib/types';
import { INITIAL_HOMEPAGE_CONTENT } from '@/lib/initialData';

export default function AdminHomepagePage() {
  const [content, setContent] = useState<HomePageContent>(INITIAL_HOMEPAGE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'categories' | 'story' | 'ingredients' | 'howItWorks' | 'reviews' | 'instagram'>('hero');

  useEffect(() => {
    DataService.getHomepageContent().then(data => {
      if (data) setContent(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await DataService.saveHomepageContent(content);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err) {
      alert('Errore durante il salvataggio nel database PostgreSQL.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Sei sicuro di voler ripristinare i testi e le impostazioni originali della homepage?')) {
      setContent(INITIAL_HOMEPAGE_CONTENT);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#F5A16C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#57382E]">Caricamento contenuti dal Database Postgres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE29A] text-[#57382E] text-xs font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#DE7E42]" />
            <span>PostgreSQL CMS Live</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#57382E]">
            Modifica Homepage
          </h1>
          <p className="text-xs text-[#7E5649]">
            Modifica testi, titoli, foto, bottoni, recensioni e sezioni. I dati vengono salvati direttamente nel database PostgreSQL e aggiornati istantaneamente su smartphone, tablet e PC.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#F5A16C]/40 text-[#7E5649] hover:bg-[#FFF8EF] font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ripristina</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-[#DE7E42] hover:bg-[#c96c34] text-white font-black text-xs flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
            <span>{saving ? 'Salvataggio in Postgres...' : 'SALVA IN POSTGRES'}</span>
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Tutte le modifiche della homepage sono state salvate con successo nel database PostgreSQL! La homepage su mobile e desktop è ora sincronizzata.</span>
          </div>
          <a
            href="/"
            target="_blank"
            className="underline inline-flex items-center gap-1 hover:text-emerald-700 font-black ml-4"
          >
            <span>Apri il sito</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#F5A16C]/20">
        {[
          { id: 'hero', name: '1. Sezione Hero', icon: Sparkles },
          { id: 'categories', name: '2. 4 Categorie', icon: Layers },
          { id: 'story', name: '3. Storia & Forno', icon: BookOpen },
          { id: 'ingredients', name: '4. Ingredienti', icon: ShoppingBag },
          { id: 'howItWorks', name: '5. Come Funziona', icon: CheckCircle2 },
          { id: 'reviews', name: '6. Recensioni Clienti', icon: MessageSquare },
          { id: 'instagram', name: '7. Instagram Feed', icon: Camera },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#57382E] text-white shadow-sm'
                  : 'bg-white text-[#7E5649] hover:bg-[#FFF8EF] border border-[#F5A16C]/25'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#DE7E42]" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT FORMS */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-sm space-y-8">
        {/* 1. HERO TAB */}
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-[#57382E]">Modifica Sezione Hero (Intestazione Principale)</h3>
              <p className="text-xs text-[#7E5649]">Personalizza i testi, la foto grande e i pulsanti che i visitatori vedono appena entrano.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#57382E] mb-1">Badge Superiore:</label>
                <input
                  type="text"
                  value={content.heroBadge}
                  onChange={e => setContent({ ...content, heroBadge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#57382E] mb-1">Titolo Principale (Prima Parte):</label>
                <input
                  type="text"
                  value={content.heroTitle}
                  onChange={e => setContent({ ...content, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#57382E] mb-1">Parola/Frase Evidenziata a Colori:</label>
                <input
                  type="text"
                  value={content.heroTitleHighlight}
                  onChange={e => setContent({ ...content, heroTitleHighlight: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#57382E] mb-1">Sottotitolo Descrittivo:</label>
                <textarea
                  rows={3}
                  value={content.heroSubtitle}
                  onChange={e => setContent({ ...content, heroSubtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#57382E] mb-1">Testo Bottone Primario:</label>
                <input
                  type="text"
                  value={content.heroPrimaryBtnText}
                  onChange={e => setContent({ ...content, heroPrimaryBtnText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#57382E] mb-1">Link Bottone Primario:</label>
                <input
                  type="text"
                  value={content.heroPrimaryBtnLink}
                  onChange={e => setContent({ ...content, heroPrimaryBtnLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#57382E] mb-1">Testo Bottone Secondario:</label>
                <input
                  type="text"
                  value={content.heroSecondaryBtnText}
                  onChange={e => setContent({ ...content, heroSecondaryBtnText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#57382E] mb-1">Link Bottone Secondario:</label>
                <input
                  type="text"
                  value={content.heroSecondaryBtnLink}
                  onChange={e => setContent({ ...content, heroSecondaryBtnLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                />
              </div>
            </div>

            {/* Hero Image & Badges */}
            <div className="pt-4 border-t border-[#F5A16C]/20 space-y-4">
              <h4 className="text-sm font-black text-[#57382E]">Immagine Principale e Badge Grafici</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#57382E] mb-1">URL Fotografia Tavolo Hero:</label>
                  <input
                    type="url"
                    value={content.heroImageUrl}
                    onChange={e => setContent({ ...content, heroImageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#57382E] mb-1">Tag Sovrapposto Foto (es. Appena Sfornato):</label>
                  <input
                    type="text"
                    value={content.heroImageTag}
                    onChange={e => setContent({ ...content, heroImageTag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#57382E] mb-1">Titolo Sovrapposto Foto:</label>
                  <input
                    type="text"
                    value={content.heroImageTitle}
                    onChange={e => setContent({ ...content, heroImageTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#57382E] mb-1">Badge Fluttuante 1 (Titolo):</label>
                  <input
                    type="text"
                    value={content.heroFloatBadge1Text}
                    onChange={e => setContent({ ...content, heroFloatBadge1Text: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#57382E] mb-1">Badge Fluttuante 1 (Sottotitolo):</label>
                  <input
                    type="text"
                    value={content.heroFloatBadge1Sub}
                    onChange={e => setContent({ ...content, heroFloatBadge1Sub: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#57382E] mb-1">Badge Fluttuante 2 (Titolo):</label>
                  <input
                    type="text"
                    value={content.heroFloatBadge2Text}
                    onChange={e => setContent({ ...content, heroFloatBadge2Text: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#57382E] mb-1">Badge Fluttuante 2 (Sottotitolo):</label>
                  <input
                    type="text"
                    value={content.heroFloatBadge2Sub}
                    onChange={e => setContent({ ...content, heroFloatBadge2Sub: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E]"
                  />
                </div>
              </div>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 border-t border-[#F5A16C]/20 space-y-3">
              <h4 className="text-sm font-black text-[#57382E]">I 3 Elementi di Garanzia / Fiducia (Trust Bar)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#FFF8EF] rounded-2xl border border-[#F5A16C]/20 space-y-1.5">
                  <input
                    type="text"
                    value={content.trustItem1Value}
                    onChange={e => setContent({ ...content, trustItem1Value: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-white border border-[#F5A16C]/30 text-xs font-black"
                  />
                  <input
                    type="text"
                    value={content.trustItem1Label}
                    onChange={e => setContent({ ...content, trustItem1Label: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-white border border-[#F5A16C]/30 text-[11px]"
                  />
                </div>

                <div className="p-3 bg-[#FFF8EF] rounded-2xl border border-[#F5A16C]/20 space-y-1.5">
                  <input
                    type="text"
                    value={content.trustItem2Value}
                    onChange={e => setContent({ ...content, trustItem2Value: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-white border border-[#F5A16C]/30 text-xs font-black"
                  />
                  <input
                    type="text"
                    value={content.trustItem2Label}
                    onChange={e => setContent({ ...content, trustItem2Label: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-white border border-[#F5A16C]/30 text-[11px]"
                  />
                </div>

                <div className="p-3 bg-[#FFF8EF] rounded-2xl border border-[#F5A16C]/20 space-y-1.5">
                  <input
                    type="text"
                    value={content.trustItem3Value}
                    onChange={e => setContent({ ...content, trustItem3Value: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-white border border-[#F5A16C]/30 text-xs font-black"
                  />
                  <input
                    type="text"
                    value={content.trustItem3Label}
                    onChange={e => setContent({ ...content, trustItem3Label: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-white border border-[#F5A16C]/30 text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-[#57382E]">Le 4 Categorie Grafiche Principali</h3>
              <p className="text-xs text-[#7E5649]">Personalizza titoli, etichette e fotografie delle quattro sezioni grafiche.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#57382E] mb-1">Badge Sezione:</label>
                <input
                  type="text"
                  value={content.categoriesBadge}
                  onChange={e => setContent({ ...content, categoriesBadge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#57382E] mb-1">Titolo Sezione:</label>
                <input
                  type="text"
                  value={content.categoriesTitle}
                  onChange={e => setContent({ ...content, categoriesTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#57382E] mb-1">Sottotitolo Sezione:</label>
                <input
                  type="text"
                  value={content.categoriesSubtitle}
                  onChange={e => setContent({ ...content, categoriesSubtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {content.categoriesCards.map((cat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5A16C]/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#DE7E42]">Categoria #{idx + 1}</span>
                    <span className="text-[10px] text-[#7E5649] font-bold">{cat.title}</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#57382E]">Titolo:</label>
                    <input
                      type="text"
                      value={cat.title}
                      onChange={e => {
                        const updated = [...content.categoriesCards];
                        updated[idx].title = e.target.value;
                        setContent({ ...content, categoriesCards: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F5A16C]/30 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#57382E]">Sottotitolo / Frase:</label>
                    <input
                      type="text"
                      value={cat.subtitle}
                      onChange={e => {
                        const updated = [...content.categoriesCards];
                        updated[idx].subtitle = e.target.value;
                        setContent({ ...content, categoriesCards: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F5A16C]/30 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#57382E]">Etichetta / Tag (es. 1. Tradizione & Farine):</label>
                    <input
                      type="text"
                      value={cat.tag}
                      onChange={e => {
                        const updated = [...content.categoriesCards];
                        updated[idx].tag = e.target.value;
                        setContent({ ...content, categoriesCards: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F5A16C]/30 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#57382E]">URL Immagine:</label>
                    <input
                      type="url"
                      value={cat.imageUrl}
                      onChange={e => {
                        const updated = [...content.categoriesCards];
                        updated[idx].imageUrl = e.target.value;
                        setContent({ ...content, categoriesCards: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F5A16C]/30 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#57382E]">Link di destinazione:</label>
                    <input
                      type="text"
                      value={cat.link}
                      onChange={e => {
                        const updated = [...content.categoriesCards];
                        updated[idx].link = e.target.value;
                        setContent({ ...content, categoriesCards: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F5A16C]/30 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. STORY TAB */}
        {activeTab === 'story' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-[#57382E]">La Storia di SFORNAMÌ</h3>
              <p className="text-xs text-[#7E5649]">La narrazione del forno artigianale, i valori e la galleria a 4 foto.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#57382E] mb-1">Badge:</label>
                <input
                  type="text"
                  value={content.storyBadge}
                  onChange={e => setContent({ ...content, storyBadge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#57382E] mb-1">Titolo Sezione:</label>
                <input
                  type="text"
                  value={content.storyTitle}
                  onChange={e => setContent({ ...content, storyTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs"
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#57382E] mb-1">Paragrafo 1:</label>
                  <textarea
                    rows={3}
                    value={content.storyParagraph1}
                    onChange={e => setContent({ ...content, storyParagraph1: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#57382E] mb-1">Paragrafo 2:</label>
                  <textarea
                    rows={3}
                    value={content.storyParagraph2}
                    onChange={e => setContent({ ...content, storyParagraph2: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#57382E] mb-1">Paragrafo 3:</label>
                  <textarea
                    rows={3}
                    value={content.storyParagraph3}
                    onChange={e => setContent({ ...content, storyParagraph3: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#57382E] mb-1">Testo Bottone 1:</label>
                <input
                  type="text"
                  value={content.storyBtn1Text}
                  onChange={e => setContent({ ...content, storyBtn1Text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#57382E] mb-1">Testo Bottone 2:</label>
                <input
                  type="text"
                  value={content.storyBtn2Text}
                  onChange={e => setContent({ ...content, storyBtn2Text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#F5A16C]/20">
              <h4 className="text-sm font-black text-[#57382E] mb-2">Le 4 Fotografie del Laboratorio</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(content.storyImages || []).map((imgUrl, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#DE7E42] w-6 shrink-0">#{i + 1}</span>
                    <input
                      type="url"
                      value={imgUrl}
                      onChange={e => {
                        const updated = [...(content.storyImages || [])];
                        updated[i] = e.target.value;
                        setContent({ ...content, storyImages: updated });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. INGREDIENTS TAB */}
        {activeTab === 'ingredients' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-[#57382E]">La Qualità degli Ingredienti</h3>
              <p className="text-xs text-[#7E5649]">I quattro pilastri di qualità del laboratorio artigianale.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.ingredients.map((ing, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5A16C]/25 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ing.icon}
                      onChange={e => {
                        const updated = [...content.ingredients];
                        updated[idx].icon = e.target.value;
                        setContent({ ...content, ingredients: updated });
                      }}
                      className="w-12 px-2 py-1.5 rounded-lg bg-white border border-[#F5A16C]/30 text-center text-lg"
                      title="Emoji icona"
                    />
                    <input
                      type="text"
                      value={ing.title}
                      onChange={e => {
                        const updated = [...content.ingredients];
                        updated[idx].title = e.target.value;
                        setContent({ ...content, ingredients: updated });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#F5A16C]/30 text-xs font-bold"
                      placeholder="Titolo ingrediente"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={ing.text}
                    onChange={e => {
                      const updated = [...content.ingredients];
                      updated[idx].text = e.target.value;
                      setContent({ ...content, ingredients: updated });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#F5A16C]/30 text-xs text-[#7E5649]"
                    placeholder="Descrizione dell'ingrediente e origine"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. HOW IT WORKS TAB */}
        {activeTab === 'howItWorks' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-[#57382E]">Come Funziona Ordinare</h3>
              <p className="text-xs text-[#7E5649]">I tre semplici passaggi per ricevere l'ordine a domicilio o da asporto.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.howItWorksSteps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5A16C]/25 space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DE7E42] text-white text-[10px] font-black">
                    Passo #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={step.title}
                    onChange={e => {
                      const updated = [...content.howItWorksSteps];
                      updated[idx].title = e.target.value;
                      setContent({ ...content, howItWorksSteps: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#F5A16C]/30 text-xs font-bold"
                  />
                  <textarea
                    rows={4}
                    value={step.text}
                    onChange={e => {
                      const updated = [...content.howItWorksSteps];
                      updated[idx].text = e.target.value;
                      setContent({ ...content, howItWorksSteps: updated });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#F5A16C]/30 text-xs text-[#7E5649]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#57382E]">Recensioni dei Clienti</h3>
                <p className="text-xs text-[#7E5649]">Aggiungi, modifica o rimuovi le testimonianze mostrate in home.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newRev = {
                    name: 'Nuovo Cliente',
                    zone: 'Roma',
                    rating: 5,
                    date: 'Oggi',
                    text: 'Prodotti fantastici, profumo e sapore autentici!',
                  };
                  setContent({ ...content, reviews: [...content.reviews, newRev] });
                }}
                className="px-3 py-1.5 rounded-xl bg-[#57382E] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Aggiungi Recensione</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.reviews.map((rev, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5A16C]/25 space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = content.reviews.filter((_, i) => i !== idx);
                      setContent({ ...content, reviews: updated });
                    }}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                    title="Elimina recensione"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="pr-6">
                    <label className="block text-[10px] font-bold text-[#57382E]">Nome Cliente:</label>
                    <input
                      type="text"
                      value={rev.name}
                      onChange={e => {
                        const updated = [...content.reviews];
                        updated[idx].name = e.target.value;
                        setContent({ ...content, reviews: updated });
                      }}
                      className="w-full px-2.5 py-1 rounded-lg bg-white border border-[#F5A16C]/30 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#57382E]">Zona / Quartiere (es. Torraccia, Roma):</label>
                    <input
                      type="text"
                      value={rev.zone}
                      onChange={e => {
                        const updated = [...content.reviews];
                        updated[idx].zone = e.target.value;
                        setContent({ ...content, reviews: updated });
                      }}
                      className="w-full px-2.5 py-1 rounded-lg bg-white border border-[#F5A16C]/30 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#57382E]">Testo della Recensione:</label>
                    <textarea
                      rows={3}
                      value={rev.text}
                      onChange={e => {
                        const updated = [...content.reviews];
                        updated[idx].text = e.target.value;
                        setContent({ ...content, reviews: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F5A16C]/30 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. INSTAGRAM TAB */}
        {activeTab === 'instagram' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-[#57382E]">Feed e Galleria Instagram</h3>
              <p className="text-xs text-[#7E5649]">I 4 post quadrati che mostrano il backstage e i prodotti sfornati.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.instagramPosts.map((post, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5A16C]/25 space-y-2">
                  <span className="text-[10px] font-black text-[#DE7E42] block">Foto #{idx + 1}</span>
                  <div>
                    <label className="block text-[11px] font-bold text-[#57382E]">URL Immagine:</label>
                    <input
                      type="url"
                      value={post.img}
                      onChange={e => {
                        const updated = [...content.instagramPosts];
                        updated[idx].img = e.target.value;
                        setContent({ ...content, instagramPosts: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F5A16C]/30 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#57382E]">Didascalia Post:</label>
                    <input
                      type="text"
                      value={post.caption}
                      onChange={e => {
                        const updated = [...content.instagramPosts];
                        updated[idx].caption = e.target.value;
                        setContent({ ...content, instagramPosts: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F5A16C]/30 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#57382E]">Numero di Like fittizi / reali:</label>
                    <input
                      type="number"
                      value={post.likes}
                      onChange={e => {
                        const updated = [...content.instagramPosts];
                        updated[idx].likes = parseInt(e.target.value, 10) || 0;
                        setContent({ ...content, instagramPosts: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F5A16C]/30 text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Save Action */}
        <div className="pt-6 border-t border-[#F5A16C]/20 flex items-center justify-between">
          <p className="text-xs text-[#7E5649]">
            Tutte le modifiche vengono memorizzate su <strong>PostgreSQL</strong> con replica immediata.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-2xl bg-[#DE7E42] hover:bg-[#c96c34] text-white font-black text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
            <span>{saving ? 'Salvataggio in corso...' : 'SALVA TUTTO IN POSTGRESQL'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
