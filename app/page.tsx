'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AboutSection from '@/components/about';
import Preloader from '@/components/Preloader';
import HeroSection from '@/components/home/HeroSection';
import GalleryShowcase from '@/components/home/GalleryShowcase';
import SneakPeak from '@/components/home/SneakPeak';
import AerialView from '@/components/home/AerialView';
import PackingChecklist from '@/components/home/PackingChecklist';
import { playSynthSound } from '@/lib/sounds';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
  isSquare: boolean;
}

let hasPlayedIntro = false;

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Show loading screen animation on browser reload, skip on client-side navigation
  useEffect(() => {
    setIsMounted(true);
    if (!hasPlayedIntro) {
      setIntroStarted(true);
      setLoadingComplete(false);
      hasPlayedIntro = true;
    } else {
      setIntroStarted(true);
      setLoadingComplete(true);
    }
  }, []);

  // Handle hash scrolling — fires from mount, polls until element is found.
  useEffect(() => {
    if (!isMounted) return;

    let attempts = 0;
    const tryScroll = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const el = document.getElementById(hash.replace('#', ''));
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'auto' });
        if (attempts < 8) { attempts++; setTimeout(tryScroll, 80); }
      } else {
        if (attempts < 30) { attempts++; setTimeout(tryScroll, 100); }
      }
    };

    setTimeout(tryScroll, 0);
    window.addEventListener('hashchange', tryScroll);
    return () => window.removeEventListener('hashchange', tryScroll);
  }, [isMounted]);

  // Function to create comic dot explosion particles
  const spawnParticles = (x: number, y: number) => {
    const colors = ['#FF9A00', '#FF188C', '#0D21DD', '#030404', '#F5F1E5'];
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Math.random() + Date.now() + i,
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 12 + 6,
      angle: Math.random() * Math.PI * 2,
      distance: Math.random() * 70 + 30,
      isSquare: Math.random() > 0.5
    }));
    setParticles((prev) => [...prev, ...newParticles].slice(-40)); // Keep max 40 in DOM
  };

  useEffect(() => {
    // Global listener for screen clicks to synthesis clicks and pop comic dots
    const handleGlobalClick = (e: MouseEvent) => {
      // Bypass on mobile/tablet screens to keep scrolling and tapping fast and lag-free
      if (window.matchMedia('(max-width: 1023px)').matches) return;

      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('.ticket-stub')
      ) return;
      spawnParticles(e.clientX, e.clientY);
      playSynthSound('click');
    };

    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  if (!isMounted) {
    return <div className="fixed inset-0 bg-brand-ink" />;
  }

  return (
    <main className="flex flex-col items-center overflow-x-hidden relative bg-brand-cloud text-brand-ink font-sans">
      {/* Noise/Grain Overlay */}
      <div className="noise-overlay" />

      {/* Mario Loading Screen Overlay */}
      <AnimatePresence>
        {introStarted && !loadingComplete && (
          <Preloader onComplete={() => setLoadingComplete(true)} />
        )}
      </AnimatePresence>

      {/* Particle Overlay for click explosions */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: p.x - p.size / 2, y: p.y - p.size / 2, scale: 1, opacity: 1, rotate: 0 }}
              animate={{
                x: p.x - p.size / 2 + Math.cos(p.angle) * p.distance,
                y: p.y - p.size / 2 + Math.sin(p.angle) * p.distance,
                scale: 0.1,
                opacity: 0,
                rotate: 180
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.isSquare ? '0%' : '50%',
                border: '2px solid #030404',
                boxShadow: '1.5px 1.5px 0px #030404',
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Hero Section */}
      <HeroSection 
        loadingComplete={loadingComplete} 
        spawnParticles={spawnParticles} 
      />

      {/* About Section wrapper */}
      <section className="w-full z-10 bg-brand-ink">
        <AboutSection />
      </section>

      {/* Memories of 2026 Gallery Showcase Section */}
      <GalleryShowcase />

      {/* Sneak Peak Section */}
      <SneakPeak />

      {/* Unified Background Wrapper */}
      <div className="w-full relative z-10 bg-brand-cloud border-t-4 border-brand-ink overflow-hidden">
        {/* Aurora Mesh — mirrors Hero.tsx background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-brand-cloud" />
           <motion.div
            className="hidden md:block absolute -top-[10%] -left-[10%] w-[70%] h-[80%] rounded-full opacity-[0.2]"
            style={{ background: '#FF188C', filter: 'blur(140px)' }}
            animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="hidden md:block absolute top-[20%] right-[10%] w-[50%] h-[70%] rounded-full opacity-[0.10]"
            style={{ background: '#0D21DD', filter: 'blur(150px)' }}
            animate={{ x: [0, -40, 0], y: [0, -20, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(to right, #030404 1px, transparent 1px), linear-gradient(to bottom, #030404 1px, transparent 1px)`,
              backgroundSize: '4rem 4rem'
            }}
          />
          <div className="absolute inset-0 bg-halftone-black opacity-10 mix-blend-overlay" />
        </div>

        {/* Content Container */}
        <div className="relative z-20">
          {/* Aerial View Section */}
          <AerialView />

          {/* Packing Checklist Section */}
          <PackingChecklist />


          {/* ============================================================
              REGISTRATION SECTION — Homepage
              ============================================================ */}

          <section className="w-full px-4 sm:px-6 py-20 lg:py-28 relative z-10">
            <div className="max-w-5xl mx-auto">

              {/* ── Hero Banner — Bright & Vibrant ── */}
              <div style={{
                background: '#F5F1E5',
                border: '4px solid #030404',
                borderRadius: '24px',
                boxShadow: '10px 10px 0px 0px #FF188C',
                padding: 'clamp(36px, 6vw, 60px) clamp(24px, 5vw, 48px) clamp(32px, 5vw, 52px)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '28px',
                textAlign: 'center',
              }}>
                {/* Colourful top bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: 'linear-gradient(90deg, #FF188C 0%, #FF9A00 50%, #0D21DD 100%)' }} />

                {/* Subtle halftone dots bg */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, #030404 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.04, pointerEvents: 'none' }} />

                {/* Badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#030404', color: '#F5F1E5', fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: '8px', border: '2px solid #030404', marginBottom: '24px', boxShadow: '3px 3px 0 #FF188C', position: 'relative' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF188C', display: 'inline-block' }} />
                  Your Registration Gateway
                </div>

                {/* Eyebrow */}
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.75rem, 2vw, 1rem)', fontWeight: 800, color: '#FF9A00', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '6px', position: 'relative' }}>
                  AARAMBH 2026
                </div>

                {/* Main heading */}
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 10vw, 6.5rem)', fontWeight: 900, color: '#030404', lineHeight: 0.88, letterSpacing: '-0.04em', textTransform: 'uppercase', margin: '0 0 24px', position: 'relative' }}>
                  REGIS<span style={{ color: '#FF188C', WebkitTextStroke: '0px', textShadow: '4px 4px 0 #FF9A00' }}>TRA</span>TION
                </h2>

                {/* Fee badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', background: '#FF188C', border: '3px solid #030404', borderRadius: '100px', padding: '12px 28px', boxShadow: '5px 5px 0 #030404', marginBottom: '20px', position: 'relative' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 900, color: '#F5F1E5' }}>₹2,500</span>
                  <span style={{ width: 2, height: 28, background: 'rgba(245,241,229,0.4)', display: 'inline-block', borderRadius: '2px' }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 800, color: '#F5F1E5', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.4, textAlign: 'left', opacity: 0.9 }}>Non-refundable<br />Registration Fee</span>
                </div>

                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.82rem, 1.8vw, 0.98rem)', fontWeight: 600, color: '#030404', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto', opacity: 0.65, position: 'relative' }}>
                  Covering stay, meals, merch &amp; full event access — everything you need to begin.
                </p>
              </div>

              {/* ── What's Included — 2×2 Grid ── */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 900, letterSpacing: '0.25em', color: '#FF188C', textTransform: 'uppercase' }}>✦ What&apos;s Included ✦</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>

                  <div style={{ background: '#F5F1E5', border: '3.5px solid #030404', borderRadius: '18px', boxShadow: '5px 5px 0 #030404', padding: '20px 18px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: 46, height: 46, borderRadius: '12px', background: '#0D21DD', border: '3px solid #030404', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '3px 3px 0 #030404', flexShrink: 0 }}>🏠</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.85rem', color: '#030404', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '4px' }}>Accommodation</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.72rem', color: '#030404', opacity: 0.6, lineHeight: 1.5 }}>Non-AC shared hostel throughout orientation.</div>
                    </div>
                  </div>

                  <div style={{ background: '#FF9A00', border: '3.5px solid #030404', borderRadius: '18px', boxShadow: '5px 5px 0 #030404', padding: '20px 18px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: 46, height: 46, borderRadius: '12px', background: '#F5F1E5', border: '3px solid #030404', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '3px 3px 0 #030404', flexShrink: 0 }}>🍱</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.85rem', color: '#030404', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '4px' }}>All Meals</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.72rem', color: '#030404', opacity: 0.7, lineHeight: 1.5 }}>Mess food from day 1 till AARAMBH concludes.</div>
                    </div>
                  </div>

                  <div style={{ background: '#FF188C', border: '3.5px solid #030404', borderRadius: '18px', boxShadow: '5px 5px 0 #030404', padding: '20px 18px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: 46, height: 46, borderRadius: '12px', background: '#F5F1E5', border: '3px solid #030404', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '3px 3px 0 #030404', flexShrink: 0 }}>🎽</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.85rem', color: '#F5F1E5', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '4px' }}>Aarambh Kit</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.72rem', color: '#F5F1E5', opacity: 0.8, lineHeight: 1.5 }}>Official T-shirt, ID card &amp; exclusive merch.</div>
                    </div>
                  </div>

                  <div style={{ background: '#030404', border: '3.5px solid #030404', borderRadius: '18px', boxShadow: '5px 5px 0 #FF188C', padding: '20px 18px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: 46, height: 46, borderRadius: '12px', background: '#FF9A00', border: '3px solid #F5F1E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '3px 3px 0 #F5F1E5', flexShrink: 0 }}>🎪</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.85rem', color: '#F5F1E5', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '4px' }}>Full Access</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.72rem', color: 'rgba(245,241,229,0.6)', lineHeight: 1.5 }}>All workshops, events &amp; outdoor activities.</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Important Instructions ── */}
              <div style={{ background: '#F5F1E5', border: '3.5px solid #030404', borderRadius: '20px', boxShadow: '7px 7px 0 #030404', padding: '28px 24px', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 900, letterSpacing: '0.2em', color: '#030404', textTransform: 'uppercase' }}>⚠ Important Instructions</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'white', border: '2.5px solid #030404', borderRadius: '12px', padding: '12px 14px', boxShadow: '3px 3px 0 #030404' }}>
                    <div style={{ minWidth: 28, height: 28, borderRadius: '8px', background: '#FF188C', border: '2px solid #030404', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '12px', color: '#F5F1E5', flexShrink: 0 }}>01</div>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', color: '#030404', lineHeight: 1.6, margin: 0 }}>
                      Enter the <strong style={{ color: '#FF188C', fontWeight: 900 }}>student&apos;s full name accurately</strong> — even if payment is made by a parent or guardian.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'white', border: '2.5px solid #030404', borderRadius: '12px', padding: '12px 14px', boxShadow: '3px 3px 0 #030404' }}>
                    <div style={{ minWidth: 28, height: 28, borderRadius: '8px', background: '#0D21DD', border: '2px solid #030404', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '12px', color: '#F5F1E5', flexShrink: 0 }}>02</div>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', color: '#030404', lineHeight: 1.6, margin: 0 }}>
                      <strong style={{ color: '#0D21DD', fontWeight: 900 }}>Strictly for admitted students</strong> of JKLU Batch 2026. Do not share outside the eligible group.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'white', border: '2.5px solid #030404', borderRadius: '12px', padding: '12px 14px', boxShadow: '3px 3px 0 #030404' }}>
                    <div style={{ minWidth: 28, height: 28, borderRadius: '8px', background: '#FF9A00', border: '2px solid #030404', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '12px', color: '#030404', flexShrink: 0 }}>03</div>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', color: '#030404', lineHeight: 1.6, margin: 0 }}>
                      Mention your <strong style={{ color: '#030404', fontWeight: 900, textDecoration: 'underline', textDecorationColor: '#FF9A00', textDecorationThickness: '2px' }}>JKLU Application Number</strong> for proper identification &amp; confirmation.
                    </p>
                  </div>

                </div>
              </div>

              {/* ── CTA Button ── */}
              <div style={{ textAlign: 'center' }}>
                <Link href="/register" style={{ display: 'inline-block', width: '100%', maxWidth: '480px' }}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: 'linear-gradient(135deg, #FF188C 0%, #FF4DB2 100%)',
                      border: '4px solid #030404',
                      borderRadius: '16px',
                      boxShadow: '8px 8px 0 #030404',
                      padding: '20px 40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1rem, 3vw, 1.3rem)', color: '#F5F1E5', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Register Online Now</span>
                    <span style={{ fontSize: '1.3rem', color: '#F5F1E5' }}>→</span>
                  </motion.div>
                </Link>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, color: '#030404', opacity: 0.4, marginTop: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Secure your spot · Limited seats available
                </p>
              </div>

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
