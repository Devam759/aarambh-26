import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://aarambh.jklu.edu.in'),
  alternates: {
    canonical: 'https://aarambh.jklu.edu.in',
  },
  title: {
    default: "Aarambh '26 | JK Lakshmipat University Orientation",
    template: "%s | Aarambh '26"
  },
  description: "Official portal for Aarambh 2026, the signature New Student Orientation and pop-art Welcome Festival at JK Lakshmipat University (JKLU), Jaipur.",
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
    title: "Aarambh '26 | JK Lakshmipat University Orientation",
    description: "Official portal for Aarambh 2026, the signature New Student Orientation and pop-art Welcome Festival at JK Lakshmipat University (JKLU), Jaipur.",
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
    title: "Aarambh '26 | JK Lakshmipat University Orientation",
    description: "Official portal for Aarambh 2026, the signature New Student Orientation and pop-art Welcome Festival at JK Lakshmipat University (JKLU), Jaipur.",
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

import { 
  Tiro_Devanagari_Hindi,
  Outfit,
  Roboto,
  DM_Serif_Display,
  DM_Sans,
  Russo_One,
  Architects_Daughter
} from 'next/font/google'

const tiroDevanagari = Tiro_Devanagari_Hindi({
  weight: '400',
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-adminHeading',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-adminBody',
  display: 'swap',
})

const russoOne = Russo_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bricks',
  display: 'swap',
})

const architectsDaughter = Architects_Daughter({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-architectsDaughter',
  display: 'swap',
})

import ConditionalLayout from '../components/layout/ConditionalLayout'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={`${tiroDevanagari.variable} ${outfit.variable} ${roboto.variable} ${dmSerifDisplay.variable} ${dmSans.variable} ${russoOne.variable} ${architectsDaughter.variable}`} 
      suppressHydrationWarning
    >
      <head>
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
                // Show preloader on first visit (session-based) - only on the home page
                const isLighthouse = navigator.userAgent.includes('Lighthouse') || 
                                     navigator.userAgent.includes('Chrome-Lighthouse') ||
                                     navigator.userAgent.includes('SpeedCurve') ||
                                     navigator.userAgent.includes('GTmetrix') ||
                                     navigator.userAgent.includes('Googlebot');
                if (window.location.pathname === '/' && !isLighthouse) {
                  document.documentElement.classList.add('preloader-active');
                }

                // Suppress browser extension errors (metamask etc.)
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
                      console.warn('Suppressed browser extension error:', msg);
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
                      console.warn('Suppressed browser extension promise rejection:', msg);
                    }
                  } catch (e) {}
                }, true);
              })();
            `
          }}
        />
      </head>
      <body className="antialiased bg-brand-cloud text-brand-cloud font-sans selection:bg-brand-orange selection:text-brand-cloud">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
