import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { SettingsProvider } from '@/context/SettingsContext';
import { CartProvider } from '@/context/CartContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WhatsAppFloatingButton } from '@/components/common/WhatsAppFloatingButton';
import { MobileCartBar } from '@/components/cart/MobileCartBar';
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
  title: 'SFORNAMÌ | Insieme per Seul 2027',
  description:
    'Insieme per Seul 2027 • Il buono fatto a mano con un pizzico di felicità. Ciambelloni, torte artigianali, crostate e dolci appena sfornati a Roma.',
  keywords: [
    'Insieme per Seul 2027',
    'pasticceria artigianale Roma',
    'torte personalizzate Roma',
    'torte compleanno Roma',
    'ciambellone artigianale Roma',
    'crostata artigianale Roma',
    'dolci fatti in casa Roma',
    'biscotti artigianali Roma',
    'pasticceria consegna a domicilio Roma',
  ],
  authors: [{ name: 'SFORNAMÌ Roma' }],
  metadataBase: new URL('https://sfornami.dsc-italy.app'),
  openGraph: {
    title: 'SFORNAMÌ | Insieme per Seul 2027',
    description:
      'Insieme per Seul 2027 • Dolci artigianali, ciambelloni, torte fresche e biscotti preparati a mano a Roma (Torraccia). Ordina online con consegna a domicilio!',
    url: 'https://sfornami.dsc-italy.app',
    siteName: 'SFORNAMÌ Roma',
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        url: 'https://sfornami.dsc-italy.app/og-image.jpg?v=seul2027',
        secureUrl: 'https://sfornami.dsc-italy.app/og-image.jpg?v=seul2027',
        width: 1200,
        height: 630,
        alt: 'SFORNAMÌ - Insieme per Seul 2027',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SFORNAMÌ | Insieme per Seul 2027',
    description:
      'Insieme per Seul 2027 • Dolci artigianali, ciambelloni, torte fresche e biscotti preparati a mano a Roma (Torraccia). Ordina online con consegna a domicilio!',
    images: ['https://sfornami.dsc-italy.app/og-image.jpg?v=seul2027'],
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
    description: 'Laboratorio artigianale di pasticceria e torte a Roma.',
    image: 'https://sfornami.dsc-italy.app/og-image.jpg',
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
      latitude: '41.9425',
      longitude: '12.5855',
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
        {/* WhatsApp & Social Media Open Graph explicit tags */}
        <meta property="og:title" content="SFORNAMÌ | Insieme per Seul 2027" />
        <meta property="og:description" content="Insieme per Seul 2027 • Dolci artigianali, ciambelloni, torte fresche e biscotti preparati a mano a Roma. Ordina online con consegna a domicilio!" />
        <meta property="og:image" content="https://sfornami.dsc-italy.app/og-image.jpg?v=seul2027" />
        <meta property="og:image:secure_url" content="https://sfornami.dsc-italy.app/og-image.jpg?v=seul2027" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="SFORNAMÌ - Insieme per Seul 2027" />
        <link rel="image_src" href="https://sfornami.dsc-italy.app/og-image.jpg?v=seul2027" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bakerySchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-[#FFF8EF] text-[#57382E]">
        <CustomerAuthProvider>
          <SettingsProvider>
            <CartProvider>
              <Navbar />
              <div className="flex-1">{children}</div>
              <Footer />
              <CartDrawer />
              <MobileCartBar />
              <WhatsAppFloatingButton />
              <CookieBanner />
            </CartProvider>
          </SettingsProvider>
        </CustomerAuthProvider>
      </body>
    </html>
  );
}
