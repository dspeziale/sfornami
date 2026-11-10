import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sfornami.dsc-italy.app';
  const lastModified = new Date();

  const routes = [
    '',
    '/panetteria',
    '/pasticceria',
    '/menu',
    '/torte-personalizzate',
    '/chi-siamo',
    '/contatti',
    '/allergeni',
    '/privacy',
    '/termini',
    '/cookie',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' || route === '/menu' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/torte') || route.startsWith('/panetteria') ? 0.9 : 0.7,
  }));
}
