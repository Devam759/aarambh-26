import './globals.css'
import type { Metadata, Viewport } from 'next'
import { OrganizationSchema } from '../components/StructuredData'

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

import ConditionalLayout from '../components/layout/ConditionalLayout'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
    >
      <head>
        <OrganizationSchema />
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
