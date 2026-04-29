import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aarambh 2026',
  description: 'University Event Management System',
}

import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-dark text-white selection:bg-primary selection:text-white">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
