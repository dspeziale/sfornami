import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WhatsAppFloatingButton } from '@/components/common/WhatsAppFloatingButton';
import { CookieBanner } from '@/components/common/CookieBanner';
import { INITIAL_STORE_SETTINGS } from '@/lib/initialData';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SFORNAMÌ | Laboratorio Artigianale di Panetteria e Pasticceria a Roma',
  description:
    'Il buono fatto a mano, con un pizzico di felicità. Pane a lievito madre naturale, pizza bianca alla pala, maritozzi con panna montata fresca e torte su ordinazione a Roma.',
  keywords: [
    'panetteria artigianale Roma',
    'pasticceria artigianale Roma',
    'torte personalizzate Roma',
    'pane lievito madre Roma',
    'maritozzo con panna Roma',
    'pizza bianca romana alla pala',
    'crostata visciole Roma',
    'dolci fatti in casa Roma',
  ],
  authors: [{ name: 'SFORNAMÌ Roma' }],
  metadataBase: new URL('https://sfornami.it'),
  openGraph: {
    title: 'SFORNAMÌ | Il buono fatto a mano, con un pizzico di felicità.',
    description:
      'Laboratorio artigianale di panetteria e pasticceria nel cuore di Roma. Ordini online con ritiro rapido o consegna a domicilio.',
    url: 'https://sfornami.it',
    siteName: 'SFORNAMÌ',
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'SFORNAMÌ - Panetteria e Pasticceria Artigianale Roma',
      },
    ],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org LocalBusiness / Bakery JSON-LD
  const bakerySchema = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: INITIAL_STORE_SETTINGS.storeName,
    description: 'Laboratorio artigianale di panetteria e pasticceria a Roma.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    telephone: INITIAL_STORE_SETTINGS.phone,
    email: INITIAL_STORE_SETTINGS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: INITIAL_STORE_SETTINGS.address,
      addressLocality: INITIAL_STORE_SETTINGS.city,
      postalCode: INITIAL_STORE_SETTINGS.cap,
      addressCountry: 'IT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '41.8967',
      longitude: '12.4678',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '07:30',
        closes: '19:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '08:00',
        closes: '13:30',
      },
    ],
    priceRange: '€',
    servesCuisine: 'Italian Bakery & Pastry',
  };

  return (
    <html lang="it" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bakerySchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-[#FFF8EF] text-[#57382E]">
        <CartProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <CartDrawer />
          <WhatsAppFloatingButton />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
