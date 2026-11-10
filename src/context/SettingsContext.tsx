'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StoreSettings } from '@/lib/types';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';
import { DataService } from '@/lib/store';
import { formatPhoneForWhatsApp } from '@/lib/whatsapp';

interface SettingsContextType {
  settings: StoreSettings;
  loading: boolean;
  whatsappNumber: string;
  getWhatsAppLink: (text?: string) => string;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: StoreSettings) => Promise<StoreSettings>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const data = await DataService.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (e) {
      console.warn('Failed to load settings', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();

    // Listen to local custom event when settings are updated in admin panel
    const handleSettingsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<StoreSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        loadSettings();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sfornami_settings_v1') {
        loadSettings();
      }
    };

    window.addEventListener('sfornami_settings_updated', handleSettingsUpdated);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('sfornami_settings_updated', handleSettingsUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateSettings = async (newSettings: StoreSettings): Promise<StoreSettings> => {
    const saved = await DataService.saveSettings(newSettings);
    setSettings(saved);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sfornami_settings_updated', { detail: saved }));
    }
    return saved;
  };

  const whatsappNumber = formatPhoneForWhatsApp(settings.whatsappNumber || INITIAL_STORE_SETTINGS.whatsappNumber);

  const getWhatsAppLink = (text?: string) => {
    const msg = text || 'Ciao SFORNAMÌ! Vorrei fare un ordine con consegna a domicilio a Roma.';
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        whatsappNumber,
        getWhatsAppLink,
        refreshSettings: loadSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    // Fallback if rendered outside provider
    const whatsappNumber = formatPhoneForWhatsApp(INITIAL_STORE_SETTINGS.whatsappNumber);
    return {
      settings: INITIAL_STORE_SETTINGS,
      loading: false,
      whatsappNumber,
      getWhatsAppLink: (text?: string) => {
        const msg = text || 'Ciao SFORNAMÌ! Vorrei fare un ordine con consegna a domicilio a Roma.';
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
      },
      refreshSettings: async () => {},
      updateSettings: async s => s,
    };
  }
  return context;
}
