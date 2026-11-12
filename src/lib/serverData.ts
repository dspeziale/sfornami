import fs from 'fs/promises';
import path from 'path';
import { Product, Order, CustomCakeRequest, StoreSettings, TimeSlot, HomePageContent } from './types';
import { INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS, INITIAL_TIME_SLOTS, INITIAL_HOMEPAGE_CONTENT } from './initialData';
import { PostgresService } from './db';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create data directory:', err);
  }
}

async function readJsonFile<T>(filename: string, defaultValue: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(process.cwd(), 'data', filename);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    try {
      await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
    } catch (writeErr) {
      console.warn(`Could not initialize ${filename}:`, writeErr);
    }
    return defaultValue;
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(process.cwd(), 'data', filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export const ServerData = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    try {
      const items = await PostgresService.getProducts();
      if (items && items.length > 0) return items;
    } catch (e) {
      console.warn('Postgres getProducts fallback to JSON:', e);
    }
    return readJsonFile<Product[]>('products.json', INITIAL_PRODUCTS);
  },

  async setProducts(products: Product[]): Promise<Product[]> {
    try {
      await PostgresService.saveAllProducts(products);
    } catch (e) {
      console.warn('Postgres saveAllProducts fallback to JSON:', e);
    }
    await writeJsonFile('products.json', products);
    return products;
  },

  async saveProduct(product: Product): Promise<Product> {
    try {
      await PostgresService.saveProduct(product);
    } catch (e) {
      console.warn('Postgres saveProduct fallback to JSON:', e);
    }
    const products = await readJsonFile<Product[]>('products.json', INITIAL_PRODUCTS);
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    await writeJsonFile('products.json', products);
    return product;
  },

  async deleteProduct(productId: string): Promise<void> {
    try {
      await PostgresService.deleteProduct(productId);
    } catch (e) {
      console.warn('Postgres deleteProduct fallback to JSON:', e);
    }
    const products = await readJsonFile<Product[]>('products.json', INITIAL_PRODUCTS);
    const filtered = products.filter(p => p.id !== productId);
    await writeJsonFile('products.json', filtered);
  },

  // HOMEPAGE CONTENT
  async getHomepageContent(): Promise<HomePageContent> {
    try {
      return await PostgresService.getHomepageContent();
    } catch (e) {
      console.warn('Postgres getHomepageContent fallback to JSON:', e);
      return readJsonFile<HomePageContent>('homepage.json', INITIAL_HOMEPAGE_CONTENT);
    }
  },

  async saveHomepageContent(content: HomePageContent): Promise<HomePageContent> {
    try {
      await PostgresService.saveHomepageContent(content);
    } catch (e) {
      console.warn('Postgres saveHomepageContent fallback to JSON:', e);
    }
    await writeJsonFile('homepage.json', content);
    return content;
  },

  // SETTINGS
  async getSettings(): Promise<StoreSettings> {
    try {
      return await PostgresService.getSettings();
    } catch (e) {
      console.warn('Postgres getSettings fallback to JSON:', e);
      return readJsonFile<StoreSettings>('settings.json', INITIAL_STORE_SETTINGS);
    }
  },

  async saveSettings(settings: StoreSettings): Promise<StoreSettings> {
    try {
      await PostgresService.saveSettings(settings);
    } catch (e) {
      console.warn('Postgres saveSettings fallback to JSON:', e);
    }
    await writeJsonFile('settings.json', settings);
    return settings;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    try {
      return await PostgresService.getOrders();
    } catch (e) {
      console.warn('Postgres getOrders fallback to JSON:', e);
      return readJsonFile<Order[]>('orders.json', []);
    }
  },

  async saveOrder(order: Order): Promise<Order> {
    try {
      await PostgresService.saveOrder(order);
    } catch (e) {
      console.warn('Postgres saveOrder fallback to JSON:', e);
    }
    const orders = await readJsonFile<Order[]>('orders.json', []);
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
    } else {
      orders.unshift(order);
    }
    await writeJsonFile('orders.json', orders);
    return order;
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      await PostgresService.updateOrderStatus(orderId, status);
    } catch (e) {
      console.warn('Postgres updateOrderStatus fallback to JSON:', e);
    }
    const orders = await readJsonFile<Order[]>('orders.json', []);
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      await writeJsonFile('orders.json', orders);
    }
  },

  // CUSTOM CAKES
  async getCakeRequests(): Promise<CustomCakeRequest[]> {
    try {
      return await PostgresService.getCakeRequests();
    } catch (e) {
      console.warn('Postgres getCakeRequests fallback to JSON:', e);
      return readJsonFile<CustomCakeRequest[]>('cake-requests.json', []);
    }
  },

  async saveCakeRequest(request: CustomCakeRequest): Promise<CustomCakeRequest> {
    try {
      await PostgresService.saveCakeRequest(request);
    } catch (e) {
      console.warn('Postgres saveCakeRequest fallback to JSON:', e);
    }
    const list = await readJsonFile<CustomCakeRequest[]>('cake-requests.json', []);
    const index = list.findIndex(r => r.id === request.id);
    if (index >= 0) {
      list[index] = request;
    } else {
      list.unshift(request);
    }
    await writeJsonFile('cake-requests.json', list);
    return request;
  },

  async updateCakeStatus(id: string, status: CustomCakeRequest['status'], estimatedQuote?: number): Promise<void> {
    try {
      await PostgresService.updateCakeStatus(id, status, estimatedQuote);
    } catch (e) {
      console.warn('Postgres updateCakeStatus fallback to JSON:', e);
    }
    const list = await readJsonFile<CustomCakeRequest[]>('cake-requests.json', []);
    const req = list.find(r => r.id === id);
    if (req) {
      req.status = status;
      if (estimatedQuote !== undefined) req.quoteAmount = estimatedQuote;
      await writeJsonFile('cake-requests.json', list);
    }
  },

  // TIME SLOTS
  async getTimeSlots(): Promise<TimeSlot[]> {
    try {
      return await PostgresService.getTimeSlots();
    } catch (e) {
      console.warn('Postgres getTimeSlots fallback to JSON:', e);
      return readJsonFile<TimeSlot[]>('time-slots.json', INITIAL_TIME_SLOTS);
    }
  },

  async saveTimeSlots(slots: TimeSlot[]): Promise<TimeSlot[]> {
    try {
      await PostgresService.saveTimeSlots(slots);
    } catch (e) {
      console.warn('Postgres saveTimeSlots fallback to JSON:', e);
    }
    await writeJsonFile('time-slots.json', slots);
    return slots;
  },
};
