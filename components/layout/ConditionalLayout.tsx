'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from '../ui/CustomCursor';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminOrScanner = 
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/scanner') || 
    pathname?.startsWith('/login') || 
    pathname?.startsWith('/feedback');

  if (isAdminOrScanner) {
    return <>{children}</>;
  }

  const isCreditsPage = pathname === '/credits';

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className={`min-h-screen ${isCreditsPage ? 'bg-[#00a6e6]' : 'bg-brand-cloud'}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
