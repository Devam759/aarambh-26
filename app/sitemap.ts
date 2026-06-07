import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aarambh.jklu.edu.in';
  const now = new Date();

  return [
    // ── Tier 1: Homepage (highest priority) ──────────────────────────────────
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // ── Tier 2: Primary public pages ─────────────────────────────────────────
    {
      url: `${baseUrl}/schedule`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rules`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // ── Tier 3: Supporting pages (low priority — should not outrank homepage) ─
    {
      url: `${baseUrl}/speakers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/credits`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
