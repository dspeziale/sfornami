'use client';

import React, { useEffect, useState } from 'react';
import { Save, Store, Phone, MessageCircle, MapPin, Truck, Check, Sparkles, CreditCard, Lock, ShieldAlert, Plus, Trash2 } from 'lucide-react';
import { DataService } from '@/lib/store';
import { StoreSettings } from '@/lib/types';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

export default function AdminImpostazioniPage() {
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Admin login credentials change state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminCredsMsg, setAdminCredsMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [changingCreds, setChangingCreds] = useState(false);

  useEffect(() => {
    DataService.getSettings().then(s => {
      setSettings(s);
      setLoading(false);
    });

    fetch('/api/admin/credentials')
      .then(res => res.json())
      .then(data => {
        if (data.email) setAdminEmail(data.email);
      })
      .catch(() => {});
  }, []);

  const handleChangeCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminCredsMsg(null);
    if (!adminEmail || !adminPassword || adminPassword.length < 6) {
      setAdminCredsMsg({ success: false, text: 'Inserisci un’email valida e una password di almeno 6 caratteri.' });
      return;
    }
    setChangingCreds(true);
    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          newEmail: adminEmail,
          newPassword: adminPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminCredsMsg({ success: true, text: 'Credenziali Admin aggiornate con successo nel database!' });
        setAdminPassword('');
      } else {
        setAdminCredsMsg({ success: false, text: data.error || 'Errore durante l’aggiornamento.' });
      }
    } catch (err) {
      setAdminCredsMsg({ success: false, text: 'Errore di rete durante il salvataggio.' });
    } finally {
      setChangingCreds(false);
    }
  };

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
            Configurazione Laboratorio (Torraccia, Roma)
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

            {/* Delivery Fees & Free Delivery Threshold Config */}
            <div className="p-4 rounded-2xl bg-linear-to-r from-[#FFE29A]/30 to-[#FFF8EF] border border-[#F5A16C]/30 space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#DE7E42]" />
                <h4 className="text-sm font-black text-[#57382E]">
                  Spese di Consegna & Spedizione Gratuita
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-3.5 rounded-xl border border-[#F5A16C]/25 shadow-xs">
                  <label className="font-bold text-[#57382E] block mb-1 text-xs">
                    Costo Base di Consegna (€)
                  </label>
                  <p className="text-[10px] text-[#7E5649] mb-2">Importo addebitato per la consegna a domicilio.</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#57382E]">€</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={settings.deliveryFee}
                      onChange={e => setSettings({ ...settings, deliveryFee: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#FFF8EF] border border-[#F5A16C]/30 font-black text-sm text-[#DE7E42]"
                    />
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#F5A16C]/25 shadow-xs">
                  <label className="font-bold text-[#57382E] block mb-1 text-xs">
                    Consegna GRATIS a partire da (€)
                  </label>
                  <p className="text-[10px] text-[#7E5649] mb-2">Oltre questo totale di spesa, il cliente NON paga la consegna.</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#57382E]">€</span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={settings.freeDeliveryThreshold}
                      onChange={e => setSettings({ ...settings, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#FFF8EF] border border-[#F5A16C]/30 font-black text-sm text-emerald-700"
                    />
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#F5A16C]/25 shadow-xs">
                  <label className="font-bold text-[#57382E] block mb-1 text-xs">
                    Minimo d'Ordine (€)
                  </label>
                  <p className="text-[10px] text-[#7E5649] mb-2">Carrello minimo per poter ordinare a domicilio.</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#57382E]">€</span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={settings.minOrderDelivery}
                      onChange={e => setSettings({ ...settings, minOrderDelivery: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#FFF8EF] border border-[#F5A16C]/30 font-black text-sm text-[#57382E]"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Customer Preview Banner */}
              <div className="p-3 bg-white rounded-xl border border-[#F5A16C]/30 text-xs flex items-center gap-2 text-[#57382E]">
                <span className="text-base">💡</span>
                <span>
                  <strong>Regola attiva:</strong> Il cliente paga <strong>€{settings.deliveryFee.toFixed(2)}</strong> per la consegna. Se il carrello raggiunge o supera <strong>€{settings.freeDeliveryThreshold.toFixed(2)}</strong>, le spese di consegna diventano <strong>0.00 € (GRATIS)</strong>!
                </span>
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

        {/* 4. Aggiunte & Personalizzazioni Predefinite del Negozio */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-[#57382E] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#DE7E42]" />
                <span>Aggiunte & Personalizzazioni Predefinite del Negozio</span>
              </h3>
              <p className="text-xs text-[#7E5649]">
                Queste opzioni (es. Confezione regalo, Scritta personalizzata, Biglietto) vengono proposte per tutti i prodotti del catalogo, a meno che il singolo prodotto non ne abbia di personalizzate.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const current = settings.defaultAddons || [];
                setSettings({
                  ...settings,
                  defaultAddons: [
                    ...current,
                    {
                      id: `addon-${Date.now()}`,
                      name: 'Nuova Aggiunta',
                      price: 2.00,
                      allowsCustomText: false,
                    },
                  ],
                });
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#57382E] hover:bg-[#7E5649] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Aggiungi Opzione Globale</span>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {(settings.defaultAddons || []).length === 0 ? (
              <p className="text-xs text-[#9E7D73] italic p-3 bg-[#FFF8EF] rounded-xl border border-dashed border-[#F5A16C]/30 text-center">
                Nessuna aggiunta predefinita configurata. Clicca su "Aggiungi Opzione Globale" per crearne una.
              </p>
            ) : (
              (settings.defaultAddons || []).map((addon, aIdx) => (
                <div
                  key={addon.id}
                  className="p-3 bg-[#FFF8EF] rounded-2xl border border-[#F5A16C]/30 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs"
                >
                  <div className="flex-1 w-full sm:w-auto">
                    <input
                      type="text"
                      required
                      value={addon.name}
                      onChange={e => {
                        const updated = [...(settings.defaultAddons || [])];
                        updated[aIdx] = { ...updated[aIdx], name: e.target.value };
                        setSettings({ ...settings, defaultAddons: updated });
                      }}
                      placeholder="Nome dell'aggiunta (es. Confezione regalo con nastro)"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#F5A16C]/30 font-bold text-[#57382E]"
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[#57382E]">€</span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        required
                        value={addon.price}
                        onChange={e => {
                          const updated = [...(settings.defaultAddons || [])];
                          updated[aIdx] = { ...updated[aIdx], price: parseFloat(e.target.value) || 0 };
                          setSettings({ ...settings, defaultAddons: updated });
                        }}
                        className="w-20 px-2 py-1.5 rounded-xl bg-white border border-[#F5A16C]/30 font-black text-[#DE7E42]"
                      />
                    </div>
                    <label className="flex items-center gap-1 text-[11px] font-bold text-[#57382E] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(addon.allowsCustomText)}
                        onChange={e => {
                          const updated = [...(settings.defaultAddons || [])];
                          updated[aIdx] = { ...updated[aIdx], allowsCustomText: e.target.checked };
                          setSettings({ ...settings, defaultAddons: updated });
                        }}
                        className="rounded text-[#DE7E42]"
                      />
                      <span>Chiedi testo cliente</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (settings.defaultAddons || []).filter((_, i) => i !== aIdx);
                        setSettings({ ...settings, defaultAddons: updated });
                      }}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                      title="Elimina opzione"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
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

      {/* 4. SEZIONE SICUREZZA & CREDENZIALI ADMIN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#DE7E42]/30 shadow-md space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F5A16C]/20">
          <div className="w-9 h-9 rounded-xl bg-[#DE7E42] text-white flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#57382E]">
              Credenziali di Accesso Admin (Login)
            </h3>
            <p className="text-xs text-[#7E5649]">
              Cambia l'email e la password utilizzate per entrare nel pannello di amministrazione. Le modifiche sono memorizzate in PostgreSQL.
            </p>
          </div>
        </div>

        {adminCredsMsg && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
              adminCredsMsg.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {adminCredsMsg.success ? <Check className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-red-600" />}
            <span>{adminCredsMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangeCredentials} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#57382E] block mb-1">Nuova Email Admin</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                placeholder="admin@sfornami.it"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E] focus:outline-hidden focus:border-[#F28BA6]"
              />
            </div>

            <div>
              <label className="font-bold text-[#57382E] block mb-1">Nuova Password Admin (min. 6 caratteri)</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="Digita la nuova password sicura..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E] focus:outline-hidden focus:border-[#F28BA6]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={changingCreds}
              className="px-6 py-2.5 rounded-xl bg-[#57382E] hover:bg-[#7E5649] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{changingCreds ? 'Salvataggio...' : 'Aggiorna Credenziali Login'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

