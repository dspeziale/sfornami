'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, ProductVariant } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: ProductVariant, notes?: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  promoCode: string | null;
  discount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'sfornami_cart_items_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items, isLoaded]);

  const addItem = (product: Product, quantity = 1, variant?: ProductVariant, notes?: string) => {
    // Strip heavy gallery/extra images from cart item to keep localStorage featherweight on mobile
    const lightweightProduct: Product = {
      ...product,
      images: [product.imageUrl], // only keep the primary image
    };

    setItems(current => {
      const uniqueId = variant ? `${product.id}-${variant.name}` : product.id;
      const existingIndex = current.findIndex(item => item.id === uniqueId);

      if (existingIndex > -1) {
        const updated = [...current];
        updated[existingIndex].quantity += quantity;
        if (notes) updated[existingIndex].notes = notes;
        return updated;
      } else {
        return [
          ...current,
          {
            id: uniqueId,
            product: lightweightProduct,
            selectedVariant: variant,
            quantity,
            notes,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(current =>
      current.map(item => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (itemId: string) => {
    setItems(current => current.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
    setDiscountPercent(0);
  };

  const toggleCart = () => setIsCartOpen(prev => !prev);

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce((acc, item) => {
    const unitPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);
    return acc + unitPrice * item.quantity;
  }, 0);

  const discount = (subtotal * discountPercent) / 100;

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BENVENUTO10' || clean === 'SFORNAMI10') {
      setPromoCode(clean);
      setDiscountPercent(10);
      return { success: true, message: 'Codice promo applicato: 10% di sconto sul totale!' };
    }
    if (clean === 'ROMA15') {
      setPromoCode(clean);
      setDiscountPercent(15);
      return { success: true, message: 'Codice speciale Roma applicato: 15% di sconto!' };
    }
    return { success: false, message: 'Codice promozionale non valido o scaduto.' };
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setDiscountPercent(0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItemsCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
        promoCode,
        discount,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

