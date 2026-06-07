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

          <section className="py-24 lg:py-32 px-4 sm:px-6 w-full max-w-3xl relative z-10 mx-auto">
        <div className="relative border-comic bg-[#F5F1E5] text-brand-ink shadow-comic p-8 sm:p-12 md:p-16 rounded-2xl overflow-hidden flex flex-col items-center text-center gap-12">
          
          {/* Upper Section: Clean Typography & Messaging (Centered) */}
          <div className="flex flex-col items-center text-center relative z-10 w-full max-w-3xl">
            <h2 
              className="text-4xl sm:text-6xl md:text-7xl uppercase leading-[0.9] mb-6 text-center"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#030404'
              }}
            >
              AARAMBH 2026 <br />
              <span 
                className="inline-block my-2"
                style={{
                  color: '#FF188C',
                  fontWeight: 900,
                  letterSpacing: '-0.02em'
                }}
              >
                REGISTRATION
              </span>
            </h2>
            
            <p className="text-brand-ink text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium opacity-90 text-center">
              Kickstart your JKLU journey with a one-time registration fee of ₹2500 (Non-refundable) covering all essentials for a welcoming orientation experience.
            </p>
          </div>

          {/* BOX 1: AC ACCOMMODATION & FEE POLICY NOTICE BANNER */}
          <div className="w-full max-w-3xl bg-brand-pink/[0.02] border-2 border-brand-pink p-6 rounded-2xl flex flex-col gap-4 text-left shadow-sm">
            <div className="flex items-start gap-3">
              <p className="font-sans font-bold text-xs sm:text-sm text-brand-pink leading-relaxed">
                AC rooms are optional and subject to availability. These will be allotted on a first-come-first-served basis and charged separately at the time of check-in.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <p className="font-sans font-medium text-xs sm:text-sm text-[#0D21DD] leading-relaxed">
                Note: A 2% convenience fee will be added during online payment due to Cashfree charges. This is a payment gateway charge collected by Cashfree; the university will receive only ₹2500.
              </p>
            </div>
          </div>

          {/* BOX 2: WHAT THE FEE INCLUDES */}
          <div className="w-full max-w-3xl bg-[#F5F1E5] border-comic rounded-2xl shadow-comic overflow-hidden flex flex-col">
            <div className="bg-[#0D21DD] border-b-2 border-brand-ink py-4 text-center text-white">
              <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-wide">
                What the fee includes
              </h3>
            </div>
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-brand-ink p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(3,4,4,1)] flex flex-col items-center text-center gap-2">
                <span className="font-sans font-bold text-xs sm:text-sm text-brand-pink tracking-wide uppercase">Non-AC Accommodation</span>
                <p className="font-sans font-medium text-[11px] sm:text-xs text-brand-ink/75">Comfortable stay in campus hostels throughout the orientation program.</p>
              </div>
              <div className="bg-white border-2 border-brand-ink p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(3,4,4,1)] flex flex-col items-center text-center gap-2">
                <span className="font-sans font-bold text-xs sm:text-sm text-[#0D21DD] tracking-wide uppercase">All Meals</span>
                <p className="font-sans font-medium text-[11px] sm:text-xs text-brand-ink/75">Mess food provided from the day of registration until the conclusion of AARAMBH.</p>
              </div>
              <div className="bg-white border-2 border-brand-ink p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(3,4,4,1)] flex flex-col items-center text-center gap-2">
                <span className="font-sans font-bold text-xs sm:text-sm text-emerald-500 tracking-wide uppercase">AARAMBH Kit</span>
                <p className="font-sans font-medium text-[11px] sm:text-xs text-brand-ink/75">Includes official merchandise (T-shirts, ID card, and more).</p>
              </div>
              <div className="bg-white border-2 border-brand-ink p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(3,4,4,1)] flex flex-col items-center text-center gap-2">
                <span className="font-sans font-bold text-xs sm:text-sm text-brand-orange tracking-wide uppercase">Full Access</span>
                <p className="font-sans font-medium text-[11px] sm:text-xs text-brand-ink/75">Entry to all workshops, creative sessions, team-building events, and activities.</p>
              </div>
            </div>
          </div>

          {/* BOX 3: IMPORTANT INSTRUCTIONS */}
          <div className="w-full max-w-3xl bg-[#F5F1E5] border-comic rounded-2xl shadow-comic overflow-hidden flex flex-col">
            <div className="bg-[#FF9A00] border-b-2 border-brand-ink py-4 text-center text-brand-ink">
              <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-wide">
                Important Instructions
              </h3>
            </div>
            <div className="p-6 sm:p-8 flex flex-col gap-4">
              <div className="bg-white border-2 border-brand-ink border-l-8 border-l-brand-pink p-4 rounded-xl flex items-start gap-3 text-left">
                <p className="font-sans font-medium text-xs sm:text-sm text-brand-ink leading-relaxed">
                  Please enter the <span className="text-brand-pink font-bold">student&apos;s full name accurately</span> during registration, even if the payment is made by a parent or guardian.
                </p>
              </div>
              <div className="bg-white border-2 border-brand-ink border-l-8 border-l-brand-orange p-4 rounded-xl flex items-start gap-3 text-left">
                <p className="font-sans font-medium text-xs sm:text-sm text-brand-ink leading-relaxed">
                  This registration is <span className="text-brand-pink font-bold">strictly for admitted students</span> of JKLU Batch 2026. Kindly avoid sharing the link outside.
                </p>
              </div>
              <div className="bg-white border-2 border-brand-ink border-l-8 border-l-[#0D21DD] p-4 rounded-xl flex items-start gap-3 text-left">
                <p className="font-sans font-medium text-xs sm:text-sm text-brand-ink leading-relaxed">
                  During payment, mention your <span className="text-brand-pink font-bold">JKLU Application Number</span> in the &quot;Notes&quot; section to ensure proper confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Lower Section: Interactive Call-To-Action Card (Centered Below) */}
          <div className="flex flex-col items-center justify-center relative z-10 w-full pt-4">
            <h3 className="font-display font-black text-2xl tracking-wide mb-2 text-brand-ink text-center uppercase">
              Register
            </h3>
            <p className="font-sans font-medium text-xs sm:text-sm text-brand-ink/70 mb-6 leading-normal text-center mx-auto max-w-md">
              Secure your place at the most welcoming, boundary-pushing orientation event of the semester.
            </p>
            
            <Link href="/register" className="w-full max-w-md block">
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
      </section>
        </div>
      </div>
    </main>
  );
}
