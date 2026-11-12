'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CustomerUser } from '@/lib/customerTypes';

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    address?: string;
    city?: string;
    cap?: string;
    notes?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateCustomerData: (data: Partial<CustomerUser>) => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'sfornami_customer_session_v1';

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCustomer(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Errore lettura sessione cliente', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Credenziali non valide.' };
      }
      setCustomer(data.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Errore di connessione.' };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    address?: string;
    city?: string;
    cap?: string;
    notes?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...userData }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Errore durante la registrazione.' };
      }
      setCustomer(data.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Errore di rete.' };
    }
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateCustomerData = (data: Partial<CustomerUser>) => {
    if (!customer) return;
    const updated = { ...customer, ...data };
    setCustomer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        loading,
        login,
        register,
        logout,
        updateCustomerData,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

