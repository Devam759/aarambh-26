import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/scanner',
          '/scanner/',
          '/volunteer',
          '/volunteer/',
          '/feedback',
          '/feedback/',
          '/login',
          '/login/',
          '/check-in',
          '/check-in/',
          '/eventsfeedback',
          '/eventsfeedback/',
          '/api/',
        ],
      },
      {
        // Explicitly allow Googlebot to index all public pages
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/scanner',
          '/volunteer',
          '/feedback',
          '/login',
          '/check-in',
          '/eventsfeedback',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://aarambh.jklu.edu.in/sitemap.xml',
    host: 'https://aarambh.jklu.edu.in',
  };
}
