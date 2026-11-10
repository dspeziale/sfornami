-- ====================================================================
-- SFORNAMÌ - SCHEMA DATABASE POSTGRESQL / SUPABASE
-- Laboratorio artigianale di panetteria e pasticceria a Roma
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELLA CATEGORIE
CREATE TABLE IF NOT EXISTS public.categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  subtitle VARCHAR(150),
  description TEXT,
  image_url TEXT,
  badge VARCHAR(50),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELLA PRODOTTI
CREATE TABLE IF NOT EXISTS public.products (
  id VARCHAR(50) PRIMARY KEY,
  slug VARCHAR(120) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  sub_category VARCHAR(100),
  description TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  allergens JSONB DEFAULT '[]'::jsonb,
  price NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  weight VARCHAR(50),
  variants JSONB DEFAULT '[]'::jsonb,
  image_url TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_weekly_special BOOLEAN DEFAULT FALSE,
  is_seasonal BOOLEAN DEFAULT FALSE,
  daily_quota INT DEFAULT 50,
  badge VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELLA ORDINI
CREATE TABLE IF NOT EXISTS public.orders (
  id VARCHAR(60) PRIMARY KEY,
  order_number VARCHAR(30) UNIQUE NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  delivery_type VARCHAR(20) NOT NULL CHECK (delivery_type IN ('pickup', 'delivery')),
  delivery_address TEXT,
  delivery_city VARCHAR(100),
  delivery_cap VARCHAR(10),
  requested_date DATE NOT NULL,
  requested_time_slot VARCHAR(50) NOT NULL,
  notes TEXT,
  subtotal NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
  discount NUMERIC(10, 2) DEFAULT 0.00,
  total NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('pickup', 'cash_on_delivery', 'card_on_delivery', 'stripe')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  status VARCHAR(30) DEFAULT 'nuovo' CHECK (status IN ('nuovo', 'da_confermare', 'confermato', 'in_preparazione', 'pronto', 'consegnato', 'annullato')),
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELLA RIGHE ORDINE (ORDER ITEMS)
CREATE TABLE IF NOT EXISTS public.order_items (
  id VARCHAR(60) PRIMARY KEY,
  order_id VARCHAR(60) NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES public.products(id) ON DELETE SET NULL,
  product_name VARCHAR(150) NOT NULL,
  variant_name VARCHAR(100),
  price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  total NUMERIC(10, 2) NOT NULL
);

-- 6. TABELLA RICHIESTE TORTE PERSONALIZZATE
CREATE TABLE IF NOT EXISTS public.custom_cake_requests (
  id VARCHAR(60) PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(150),
  cake_type VARCHAR(100) NOT NULL,
  servings INT NOT NULL,
  flavor_base VARCHAR(150) NOT NULL,
  filling VARCHAR(150) NOT NULL,
  decoration VARCHAR(150) NOT NULL,
  custom_text TEXT,
  requested_date DATE NOT NULL,
  requested_time VARCHAR(20) NOT NULL,
  reference_image_url TEXT,
  notes TEXT,
  status VARCHAR(30) DEFAULT 'in_valutazione' CHECK (status IN ('in_valutazione', 'preventivo_inviato', 'confermata', 'rifiutata')),
  quote_amount NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABELLA IMPOSTAZIONI LABORATORIO
CREATE TABLE IF NOT EXISTS public.store_settings (
  id INT PRIMARY KEY DEFAULT 1,
  store_name VARCHAR(100) NOT NULL DEFAULT 'SFORNAMÌ',
  payoff VARCHAR(150) DEFAULT 'Il buono fatto a mano, con un pizzico di felicità.',
  address VARCHAR(200) NOT NULL DEFAULT 'Via dei Banchi Vecchi, 48',
  city VARCHAR(100) NOT NULL DEFAULT 'Roma',
  cap VARCHAR(10) NOT NULL DEFAULT '00186',
  phone VARCHAR(50) DEFAULT '+39 06 6880 1234',
  whatsapp_number VARCHAR(50) NOT NULL DEFAULT '393401234567',
  email VARCHAR(150) NOT NULL DEFAULT 'ordini@sfornami.it',
  instagram_handle VARCHAR(80) DEFAULT '@sfornami_roma',
  facebook_url VARCHAR(200) DEFAULT 'https://facebook.com/sfornamiroma',
  delivery_enabled BOOLEAN DEFAULT TRUE,
  min_order_delivery NUMERIC(10, 2) DEFAULT 15.00,
  delivery_fee NUMERIC(10, 2) DEFAULT 3.50,
  free_delivery_threshold NUMERIC(10, 2) DEFAULT 40.00,
  served_caps JSONB DEFAULT '["00186","00187","00153","00192","00193","00195","00196","00197","00198","00161","00162","00152"]'::jsonb,
  stripe_enabled BOOLEAN DEFAULT FALSE,
  pickup_opening_hours TEXT DEFAULT 'Mar - Sab: 07:30 - 19:30 | Dom: 08:00 - 13:30 | Lunedì: Chiuso',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_cake_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Politiche di lettura pubblica per il catalogo
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON public.store_settings FOR SELECT USING (true);

-- Politiche per gli ordini: chiunque può inserire un ordine dal sito
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert cake_requests" ON public.custom_cake_requests FOR INSERT WITH CHECK (true);

-- Gli utenti autenticati (admin) hanno controllo completo su tutte le tabelle
CREATE POLICY "Admin full access categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access order_items" ON public.order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access cake_requests" ON public.custom_cake_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access settings" ON public.store_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
