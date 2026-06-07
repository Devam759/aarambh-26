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
            className="absolute -top-[10%] -left-[10%] w-[70%] h-[80%] rounded-full opacity-[0.2]"
            style={{ background: '#FF188C', filter: 'blur(140px)' }}
            animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[20%] right-[10%] w-[50%] h-[70%] rounded-full opacity-[0.10]"
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

          <section className="py-24 lg:py-32 px-4 sm:px-6 w-full max-w-5xl relative z-10 mx-auto">
            <div className="relative border-comic bg-brand-cloud text-brand-ink shadow-comic p-8 sm:p-16 lg:p-20 rounded-xl overflow-hidden flex flex-col items-center text-center gap-12">

              {/* Upper Section: Clean Typography & Messaging (Centered) */}
              <div className="flex flex-col items-center text-center relative z-10 w-full max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-ink text-brand-cloud font-display text-[10px] md:text-xs font-black tracking-widest rounded-lg mb-6 shadow-comic-sm border-comic-thin">
                  <span className="w-2 h-2 rounded-full bg-brand-pink animate-ping" />
                  Your Registration Gateway
                </div>

                <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase leading-[0.9] mb-6 text-center">
                  AARAMBH 2026 <br />
                  <span className="bg-brand-ink text-brand-cloud px-4 py-1.5 inline-block my-2 transform -rotate-1 shadow-[4px_4px_0px_0px_#0D21DD] border-comic rounded-lg">
                    REGISTRATION
                  </span>
                </h2>

                <p className="text-brand-ink text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans font-medium opacity-90 text-center">
                  Kickstart your JKLU journey with a registration fee of ₹2500 (Non-refundable) covering all essentials for a vibrant and welcoming orientation experience.
                </p>
              </div>

              {/* Dynamic Structured Content Container (All Sections Center Aligned) */}
              <div className="w-full max-w-3xl flex flex-col gap-8 relative z-10 text-center items-center">

                {/* BOX 1: WHAT THE FEE INCLUDES */}
                <div className="w-full bg-white border-comic p-6 sm:p-10 rounded-xl shadow-comic flex flex-col items-center">
                  <h3 className="font-display font-black text-lg sm:text-xl tracking-tight mb-6 text-brand-ink pb-2 border-b-2 border-brand-pink inline-block uppercase">
                    What the fee includes
                  </h3>

                  <div className="flex flex-col gap-4 w-full max-w-xl text-center">
                    <div className="bg-brand-cloud/40 p-4 border-2 border-brand-ink/15 rounded-lg flex flex-col items-center">
                      <span className="font-display font-black text-xs sm:text-sm text-brand-pink tracking-wide mb-1 uppercase">Non-AC Shared Accommodation</span>
                      <p className="font-sans font-medium text-xs text-brand-ink/70">Comfortable stay in campus hostels throughout the orientation program.</p>
                    </div>

                    <div className="bg-brand-cloud/40 p-4 border-2 border-brand-ink/15 rounded-lg flex flex-col items-center">
                      <span className="font-display font-black text-xs sm:text-sm text-brand-pink tracking-wide mb-1 uppercase">All Meals</span>
                      <p className="font-sans font-medium text-xs text-brand-ink/70">Mess food provided from the day of registration until the conclusion of AARAMBH.</p>
                    </div>

                    <div className="bg-brand-cloud/40 p-4 border-2 border-brand-ink/15 rounded-lg flex flex-col items-center">
                      <span className="font-display font-black text-xs sm:text-sm text-brand-pink tracking-wide mb-1 uppercase">AARAMBH Kit</span>
                      <p className="font-sans font-medium text-xs text-brand-ink/70">Includes official merchandise (T-shirts, ID card, and more).</p>
                    </div>

                    <div className="bg-brand-cloud/40 p-4 border-2 border-brand-ink/15 rounded-lg flex flex-col items-center">
                      <span className="font-display font-black text-xs sm:text-sm text-brand-pink tracking-wide mb-1 uppercase">Full Access</span>
                      <p className="font-sans font-medium text-xs text-brand-ink/70">Entry to all workshops, creative sessions, team-building events, and outdoor group activities.</p>
                    </div>
                  </div>
                </div>

                {/* BOX 2: IMPORTANT INSTRUCTIONS */}
                <div className="w-full bg-white border-comic p-6 sm:p-10 rounded-xl shadow-comic flex flex-col items-center">
                  <h3 className="font-display font-black text-lg sm:text-xl tracking-tight mb-6 text-brand-ink pb-2 border-b-2 border-brand-ink inline-block uppercase">
                    Important Instructions
                  </h3>

                  <div className="flex flex-col gap-4 w-full max-w-xl text-center">
                    <div className="border-2 border-brand-ink/15 p-4 rounded-lg bg-brand-cloud/30 font-sans font-medium text-xs sm:text-sm text-brand-ink leading-relaxed">
                      Please enter the <span className="text-brand-pink font-bold">student&apos;s full name accurately</span> during registration, even if the payment is made by a parent or guardian.
                    </div>

                    <div className="border-2 border-brand-ink/15 p-4 rounded-lg bg-brand-cloud/30 font-sans font-medium text-xs sm:text-sm text-brand-ink leading-relaxed">
                      This registration is <span className="text-brand-pink font-bold">strictly for admitted students</span> of JKLU Batch 2026. Kindly avoid sharing the link outside the eligible group.
                    </div>

                    <div className="border-2 border-brand-ink/15 p-4 rounded-lg bg-brand-cloud/30 font-sans font-medium text-xs sm:text-sm text-brand-ink leading-relaxed">
                      Mention your <span className="text-brand-pink font-bold">JKLU Application Number</span> to ensure proper identification and confirmation.
                    </div>
                  </div>
                </div>

              </div>

              {/* Lower Section: Interactive Call-To-Action Card (Centered Below) */}
              <div className="flex flex-col items-center justify-center relative z-10 w-full pt-4">
                <div className="w-full max-w-md border-comic bg-brand-cloud p-6 sm:p-8 rounded-xl shadow-comic transform transition-transform duration-300 hover:scale-[1.01]">
                  <h3 className="font-display font-black text-xl sm:text-2xl tracking-tight mb-2 text-brand-ink text-center uppercase">
                    Register
                  </h3>
                  <p className="font-sans font-medium text-xs text-brand-ink/70 mb-6 leading-normal text-center mx-auto max-w-xs">
                    Secure your place at the most fearless orientation event.
                  </p>

                  <Link href="/register" className="w-full block">
                    <motion.button
                      whileHover={{ scale: 1.03, rotate: -1 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full comic-interactive border-comic py-5 px-6 shadow-comic hover:shadow-solid-ink transition-all font-display font-black text-xl tracking-wide text-brand-cloud bg-brand-pink rounded-lg cursor-pointer flex items-center justify-center gap-2 group"
                    >
                      <span>Register Online Now</span>
                      <span className="transform group-hover:translate-x-2 transition-transform duration-200">→</span>
                    </motion.button>
                  </Link>
                </div>
              </div>

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
