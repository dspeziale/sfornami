import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Info, ArrowLeft } from 'lucide-react';
import { ALLERGENS_LIST, INITIAL_PRODUCTS } from '@/lib/initialData';

export default function AllergeniPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20 space-y-12">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DE7E42] hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Torna alla home</span>
        </Link>
        <span className="text-xs font-black uppercase tracking-wider text-[#DE7E42] block">
          Regolamento UE n. 1169/2011
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#57382E]">
          Tabella e Informazioni sugli Allergeni
        </h1>
        <p className="text-xs sm:text-sm text-[#7E5649] max-w-2xl mt-1">
          La salute e la trasparenza verso i nostri clienti sono al primo posto. Consulta di seguito la lista degli allergeni alimentari e la presenza nelle nostre specialità artigianali.
        </p>
      </div>

      {/* Official 14 Allergen Reference Guide */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-xs space-y-4">
        <h2 className="text-lg font-black text-[#57382E] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Legenda degli Allergeni Monitorati nel Laboratorio</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALLERGENS_LIST.map(a => (
            <div
              key={a.key}
              className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5A16C]/20 space-y-1"
            >
              <div className="flex items-center gap-2 text-[#57382E] font-bold text-sm">
                <span className="text-xl">{a.icon}</span>
                <span>{a.name}</span>
              </div>
              <p className="text-[11px] text-[#7E5649] leading-relaxed">
                {a.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Products Allergen Matrix Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5A16C]/25 shadow-sm space-y-4">
        <h2 className="text-lg font-black text-[#57382E]">
          Matrice di Presenza Allergeni per Prodotto
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#57382E]/20 text-[#57382E]">
                <th className="py-3 px-3 font-black">Prodotto</th>
                <th className="py-3 px-3 font-black">Categoria</th>
                <th className="py-3 px-3 font-black">Allergeni Presenti</th>
                <th className="py-3 px-3 font-black">Note di Laboratorio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5A16C]/15">
              {INITIAL_PRODUCTS.map(p => {
                const allergens = ALLERGENS_LIST.filter(a => p.allergens.includes(a.key));
                return (
                  <tr key={p.id} className="hover:bg-[#FFF8EF]/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#57382E]">{p.name}</td>
                    <td className="py-3 px-3 text-[#7E5649] uppercase text-[10px] font-semibold">{p.category}</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {allergens.map(a => (
                          <span
                            key={a.key}
                            className="px-2 py-0.5 rounded-md bg-[#FDE8ED] text-[#D86B86] font-bold text-[10px] border border-[#F28BA6]/30"
                          >
                            {a.icon} {a.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#9E7D73] text-[11px]">
                      Lavorato in laboratorio con presenza di glutine, latte e uova.
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-contamination Disclaimer */}
      <div className="bg-[#FFE29A]/30 rounded-3xl p-6 border border-[#FFE29A] text-xs text-[#57382E] space-y-2">
        <p className="font-bold flex items-center gap-1.5 text-sm">
          <Info className="w-4 h-4 text-[#DE7E42]" />
          <span>Avvertenza Importante su Contaminazioni Crociate</span>
        </p>
        <p className="leading-relaxed text-[#7E5649]">
          Nonostante la massima attenzione nella sanificazione e separazione delle linee produttive, trattandosi di un laboratorio artigianale con farine e polveri volatili, <strong>non possiamo garantire la totale assenza di tracce di glutine, frutta a guscio, sesamo, latte o soia</strong> in nessun prodotto. Per gravi allergie o celiachia vi invitiamo a contattare preventivamente il nostro personale prima dell'acquisto.
        </p>
      </div>
    </div>
  );
}

