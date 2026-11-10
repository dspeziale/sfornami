'use client';

import React, { useEffect, useState } from 'react';
import { Save, Store, Phone, MessageCircle, MapPin, Truck, Check, Sparkles, CreditCard } from 'lucide-react';
import { DataService } from '@/lib/store';
import { StoreSettings } from '@/lib/types';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

export default function AdminImpostazioniPage() {
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    DataService.getSettings().then(s => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await DataService.saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#DE7E42]">
            Configurazione Negozio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#57382E]">
            Impostazioni Laboratorio SFORNAMÌ
          </h1>
          <p className="text-xs text-[#7E5649]">
            Modifica i recapiti a Roma, il numero WhatsApp per gli ordini, i costi di consegna e le soglie minime.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Impostazioni salvate con successo!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Dati Brand e Contatti Principali */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-xs space-y-4">
          <h3 className="text-base font-black text-[#57382E] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#DE7E42]" />
            <span>Dati Identificativi & Recapiti</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#57382E] block mb-1">Nome del Brand</label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[#57382E] block mb-1">Slogan / Payoff Ufficiale</label>
              <input
                type="text"
                value={settings.payoff}
                onChange={e => setSettings({ ...settings, payoff: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
              />
            </div>

            <div>
              <label className="font-bold text-[#57382E] block mb-1">Indirizzo a Roma</label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-[#57382E] block mb-1">Città</label>
                <input
                  type="text"
                  required
                  value={settings.city}
                  onChange={e => setSettings({ ...settings, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
                />
              </div>
              <div>
                <label className="font-bold text-[#57382E] block mb-1">CAP</label>
                <input
                  type="text"
                  required
                  value={settings.cap}
                  onChange={e => setSettings({ ...settings, cap: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#57382E] block mb-1">Telefono Fisso</label>
              <input
                type="text"
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
              />
            </div>

            {/* WhatsApp Integration Number */}
            <div className="bg-[#25D366]/10 p-3 rounded-2xl border border-[#25D366]/30">
              <label className="font-black text-[#25D366] block mb-1 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 fill-[#25D366] text-white" />
                <span>Numero WhatsApp Business per Ordini*</span>
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="393401234567 (senza +)"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#25D366]/50 font-bold text-xs"
              />
              <span className="text-[10px] text-[#7E5649] mt-1 block">
                Formato internazionale senza il '+' (es. 393401234567). Tutti i pulsanti del sito inviano a questo numero.
              </span>
            </div>

            <div>
              <label className="font-bold text-[#57382E] block mb-1">Email Ordini</label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
              />
            </div>

            <div>
              <label className="font-bold text-[#57382E] block mb-1">Orari al Pubblico</label>
              <input
                type="text"
                value={settings.pickupOpeningHours}
                onChange={e => setSettings({ ...settings, pickupOpeningHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
              />
            </div>
          </div>
        </div>

        {/* 2. Regole Consegna a Domicilio */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-xs space-y-4">
          <h3 className="text-base font-black text-[#57382E] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#DE7E42]" />
            <span>Impostazioni Consegna a Domicilio a Roma</span>
          </h3>

          <div className="space-y-4 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF8EF] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.deliveryEnabled}
                onChange={e => setSettings({ ...settings, deliveryEnabled: e.target.checked })}
                className="rounded text-[#DE7E42] w-4 h-4"
              />
              <div>
                <span className="font-bold text-[#57382E] text-xs">Servizio Consegna a Domicilio Attivo</span>
                <p className="text-[11px] text-[#7E5649]">Se disattivato, il cliente potrà selezionare solo il Ritiro in Laboratorio.</p>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-[#57382E] block mb-1">Costo Base Consegna (€)</label>
                <input
                  type="number"
                  step="0.5"
                  value={settings.deliveryFee}
                  onChange={e => setSettings({ ...settings, deliveryFee: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[#57382E] block mb-1">Minimo d'Ordine Consegna (€)</label>
                <input
                  type="number"
                  step="1"
                  value={settings.minOrderDelivery}
                  onChange={e => setSettings({ ...settings, minOrderDelivery: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[#57382E] block mb-1">Spedizione Gratuita da (€)</label>
                <input
                  type="number"
                  step="1"
                  value={settings.freeDeliveryThreshold}
                  onChange={e => setSettings({ ...settings, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#57382E] block mb-1">
                CAP Serviti a Roma (separati da virgola)
              </label>
              <input
                type="text"
                value={settings.servedCaps.join(', ')}
                onChange={e =>
                  setSettings({
                    ...settings,
                    servedCaps: e.target.value.split(',').map(c => c.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* 3. Social & Stripe Gateway */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-xs space-y-4">
          <h3 className="text-base font-black text-[#57382E] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#DE7E42]" />
            <span>Social Network & Pagamenti Online</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#57382E] block mb-1">Handle Instagram</label>
              <input
                type="text"
                value={settings.instagramHandle}
                onChange={e => setSettings({ ...settings, instagramHandle: e.target.value })}
                placeholder="@sfornami_roma"
                className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
              />
            </div>

            <div>
              <label className="font-bold text-[#57382E] block mb-1">URL Pagina Facebook</label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#F5A16C]/15">
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF8EF] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.stripeEnabled}
                onChange={e => setSettings({ ...settings, stripeEnabled: e.target.checked })}
                className="rounded text-[#DE7E42] w-4 h-4"
              />
              <div className="text-xs">
                <span className="font-bold text-[#57382E]">Abilita Pagamenti Online con Carta (Stripe)</span>
                <p className="text-[11px] text-[#7E5649]">
                  Disattivato per impostazione predefinita. Attivare solo dopo aver inserito le chiavi API Stripe in produzione.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-[#F5A16C] hover:bg-[#DE7E42] text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105"
          >
            SALVA TUTTE LE IMPOSTAZIONI
          </button>
        </div>
      </form>
    </div>
  );
}

