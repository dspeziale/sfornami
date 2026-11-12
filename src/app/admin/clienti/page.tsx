'use client';

import React, { useEffect, useState } from 'react';
import { Users, Mail, Phone, MapPin, Calendar, Search, RefreshCw, ShoppingBag } from 'lucide-react';
import { CustomerUser } from '@/lib/customerTypes';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/customer');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCustomers(data);
        }
      }
    } catch (err) {
      console.warn('Errore caricamento lista clienti:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filtered = customers.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q)) ||
      (c.cap && c.cap.includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#DE7E42]">
            Clienti & Utenti Registrati
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#57382E]">
            Anagrafica Clienti ({customers.length})
          </h1>
          <p className="text-xs text-[#7E5649]">
            Clienti che hanno effettuato ordini o si sono registrati sul sito prima del checkout. Tutti i profili sono sincronizzati in PostgreSQL.
          </p>
        </div>

        <button
          onClick={loadCustomers}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-white border border-[#F5A16C]/30 text-xs font-bold text-[#57382E] hover:bg-[#FFE29A]/30 flex items-center gap-2 self-start sm:self-auto transition-all shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#DE7E42]' : ''}`} />
          <span>Aggiorna Elenco</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-3 border border-[#F5A16C]/25 shadow-xs flex items-center gap-2 max-w-md">
        <Search className="w-4 h-4 text-[#9E7D73]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Cerca per nome, email, cellulare, via o CAP..."
          className="w-full text-xs text-[#57382E] placeholder:text-[#9E7D73] focus:outline-hidden"
        />
      </div>

      {/* Table / Cards List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="text-4xl animate-spin">🌾</div>
          <p className="text-xs font-bold text-[#57382E]">Caricamento elenco clienti dal database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border-2 border-dashed border-[#F5A16C]/30 p-8 space-y-3">
          <div className="text-5xl">👤</div>
          <h3 className="text-base font-black text-[#57382E]">Nessun cliente registrato trovato</h3>
          <p className="text-xs text-[#7E5649] max-w-sm mx-auto">
            I nuovi clienti verranno registrati automaticamente e visualizzati qui non appena confermano un ordine o creano un profilo prima del checkout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-5 border border-[#F5A16C]/25 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FFE29A] text-[#57382E] font-black text-xs flex items-center justify-center shrink-0">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#57382E] leading-tight">{c.name}</h4>
                      <span className="text-[10px] text-[#DE7E42] font-semibold">{c.id}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 text-xs text-[#7E5649]">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#DE7E42] shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </p>
                  {c.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{c.phone}</span>
                    </p>
                  )}
                  {c.address && (
                    <p className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#F28BA6] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {c.address}, {c.cap} {c.city}
                      </span>
                    </p>
                  )}
                  {c.notes && (
                    <p className="text-[11px] bg-[#FFF8EF] p-2 rounded-xl border border-[#F5A16C]/20 text-[#57382E]">
                      <strong>Note:</strong> {c.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F5A16C]/15 flex items-center justify-between text-[10px] text-[#9E7D73]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Reg: {new Date(c.createdAt).toLocaleDateString('it-IT')}
                </span>
                {c.lastLoginAt && (
                  <span>Ultimo accesso: {new Date(c.lastLoginAt).toLocaleDateString('it-IT')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

