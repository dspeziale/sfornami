'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Check,
  Gift,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DataService } from '@/lib/store';
import { useSettings } from '@/context/SettingsContext';
import { generateWhatsAppCustomCakeMessage } from '@/lib/whatsapp';
import { CustomCakeConfig, CustomCakeRequest } from '@/lib/types';
import { INITIAL_CUSTOM_CAKE_CONFIG } from '@/lib/initialData';

export default function TortePersonalizzatePage() {
  const { settings } = useSettings();
  const [config, setConfig] = useState<CustomCakeConfig>(INITIAL_CUSTOM_CAKE_CONFIG);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Form selections
  const [selectedCakeTypeId, setSelectedCakeTypeId] = useState<string>('');
  const [servings, setServings] = useState<number>(10);
  const [selectedBaseId, setSelectedBaseId] = useState<string>('');
  const [selectedFillingId, setSelectedFillingId] = useState<string>('');
  const [selectedDecorationId, setSelectedDecorationId] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [requestedDate, setRequestedDate] = useState<string>('');
  const [requestedTime, setRequestedTime] = useState<string>('11:00');
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [submittedRequest, setSubmittedRequest] = useState<CustomCakeRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [minDateString, setMinDateString] = useState('');
  const [showSummaryBreakdown, setShowSummaryBreakdown] = useState(false);

  // Load config on mount
  useEffect(() => {
    async function load() {
      try {
        const cfg = await DataService.getCustomCakeConfig();
        setConfig(cfg);
        if (cfg.cakeTypes && cfg.cakeTypes.length > 0) {
          const firstActive = cfg.cakeTypes.find(c => c.isActive) || cfg.cakeTypes[0];
          setSelectedCakeTypeId(firstActive.id);
        }
        if (cfg.flavorBases && cfg.flavorBases.length > 0) {
          const firstActive = cfg.flavorBases.find(b => b.isActive) || cfg.flavorBases[0];
          setSelectedBaseId(firstActive.id);
        }
        if (cfg.fillings && cfg.fillings.length > 0) {
          const firstActive = cfg.fillings.find(f => f.isActive) || cfg.fillings[0];
          setSelectedFillingId(firstActive.id);
        }
        if (cfg.decorations && cfg.decorations.length > 0) {
          const firstActive = cfg.decorations.find(d => d.isActive) || cfg.decorations[0];
          setSelectedDecorationId(firstActive.id);
        }
        if (cfg.servingsOptions && cfg.servingsOptions.length > 0) {
          setServings(cfg.servingsOptions.includes(10) ? 10 : cfg.servingsOptions[0]);
        }
      } catch (e) {
        console.warn('Failed to load cake config:', e);
      } finally {
        setLoadingConfig(false);
      }
    }
    load();
  }, []);

  // Compute minimum selectable date based on config.minHoursNotice
  useEffect(() => {
    const hours = config.minHoursNotice || 48;
    const minTimestamp = Date.now() + hours * 3600 * 1000;
    const minD = new Date(minTimestamp);
    const dateStr = minD.toISOString().split('T')[0];
    setMinDateString(dateStr);
    if (!requestedDate || requestedDate < dateStr) {
      setRequestedDate(dateStr);
    }
  }, [config.minHoursNotice, requestedDate]);

  // Selected Objects
  const currentCakeType = useMemo(() => {
    return config.cakeTypes.find(c => c.id === selectedCakeTypeId) || config.cakeTypes[0];
  }, [config.cakeTypes, selectedCakeTypeId]);

  const currentBase = useMemo(() => {
    return config.flavorBases.find(b => b.id === selectedBaseId) || config.flavorBases[0];
  }, [config.flavorBases, selectedBaseId]);

  const currentFilling = useMemo(() => {
    return config.fillings.find(f => f.id === selectedFillingId) || config.fillings[0];
  }, [config.fillings, selectedFillingId]);

  const currentDecoration = useMemo(() => {
    return config.decorations.find(d => d.id === selectedDecorationId) || config.decorations[0];
  }, [config.decorations, selectedDecorationId]);

  // Price Calculation
  const estimatedTotal = useMemo(() => {
    const baseServingPrice = (config.basePricePerServing || 3.50) * servings;
    const cakeModifier = currentCakeType?.priceModifier || 0;
    const baseModifier = currentBase?.priceModifier || 0;
    const fillingModifier = currentFilling?.priceModifier || 0;
    const decorationModifier = currentDecoration?.priceModifier || 0;
    const dedicationCost = customText.trim() ? (config.customDedicationPrice || 0) : 0;

    let extrasCost = 0;
    selectedExtras.forEach(extraName => {
      const extraObj = config.extraAddons.find(e => e.name === extraName);
      if (extraObj) extrasCost += extraObj.price;
    });

    return baseServingPrice + cakeModifier + baseModifier + fillingModifier + decorationModifier + dedicationCost + extrasCost;
  }, [config, servings, currentCakeType, currentBase, currentFilling, currentDecoration, customText, selectedExtras]);

  // Weight Calculation
  const estimatedWeightKg = useMemo(() => {
    return ((config.servingWeightKg || 0.12) * servings).toFixed(1);
  }, [config.servingWeightKg, servings]);

  const toggleExtra = (extraName: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraName) ? prev.filter(e => e !== extraName) : [...prev, extraName]
    );
  };

  const handleSubmitSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Inserisci almeno Nome e Numero di Telefono per poter confermare la torta.');
      return;
    }

    if (!requestedDate) {
      setErrorMsg('Seleziona la data per la consegna o il ritiro della torta.');
      return;
    }

    setSubmitting(true);
    try {
      const cakeReqData: Omit<CustomCakeRequest, 'id' | 'createdAt' | 'status'> = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || '',
        cakeType: currentCakeType?.name || 'Torta Personalizzata',
        servings,
        flavorBase: currentBase?.name || 'Base Standard',
        filling: currentFilling?.name || 'Farcitura Standard',
        decoration: currentDecoration?.name || 'Decorazione Standard',
        customText: customText.trim() || undefined,
        selectedExtras: selectedExtras.length > 0 ? selectedExtras : undefined,
        estimatedPrice: estimatedTotal,
        requestedDate,
        requestedTime,
        referenceImageUrl: referenceImageUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      const created = await DataService.createCustomCakeRequest(cakeReqData);
      setSubmittedRequest(created);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setErrorMsg('Si è verificato un errore durante l’invio. Puoi comunque inviare la richiesta subito su WhatsApp!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendWhatsAppDirect = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Compila almeno il tuo Nome e Numero di Telefono prima di inviare su WhatsApp.');
      return;
    }

    const draftReq: CustomCakeRequest = {
      id: `cake-${Date.now()}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || '',
      cakeType: currentCakeType?.name || 'Torta Personalizzata',
      servings,
      flavorBase: currentBase?.name || 'Base Standard',
      filling: currentFilling?.name || 'Farcitura Standard',
      decoration: currentDecoration?.name || 'Decorazione Standard',
      customText: customText.trim() || undefined,
      selectedExtras: selectedExtras.length > 0 ? selectedExtras : undefined,
      estimatedPrice: estimatedTotal,
      requestedDate,
      requestedTime,
      referenceImageUrl: referenceImageUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      status: 'in_valutazione',
      createdAt: new Date().toISOString(),
    };

    // Also persist in background
    DataService.createCustomCakeRequest(draftReq).catch(console.warn);

    const waUrl = generateWhatsAppCustomCakeMessage({
      cakeRequest: draftReq,
      settings,
    });
    window.open(waUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-10">
      {/* HERO INTRO */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-4 py-1.5 rounded-full bg-[#FFE29A]/40 text-[#DE7E42] text-xs font-black tracking-wider uppercase inline-flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          {config.bannerBadge || 'Laboratorio Artigianale di Pasticceria • Roma'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#57382E] tracking-tight">
          {config.introTitle || 'Crea la Tua Torta dei Sogni'}
        </h1>
        <p className="text-xs sm:text-sm text-[#7E5649] leading-relaxed max-w-2xl mx-auto">
          {config.introSubtitle ||
            'Compleanni, cerimonie, lauree o una domenica speciale: personalizza ogni dettaglio del tuo dolce artigianale e ricevilo fresco a domicilio a Roma.'}
        </p>
      </div>

      {/* CONFIRMATION SCREEN IF SUBMITTED */}
      {submittedRequest ? (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-400 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
            🎂
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#57382E]">
              Richiesta Ricevuta con Successo!
            </h2>
            <p className="text-xs sm:text-sm text-[#7E5649] max-w-lg mx-auto">
              Grazie <strong>{submittedRequest.customerName}</strong>! I nostri maestri pasticceri hanno ricevuto le specifiche per la tua torta <strong>{submittedRequest.cakeType}</strong> da {submittedRequest.servings} persone.
            </p>
          </div>

          <div className="bg-[#FFF8EF] p-5 rounded-2xl border border-[#F5A16C]/25 text-left text-xs text-[#57382E] space-y-2">
            <div className="flex justify-between border-b border-[#F5A16C]/15 pb-2">
              <span className="font-bold">Codice Richiesta:</span>
              <span className="font-black text-[#DE7E42]">{submittedRequest.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Data & Ora Consegna:</span>
              <span>{submittedRequest.requestedDate} alle {submittedRequest.requestedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Preventivo Stimato:</span>
              <span className="font-black text-sm text-[#DE7E42]">€{submittedRequest.estimatedPrice?.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={() => {
                const waUrl = generateWhatsAppCustomCakeMessage({
                  cakeRequest: submittedRequest,
                  settings,
                });
                window.open(waUrl, '_blank');
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01]"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Avvisa Subito il Laboratorio su WhatsApp</span>
            </button>

            <button
              onClick={() => {
                setSubmittedRequest(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#7E5649] hover:underline block mx-auto pt-2"
            >
              Configura un&apos;altra torta
            </button>
          </div>
        </div>
      ) : (
        /* INTERACTIVE BUILDER FORM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* MAIN BUILDER COLUMN (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* STEP 1: TIPOLOGIA DI TORTA */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F5A16C]/25 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#57382E] text-white flex items-center justify-center text-xs font-black">
                  1
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#57382E]">
                    Scegli la Tipologia di Torta
                  </h2>
                  <p className="text-xs text-[#7E5649]">
                    Seleziona lo stile artigianale che fa da cuore alla tua creazione.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {config.cakeTypes.filter(c => c.isActive).map(cake => {
                  const isSelected = cake.id === selectedCakeTypeId;
                  return (
                    <div
                      key={cake.id}
                      onClick={() => setSelectedCakeTypeId(cake.id)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#DE7E42] bg-[#FFF8EF] shadow-md ring-2 ring-[#DE7E42]/20'
                          : 'border-[#F5A16C]/20 bg-white hover:border-[#DE7E42]/50 hover:bg-[#FFF8EF]/40'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-black text-[#57382E] flex items-center gap-1.5">
                            {cake.name}
                          </h3>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#DE7E42] text-white flex items-center justify-center text-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        {cake.description && (
                          <p className="text-xs text-[#7E5649] leading-relaxed">
                            {cake.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#F5A16C]/15">
                        {cake.isPopular ? (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFE29A] text-[#57382E] px-2 py-0.5 rounded-full">
                            ★ Più Richiesta
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="text-xs font-black text-[#DE7E42]">
                          {(cake.priceModifier || 0) > 0 ? `+€${(cake.priceModifier || 0).toFixed(2)}` : 'Incluso'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: QUANTE PERSONE (PORZIONI) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F5A16C]/25 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#57382E] text-white flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-[#57382E]">
                      Quante Persone Siete?
                    </h2>
                    <p className="text-xs text-[#7E5649]">
                      Calcoliamo le porzioni e il peso ideale per non sprecare e soddisfare tutti gli ospiti.
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1.5 rounded-xl bg-[#FFE29A]/50 text-[#57382E] font-black text-xs">
                  ⚖️ Circa {estimatedWeightKg} kg di torta
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-2">
                {config.servingsOptions.map(num => {
                  const isSelected = servings === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setServings(num)}
                      className={`py-3 px-1 rounded-2xl font-black text-xs transition-all flex flex-col items-center justify-center gap-0.5 border ${
                        isSelected
                          ? 'bg-[#57382E] text-white border-[#57382E] shadow-md scale-105'
                          : 'bg-[#FFF8EF] text-[#57382E] border-[#F5A16C]/30 hover:border-[#DE7E42]'
                      }`}
                    >
                      <span className="text-sm sm:text-base">{num}</span>
                      <span className="text-[9px] opacity-80">pers.</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: BASE & IMPASTO */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F5A16C]/25 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#57382E] text-white flex items-center justify-center text-xs font-black">
                  3
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#57382E]">
                    Scegli la Base & l&apos;Impasto
                  </h2>
                  <p className="text-xs text-[#7E5649]">
                    Tutti gli impasti sono preparati freschi con uova fresche italiane e burro selezionato.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {config.flavorBases.filter(b => b.isActive).map(base => {
                  const isSelected = base.id === selectedBaseId;
                  return (
                    <div
                      key={base.id}
                      onClick={() => setSelectedBaseId(base.id)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#DE7E42] bg-[#FFF8EF] shadow-sm'
                          : 'border-[#F5A16C]/20 bg-white hover:border-[#DE7E42]/50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-black text-[#57382E]">{base.name}</h4>
                        {base.description && (
                          <p className="text-[11px] text-[#7E5649]">{base.description}</p>
                        )}
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <span className="text-xs font-black text-[#DE7E42] block">
                          {(base.priceModifier || 0) > 0 ? `+€${(base.priceModifier || 0).toFixed(2)}` : 'Incluso'}
                        </span>
                        {isSelected && (
                          <span className="inline-block mt-1 w-4 h-4 rounded-full bg-[#DE7E42] text-white text-[10px] leading-4 text-center">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: FARCITURA & CREME */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F5A16C]/25 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#57382E] text-white flex items-center justify-center text-xs font-black">
                  4
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#57382E]">
                    Farcitura & Creme Golose
                  </h2>
                  <p className="text-xs text-[#7E5649]">
                    Creme montate a mano ogni mattina dal nostro pasticcere.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {config.fillings.filter(f => f.isActive).map(filling => {
                  const isSelected = filling.id === selectedFillingId;
                  return (
                    <div
                      key={filling.id}
                      onClick={() => setSelectedFillingId(filling.id)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#DE7E42] bg-[#FFF8EF] shadow-sm'
                          : 'border-[#F5A16C]/20 bg-white hover:border-[#DE7E42]/50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-black text-[#57382E]">{filling.name}</h4>
                          {filling.isPopular && (
                            <span className="text-[9px] font-black uppercase bg-[#FFE29A] text-[#57382E] px-1.5 py-0.5 rounded-md">
                              Consigliata
                            </span>
                          )}
                        </div>
                        {filling.description && (
                          <p className="text-[11px] text-[#7E5649]">{filling.description}</p>
                        )}
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <span className="text-xs font-black text-[#DE7E42] block">
                          {(filling.priceModifier || 0) > 0 ? `+€${(filling.priceModifier || 0).toFixed(2)}` : 'Incluso'}
                        </span>
                        {isSelected && (
                          <span className="inline-block mt-1 w-4 h-4 rounded-full bg-[#DE7E42] text-white text-[10px] leading-4 text-center">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 5: DECORAZIONE & SCRITTA DEDICA */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F5A16C]/25 shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#57382E] text-white flex items-center justify-center text-xs font-black">
                  5
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#57382E]">
                    Decorazione & Scritta di Auguri
                  </h2>
                  <p className="text-xs text-[#7E5649]">
                    Scegli la finitura estetica e personalizza la dedica scritta sulla torta.
                  </p>
                </div>
              </div>

              {/* DECORAZIONI OPTIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {config.decorations.filter(d => d.isActive).map(dec => {
                  const isSelected = dec.id === selectedDecorationId;
                  return (
                    <div
                      key={dec.id}
                      onClick={() => setSelectedDecorationId(dec.id)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#DE7E42] bg-[#FFF8EF] shadow-sm'
                          : 'border-[#F5A16C]/20 bg-white hover:border-[#DE7E42]/50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-black text-[#57382E]">{dec.name}</h4>
                          {dec.isPopular && (
                            <span className="text-[9px] font-black uppercase bg-[#FFE29A] text-[#57382E] px-1.5 py-0.5 rounded-md">
                              Scenografica
                            </span>
                          )}
                        </div>
                        {dec.description && (
                          <p className="text-[11px] text-[#7E5649]">{dec.description}</p>
                        )}
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <span className="text-xs font-black text-[#DE7E42] block">
                          {(dec.priceModifier || 0) > 0 ? `+€${(dec.priceModifier || 0).toFixed(2)}` : 'Incluso'}
                        </span>
                        {isSelected && (
                          <span className="inline-block mt-1 w-4 h-4 rounded-full bg-[#DE7E42] text-white text-[10px] leading-4 text-center">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SCRITTA DEDICA WITH LIVE CARTRIDGE / CAKE PLAQUE PREVIEW */}
              <div className="bg-[#FFF8EF] rounded-2xl p-5 border border-[#F5A16C]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#57382E] flex items-center gap-2">
                    <span>✍️ Scritta Personalizzata sulla Torta</span>
                    <span className="text-[10px] font-bold text-[#DE7E42] bg-white px-2 py-0.5 rounded-full border border-[#F5A16C]/20">
                      {config.customDedicationPrice === 0 ? 'Gratuita' : `+€${config.customDedicationPrice.toFixed(2)}`}
                    </span>
                  </label>
                  <span className="text-[11px] text-[#7E5649]">Max 40 caratteri</span>
                </div>

                <input
                  type="text"
                  maxLength={40}
                  placeholder="Es: Buon Compleanno Marco! • 18 Anni • Ti Amo"
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  className="w-full bg-white px-4 py-2.5 rounded-xl border border-[#F5A16C]/30 text-xs sm:text-sm font-bold text-[#57382E] focus:outline-none focus:ring-2 focus:ring-[#DE7E42]"
                />

                {/* LIVE DEDICATION PREVIEW PLAQUE */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#57382E] to-[#3D251E] text-center shadow-inner relative overflow-hidden border border-[#FFE29A]/30">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFE29A] block mb-1">
                    Anteprima Cartiglio sulla Torta
                  </span>
                  <p className="text-base sm:text-xl font-serif italic text-white drop-shadow-sm min-h-[30px] flex items-center justify-center">
                    {customText.trim() ? `"${customText.trim()}"` : 'Inserisci la tua dedica sopra per vederla qui...'}
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 6: EXTRA & ACCESSORI */}
            {config.extraAddons && config.extraAddons.filter(e => e.isActive).length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F5A16C]/25 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#57382E] text-white flex items-center justify-center text-xs font-black">
                    6
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-[#57382E]">
                      Aggiungi Extra per la Festa
                    </h2>
                    <p className="text-xs text-[#7E5649]">
                      Completa la sorpresa con candeline, topper personalizzati, confezioni di lusso o spumante.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {config.extraAddons.filter(e => e.isActive).map(extra => {
                    const isChecked = selectedExtras.includes(extra.name);
                    return (
                      <div
                        key={extra.id}
                        onClick={() => toggleExtra(extra.name)}
                        className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex items-center justify-between gap-3 ${
                          isChecked
                            ? 'border-[#25D366] bg-[#25D366]/5 shadow-sm'
                            : 'border-[#F5A16C]/20 bg-white hover:border-[#F5A16C]/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // Handled by div click
                            className="w-4 h-4 rounded text-[#25D366] focus:ring-0 cursor-pointer"
                          />
                          <div>
                            <h4 className="text-xs sm:text-sm font-black text-[#57382E]">{extra.name}</h4>
                            {extra.description && (
                              <p className="text-[11px] text-[#7E5649]">{extra.description}</p>
                            )}
                          </div>
                        </div>

                        <span className="text-xs font-black text-[#DE7E42] whitespace-nowrap">
                          +€{extra.price.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 7: DATA & ORARIO CONSEGNA */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F5A16C]/25 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#57382E] text-white flex items-center justify-center text-xs font-black">
                  7
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#57382E]">
                    Quando Desideri la Torta?
                  </h2>
                  <p className="text-xs text-[#7E5649]">
                    Preavviso minimo: <strong>{config.minHoursNotice || 48} ore</strong> per consentirci di reperire gli ingredienti più freschi.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#FFF8EF] p-4 rounded-2xl border border-[#F5A16C]/30 space-y-1">
                  <label className="text-xs font-bold text-[#57382E] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#DE7E42]" />
                    <span>Data di Consegna / Ritiro *</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={minDateString}
                    value={requestedDate}
                    onChange={e => setRequestedDate(e.target.value)}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-[#F5A16C]/30 text-xs font-bold text-[#57382E] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#7E5649] block">
                    Prima data disponibile: {new Date(minDateString).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                </div>

                <div className="bg-[#FFF8EF] p-4 rounded-2xl border border-[#F5A16C]/30 space-y-1">
                  <label className="text-xs font-bold text-[#57382E] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#DE7E42]" />
                    <span>Fascia Oraria Desiderata</span>
                  </label>
                  <select
                    value={requestedTime}
                    onChange={e => setRequestedTime(e.target.value)}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-[#F5A16C]/30 text-xs font-bold text-[#57382E] focus:outline-none cursor-pointer"
                  >
                    <option value="09:00 - 11:00">Mattina (09:00 - 11:00)</option>
                    <option value="11:00 - 13:00">Pranzo (11:00 - 13:00)</option>
                    <option value="15:00 - 17:00">Pomeriggio (15:00 - 17:00)</option>
                    <option value="17:00 - 19:30">Sera (17:00 - 19:30)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* STEP 8: DATI CONTATTO & NOTE */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F5A16C]/25 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#57382E] text-white flex items-center justify-center text-xs font-black">
                  8
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#57382E]">
                    I Tuoi Recapiti & Note Speciali
                  </h2>
                  <p className="text-xs text-[#7E5649]">
                    Ti contatteremo per confermare la disponibilità e tutti i dettagli.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-[#7E5649] block mb-1">Il Tuo Nome e Cognome *</label>
                  <input
                    type="text"
                    required
                    placeholder="Es: Maria Rossi"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full bg-[#FFF8EF] px-3.5 py-2.5 rounded-xl border border-[#F5A16C]/30 text-xs font-bold text-[#57382E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#7E5649] block mb-1">Numero di Telefono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Es: 347 1234567"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#FFF8EF] px-3.5 py-2.5 rounded-xl border border-[#F5A16C]/30 text-xs font-bold text-[#57382E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7E5649] block mb-1">Email (Opzionale)</label>
                <input
                  type="email"
                  placeholder="Es: maria@gmail.com"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#FFF8EF] px-3.5 py-2 rounded-xl border border-[#F5A16C]/30 text-xs font-medium text-[#57382E] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7E5649] block mb-1">
                  Note Speciali, Intolleranze o Allergie
                </label>
                <textarea
                  rows={2}
                  placeholder="Segnalaci eventuali intolleranze (es: senza lattosio, no frutta secca) o richieste speciali per i pasticceri..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-[#FFF8EF] px-3.5 py-2 rounded-xl border border-[#F5A16C]/30 text-xs font-medium text-[#57382E] focus:outline-none"
                />
              </div>

              {config.allowPhotoUpload && (
                <div>
                  <label className="text-[11px] font-bold text-[#7E5649] block mb-1">
                    Link Foto di Ispirazione (Opzionale)
                  </label>
                  <input
                    type="url"
                    placeholder="Incolla un link a una foto di Pinterest, Instagram o Google Drive (oppure inviacela su WhatsApp)"
                    value={referenceImageUrl}
                    onChange={e => setReferenceImageUrl(e.target.value)}
                    className="w-full bg-[#FFF8EF] px-3.5 py-2 rounded-xl border border-[#F5A16C]/30 text-xs font-medium text-[#57382E] focus:outline-none"
                  />
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700">
                  {errorMsg}
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR SUMMARY & ACTIONS COLUMN (4 cols) - STICKY */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl p-6 border-2 border-[#DE7E42]/30 shadow-lg space-y-5">
              <div className="border-b border-[#F5A16C]/20 pb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#DE7E42] block">
                  Riepilogo Configurazione
                </span>
                <h3 className="text-xl font-black text-[#57382E] mt-0.5">
                  {currentCakeType?.name}
                </h3>
                <p className="text-xs text-[#7E5649] mt-0.5">
                  {servings} persone • ca. {estimatedWeightKg} kg
                </p>
              </div>

              {/* DETAILS SUMMARY */}
              <div className="space-y-2.5 text-xs text-[#57382E]">
                <div className="flex justify-between items-start">
                  <span className="text-[#7E5649]">Base:</span>
                  <span className="font-bold text-right max-w-[180px]">{currentBase?.name}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[#7E5649]">Farcitura:</span>
                  <span className="font-bold text-right max-w-[180px]">{currentFilling?.name}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[#7E5649]">Decorazione:</span>
                  <span className="font-bold text-right max-w-[180px]">{currentDecoration?.name}</span>
                </div>
                {customText.trim() && (
                  <div className="flex justify-between items-start bg-[#FFF8EF] p-2 rounded-xl border border-[#F5A16C]/20">
                    <span className="text-[#7E5649]">Dedica:</span>
                    <span className="font-black italic text-[#DE7E42]">&quot;{customText.trim()}&quot;</span>
                  </div>
                )}
                {selectedExtras.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-[#7E5649] block mb-1">Extra scelti:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedExtras.map(e => (
                        <span key={e} className="bg-[#FFE29A]/40 text-[#57382E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          + {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* TOTAL ESTIMATED PRICE */}
              <div className="bg-gradient-to-br from-[#FFF8EF] to-[#FFE29A]/40 p-4 rounded-2xl border border-[#F5A16C]/30 space-y-1 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7E5649] block">
                  Preventivo Indicativo
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#DE7E42]">
                  €{estimatedTotal.toFixed(2)}
                </div>
                <span className="text-[10px] text-[#7E5649] block">
                  (ca. €{(estimatedTotal / servings).toFixed(2)} a persona)
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleSubmitSite}
                  disabled={submitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#57382E] hover:bg-[#3d2720] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Invio in corso...' : 'Invia Richiesta al Laboratorio'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendWhatsAppDirect}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Avvisa Subito su WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#7E5649] text-center pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Nessun pagamento anticipato richiesto adesso</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
