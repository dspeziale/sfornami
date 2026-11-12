import { Pool } from 'pg';
import { Product, StoreSettings, Order, CustomCakeRequest, TimeSlot, HomePageContent } from './types';
import { INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS, INITIAL_TIME_SLOTS, INITIAL_HOMEPAGE_CONTENT } from './initialData';

const DEFAULT_POSTGRES_URL = 'postgres://postgres:BxLsgENC7nadiJzQR0CbMgjDUmXbHCv5SPmHa1DocKowR89gb2Yz0qOOtNPeRQGR@82klm8m6jknbyuzjm8wgoc2p:5432/postgres';

let pool: Pool | null = null;
let tablesInitialized = false;

export function getDbPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || DEFAULT_POSTGRES_URL;
    pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 5000,
      max: 10,
    });
  }
  return pool;
}

export async function initPostgresTables(): Promise<void> {
  if (tablesInitialized) return;
  const p = getDbPool();

  try {
    // 1. Products table
    await p.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        slug TEXT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        sub_category TEXT,
        description TEXT,
        ingredients TEXT,
        allergens JSONB,
        price NUMERIC,
        unit TEXT,
        weight TEXT,
        image_url TEXT,
        images JSONB,
        is_available BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        is_weekly_special BOOLEAN DEFAULT false,
        is_seasonal BOOLEAN DEFAULT false,
        daily_quota INT DEFAULT 30,
        badge TEXT,
        variants JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Orders table
    await p.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        order_number TEXT UNIQUE,
        customer_name TEXT,
        customer_email TEXT,
        customer_phone TEXT,
        delivery_type TEXT,
        delivery_address TEXT,
        delivery_city TEXT,
        delivery_cap TEXT,
        requested_date TEXT,
        requested_time_slot TEXT,
        notes TEXT,
        items JSONB,
        subtotal NUMERIC,
        delivery_fee NUMERIC,
        discount NUMERIC,
        total NUMERIC,
        payment_method TEXT,
        payment_status TEXT,
        status TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Custom Cakes table
    await p.query(`
      CREATE TABLE IF NOT EXISTS custom_cake_requests (
        id TEXT PRIMARY KEY,
        customer_name TEXT,
        customer_phone TEXT,
        customer_email TEXT,
        cake_type TEXT,
        servings INT,
        flavor_base TEXT,
        filling TEXT,
        decoration TEXT,
        custom_text TEXT,
        requested_date TEXT,
        requested_time TEXT,
        reference_photo_url TEXT,
        notes TEXT,
        status TEXT,
        quote_amount NUMERIC,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 4. Settings table (Key-Value/JSONB row)
    await p.query(`
      CREATE TABLE IF NOT EXISTS store_settings (
        id TEXT PRIMARY KEY,
        data JSONB,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 5. Time Slots table
    await p.query(`
      CREATE TABLE IF NOT EXISTS time_slots (
        id TEXT PRIMARY KEY,
        data JSONB,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 6. Homepage Content table
    await p.query(`
      CREATE TABLE IF NOT EXISTS homepage_content (
        id TEXT PRIMARY KEY,
        data JSONB,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 7. Customers / Users table
    await p.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT,
        address TEXT,
        city TEXT DEFAULT 'Roma',
        cap TEXT DEFAULT '00156',
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        last_login_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 8. Admin Credentials table
    await p.query(`
      CREATE TABLE IF NOT EXISTS admin_credentials (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Seed default admin credentials if table empty
    const adminCountRes = await p.query('SELECT COUNT(*) FROM admin_credentials');
    if (parseInt(adminCountRes.rows[0].count, 10) === 0) {
      await p.query(
        `INSERT INTO admin_credentials (id, email, password_hash, updated_at)
         VALUES ('default', 'admin@sfornami.it', 'sfornami2026', NOW())
         ON CONFLICT (id) DO NOTHING`
      );
    }

    // SEED: Products if empty
    const prodCountRes = await p.query('SELECT COUNT(*) FROM products');
    if (parseInt(prodCountRes.rows[0].count, 10) === 0) {
      console.log('🌱 Inizializzazione prodotti in PostgreSQL...');
      for (const prod of INITIAL_PRODUCTS) {
        await p.query(
          `INSERT INTO products (
            id, slug, name, category, sub_category, description, ingredients, allergens,
            price, unit, weight, image_url, images, is_available, is_featured, is_weekly_special,
            is_seasonal, daily_quota, badge, variants
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
          ON CONFLICT (id) DO NOTHING`,
          [
            prod.id,
            prod.slug,
            prod.name,
            prod.category,
            prod.subCategory || null,
            prod.description,
            prod.ingredients,
            JSON.stringify(prod.allergens || []),
            prod.price,
            prod.unit,
            prod.weight || null,
            prod.imageUrl,
            JSON.stringify(prod.images || [prod.imageUrl]),
            prod.isAvailable,
            prod.isFeatured || false,
            prod.isWeeklySpecial || false,
            prod.isSeasonal || false,
            prod.dailyQuota || 30,
            prod.badge || null,
            JSON.stringify(prod.variants || []),
          ]
        );
      }
    }

    // SEED: Settings if empty
    const settingsRes = await p.query('SELECT COUNT(*) FROM store_settings WHERE id = $1', ['default']);
    if (parseInt(settingsRes.rows[0].count, 10) === 0) {
      await p.query('INSERT INTO store_settings (id, data) VALUES ($1, $2)', ['default', JSON.stringify(INITIAL_STORE_SETTINGS)]);
    }

    // SEED: Homepage content if empty
    const hpRes = await p.query('SELECT COUNT(*) FROM homepage_content WHERE id = $1', ['default']);
    if (parseInt(hpRes.rows[0].count, 10) === 0) {
      await p.query('INSERT INTO homepage_content (id, data) VALUES ($1, $2)', ['default', JSON.stringify(INITIAL_HOMEPAGE_CONTENT)]);
    }

    // SEED: Time slots if empty
    const tsRes = await p.query('SELECT COUNT(*) FROM time_slots WHERE id = $1', ['default']);
    if (parseInt(tsRes.rows[0].count, 10) === 0) {
      await p.query('INSERT INTO time_slots (id, data) VALUES ($1, $2)', ['default', JSON.stringify(INITIAL_TIME_SLOTS)]);
    }

    tablesInitialized = true;
    console.log('✅ PostgreSQL SFORNAMÌ: Tabelle e indici pronti!');
  } catch (err) {
    console.warn('⚠️ Impossibile inizializzare PostgreSQL (fallback attivo):', err);
  }
}

// Convert DB row to Product
function rowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    subCategory: row.sub_category || undefined,
    description: row.description || '',
    ingredients: row.ingredients || '',
    allergens: typeof row.allergens === 'string' ? JSON.parse(row.allergens) : row.allergens || [],
    price: parseFloat(row.price),
    unit: row.unit || 'Al pezzo',
    weight: row.weight || undefined,
    imageUrl: row.image_url,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images || (row.image_url ? [row.image_url] : []),
    isAvailable: Boolean(row.is_available),
    isFeatured: Boolean(row.is_featured),
    isWeeklySpecial: Boolean(row.is_weekly_special),
    isSeasonal: Boolean(row.is_seasonal),
    dailyQuota: row.daily_quota ? parseInt(row.daily_quota, 10) : 30,
    badge: row.badge || undefined,
    variants: typeof row.variants === 'string' ? JSON.parse(row.variants) : row.variants || undefined,
  };
}

export const PostgresService = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    await initPostgresTables();
    const p = getDbPool();
    const res = await p.query('SELECT * FROM products ORDER BY created_at DESC');
    return res.rows.map(rowToProduct);
  },

  async saveProduct(prod: Product): Promise<Product> {
    await initPostgresTables();
    const p = getDbPool();
    await p.query(
      `INSERT INTO products (
        id, slug, name, category, sub_category, description, ingredients, allergens,
        price, unit, weight, image_url, images, is_available, is_featured, is_weekly_special,
        is_seasonal, daily_quota, badge, variants, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20, NOW())
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        sub_category = EXCLUDED.sub_category,
        description = EXCLUDED.description,
        ingredients = EXCLUDED.ingredients,
        allergens = EXCLUDED.allergens,
        price = EXCLUDED.price,
        unit = EXCLUDED.unit,
        weight = EXCLUDED.weight,
        image_url = EXCLUDED.image_url,
        images = EXCLUDED.images,
        is_available = EXCLUDED.is_available,
        is_featured = EXCLUDED.is_featured,
        is_weekly_special = EXCLUDED.is_weekly_special,
        is_seasonal = EXCLUDED.is_seasonal,
        daily_quota = EXCLUDED.daily_quota,
        badge = EXCLUDED.badge,
        variants = EXCLUDED.variants,
        updated_at = NOW()`,
      [
        prod.id,
        prod.slug,
        prod.name,
        prod.category,
        prod.subCategory || null,
        prod.description,
        prod.ingredients,
        JSON.stringify(prod.allergens || []),
        prod.price,
        prod.unit,
        prod.weight || null,
        prod.imageUrl,
        JSON.stringify(prod.images || [prod.imageUrl]),
        prod.isAvailable,
        prod.isFeatured || false,
        prod.isWeeklySpecial || false,
        prod.isSeasonal || false,
        prod.dailyQuota || 30,
        prod.badge || null,
        JSON.stringify(prod.variants || []),
      ]
    );
    return prod;
  },

  async saveAllProducts(products: Product[]): Promise<Product[]> {
    await initPostgresTables();
    const p = getDbPool();
    // Replace whole table atomically
    await p.query('BEGIN');
    try {
      await p.query('DELETE FROM products');
      for (const prod of products) {
        await p.query(
          `INSERT INTO products (
            id, slug, name, category, sub_category, description, ingredients, allergens,
            price, unit, weight, image_url, images, is_available, is_featured, is_weekly_special,
            is_seasonal, daily_quota, badge, variants
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
          [
            prod.id,
            prod.slug,
            prod.name,
            prod.category,
            prod.subCategory || null,
            prod.description,
            prod.ingredients,
            JSON.stringify(prod.allergens || []),
            prod.price,
            prod.unit,
            prod.weight || null,
            prod.imageUrl,
            JSON.stringify(prod.images || [prod.imageUrl]),
            prod.isAvailable,
            prod.isFeatured || false,
            prod.isWeeklySpecial || false,
            prod.isSeasonal || false,
            prod.dailyQuota || 30,
            prod.badge || null,
            JSON.stringify(prod.variants || []),
          ]
        );
      }
      await p.query('COMMIT');
    } catch (e) {
      await p.query('ROLLBACK');
      throw e;
    }
    return products;
  },

  async deleteProduct(id: string): Promise<void> {
    await initPostgresTables();
    const p = getDbPool();
    await p.query('DELETE FROM products WHERE id = $1', [id]);
  },

  // HOMEPAGE CONTENT
  async getHomepageContent(): Promise<HomePageContent> {
    await initPostgresTables();
    const p = getDbPool();
    const res = await p.query('SELECT data FROM homepage_content WHERE id = $1', ['default']);
    if (res.rows.length > 0 && res.rows[0].data) {
      return typeof res.rows[0].data === 'string' ? JSON.parse(res.rows[0].data) : res.rows[0].data;
    }
    return INITIAL_HOMEPAGE_CONTENT;
  },

  async saveHomepageContent(content: HomePageContent): Promise<HomePageContent> {
    await initPostgresTables();
    const p = getDbPool();
    await p.query(
      `INSERT INTO homepage_content (id, data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      ['default', JSON.stringify(content)]
    );
    return content;
  },

  // STORE SETTINGS
  async getSettings(): Promise<StoreSettings> {
    await initPostgresTables();
    const p = getDbPool();
    const res = await p.query('SELECT data FROM store_settings WHERE id = $1', ['default']);
    if (res.rows.length > 0 && res.rows[0].data) {
      return typeof res.rows[0].data === 'string' ? JSON.parse(res.rows[0].data) : res.rows[0].data;
    }
    return INITIAL_STORE_SETTINGS;
  },

  async saveSettings(settings: StoreSettings): Promise<StoreSettings> {
    await initPostgresTables();
    const p = getDbPool();
    await p.query(
      `INSERT INTO store_settings (id, data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      ['default', JSON.stringify(settings)]
    );
    return settings;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    await initPostgresTables();
    const p = getDbPool();
    const res = await p.query('SELECT * FROM orders ORDER BY created_at DESC');
    return res.rows.map(row => ({
      id: row.id,
      orderNumber: row.order_number,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      deliveryType: row.delivery_type,
      deliveryAddress: row.delivery_address || undefined,
      deliveryCity: row.delivery_city || undefined,
      deliveryCap: row.delivery_cap || undefined,
      requestedDate: row.requested_date,
      requestedTimeSlot: row.requested_time_slot,
      notes: row.notes || undefined,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items || [],
      subtotal: parseFloat(row.subtotal),
      deliveryFee: parseFloat(row.delivery_fee || 0),
      discount: parseFloat(row.discount || 0),
      total: parseFloat(row.total),
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      status: row.status,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    }));
  },

  async saveOrder(order: Order): Promise<Order> {
    await initPostgresTables();
    const p = getDbPool();
    await p.query(
      `INSERT INTO orders (
        id, order_number, customer_name, customer_email, customer_phone, delivery_type,
        delivery_address, delivery_city, delivery_cap, requested_date, requested_time_slot,
        notes, items, subtotal, delivery_fee, discount, total, payment_method, payment_status,
        status, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20, $21)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        payment_status = EXCLUDED.payment_status`,
      [
        order.id,
        order.orderNumber,
        order.customerName,
        order.customerEmail,
        order.customerPhone,
        order.deliveryType,
        order.deliveryAddress || null,
        order.deliveryCity || null,
        order.deliveryCap || null,
        order.requestedDate,
        order.requestedTimeSlot,
        order.notes || null,
        JSON.stringify(order.items),
        order.subtotal,
        order.deliveryFee,
        order.discount,
        order.total,
        order.paymentMethod,
        order.paymentStatus,
        order.status,
        order.createdAt || new Date().toISOString(),
      ]
    );
    return order;
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    await initPostgresTables();
    const p = getDbPool();
    await p.query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId]);
  },

  // TIME SLOTS
  async getTimeSlots(): Promise<TimeSlot[]> {
    await initPostgresTables();
    const p = getDbPool();
    const res = await p.query('SELECT data FROM time_slots WHERE id = $1', ['default']);
    if (res.rows.length > 0 && res.rows[0].data) {
      return typeof res.rows[0].data === 'string' ? JSON.parse(res.rows[0].data) : res.rows[0].data;
    }
    return INITIAL_TIME_SLOTS;
  },

  async saveTimeSlots(slots: TimeSlot[]): Promise<TimeSlot[]> {
    await initPostgresTables();
    const p = getDbPool();
    await p.query(
      `INSERT INTO time_slots (id, data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      ['default', JSON.stringify(slots)]
    );
    return slots;
  },

  // CUSTOM CAKES
  async getCakeRequests(): Promise<CustomCakeRequest[]> {
    await initPostgresTables();
    const p = getDbPool();
    const res = await p.query('SELECT * FROM custom_cake_requests ORDER BY created_at DESC');
    return res.rows.map(row => ({
      id: row.id,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerEmail: row.customer_email,
      cakeType: row.cake_type,
      servings: parseInt(row.servings, 10),
      flavorBase: row.flavor_base,
      filling: row.filling,
      decoration: row.decoration,
      customText: row.custom_text || undefined,
      requestedDate: row.requested_date,
      requestedTime: row.requested_time,
      referenceImageUrl: row.reference_photo_url || undefined,
      notes: row.notes || undefined,
      status: row.status,
      quoteAmount: row.quote_amount ? parseFloat(row.quote_amount) : undefined,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    }));
  },

  async saveCakeRequest(request: CustomCakeRequest): Promise<CustomCakeRequest> {
    await initPostgresTables();
    const p = getDbPool();
    await p.query(
      `INSERT INTO custom_cake_requests (
        id, customer_name, customer_phone, customer_email, cake_type, servings,
        flavor_base, filling, decoration, custom_text, requested_date, requested_time,
        reference_photo_url, notes, status, quote_amount, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        quote_amount = EXCLUDED.quote_amount`,
      [
        request.id,
        request.customerName,
        request.customerPhone,
        request.customerEmail,
        request.cakeType,
        request.servings,
        request.flavorBase,
        request.filling,
        request.decoration,
        request.customText || null,
        request.requestedDate,
        request.requestedTime,
        request.referenceImageUrl || null,
        request.notes || null,
        request.status,
        request.quoteAmount || null,
        request.createdAt || new Date().toISOString(),
      ]
    );
    return request;
  },

  async updateCakeStatus(id: string, status: CustomCakeRequest['status'], quoteAmount?: number): Promise<void> {
    await initPostgresTables();
    const p = getDbPool();
    await p.query(
      'UPDATE custom_cake_requests SET status = $1, quote_amount = COALESCE($2, quote_amount) WHERE id = $3',
      [status, quoteAmount || null, id]
    );
  },

  // CUSTOMERS / USERS
  async getCustomers(): Promise<any[]> {
    await initPostgresTables();
    const p = getDbPool();
    const res = await p.query('SELECT id, name, email, phone, address, city, cap, notes, created_at, last_login_at FROM customers ORDER BY created_at DESC');
    return res.rows.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone || '',
      address: r.address || '',
      city: r.city || 'Roma',
      cap: r.cap || '00156',
      notes: r.notes || '',
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      lastLoginAt: r.last_login_at ? new Date(r.last_login_at).toISOString() : undefined,
    }));
  },

  async findCustomerByEmail(email: string): Promise<any | null> {
    await initPostgresTables();
    const p = getDbPool();
    const cleanEmail = email.trim().toLowerCase();
    const res = await p.query('SELECT * FROM customers WHERE LOWER(email) = $1 LIMIT 1', [cleanEmail]);
    if (res.rows.length === 0) return null;
    const r = res.rows[0];
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone || '',
      passwordHash: r.password_hash || '',
      address: r.address || '',
      city: r.city || 'Roma',
      cap: r.cap || '00156',
      notes: r.notes || '',
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      lastLoginAt: r.last_login_at ? new Date(r.last_login_at).toISOString() : undefined,
    };
  },

  async registerCustomer(data: { name: string; email: string; phone?: string; passwordHash?: string; address?: string; city?: string; cap?: string; notes?: string }): Promise<any> {
    await initPostgresTables();
    const p = getDbPool();
    const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const cleanEmail = data.email.trim().toLowerCase();

    const res = await p.query(
      `INSERT INTO customers (id, name, email, phone, password_hash, address, city, cap, notes, created_at, last_login_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         phone = COALESCE(EXCLUDED.phone, customers.phone),
         address = COALESCE(EXCLUDED.address, customers.address),
         city = COALESCE(EXCLUDED.city, customers.city),
         cap = COALESCE(EXCLUDED.cap, customers.cap),
         notes = COALESCE(EXCLUDED.notes, customers.notes),
         last_login_at = NOW()
       RETURNING id, name, email, phone, address, city, cap, notes, created_at, last_login_at`,
      [
        id,
        data.name.trim(),
        cleanEmail,
        data.phone?.trim() || null,
        data.passwordHash || null,
        data.address?.trim() || null,
        data.city?.trim() || 'Roma',
        data.cap?.trim() || '00156',
        data.notes?.trim() || null,
      ]
    );
    const r = res.rows[0];
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone || '',
      address: r.address || '',
      city: r.city || 'Roma',
      cap: r.cap || '00156',
      notes: r.notes || '',
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      lastLoginAt: r.last_login_at ? new Date(r.last_login_at).toISOString() : undefined,
    };
  },

  async updateCustomerLastLogin(email: string): Promise<void> {
    await initPostgresTables();
    const p = getDbPool();
    await p.query('UPDATE customers SET last_login_at = NOW() WHERE LOWER(email) = $1', [email.trim().toLowerCase()]);
  },

  // ADMIN CREDENTIALS
  async getAdminCredentials(): Promise<{ email: string; passwordHash: string }> {
    await initPostgresTables();
    const p = getDbPool();
    const res = await p.query('SELECT email, password_hash FROM admin_credentials WHERE id = $1 LIMIT 1', ['default']);
    if (res.rows.length === 0) {
      return { email: 'admin@sfornami.it', passwordHash: 'sfornami2026' };
    }
    return {
      email: res.rows[0].email,
      passwordHash: res.rows[0].password_hash,
    };
  },

  async updateAdminCredentials(email: string, passwordHash: string): Promise<void> {
    await initPostgresTables();
    const p = getDbPool();
    await p.query(
      `INSERT INTO admin_credentials (id, email, password_hash, updated_at)
       VALUES ('default', $1, $2, NOW())
       ON CONFLICT (id) DO UPDATE SET
         email = EXCLUDED.email,
         password_hash = EXCLUDED.password_hash,
         updated_at = NOW()`,
      [email.trim().toLowerCase(), passwordHash.trim()]
    );
  },
};

