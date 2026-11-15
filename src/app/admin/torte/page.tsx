'use client';

import React, { useEffect, useState } from 'react';
import {
  Cake,
  MessageCircle,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  Star,
  Layers,
  Sparkles,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { DataService } from '@/lib/store';
import { CustomCakeConfig, CustomCakeRequest, CakeOptionItem, CakeExtraAddon } from '@/lib/types';
import { INITIAL_CUSTOM_CAKE_CONFIG } from '@/lib/initialData';

export default function AdminTortePage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'config'>('requests');

  // Requests state
  const [requests, setRequests] = useState<CustomCakeRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [quoteInputs, setQuoteInputs] = useState<Record<string, number>>({});

  // Config state
  const [config, setConfig] = useState<CustomCakeConfig>(INITIAL_CUSTOM_CAKE_CONFIG);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Item Modals/Forms State
  const [activeSection, setActiveSection] = useState<'types' | 'bases' | 'fillings' | 'decorations' | 'extras'>('types');
  const [editingItem, setEditingItem] = useState<{
    section: 'types' | 'bases' | 'fillings' | 'decorations' | 'extras';
    item: CakeOptionItem | CakeExtraAddon;
    isNew: boolean;
  } | null>(null);

  const [newServingInput, setNewServingInput] = useState('');

  const loadRequests = async () => {
    setLoadingRequests(true);
    const data = await DataService.getCustomCakeRequests();
    setRequests(data);
    setLoadingRequests(false);
  };

  const loadConfig = async () => {
    setLoadingConfig(true);
    const cfg = await DataService.getCustomCakeConfig();
    setConfig(cfg);
    setLoadingConfig(false);
  };

  useEffect(() => {
    loadRequests();
    loadConfig();
  }, []);

  const handleStatusChange = async (id: string, status: CustomCakeRequest['status']) => {
    const quote = quoteInputs[id];
    await DataService.updateCustomCakeStatus(id, status, quote);
    await loadRequests();
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      await DataService.saveCustomCakeConfig(config);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Error saving cake config:', e);
      alert('Errore durante il salvataggio della configurazione.');
    } finally {
      setSavingConfig(false);
    }
  };

  // Helper functions for options
  const toggleItemActive = (section: 'cakeTypes' | 'flavorBases' | 'fillings' | 'decorations', id: string) => {
    setConfig(prev => ({
      ...prev,
      [section]: prev[section].map(item => item.id === id ? { ...item, isActive: !item.isActive } : item),
    }));
  };

  const toggleItemPopular = (section: 'cakeTypes' | 'fillings' | 'decorations', id: string) => {
    setConfig(prev => ({
      ...prev,
      [section]: prev[section].map(item => item.id === id ? { ...item, isPopular: !item.isPopular } : item),
    }));
  };

  const deleteItem = (section: 'cakeTypes' | 'flavorBases' | 'fillings' | 'decorations' | 'extraAddons', id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa opzione?')) return;
    setConfig(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter(item => item.id !== id),
    }));
  };

  const handleSaveModalItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const { section, item, isNew } = editingItem;

    if (section === 'extras') {
      const extraItem = item as CakeExtraAddon;
      setConfig(prev => {
        const list = [...prev.extraAddons];
        if (isNew) {
          list.push({ ...extraItem, id: extraItem.id || `extra-${Date.now()}` });
        } else {
          const idx = list.findIndex(i => i.id === extraItem.id);
          if (idx >= 0) list[idx] = extraItem;
        }
        return { ...prev, extraAddons: list };
      });
    } else {
      const optionItem = item as CakeOptionItem;
      const keyMap: Record<string, 'cakeTypes' | 'flavorBases' | 'fillings' | 'decorations'> = {
        types: 'cakeTypes',
        bases: 'flavorBases',
        fillings: 'fillings',
        decorations: 'decorations',
      };
      const configKey = keyMap[section];

      setConfig(prev => {
        const list = [...prev[configKey]];
        if (isNew) {
          list.push({ ...optionItem, id: optionItem.id || `${section}-${Date.now()}` });
        } else {
          const idx = list.findIndex(i => i.id === optionItem.id);
          if (idx >= 0) list[idx] = optionItem;
        }
        return { ...prev, [configKey]: list };
      });
    }

    setEditingItem(null);
  };

  const handleAddServing = () => {
    const val = parseInt(newServingInput, 10);
    if (!val || val <= 0) return;
    if (config.servingsOptions.includes(val)) {
      alert('Questa porzione esiste già');
      return;
    }
    const updated = [...config.servingsOptions, val].sort((a, b) => a - b);
    setConfig(prev => ({ ...prev, servingsOptions: updated }));
    setNewServingInput('');
  };

  const handleRemoveServing = (val: number) => {
    setConfig(prev => ({
      ...prev,
      servingsOptions: prev.servingsOptions.filter(s => s !== val),
    }));
  };

  const filteredRequests = requests.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.customerName.toLowerCase().includes(q) ||
      r.cakeType.toLowerCase().includes(q) ||
      r.customerPhone.includes(q) ||
      (r.customerEmail && r.customerEmail.toLowerCase().includes(q))
    );
  });

  const pendingCount = requests.filter(r => r.status === 'in_valutazione').length;

  return (
    <div className="space-y-6 pb-24">
      {/* HEADER WITH TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#F5A16C]/25 shadow-xs">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#DE7E42]">
            Gestione Pasticceria & Laboratorio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#57382E] mt-0.5">
            Torte su Ordinazione & Personalizzate
          </h1>
          <p className="text-xs text-[#7E5649] mt-1">
            Gestisci le richieste ricevute dai clienti e configura l&apos;intero listino prezzi, opzioni, ingredienti ed extra.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-[#FFF8EF] p-1.5 rounded-2xl border border-[#F5A16C]/30 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'requests'
                  ? 'bg-[#57382E] text-white shadow-sm'
                  : 'text-[#7E5649] hover:text-[#57382E]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Richieste Ricevute</span>
              {pendingCount > 0 && (
                <span className="bg-[#DE7E42] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'config'
                  ? 'bg-[#57382E] text-white shadow-sm'
                  : 'text-[#7E5649] hover:text-[#57382E]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Configura Tutto</span>
            </button>
          </div>

          {activeTab === 'config' && (
            <button
              onClick={handleSaveConfig}
              disabled={savingConfig}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1eb857] hover:to-[#0f7a6e] text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Salvato!</span>
                </>
              ) : (
                <>
                  <Save className={`w-4 h-4 ${savingConfig ? 'animate-spin' : ''}`} />
                  <span>{savingConfig ? 'Salvataggio...' : 'Salva Modifiche'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: RICHIESTE RICEVUTE */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#F5A16C]/20 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7E5649]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cerca cliente, telefono o tipo torta..."
                className="w-full pl-10 pr-4 py-2 bg-[#FFF8EF] border border-[#F5A16C]/30 rounded-xl text-xs font-semibold text-[#57382E] placeholder-[#7E5649]/60 focus:outline-none focus:ring-2 focus:ring-[#DE7E42]"
              />
            </div>

            <button
              onClick={loadRequests}
              className="px-4 py-2 rounded-xl bg-white border border-[#F5A16C]/30 text-[#57382E] hover:bg-[#FFF8EF] text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingRequests ? 'animate-spin' : ''}`} />
              <span>Ricarica</span>
            </button>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#F5A16C]/20 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FFE29A]/30 text-[#DE7E42] flex items-center justify-center mx-auto text-2xl">
                🎂
              </div>
              <h3 className="text-lg font-black text-[#57382E]">Nessuna richiesta trovata</h3>
              <p className="text-xs text-[#7E5649] max-w-md mx-auto">
                Quando i clienti configurano una torta sul sito, la troverai qui per calcolare il preventivo e rispondere su WhatsApp.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRequests.map(req => {
                const quoteVal = quoteInputs[req.id] !== undefined ? quoteInputs[req.id] : (req.quoteAmount || req.estimatedPrice || '');
                const cleanPhone = req.customerPhone.replace(/\D/g, '');
                const waMessage = `Ciao ${req.customerName}! 🎂\nTi contattiamo dal laboratorio artigianale SFORNAMÌ a Roma per la tua richiesta di torta personalizzata:\n\n` +
                  `🍰 *${req.cakeType}* per *${req.servings} persone*\n` +
                  `🌾 *Base:* ${req.flavorBase}\n` +
                  `🍓 *Farcitura:* ${req.filling}\n` +
                  `✨ *Decorazione:* ${req.decoration}\n` +
                  (req.customText ? `✍️ *Scritta:* "${req.customText}"\n` : '') +
                  (req.selectedExtras && req.selectedExtras.length > 0 ? `🎁 *Extra:* ${req.selectedExtras.join(', ')}\n` : '') +
                  `📅 *Data richiesta:* ${req.requestedDate} alle ${req.requestedTime}\n\n` +
                  (quoteVal ? `💰 *Preventivo stimato:* €${Number(quoteVal).toFixed(2)}\n\n` : '') +
                  `Possiamo procedere con la conferma dell'ordine? Restiamo a tua completa disposizione!`;

                const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl p-6 border-2 border-[#F5A16C]/25 shadow-sm space-y-4 text-xs transition-all hover:border-[#DE7E42]"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#FFE29A]/40 text-[#57382E]">
                            {req.id}
                          </span>
                          <span className="text-[10px] text-[#7E5649]">
                            {new Date(req.createdAt).toLocaleDateString('it-IT')} {new Date(req.createdAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-[#57382E] mt-1">{req.cakeType}</h3>
                        <p className="text-[#7E5649] font-medium">
                          Cliente: <strong className="text-[#57382E]">{req.customerName}</strong>
                        </p>
                      </div>

                      <select
                        value={req.status}
                        onChange={e => handleStatusChange(req.id, e.target.value as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer ${
                          req.status === 'in_valutazione'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : req.status === 'preventivo_inviato'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : req.status === 'confermata'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="in_valutazione">In Valutazione</option>
                        <option value="preventivo_inviato">Preventivo Inviato</option>
                        <option value="confermata">Confermata</option>
                        <option value="rifiutata">Rifiutata</option>
                      </select>
                    </div>

                    {/* DETAILS BOX */}
                    <div className="bg-[#FFF8EF] rounded-2xl p-4 space-y-2.5 text-[#57382E] border border-[#F5A16C]/20">
                      <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#F5A16C]/15">
                        <div>
                          <span className="text-[10px] font-bold text-[#7E5649] block">Porzioni:</span>
                          <span className="font-black text-sm text-[#DE7E42]">{req.servings} persone</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#7E5649] block">Data & Ora Richiesta:</span>
                          <span className="font-bold">{req.requestedDate} • {req.requestedTime}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p><strong>Base / Impasto:</strong> {req.flavorBase}</p>
                        <p><strong>Farcitura:</strong> {req.filling}</p>
                        <p><strong>Decorazione:</strong> {req.decoration}</p>
                        {req.customText && (
                          <p className="bg-white/80 p-2 rounded-xl border border-[#F5A16C]/20 text-[#57382E]">
                            ✍️ <strong>Scritta Dedica:</strong> &quot;{req.customText}&quot;
                          </p>
                        )}
                        {req.selectedExtras && req.selectedExtras.length > 0 && (
                          <p className="bg-[#FFE29A]/30 p-2 rounded-xl text-[#57382E] font-medium">
                            🎁 <strong>Extra Aggiunti:</strong> {req.selectedExtras.join(', ')}
                          </p>
                        )}
                        {req.estimatedPrice && (
                          <p className="text-[11px] text-[#7E5649]">
                            Stima automatica configuratore: <strong>€{req.estimatedPrice.toFixed(2)}</strong>
                          </p>
                        )}
                        {req.notes && (
                          <p className="italic text-[#7E5649] bg-white p-2 rounded-xl border border-[#F5A16C]/10">
                            Note cliente: {req.notes}
                          </p>
                        )}
                        {req.referenceImageUrl && (
                          <div className="pt-1">
                            <a
                              href={req.referenceImageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-bold text-[#DE7E42] hover:underline flex items-center gap-1"
                            >
                              📷 Visualizza foto allegata dal cliente
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CONTACT & QUOTE ACTIONS */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-1.5 bg-[#FFF8EF] px-3 py-2 rounded-xl border border-[#F5A16C]/30">
                          <DollarSign className="w-4 h-4 text-[#7E5649]" />
                          <input
                            type="number"
                            step="0.50"
                            placeholder="Preventivo € finale"
                            value={quoteVal}
                            onChange={e => setQuoteInputs({ ...quoteInputs, [req.id]: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-transparent text-xs font-black text-[#57382E] focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={() => handleStatusChange(req.id, 'preventivo_inviato')}
                          className="px-3 py-2 rounded-xl bg-white border border-[#F5A16C]/40 text-[#57382E] font-bold text-xs hover:bg-[#FFF8EF]"
                        >
                          Salva €
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`tel:${cleanPhone}`}
                          className="py-2.5 px-3 rounded-xl bg-white border border-[#F5A16C]/30 text-[#57382E] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#FFF8EF]"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#DE7E42]" />
                          <span>{req.customerPhone}</span>
                        </a>

                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <MessageCircle className="w-4 h-4 fill-white" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONFIGURAZIONE TOTALE */}
      {activeTab === 'config' && (
        <div className="space-y-8">
          {/* GENERAL SETTINGS CARD */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#F5A16C]/25 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F5A16C]/20">
              <div className="w-10 h-10 rounded-2xl bg-[#FFE29A]/50 text-[#DE7E42] flex items-center justify-center font-black">
                ⚙️
              </div>
              <div>
                <h2 className="text-lg font-black text-[#57382E]">Parametri Base del Calcolo</h2>
                <p className="text-xs text-[#7E5649]">Imposta il costo a porzione, peso stimato e preavviso minimo.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FFF8EF] p-4 rounded-2xl border border-[#F5A16C]/20">
                <label className="text-[11px] font-bold text-[#7E5649] block mb-1">
                  Prezzo Base a Porzione (€)
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-[#DE7E42]">€</span>
                  <input
                    type="number"
                    step="0.10"
                    min="1"
                    value={config.basePricePerServing}
                    onChange={e => setConfig({ ...config, basePricePerServing: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white px-3 py-1.5 rounded-xl border border-[#F5A16C]/30 text-sm font-black text-[#57382E] focus:outline-none"
                  />
                  <span className="text-xs text-[#7E5649]">/fetta</span>
                </div>
              </div>

              <div className="bg-[#FFF8EF] p-4 rounded-2xl border border-[#F5A16C]/20">
                <label className="text-[11px] font-bold text-[#7E5649] block mb-1">
                  Peso per Porzione (kg)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.01"
                    min="0.05"
                    value={config.servingWeightKg}
                    onChange={e => setConfig({ ...config, servingWeightKg: parseFloat(e.target.value) || 0.12 })}
                    className="w-full bg-white px-3 py-1.5 rounded-xl border border-[#F5A16C]/30 text-sm font-black text-[#57382E] focus:outline-none"
                  />
                  <span className="text-xs text-[#7E5649]">kg (es: 0.12 = 120g)</span>
                </div>
              </div>

              <div className="bg-[#FFF8EF] p-4 rounded-2xl border border-[#F5A16C]/20">
                <label className="text-[11px] font-bold text-[#7E5649] block mb-1">
                  Ore Minime di Preavviso
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="1"
                    min="12"
                    value={config.minHoursNotice}
                    onChange={e => setConfig({ ...config, minHoursNotice: parseInt(e.target.value, 10) || 48 })}
                    className="w-full bg-white px-3 py-1.5 rounded-xl border border-[#F5A16C]/30 text-sm font-black text-[#57382E] focus:outline-none"
                  />
                  <span className="text-xs text-[#7E5649]">ore (es: 48h)</span>
                </div>
              </div>

              <div className="bg-[#FFF8EF] p-4 rounded-2xl border border-[#F5A16C]/20">
                <label className="text-[11px] font-bold text-[#7E5649] block mb-1">
                  Costo Scritta / Dedica (€)
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-[#DE7E42]">€</span>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    value={config.customDedicationPrice}
                    onChange={e => setConfig({ ...config, customDedicationPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white px-3 py-1.5 rounded-xl border border-[#F5A16C]/30 text-sm font-black text-[#57382E] focus:outline-none"
                  />
                  <span className="text-xs text-[#7E5649]">{config.customDedicationPrice === 0 ? 'Gratis' : ''}</span>
                </div>
              </div>
            </div>

            {/* TEXT HEADERS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-[11px] font-bold text-[#7E5649] block mb-1">Titolo Sezione</label>
                <input
                  type="text"
                  value={config.introTitle}
                  onChange={e => setConfig({ ...config, introTitle: e.target.value })}
                  className="w-full bg-[#FFF8EF] px-3.5 py-2 rounded-xl border border-[#F5A16C]/30 text-xs font-bold text-[#57382E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7E5649] block mb-1">Badge Sovratitolo</label>
                <input
                  type="text"
                  value={config.bannerBadge}
                  onChange={e => setConfig({ ...config, bannerBadge: e.target.value })}
                  className="w-full bg-[#FFF8EF] px-3.5 py-2 rounded-xl border border-[#F5A16C]/30 text-xs font-bold text-[#57382E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7E5649] block mb-1">Sottotitolo Descrittivo</label>
                <input
                  type="text"
                  value={config.introSubtitle}
                  onChange={e => setConfig({ ...config, introSubtitle: e.target.value })}
                  className="w-full bg-[#FFF8EF] px-3.5 py-2 rounded-xl border border-[#F5A16C]/30 text-xs font-bold text-[#57382E]"
                />
              </div>
            </div>

            {/* PORZIONI DISPONIBILI */}
            <div className="pt-4 border-t border-[#F5A16C]/20">
              <label className="text-xs font-black text-[#57382E] block mb-2">
                Porzioni Selezionabili dal Cliente
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {config.servingsOptions.map(s => (
                  <div
                    key={s}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-black text-[#57382E]"
                  >
                    <span>{s} persone</span>
                    <button
                      onClick={() => handleRemoveServing(s)}
                      className="text-rose-500 hover:text-rose-700 ml-1"
                      title="Rimuovi"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    placeholder="Es: 18"
                    value={newServingInput}
                    onChange={e => setNewServingInput(e.target.value)}
                    className="w-20 px-2.5 py-1.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-bold text-[#57382E]"
                  />
                  <button
                    onClick={handleAddServing}
                    className="px-2.5 py-1.5 rounded-xl bg-[#57382E] text-white text-xs font-bold hover:bg-[#3d2720]"
                  >
                    + Aggiungi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SUB-SECTIONS NAVIGATION */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#F5A16C]/20 pb-3">
            {[
              { id: 'types', label: '1. Tipi di Torta', icon: '🎂', count: config.cakeTypes.length },
              { id: 'bases', label: '2. Basi & Impasti', icon: '🌾', count: config.flavorBases.length },
              { id: 'fillings', label: '3. Farciture & Creme', icon: '🍓', count: config.fillings.length },
              { id: 'decorations', label: '4. Decorazioni & Stile', icon: '✨', count: config.decorations.length },
              { id: 'extras', label: '5. Extra & Add-ons', icon: '🎁', count: config.extraAddons.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                  activeSection === tab.id
                    ? 'bg-[#DE7E42] text-white shadow-sm'
                    : 'bg-white text-[#7E5649] hover:bg-[#FFE29A]/30 border border-[#F5A16C]/20'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="bg-black/10 px-1.5 py-0.5 rounded-full text-[10px]">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* SECTION 1: TIPI DI TORTA */}
          {activeSection === 'types' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-[#57382E]">Tipologie di Torta</h3>
                  <p className="text-xs text-[#7E5649]">Le torte selezionabili all&apos;inizio del configuratore.</p>
                </div>
                <button
                  onClick={() => setEditingItem({
                    section: 'types',
                    item: { id: '', name: '', description: '', priceModifier: 0, isActive: true, isPopular: false },
                    isNew: true,
                  })}
                  className="px-3.5 py-2 rounded-xl bg-[#57382E] text-white text-xs font-black flex items-center gap-1.5 hover:bg-[#3d2720]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuovo Tipo Torta</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.cakeTypes.map(cake => (
                  <div
                    key={cake.id}
                    className={`bg-white rounded-2xl p-4 border transition-all space-y-3 ${
                      cake.isActive ? 'border-[#F5A16C]/30 shadow-xs' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-black text-[#57382E]">{cake.name}</h4>
                          {cake.isPopular && (
                            <span className="text-[9px] font-black uppercase bg-[#FFE29A] text-[#57382E] px-1.5 py-0.5 rounded-md">
                              Più Richiesta
                            </span>
                          )}
                        </div>
                        {cake.description && (
                          <p className="text-[11px] text-[#7E5649] mt-1 line-clamp-2">{cake.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-[#DE7E42] block">
                          {(cake.priceModifier || 0) > 0 ? `+€${(cake.priceModifier || 0).toFixed(2)}` : 'Incluso'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F5A16C]/15 text-[11px]">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cake.isActive}
                            onChange={() => toggleItemActive('cakeTypes', cake.id)}
                            className="rounded text-[#DE7E42]"
                          />
                          <span className="font-bold text-[#57382E]">Attiva</span>
                        </label>

                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(cake.isPopular)}
                            onChange={() => toggleItemPopular('cakeTypes', cake.id)}
                            className="rounded text-[#DE7E42]"
                          />
                          <span className="font-bold text-[#DE7E42]">Popolare</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingItem({ section: 'types', item: cake, isNew: false })}
                          className="p-1.5 rounded-lg hover:bg-[#FFF8EF] text-[#57382E]"
                          title="Modifica"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItem('cakeTypes', cake.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500"
                          title="Elimina"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: BASI E IMPASTI */}
          {activeSection === 'bases' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-[#57382E]">Basi & Impasti Artigianali</h3>
                  <p className="text-xs text-[#7E5649]">La struttura della torta (pan di spagna, sfoglia, frolla sablée, etc.).</p>
                </div>
                <button
                  onClick={() => setEditingItem({
                    section: 'bases',
                    item: { id: '', name: '', description: '', priceModifier: 0, isActive: true },
                    isNew: true,
                  })}
                  className="px-3.5 py-2 rounded-xl bg-[#57382E] text-white text-xs font-black flex items-center gap-1.5 hover:bg-[#3d2720]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuova Base</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.flavorBases.map(base => (
                  <div
                    key={base.id}
                    className={`bg-white rounded-2xl p-4 border transition-all space-y-3 ${
                      base.isActive ? 'border-[#F5A16C]/30 shadow-xs' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-[#57382E]">{base.name}</h4>
                        {base.description && (
                          <p className="text-[11px] text-[#7E5649] mt-1">{base.description}</p>
                        )}
                      </div>
                      <span className="text-xs font-black text-[#DE7E42]">
                        {(base.priceModifier || 0) > 0 ? `+€${(base.priceModifier || 0).toFixed(2)}` : 'Incluso'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F5A16C]/15 text-[11px]">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={base.isActive}
                          onChange={() => toggleItemActive('flavorBases', base.id)}
                          className="rounded text-[#DE7E42]"
                        />
                        <span className="font-bold text-[#57382E]">Attiva</span>
                      </label>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingItem({ section: 'bases', item: base, isNew: false })}
                          className="p-1.5 rounded-lg hover:bg-[#FFF8EF] text-[#57382E]"
                          title="Modifica"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItem('flavorBases', base.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500"
                          title="Elimina"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: FARCITURE & CREME */}
          {activeSection === 'fillings' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-[#57382E]">Farciture & Creme</h3>
                  <p className="text-xs text-[#7E5649]">Chantilly, crema pasticcera, pistacchio Bronte, ganache, etc.</p>
                </div>
                <button
                  onClick={() => setEditingItem({
                    section: 'fillings',
                    item: { id: '', name: '', description: '', priceModifier: 0, isActive: true, isPopular: false },
                    isNew: true,
                  })}
                  className="px-3.5 py-2 rounded-xl bg-[#57382E] text-white text-xs font-black flex items-center gap-1.5 hover:bg-[#3d2720]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuova Farcitura</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.fillings.map(f => (
                  <div
                    key={f.id}
                    className={`bg-white rounded-2xl p-4 border transition-all space-y-3 ${
                      f.isActive ? 'border-[#F5A16C]/30 shadow-xs' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-black text-[#57382E]">{f.name}</h4>
                          {f.isPopular && (
                            <span className="text-[9px] font-black uppercase bg-[#FFE29A] text-[#57382E] px-1.5 py-0.5 rounded-md">
                              Consigliata
                            </span>
                          )}
                        </div>
                        {f.description && (
                          <p className="text-[11px] text-[#7E5649] mt-1">{f.description}</p>
                        )}
                      </div>
                      <span className="text-xs font-black text-[#DE7E42]">
                        {(f.priceModifier || 0) > 0 ? `+€${(f.priceModifier || 0).toFixed(2)}` : 'Incluso'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F5A16C]/15 text-[11px]">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={f.isActive}
                            onChange={() => toggleItemActive('fillings', f.id)}
                            className="rounded text-[#DE7E42]"
                          />
                          <span className="font-bold text-[#57382E]">Attiva</span>
                        </label>

                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(f.isPopular)}
                            onChange={() => toggleItemPopular('fillings', f.id)}
                            className="rounded text-[#DE7E42]"
                          />
                          <span className="font-bold text-[#DE7E42]">Consigliata</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingItem({ section: 'fillings', item: f, isNew: false })}
                          className="p-1.5 rounded-lg hover:bg-[#FFF8EF] text-[#57382E]"
                          title="Modifica"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItem('fillings', f.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500"
                          title="Elimina"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: DECORAZIONI & STILE */}
          {activeSection === 'decorations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-[#57382E]">Decorazioni & Finiture</h3>
                  <p className="text-xs text-[#7E5649]">Frutti di bosco, fiori edibili, macarons, ostie con foto, glassa a specchio.</p>
                </div>
                <button
                  onClick={() => setEditingItem({
                    section: 'decorations',
                    item: { id: '', name: '', description: '', priceModifier: 0, isActive: true, isPopular: false },
                    isNew: true,
                  })}
                  className="px-3.5 py-2 rounded-xl bg-[#57382E] text-white text-xs font-black flex items-center gap-1.5 hover:bg-[#3d2720]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuova Decorazione</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.decorations.map(d => (
                  <div
                    key={d.id}
                    className={`bg-white rounded-2xl p-4 border transition-all space-y-3 ${
                      d.isActive ? 'border-[#F5A16C]/30 shadow-xs' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-black text-[#57382E]">{d.name}</h4>
                          {d.isPopular && (
                            <span className="text-[9px] font-black uppercase bg-[#FFE29A] text-[#57382E] px-1.5 py-0.5 rounded-md">
                              Scenografica
                            </span>
                          )}
                        </div>
                        {d.description && (
                          <p className="text-[11px] text-[#7E5649] mt-1">{d.description}</p>
                        )}
                      </div>
                      <span className="text-xs font-black text-[#DE7E42]">
                        {(d.priceModifier || 0) > 0 ? `+€${(d.priceModifier || 0).toFixed(2)}` : 'Incluso'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F5A16C]/15 text-[11px]">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={d.isActive}
                            onChange={() => toggleItemActive('decorations', d.id)}
                            className="rounded text-[#DE7E42]"
                          />
                          <span className="font-bold text-[#57382E]">Attiva</span>
                        </label>

                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(d.isPopular)}
                            onChange={() => toggleItemPopular('decorations', d.id)}
                            className="rounded text-[#DE7E42]"
                          />
                          <span className="font-bold text-[#DE7E42]">Popolare</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingItem({ section: 'decorations', item: d, isNew: false })}
                          className="p-1.5 rounded-lg hover:bg-[#FFF8EF] text-[#57382E]"
                          title="Modifica"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItem('decorations', d.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500"
                          title="Elimina"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: EXTRA & ADD-ONS */}
          {activeSection === 'extras' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-[#57382E]">Extra, Accessori & Confezioni</h3>
                  <p className="text-xs text-[#7E5649]">Candeline, topper sagomati, scatole lusso, bottiglie di spumante, ecc.</p>
                </div>
                <button
                  onClick={() => setEditingItem({
                    section: 'extras',
                    item: { id: '', name: '', description: '', price: 3.00, isActive: true },
                    isNew: true,
                  })}
                  className="px-3.5 py-2 rounded-xl bg-[#57382E] text-white text-xs font-black flex items-center gap-1.5 hover:bg-[#3d2720]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuovo Extra</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.extraAddons.map(extra => (
                  <div
                    key={extra.id}
                    className={`bg-white rounded-2xl p-4 border transition-all space-y-3 ${
                      extra.isActive ? 'border-[#F5A16C]/30 shadow-xs' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-[#57382E]">{extra.name}</h4>
                        {extra.description && (
                          <p className="text-[11px] text-[#7E5649] mt-1">{extra.description}</p>
                        )}
                      </div>
                      <span className="text-sm font-black text-[#DE7E42]">
                        €{extra.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F5A16C]/15 text-[11px]">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={extra.isActive}
                          onChange={() => {
                            setConfig(prev => ({
                              ...prev,
                              extraAddons: prev.extraAddons.map(e => e.id === extra.id ? { ...e, isActive: !e.isActive } : e),
                            }));
                          }}
                          className="rounded text-[#DE7E42]"
                        />
                        <span className="font-bold text-[#57382E]">Attivo</span>
                      </label>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingItem({ section: 'extras', item: extra, isNew: false })}
                          className="p-1.5 rounded-lg hover:bg-[#FFF8EF] text-[#57382E]"
                          title="Modifica"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItem('extraAddons', extra.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500"
                          title="Elimina"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FLOATING BOTTOM SAVE BAR */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#57382E] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-4 border border-[#F5A16C]/40">
            <span className="text-xs font-bold hidden sm:inline">
              Modifiche effettuate? Salva per aggiornare il sito pubblico:
            </span>
            <button
              onClick={handleSaveConfig}
              disabled={savingConfig}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1eb857] hover:to-[#0f7a6e] font-black text-xs shadow-md transition-all flex items-center gap-2"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Salvato con successo!</span>
                </>
              ) : (
                <>
                  <Save className={`w-4 h-4 ${savingConfig ? 'animate-spin' : ''}`} />
                  <span>{savingConfig ? 'Salvataggio...' : 'Salva Tutte le Modifiche'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MODAL EDIT / CREATE ITEM */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-[#F5A16C]/40 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#F5A16C]/20">
              <h3 className="text-base font-black text-[#57382E]">
                {editingItem.isNew ? 'Aggiungi Nuova Voce' : 'Modifica Voce'}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-[#FFF8EF] text-[#7E5649] flex items-center justify-center font-black hover:bg-[#FFE29A]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveModalItem} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#7E5649] block mb-1">Nome Voce / Ingrediente *</label>
                <input
                  type="text"
                  required
                  value={editingItem.item.name}
                  onChange={e => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, name: e.target.value } as any,
                  })}
                  placeholder="Es: Crema al Pistacchio di Bronte DOP"
                  className="w-full bg-[#FFF8EF] px-3.5 py-2.5 rounded-xl border border-[#F5A16C]/30 font-bold text-[#57382E] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#7E5649] block mb-1">Descrizione Dettagliata</label>
                <textarea
                  rows={2}
                  value={editingItem.item.description || ''}
                  onChange={e => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, description: e.target.value } as any,
                  })}
                  placeholder="Descrivi ingredienti o caratteristiche speciali..."
                  className="w-full bg-[#FFF8EF] px-3.5 py-2 rounded-xl border border-[#F5A16C]/30 font-medium text-[#57382E] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#7E5649] block mb-1">
                  {editingItem.section === 'extras' ? 'Prezzo (€ fisso)' : 'Modificatore Prezzo (+€ a fetta o torta)'}
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-[#DE7E42]">€</span>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={
                      editingItem.section === 'extras'
                        ? (editingItem.item as CakeExtraAddon).price || 0
                        : (editingItem.item as CakeOptionItem).priceModifier || 0
                    }
                    onChange={e => {
                      const val = parseFloat(e.target.value) || 0;
                      if (editingItem.section === 'extras') {
                        setEditingItem({
                          ...editingItem,
                          item: { ...editingItem.item, price: val } as any,
                        });
                      } else {
                        setEditingItem({
                          ...editingItem,
                          item: { ...editingItem.item, priceModifier: val } as any,
                        });
                      }
                    }}
                    className="w-full bg-[#FFF8EF] px-3.5 py-2 rounded-xl border border-[#F5A16C]/30 font-black text-[#57382E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#57382E]">
                  <input
                    type="checkbox"
                    checked={editingItem.item.isActive}
                    onChange={e => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, isActive: e.target.checked } as any,
                    })}
                    className="rounded text-[#DE7E42]"
                  />
                  <span>Attivo nel catalogo</span>
                </label>

                {editingItem.section !== 'bases' && editingItem.section !== 'extras' && (
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#DE7E42]">
                    <input
                      type="checkbox"
                      checked={Boolean((editingItem.item as CakeOptionItem).isPopular)}
                      onChange={e => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, isPopular: e.target.checked } as any,
                      })}
                      className="rounded text-[#DE7E42]"
                    />
                    <span>Evidenzia / Più richiesta</span>
                  </label>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F5A16C]/20">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#57382E] text-white font-black hover:bg-[#3d2720]"
                >
                  Conferma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
