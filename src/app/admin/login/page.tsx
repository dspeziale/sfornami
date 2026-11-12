'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('sfornami_admin_auth', 'true');
        localStorage.setItem('sfornami_admin_email', data.email);
        router.push('/admin');
      } else {
        setError(data.error || 'Credenziali non corrette.');
        setLoading(false);
      }
    } catch (err) {
      setError('Errore di comunicazione con il server. Riprova.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EF] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 animate-fadeIn">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <Logo variant="main" size="lg" />
          </Link>
          <div className="pt-2">
            <span className="px-3 py-1 rounded-full bg-[#FFE29A] text-[#57382E] text-xs font-black uppercase tracking-wider">
              Area Riservata Forno
            </span>
            <h2 className="text-2xl font-black text-[#57382E] mt-2">
              Accesso Amministratore
            </h2>
            <p className="text-xs text-[#7E5649]">
              Gestione ordini in tempo reale, catalogo prodotti e calendario.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/30 shadow-xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-[#57382E] block mb-1">
                Email Amministratore
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#9E7D73]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E] focus:outline-hidden focus:border-[#F28BA6]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#57382E] block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#9E7D73]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5A16C]/30 text-xs text-[#57382E] focus:outline-hidden focus:border-[#F28BA6]"
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3 bg-[#FFE29A]/30 rounded-xl text-[11px] text-[#57382E] border border-[#FFE29A] space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Credenziali di default modificabili:</span>
              </p>
              <p className="text-[10px] text-[#7E5649]">
                Se non le hai ancora modificate, usa: <code>admin@sfornami.it</code> / <code>sfornami2026</code>. Puoi cambiarle in qualsiasi momento da <strong>Impostazioni Forno</strong>.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#F5A16C] hover:bg-[#DE7E42] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <span>{loading ? 'Accesso in corso...' : 'ACCEDI AL PANNELLO'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-[#9E7D73] hover:underline">
              ← Torna al sito web pubblico
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

