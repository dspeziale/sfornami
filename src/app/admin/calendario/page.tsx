'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Plus, Trash2, Check, AlertCircle, Save } from 'lucide-react';
import { DataService } from '@/lib/store';
import { TimeSlot } from '@/lib/types';
import { INITIAL_TIME_SLOTS } from '@/lib/initialData';

export default function AdminCalendarioPage() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New slot inputs
  const [newType, setNewType] = useState<'pickup' | 'delivery'>('pickup');
  const [newLabel, setNewLabel] = useState('08:30 - 10:00');
  const [newMax, setNewMax] = useState(15);

  useEffect(() => {
    DataService.getTimeSlots().then(items => {
      setSlots(items);
      setLoading(false);
    });
  }, []);

  const toggleSlotActive = (id: string) => {
    setSlots(current =>
      current.map(s => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const updateMaxOrders = (id: string, max: number) => {
    setSlots(current =>
      current.map(s => (s.id === id ? { ...s, maxOrders: max } : s))
    );
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      type: newType,
      label: newLabel,
      maxOrders: Number(newMax),
      isActive: true,
    };
    setSlots([...slots, newSlot]);
  };

  const handleDeleteSlot = (id: string) => {
    setSlots(slots.filter(s => s.id !== id));
  };

  const handleSaveAll = async () => {
    await DataService.saveTimeSlots(slots);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const pickupSlots = slots.filter(s => s.type === 'pickup');
  const deliverySlots = slots.filter(s => s.type === 'delivery');

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#DE7E42]">
            Capienza e Ritiro
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#57382E]">
            Gestione Calendario & Fasce Orarie
          </h1>
          <p className="text-xs text-[#7E5649]">
            Configura le fasce orarie per il ritiro al forno e la consegna a domicilio, e imposta il limite massimo di ordini per evitare code.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-6 py-3 rounded-2xl bg-[#57382E] hover:bg-[#7E5649] text-white font-black text-xs flex items-center gap-2 shadow-md transition-all hover:scale-105"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? 'SALVATO CON SUCCESSO!' : 'SALVA MODIFICHE'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pickup Slots */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#F5A16C]/25 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#57382E] flex items-center gap-2">
              <span className="text-xl">🏪</span>
              <span>Fasce Orarie Ritiro al Forno</span>
            </h3>
            <span className="text-xs text-[#9E7D73] font-bold">{pickupSlots.length} fasce</span>
          </div>

          <div className="space-y-2">
            {pickupSlots.map(slot => (
              <div
                key={slot.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF8EF] border border-[#F5A16C]/20 text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-black text-[#57382E] text-sm block">{slot.label}</span>
                  <span className="text-[#7E5649]">Max ordini accettabili:</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={slot.maxOrders}
                    onChange={e => updateMaxOrders(slot.id, parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded-xl bg-white border border-[#F5A16C]/30 text-center font-bold text-xs"
                  />
                  <button
                    onClick={() => toggleSlotActive(slot.id)}
                    className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-colors ${
                      slot.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {slot.isActive ? 'Attivo' : 'Chiuso'}
                  </button>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Slots */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#F5A16C]/25 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#57382E] flex items-center gap-2">
              <span className="text-xl">🛵</span>
              <span>Fasce Orarie Consegna a Domicilio</span>
            </h3>
            <span className="text-xs text-[#9E7D73] font-bold">{deliverySlots.length} fasce</span>
          </div>

          <div className="space-y-2">
            {deliverySlots.map(slot => (
              <div
                key={slot.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF8EF] border border-[#F5A16C]/20 text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-black text-[#57382E] text-sm block">{slot.label}</span>
                  <span className="text-[#7E5649]">Max consegne per slot:</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={slot.maxOrders}
                    onChange={e => updateMaxOrders(slot.id, parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded-xl bg-white border border-[#F5A16C]/30 text-center font-bold text-xs"
                  />
                  <button
                    onClick={() => toggleSlotActive(slot.id)}
                    className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-colors ${
                      slot.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {slot.isActive ? 'Attivo' : 'Chiuso'}
                  </button>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add new time slot form */}
      <form onSubmit={handleAddSlot} className="bg-white rounded-3xl p-6 border-2 border-[#F5A16C]/25 space-y-3">
        <h4 className="text-xs font-black uppercase text-[#57382E]">Crea Nuova Fascia Oraria</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-bold text-[#57382E] block mb-1">Tipo</label>
            <select
              value={newType}
              onChange={e => setNewType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 font-bold"
            >
              <option value="pickup">Ritiro in Forno</option>
              <option value="delivery">Consegna a Domicilio</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-[#57382E] block mb-1">Fascia (es. 14:00 - 15:30)</label>
            <input
              type="text"
              required
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
            />
          </div>
          <div>
            <label className="font-bold text-[#57382E] block mb-1">Max Ordini</label>
            <input
              type="number"
              required
              value={newMax}
              onChange={e => setNewMax(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#F5A16C] hover:bg-[#DE7E42] text-white font-black text-xs"
            >
              + Aggiungi Fascia
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
