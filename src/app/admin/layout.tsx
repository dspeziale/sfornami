'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Cake,
  Calendar,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Sparkles,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('sfornami_admin_auth');
      setIsAuthenticated(auth === 'true');
      if (auth !== 'true' && !isLoginPage) {
        router.push('/admin/login');
      }
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem('sfornami_admin_auth');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  // If on login page, render children directly without admin shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Gestione Ordini', href: '/admin/ordini', icon: ShoppingBag },
    { name: 'Prodotti & Menu', href: '/admin/prodotti', icon: Package },
    { name: 'Torte su Misura', href: '/admin/torte', icon: Cake },
    { name: 'Modifica Homepage', href: '/admin/homepage', icon: Sparkles },
    { name: 'Fasce Orarie', href: '/admin/calendario', icon: Calendar },
    { name: 'Impostazioni', href: '/admin/impostazioni', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8EF] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#F5A16C]/25 shrink-0 p-6 justify-between">
        <div className="space-y-6">
          <Link href="/admin" className="block">
            <Logo variant="secondary" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#DE7E42] mt-1 block">
              Pannello Gestione Forno
            </span>
          </Link>

          <nav className="space-y-1.5 pt-4">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#FFE29A] text-[#57382E] shadow-xs'
                      : 'text-[#7E5649] hover:bg-[#FFF8EF] hover:text-[#57382E]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#DE7E42]" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-[#F5A16C]/20">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-bold text-[#7E5649] hover:text-[#57382E] p-2 rounded-xl hover:bg-[#FFF8EF]"
          >
            <ExternalLink className="w-4 h-4 text-[#DE7E42]" />
            <span>Visualizza Sito Web</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Esci dall'Area Riservata</span>
          </button>
        </div>
      </aside>

      {/* Top Mobile Bar */}
      <header className="md:hidden bg-white border-b border-[#F5A16C]/25 p-4 flex items-center justify-between sticky top-0 z-30">
        <Logo variant="secondary" />
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className="p-2 text-[#7E5649]">
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 text-[#57382E]"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#F5A16C]/25 p-4 space-y-2 animate-fadeIn z-30">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold ${
                  isActive ? 'bg-[#FFE29A] text-[#57382E]' : 'text-[#7E5649]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#DE7E42]" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-600"
          >
            <LogOut className="w-4 h-4" />
            <span>Esci</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar for the Baker on the move! */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#F5A16C]/25 px-2 py-1.5 flex justify-around items-center z-40 shadow-lg">
        {navItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${
                isActive ? 'text-[#DE7E42]' : 'text-[#9E7D73]'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-[60px]">{item.name.replace('Gestione ', '')}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

