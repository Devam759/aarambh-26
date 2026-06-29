'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from '../ui/CustomCursor';
import Preloader from '../Preloader';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showPreloader, setShowPreloader] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLighthouse = navigator.userAgent.includes('Lighthouse') ||
        navigator.userAgent.includes('Chrome-Lighthouse') ||
        navigator.userAgent.includes('SpeedCurve') ||
        navigator.userAgent.includes('GTmetrix') ||
        navigator.userAgent.includes('Googlebot');

      const hasPlayed = (window as any).hasPlayedIntro;

      if (pathname === '/' && !hasPlayed && !isLighthouse) {
        setShowPreloader(false); // Changed from true to false to disable preloader
      } else {
        setShowPreloader(false);
      }
    }
  }, [pathname]);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      (window as any).hasPlayedIntro = true;
    }
    document.documentElement.classList.remove('preloader-active');
    setShowPreloader(false);
  };

  const isAdminOrScanner =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/scanner') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/feedback') ||
    pathname?.startsWith('/complaint') ||
    pathname?.startsWith('/warden');

  if (isAdminOrScanner) {
    return <>{children}</>;
  }

  const isCreditsPage = pathname === '/credits';
  const isGalleryPage = pathname?.startsWith('/gallery');

  return (
    <>
      <CustomCursor />

      {/* Commented out Preloader to bypass the loading screen
      <AnimatePresence>
        {showPreloader && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999]"
          >
            <Preloader onComplete={handleComplete} />
          </motion.div>
        )}
      </AnimatePresence>
      */}

      <div className={pathname?.startsWith('/volunteer') ? 'hidden md:block' : ''}>
        <Navbar />
      </div>
      <main className={`min-h-screen ${isCreditsPage ? 'bg-[#F5F1E5]' : 'bg-brand-cloud'}`}>
        {children}
      </main>
      {!isGalleryPage && <Footer />}
    </>
  );
}
