'use client';

import React, { useEffect, useState } from 'react';
import { Cake, MessageCircle, Phone, Calendar, Clock, CheckCircle2, XCircle, Search, RefreshCw } from 'lucide-react';
import { DataService } from '@/lib/store';
import { CustomCakeRequest } from '@/lib/types';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

export default function AdminTortePage() {
  const [requests, setRequests] = useState<CustomCakeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [quoteInputs, setQuoteInputs] = useState<Record<string, number>>({});

  const loadRequests = async () => {
    setLoading(true);
    const data = await DataService.getCustomCakeRequests();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusChange = async (id: string, status: CustomCakeRequest['status']) => {
    const quote = quoteInputs[id];
    await DataService.updateCustomCakeStatus(id, status, quote);
    await loadRequests();
  };

  const filtered = requests.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return r.customerName.toLowerCase().includes(q) || r.cakeType.toLowerCase().includes(q) || r.customerPhone.includes(q);
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#DE7E42]">
            Richieste Speciali
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#57382E]">
            Torte su Ordinazione da Valutare
          </h1>
          <p className="text-xs text-[#7E5649]">
            Richieste ricevute dal configuratore web. Valuta gli ingredienti e invia il preventivo via WhatsApp.
          </p>
        </div>

        <button
          onClick={loadRequests}
          className="p-2.5 rounded-xl bg-white border border-[#F5A16C]/30 text-[#57382E] hover:bg-[#FFE29A]/30 text-xs font-bold flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Ricarica</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(req => {
          const waLink = `https://wa.me/${req.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
            `Ciao ${req.customerName}! Ti contattiamo dal laboratorio artigianale SFORNAMÌ per la tua richiesta di torta "${req.cakeType}" da ${req.servings} persone per il giorno ${req.requestedDate}. ${
              quoteInputs[req.id] ? `Il preventivo stimato è di €${quoteInputs[req.id].toFixed(2)}.` : ''
            }`
          )}`;

          return (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-6 border-2 border-[#F5A16C]/25 shadow-sm space-y-4 text-xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-[#DE7E42] uppercase block">
                    ID: {req.id}
                  </span>
                  <h3 className="text-lg font-black text-[#57382E]">{req.cakeType}</h3>
                  <p className="text-[#7E5649] font-medium mt-0.5">
                    Cliente: <strong>{req.customerName}</strong> ({req.customerPhone})
                  </p>
                </div>
                <select
                  value={req.status}
                  onChange={e => handleStatusChange(req.id, e.target.value as any)}
                  className="px-2.5 py-1 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-bold text-[#57382E] cursor-pointer"
                >
                  <option value="in_valutazione">In Valutazione</option>
                  <option value="preventivo_inviato">Preventivo Inviato</option>
                  <option value="confermata">Confermata</option>
                  <option value="rifiutata">Rifiutata</option>
                </select>
              </div>

              <div className="bg-[#FFF8EF] rounded-2xl p-4 space-y-2 text-[#57382E] border border-[#F5A16C]/20">
                <div className="grid grid-cols-2 gap-2">
                  <p><strong>Porzioni:</strong> {req.servings} persone</p>
                  <p><strong>Data & Ora:</strong> {req.requestedDate} ({req.requestedTime})</p>
                </div>
                <p><strong>Base:</strong> {req.flavorBase}</p>
                <p><strong>Farcitura:</strong> {req.filling}</p>
                <p><strong>Decorazione:</strong> {req.decoration}</p>
                {req.customText && (
                  <p className="text-[#D86B86] italic font-bold">
                    Scritta: "{req.customText}"
                  </p>
                )}
                {req.notes && (
                  <p className="text-[#9E7D73] text-[11px]">
                    <strong>Note:</strong> {req.notes}
                  </p>
                )}
              </div>

              {/* Quote Input & Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="font-bold text-[#57382E]">Preventivo (€):</span>
                  <input
                    type="number"
                    step="1"
                    placeholder="Es. 45"
                    defaultValue={req.quoteAmount || ''}
                    onChange={e => setQuoteInputs({ ...quoteInputs, [req.id]: parseFloat(e.target.value) || 0 })}
                    className="w-24 px-3 py-1.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs font-black"
                  />
                </div>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Invia Preventivo su WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

