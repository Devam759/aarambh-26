import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://aarambh.jklu.edu.in'),
  alternates: {
    canonical: 'https://aarambh.jklu.edu.in',
  },
  title: {
    default: "Aarambh 2026 | JKLU New Student Orientation & Welcome Program - JK Lakshmipat University",
    template: "%s | Aarambh 2026"
  },
  description: "Official portal for Aarambh 2026, the signature eight-day New Student Orientation and Welcome Program at JK Lakshmipat University (JKLU), Jaipur. Get complete event schedules, rules, guidelines, student club details, and registration forms.",
  manifest: '/manifest.json',
  keywords: [
    "Aarambh", "Aarambh 2026", "Aarambh JKLU", "aarambh jklu", "jklu aarambh", "JKLU Orientation", "JKLU Orientation 2026",
    "JK Lakshmipat University", "JK Lakshmipat University Orientation", "Aarambh JKLU Orientation",
    "JKLU Welcome Week", "JKLU Welcome Week 2026", "Aarambh orientation week", "JKLU student orientation",
    "college orientation Jaipur", "Aarambh festival registration", "Aarambh Jaipur", "JKLU student affairs"
  ],
  authors: [{ name: "JKLU Tech Team" }],
  creator: "JKLU Tech Team",
  openGraph: {
    title: "Aarambh 2026 | JKLU New Student Orientation & Welcome Program - JK Lakshmipat University",
    description: "Official portal for Aarambh 2026, the signature eight-day New Student Orientation and Welcome Program at JK Lakshmipat University (JKLU), Jaipur. Register, view schedules, rules, guidelines, and highlights.",
    url: 'https://aarambh.jklu.edu.in',
    siteName: "Aarambh '26 Portal",
    images: [
      {
        url: '/aarambh-2025-poster.jpg',
        width: 1200,
        height: 630,
        alt: "Aarambh 2026 Banner"
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Aarambh 2026 | JKLU New Student Orientation & Welcome Program - JK Lakshmipat University",
    description: "Official portal for Aarambh 2026, the signature eight-day New Student Orientation and Welcome Program at JK Lakshmipat University (JKLU), Jaipur.",
    images: ['/aarambh-2025-poster.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#FF9A00',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

import { Tiro_Devanagari_Hindi } from 'next/font/google'

const tiroDevanagari = Tiro_Devanagari_Hindi({
  weight: '400',
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
})

import ConditionalLayout from '../components/layout/ConditionalLayout'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={tiroDevanagari.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Outfit:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": "Aarambh '26",
              "startDate": "2026-07-14T09:00:00+05:30",
              "endDate": "2026-07-21T18:00:00+05:30",
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "location": {
                "@type": "Place",
                "name": "JK Lakshmipat University Campus",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Near Mahindra SEZ, Ajmer Road",
                  "addressLocality": "Jaipur",
                  "addressRegion": "Rajasthan",
                  "postalCode": "302026",
                  "addressCountry": "IN"
                }
              },
              "image": [
                "https://aarambh.jklu.edu.in/aarambh-2025-poster.jpg"
              ],
              "description": "Aarambh '26 is the signature first-year orientation program and pop-art welcome festival of JK Lakshmipat University (JKLU), Jaipur. Experience engaging workshops, cultural nights, sports tournaments, and student club showcases.",
              "organizer": {
                "@type": "EducationalOrganization",
                "name": "JK Lakshmipat University",
                "url": "https://jklu.edu.in"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://aarambh.jklu.edu.in/register",
                "price": "2500",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-06-01T00:00:00+05:30"
              }
            })
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const ignoreErrors = [
                  'metamask',
                  'failed to connect to metamask',
                  'metamask extension not found',
                  'nkbihfbeogaeaoehlefnkodbefgpgknn',
                  'inpage.js'
                ];
                
                function shouldIgnore(errorMsg, errorStack, filename) {
                  const checkString = (str) => {
                    if (!str) return false;
                    return ignoreErrors.some(term => str.toLowerCase().includes(term));
                  };
                  return checkString(errorMsg) || checkString(errorStack) || checkString(filename);
                }

                window.addEventListener('error', function(event) {
                  try {
                    const msg = event.message || '';
                    const filename = event.filename || '';
                    const stack = (event.error && event.error.stack) || '';
                    if (shouldIgnore(msg, stack, filename)) {
                      event.stopImmediatePropagation();
                      event.preventDefault();
                      console.warn('Antigravity: Suppressed browser extension error:', msg);
                    }
                  } catch (e) {}
                }, true);

                window.addEventListener('unhandledrejection', function(event) {
                  try {
                    const reason = event.reason || '';
                    const msg = typeof reason === 'string' ? reason : (reason.message || '');
                    const stack = reason.stack || '';
                    if (shouldIgnore(msg, stack)) {
                      event.stopImmediatePropagation();
                      event.preventDefault();
                      console.warn('Antigravity: Suppressed browser extension promise rejection:', msg);
                    }
                  } catch (e) {}
                }, true);
              })();
            `
          }}
        />
      </head>
      <body className="antialiased bg-brand-cloud text-brand-cloud font-sans selection:bg-brand-pink selection:text-brand-cloud">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
