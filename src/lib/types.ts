export type ProductCategory = 
  | 'panetteria'
  | 'pasticceria'
  | 'torte-ordinazione'
  | 'specialita-stagionali';

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  badge?: string;
}

export type Allergen = 
  | 'glutine'
  | 'latte'
  | 'uova'
  | 'frutta_a_guscio'
  | 'soia'
  | 'sesamo'
  | 'arachidi'
  | 'anidride_solforosa';

export interface ProductVariant {
  name: string;
  priceModifier: number; // additional cost or replacement price
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  subCategory?: string;
  description: string;
  ingredients: string;
  allergens: Allergen[];
  price: number;
  unit: string; // e.g. "al pezzo", "al kg", "500g", "vassoio da 6"
  weight?: string;
  variants?: ProductVariant[];
  imageUrl: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  isWeeklySpecial?: boolean;
  isSeasonal?: boolean;
  dailyQuota?: number;
  badge?: string;
}

export interface CartItem {
  id: string; // unique cart item id (e.g. productId + variant)
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 
  | 'nuovo'
  | 'da_confermare'
  | 'confermato'
  | 'in_preparazione'
  | 'pronto'
  | 'consegnato'
  | 'annullato';

export type DeliveryType = 'pickup' | 'delivery';

export type PaymentMethod = 'pickup' | 'cash_on_delivery' | 'card_on_delivery' | 'stripe';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantName?: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. SFN-2026-1042
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryCap?: string;
  requestedDate: string; // YYYY-MM-DD
  requestedTimeSlot: string; // e.g. "09:00 - 10:30"
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  status: OrderStatus;
  createdAt: string;
  whatsappSent?: boolean;
}

export interface CustomCakeRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  cakeType: string;
  servings: number;
  flavorBase: string;
  filling: string;
  decoration: string;
  customText?: string;
  requestedDate: string;
  requestedTime: string;
  referenceImageUrl?: string;
  notes?: string;
  status: 'in_valutazione' | 'preventivo_inviato' | 'confermata' | 'rifiutata';
  quoteAmount?: number;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  type: DeliveryType;
  label: string; // e.g. "08:30 - 10:00"
  maxOrders: number;
  currentOrders?: number;
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  payoff: string;
  address: string;
  city: string;
  cap: string;
  phone: string;
  whatsappNumber: string; // international format e.g. "393401234567"
  email: string;
  instagramHandle: string;
  facebookUrl: string;
  deliveryEnabled: boolean;
  minOrderDelivery: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  servedCaps: string[];
  stripeEnabled: boolean;
  pickupOpeningHours: string;
  specialNotice?: string;
}

export interface AllergenMeta {
  key: Allergen;
  name: string;
  icon: string;
  description: string;
}

