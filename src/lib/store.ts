import { CustomCakeRequest, Order, OrderStatus, Product, StoreSettings, TimeSlot } from './types';
import { INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS, INITIAL_TIME_SLOTS } from './initialData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'sfornami_products_v1',
  ORDERS: 'sfornami_orders_v1',
  CAKE_REQUESTS: 'sfornami_cake_requests_v1',
  SETTINGS: 'sfornami_settings_v1',
  TIME_SLOTS: 'sfornami_time_slots_v1',
};

// Helper for local storage access in SSR-safe manner
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage`, err);
  }
}

// Initial demonstration orders to give the admin a rich dashboard immediately
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-demo-1',
    orderNumber: 'SFN-2026-1001',
    customerName: 'Giulia De Angelis',
    customerEmail: 'giulia.deangelis@roma.it',
    customerPhone: '+39 347 1234567',
    deliveryType: 'pickup',
    requestedDate: '2026-11-11',
    requestedTimeSlot: '09:00 - 10:30',
    notes: 'Gradita mollica ben cotta per il pane!',
    items: [
      { id: 'item-1', productId: 'prod-pane-casereccio', productName: 'Pane Casereccio di Lariano a Lievito Madre', price: 4.20, quantity: 2, total: 8.40 },
      { id: 'item-2', productId: 'prod-maritozzo-romano-classico', productName: 'Maritozzo Tradizionale con Panna Montata', price: 3.20, quantity: 4, total: 12.80 },
    ],
    subtotal: 21.20,
    deliveryFee: 0,
    discount: 0,
    total: 21.20,
    paymentMethod: 'pickup',
    paymentStatus: 'pending',
    status: 'in_preparazione',
    createdAt: '2026-11-10T18:30:00Z',
  },
  {
    id: 'ord-demo-2',
    orderNumber: 'SFN-2026-1002',
    customerName: 'Marco Valenti',
    customerEmail: 'm.valenti@studiolegaleroma.it',
    customerPhone: '+39 333 9876543',
    deliveryType: 'delivery',
    deliveryAddress: 'Corso Vittorio Emanuele II, 142',
    deliveryCity: 'Roma',
    deliveryCap: '00186',
    requestedDate: '2026-11-11',
    requestedTimeSlot: '10:30 - 12:30 (Mattina)',
    notes: 'Citofonare Studio Valenti int. 4. Colazione per riunione clienti.',
    items: [
      { id: 'item-3', productId: 'prod-pizza-bianca-romana', productName: 'Pizza Bianca Romana alla Pala', variantName: 'Farcita con Mortadella IGP di Bologna (+150g)', price: 7.00, quantity: 2, total: 14.00 },
      { id: 'item-4', productId: 'prod-cornetto-sfogliato-burro', productName: 'Cornetto Sfogliato al Burro Francese', variantName: 'Farcito con Crema al Pistacchio di Bronte', price: 2.60, quantity: 6, total: 15.60 },
      { id: 'item-5', productId: 'prod-tozzetti-romani-mandorle', productName: 'Tozzetti Tradizionali Romani alle Mandorle e Miele', price: 5.50, quantity: 1, total: 5.50 },
    ],
    subtotal: 35.10,
    deliveryFee: 3.50,
    discount: 0,
    total: 38.60,
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'pending',
    status: 'nuovo',
    createdAt: '2026-11-10T19:15:00Z',
  },
  {
    id: 'ord-demo-3',
    orderNumber: 'SFN-2026-1003',
    customerName: 'Elena Ferri',
    customerEmail: 'elena.ferri@gmail.com',
    customerPhone: '+39 328 5544332',
    deliveryType: 'pickup',
    requestedDate: '2026-11-11',
    requestedTimeSlot: '16:30 - 18:00',
    notes: 'Torta per compleanno di mamma, con candelina 60 se possibile!',
    items: [
      { id: 'item-6', productId: 'prod-torta-millefoglie-chantilly', productName: 'Torta Millefoglie con Chantilly e Fragoline di Nemi', price: 36.00, quantity: 1, total: 36.00 },
    ],
    subtotal: 36.00,
    deliveryFee: 0,
    discount: 0,
    total: 36.00,
    paymentMethod: 'pickup',
    paymentStatus: 'paid',
    status: 'confermato',
    createdAt: '2026-11-10T16:00:00Z',
  },
];

const INITIAL_DEMO_CAKE_REQUESTS: CustomCakeRequest[] = [
  {
    id: 'cake-demo-1',
    customerName: 'Federica Moretti',
    customerPhone: '+39 349 7788990',
    customerEmail: 'fede.moretti@libero.it',
    cakeType: 'Naked Cake floreale',
    servings: 20,
    flavorBase: 'Pan di spagna alla vaniglia con bagna leggera ai frutti di bosco',
    filling: 'Crema chantilly al mascarpone e fragole fresche',
    decoration: 'Fiori edibili naturali, rosmarino e lamponi a cascata',
    customText: 'Auguri Beatrice! (18 Anni)',
    requestedDate: '2026-11-15',
    requestedTime: '11:00',
    notes: 'Festa in terrazza a Trastevere. Abbiamo invitati intolleranti alla frutta a guscio.',
    status: 'in_valutazione',
    createdAt: '2026-11-10T14:20:00Z',
  },
];

export const DataService = {
  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Product[];
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local storage', e);
      }
    }
    return getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find(p => p.slug === slug) || null;
  },

  async saveProduct(product: Product): Promise<Product> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').upsert(product);
      } catch (e) {
        console.warn('Supabase save product error', e);
      }
    }
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    setLocalItem(STORAGE_KEYS.PRODUCTS, products);
    return product;
  },

  async deleteProduct(productId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', productId);
      } catch (e) {
        console.warn('Supabase delete product error', e);
      }
    }
    const products = await this.getProducts();
    const updated = products.filter(p => p.id !== productId);
    setLocalItem(STORAGE_KEYS.PRODUCTS, updated);
  },

  async toggleProductAvailability(productId: string): Promise<boolean> {
    const products = await this.getProducts();
    const p = products.find(item => item.id === productId);
    if (!p) return false;
    p.isAvailable = !p.isAvailable;
    await this.saveProduct(p);
    return p.isAvailable;
  },

  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as Order[];
      } catch (e) {
        console.warn('Supabase fetch orders error', e);
      }
    }
    return getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_DEMO_ORDERS);
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find(o => o.id === id || o.orderNumber === id) || null;
  },

  async createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<Order> {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SFN-2026-${randomSuffix}`;
    const newOrder: Order = {
      ...order,
      id: `ord-${timestamp}`,
      orderNumber,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').insert(newOrder);
      } catch (e) {
        console.warn('Supabase insert order error', e);
      }
    }

    const currentOrders = await this.getOrders();
    currentOrders.unshift(newOrder);
    setLocalItem(STORAGE_KEYS.ORDERS, currentOrders);
    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').update({ status }).eq('id', orderId);
      } catch (e) {
        console.warn('Supabase update order status error', e);
      }
    }
    const orders = await this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      setLocalItem(STORAGE_KEYS.ORDERS, orders);
    }
  },

  // --- CUSTOM CAKE REQUESTS ---
  async getCustomCakeRequests(): Promise<CustomCakeRequest[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('custom_cake_requests').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as CustomCakeRequest[];
      } catch (e) {
        console.warn('Supabase fetch custom cakes error', e);
      }
    }
    return getLocalItem<CustomCakeRequest[]>(STORAGE_KEYS.CAKE_REQUESTS, INITIAL_DEMO_CAKE_REQUESTS);
  },

  async createCustomCakeRequest(req: Omit<CustomCakeRequest, 'id' | 'createdAt' | 'status'>): Promise<CustomCakeRequest> {
    const newRequest: CustomCakeRequest = {
      ...req,
      id: `cake-${Date.now()}`,
      status: 'in_valutazione',
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('custom_cake_requests').insert(newRequest);
      } catch (e) {
        console.warn('Supabase insert custom cake error', e);
      }
    }

    const currentRequests = await this.getCustomCakeRequests();
    currentRequests.unshift(newRequest);
    setLocalItem(STORAGE_KEYS.CAKE_REQUESTS, currentRequests);
    return newRequest;
  },

  async updateCustomCakeStatus(id: string, status: CustomCakeRequest['status'], quoteAmount?: number): Promise<void> {
    const requests = await this.getCustomCakeRequests();
    const req = requests.find(r => r.id === id);
    if (req) {
      req.status = status;
      if (quoteAmount !== undefined) req.quoteAmount = quoteAmount;
      setLocalItem(STORAGE_KEYS.CAKE_REQUESTS, requests);
    }
  },

  // --- SETTINGS ---
  async getSettings(): Promise<StoreSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('store_settings').select('*').single();
        if (!error && data) return data as StoreSettings;
      } catch (e) {
        console.warn('Supabase fetch settings error', e);
      }
    }
    return getLocalItem<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_STORE_SETTINGS);
  },

  async saveSettings(settings: StoreSettings): Promise<StoreSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('store_settings').upsert(settings);
      } catch (e) {
        console.warn('Supabase save settings error', e);
      }
    }
    setLocalItem(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  },

  // --- TIME SLOTS ---
  async getTimeSlots(): Promise<TimeSlot[]> {
    return getLocalItem<TimeSlot[]>(STORAGE_KEYS.TIME_SLOTS, INITIAL_TIME_SLOTS);
  },

  async saveTimeSlots(slots: TimeSlot[]): Promise<TimeSlot[]> {
    setLocalItem(STORAGE_KEYS.TIME_SLOTS, slots);
    return slots;
  },
};

