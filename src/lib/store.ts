import { CustomCakeRequest, HomePageContent, Order, OrderStatus, Product, StoreSettings, TimeSlot } from './types';
import { INITIAL_HOMEPAGE_CONTENT, INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS, INITIAL_TIME_SLOTS } from './initialData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'sfornami_products_v1',
  ORDERS: 'sfornami_orders_v1',
  CAKE_REQUESTS: 'sfornami_cake_requests_v1',
  SETTINGS: 'sfornami_settings_v1',
  TIME_SLOTS: 'sfornami_time_slots_v1',
  HOMEPAGE: 'sfornami_homepage_v1',
  LAST_SYNC: 'sfornami_last_sync_v1',
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

// Check if a products list is identical to the hardcoded initial default
function isDefaultCatalog(products: Product[]): boolean {
  if (!products || products.length !== INITIAL_PRODUCTS.length) return false;
  return products.every(
    (p, idx) => p.id === INITIAL_PRODUCTS[idx]?.id && p.name === INITIAL_PRODUCTS[idx]?.name
  );
}

// Initial demonstration orders to give the admin a rich dashboard immediately
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-demo-1',
    orderNumber: 'SFN-2026-1001',
    customerName: 'Giulia De Angelis',
    customerEmail: 'giulia.deangelis@roma.it',
    customerPhone: '+39 347 1234567',
    deliveryType: 'delivery',
    deliveryAddress: 'Via Nomentana, 450',
    deliveryCity: 'Roma',
    deliveryCap: '00156',
    requestedDate: '2026-11-13',
    requestedTimeSlot: '09:00 - 10:30',
    notes: 'Gradita mollica ben cotta per il pane!',
    items: [
      { id: 'item-1', productId: 'prod-pane-casereccio', productName: 'Pane Casereccio di Lariano a Lievito Madre', price: 4.20, quantity: 2, total: 8.40 },
      { id: 'item-2', productId: 'prod-maritozzo-romano-classico', productName: 'Maritozzo Tradizionale con Panna Montata', price: 3.20, quantity: 4, total: 12.80 },
    ],
    subtotal: 21.20,
    deliveryFee: 3.50,
    discount: 0,
    total: 24.70,
    paymentMethod: 'cash_on_delivery',
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
    deliveryAddress: 'Via di Torraccia, 22',
    deliveryCity: 'Roma',
    deliveryCap: '00156',
    requestedDate: '2026-11-13',
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
    notes: 'Festa a Roma. Abbiamo invitati intolleranti alla frutta a guscio.',
    status: 'in_valutazione',
    createdAt: '2026-11-10T14:20:00Z',
  },
];

export const DataService = {
  // Synchronous cache accessor for instant mobile rendering
  getCachedProducts(): Product[] | null {
    if (typeof window === 'undefined') return null;
    return getLocalItem<Product[] | null>(STORAGE_KEYS.PRODUCTS, null);
  },

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    // 1. If running in browser, try fetching centralized server data
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (res.ok) {
          const serverProducts = (await res.json()) as Product[];
          if (Array.isArray(serverProducts)) {
            const localProducts = getLocalItem<Product[] | null>(STORAGE_KEYS.PRODUCTS, null);

            // Auto-Migration check:
            // If the client has modified products in localStorage, but the server is still on the default demo catalog,
            // automatically sync the client's customized products up to the server!
            if (
              localProducts &&
              localProducts.length > 0 &&
              !isDefaultCatalog(localProducts) &&
              isDefaultCatalog(serverProducts)
            ) {
              console.log('🔄 Sincronizzazione automatica catalogo personalizzato verso il server...');
              try {
                await fetch('/api/products', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(localProducts),
                });
                return localProducts;
              } catch (syncErr) {
                console.warn('Auto-sync to server failed', syncErr);
                return localProducts;
              }
            }

            // Otherwise, update local storage with the authoritative server catalog
            setLocalItem(STORAGE_KEYS.PRODUCTS, serverProducts);
            return serverProducts;
          }
        }
      } catch (err) {
        console.warn('Network error fetching /api/products, using local fallback:', err);
      }
    }

    // 2. Supabase fallback if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Product[];
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local storage', e);
      }
    }

    // 3. Fallback to localStorage or default
    return getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find(p => p.slug === slug) || null;
  },

  async saveProduct(product: Product): Promise<Product> {
    // Update local cache first
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    setLocalItem(STORAGE_KEYS.PRODUCTS, products);

    // Save to centralized server API
    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
      } catch (e) {
        console.warn('Server API save product error:', e);
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').upsert(product);
      } catch (e) {
        console.warn('Supabase save product error', e);
      }
    }

    return product;
  },

  async saveAllProducts(products: Product[]): Promise<Product[]> {
    setLocalItem(STORAGE_KEYS.PRODUCTS, products);

    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(products),
        });
        if (res.ok) {
          setLocalItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
        }
      } catch (e) {
        console.warn('Server API sync products error:', e);
      }
    }

    return products;
  },

  async deleteProduct(productId: string): Promise<void> {
    const products = await this.getProducts();
    const updated = products.filter(p => p.id !== productId);
    setLocalItem(STORAGE_KEYS.PRODUCTS, updated);

    if (typeof window !== 'undefined') {
      try {
        await fetch(`/api/products?id=${encodeURIComponent(productId)}`, {
          method: 'DELETE',
        });
      } catch (e) {
        console.warn('Server API delete product error:', e);
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', productId);
      } catch (e) {
        console.warn('Supabase delete product error', e);
      }
    }
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
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        if (res.ok) {
          const data = (await res.json()) as Order[];
          if (Array.isArray(data) && data.length > 0) {
            setLocalItem(STORAGE_KEYS.ORDERS, data);
            return data;
          }
        }
      } catch (e) {
        console.warn('Failed to fetch /api/orders:', e);
      }
    }

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

    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder),
        });
      } catch (e) {
        console.warn('Failed to save order to /api/orders:', e);
      }
    }

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
    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: orderId, status }),
        });
      } catch (e) {
        console.warn('Failed to update order status via /api/orders:', e);
      }
    }

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
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/torte', { cache: 'no-store' });
        if (res.ok) {
          const data = (await res.json()) as CustomCakeRequest[];
          if (Array.isArray(data) && data.length > 0) {
            setLocalItem(STORAGE_KEYS.CAKE_REQUESTS, data);
            return data;
          }
        }
      } catch (e) {
        console.warn('Failed to fetch /api/torte:', e);
      }
    }

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

    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/torte', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRequest),
        });
      } catch (e) {
        console.warn('Failed to save cake request to /api/torte:', e);
      }
    }

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
    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/torte', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status, estimatedQuote: quoteAmount }),
        });
      } catch (e) {
        console.warn('Failed to update cake status via /api/torte:', e);
      }
    }

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
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        if (res.ok) {
          const data = (await res.json()) as StoreSettings;
          if (data && data.storeName) {
            setLocalItem(STORAGE_KEYS.SETTINGS, data);
            return data;
          }
        }
      } catch (e) {
        console.warn('Failed to fetch /api/settings:', e);
      }
    }

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
    setLocalItem(STORAGE_KEYS.SETTINGS, settings);

    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings),
        });
      } catch (e) {
        console.warn('Failed to save settings to /api/settings:', e);
      }
      window.dispatchEvent(new CustomEvent('sfornami_settings_updated', { detail: settings }));
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('store_settings').upsert(settings);
      } catch (e) {
        console.warn('Supabase save settings error', e);
      }
    }
    return settings;
  },

  // --- TIME SLOTS ---
  async getTimeSlots(): Promise<TimeSlot[]> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/calendario', { cache: 'no-store' });
        if (res.ok) {
          const data = (await res.json()) as TimeSlot[];
          if (Array.isArray(data) && data.length > 0) {
            setLocalItem(STORAGE_KEYS.TIME_SLOTS, data);
            return data;
          }
        }
      } catch (e) {
        console.warn('Failed to fetch /api/calendario:', e);
      }
    }
    return getLocalItem<TimeSlot[]>(STORAGE_KEYS.TIME_SLOTS, INITIAL_TIME_SLOTS);
  },

  async saveTimeSlots(slots: TimeSlot[]): Promise<TimeSlot[]> {
    setLocalItem(STORAGE_KEYS.TIME_SLOTS, slots);

    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/calendario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slots),
        });
      } catch (e) {
        console.warn('Failed to save time slots to /api/calendario:', e);
      }
    }
    return slots;
  },

  // --- HOMEPAGE CONTENT ---
  async getHomepageContent(): Promise<HomePageContent> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/homepage', { cache: 'no-store' });
        if (res.ok) {
          const data = (await res.json()) as HomePageContent;
          if (data && data.heroTitle) {
            setLocalItem(STORAGE_KEYS.HOMEPAGE, data);
            return data;
          }
        }
      } catch (e) {
        console.warn('Failed to fetch /api/homepage:', e);
      }
    }
    return getLocalItem<HomePageContent>(STORAGE_KEYS.HOMEPAGE, INITIAL_HOMEPAGE_CONTENT);
  },

  async saveHomepageContent(content: HomePageContent): Promise<HomePageContent> {
    setLocalItem(STORAGE_KEYS.HOMEPAGE, content);

    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/homepage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(content),
        });
      } catch (e) {
        console.warn('Failed to save homepage content to /api/homepage:', e);
      }
      window.dispatchEvent(new CustomEvent('sfornami_homepage_updated', { detail: content }));
    }
    return content;
  },
};
