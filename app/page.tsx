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

              {/* Skeuomorphic Spiral Diary/Notebook Details Menu */}
              <div className="w-full max-w-4xl relative z-10 my-4 select-none">
                {/* Diary Outer Cover */}
                <div className="bg-[#5c2d25] border-comic rounded-2xl shadow-comic-lg p-3 sm:p-5 relative md:rotate-[0.5deg]">
                  {/* Spine edge details (skeuomorphic book spine on left edge) */}
                  <div className="absolute top-0 bottom-0 left-0 w-3 bg-[#4a231d] rounded-l-xl z-20" />
                  
                  {/* Diary Inner Body - 2 Columns (Open pages) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-comic border-brand-ink bg-[#fbf9f3] rounded-lg overflow-hidden relative min-h-[520px]">
                    
                    {/* Ruled Paper Gradients applied as background to both pages */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.8] z-0 bg-[#fbf9f3]" 
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, transparent 38px, #ff8da1 38px, #ff8da1 39px, transparent 39px),
                          repeating-linear-gradient(transparent, transparent 31px, rgba(3, 4, 4, 0.08) 31px, rgba(3, 4, 4, 0.08) 32px)
                        `
                      }}
                    />

                    {/* Left Page (What the Fee Includes) */}
                    <div className="w-full p-6 pt-10 pb-8 pl-16 pr-8 md:pl-16 md:pr-12 border-b-2 md:border-b-0 md:border-r-2 border-brand-ink relative z-10 flex flex-col justify-between min-h-[480px]">
                      <div>
                        {/* Coffee stain on left page */}
                        <svg className="absolute w-36 h-36 text-amber-900/[0.04] pointer-events-none select-none -left-2 bottom-4 rotate-12 -z-5" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="140 10 30 10" />
                          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="80 40" />
                        </svg>

                        {/* Header Title (Handwritten double-underlined style) */}
                        <div className="mb-8 relative">
                          <h3 className="font-diary font-black text-2xl md:text-3xl tracking-wide text-brand-blue uppercase rotate-[-1deg]">
                            What the fee includes:
                          </h3>
                          <div className="h-1 w-44 bg-brand-pink mt-1 opacity-70 transform -skew-x-12" />
                          <div className="h-0.5 w-32 bg-brand-pink mt-0.5 opacity-50 transform -skew-x-12" />
                        </div>

                        {/* Ruled Paper Content List */}
                        <ul className="space-y-4 pl-1 text-left">
                          <li className="flex items-start gap-3">
                            <span className="font-diary font-black text-lg text-brand-pink select-none mt-1">✓</span>
                            <div>
                              <span className="font-diary font-black text-lg md:text-xl text-brand-ink tracking-wide block leading-tight">
                                Accommodation (Hostels)
                              </span>
                              <span className="font-sans font-semibold text-xs text-brand-ink/70 block mt-0.5">
                                Comfortable non-AC shared hostel stay during orientation.
                              </span>
                            </div>
                          </li>

                          <li className="flex items-start gap-3">
                            <span className="font-diary font-black text-lg text-brand-pink select-none mt-1">✓</span>
                            <div>
                              <span className="font-diary font-black text-lg md:text-xl text-brand-ink tracking-wide block leading-tight">
                                All Meals (Mess food)
                              </span>
                              <span className="font-sans font-semibold text-xs text-brand-ink/70 block mt-0.5">
                                Provided from registration day until orientation concludes.
                              </span>
                            </div>
                          </li>

                          <li className="flex items-start gap-3">
                            <span className="font-diary font-black text-lg text-brand-pink select-none mt-1">✓</span>
                            <div>
                              <span className="font-diary font-black text-lg md:text-xl text-brand-ink tracking-wide block leading-tight">
                                AARAMBH Kit
                              </span>
                              <span className="font-sans font-semibold text-xs text-brand-ink/70 block mt-0.5">
                                Includes official T-shirts, identity cards, and batch merchandise.
                              </span>
                            </div>
                          </li>

                          <li className="flex items-start gap-3">
                            <span className="font-diary font-black text-lg text-brand-pink select-none mt-1">✓</span>
                            <div>
                              <span className="font-diary font-black text-lg md:text-xl text-brand-ink tracking-wide block leading-tight">
                                Full Event Access
                              </span>
                              <span className="font-sans font-semibold text-xs text-brand-ink/70 block mt-0.5">
                                Workshops, creative sessions, games & outdoor activities.
                              </span>
                            </div>
                          </li>
                        </ul>
                      </div>

                      {/* Sticky Note for optional AC rooms */}
                      <div className="mt-8 bg-[#fffae0] border-comic-thin p-3 rounded shadow-comic-sm transform -rotate-2 text-left z-20">
                        <p className="font-diary font-bold text-xs text-brand-ink leading-relaxed">
                          💡 AC rooms optional & charged separately at check-in (subject to availability, FCSF basis).
                        </p>
                      </div>
                    </div>

                    {/* Right Page (Important Instructions) */}
                    <div className="w-full p-6 pt-10 pb-8 pl-16 pr-8 md:pl-16 md:pr-10 relative z-10 flex flex-col justify-between min-h-[480px]">
                      <div>
                        {/* Pencil sketch star doodle */}
                        <svg className="absolute w-10 h-10 text-brand-pink/60 pointer-events-none select-none right-4 top-4 animate-pulse -z-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2l3 6 7 .5-5 4.5 1.5 7-6.5-3.5-6.5 3.5 1.5-7-5-4.5 7-.5 3-6z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        {/* Header Title (Handwritten double-underlined style) */}
                        <div className="mb-8 relative">
                          <h3 className="font-diary font-black text-2xl md:text-3xl tracking-wide text-brand-pink uppercase rotate-[1deg]">
                            Important Instructions:
                          </h3>
                          <div className="h-1 w-48 bg-brand-blue mt-1 opacity-70 transform -skew-x-12" />
                          <div className="h-0.5 w-36 bg-brand-blue mt-0.5 opacity-50 transform -skew-x-12" />
                        </div>

                        {/* Ruled Paper Content List */}
                        <ul className="space-y-4 pl-1 text-left">
                          <li className="flex items-start gap-3">
                            <span className="font-diary font-black text-lg text-brand-blue select-none mt-1">✏</span>
                            <div>
                              <span className="font-diary font-black text-lg md:text-xl text-brand-ink tracking-wide block leading-tight">
                                Accuracy is Key
                              </span>
                              <span className="font-sans font-semibold text-xs text-brand-ink/70 block mt-0.5">
                                Please enter the student&apos;s full name accurately during registration, even if paid by parent/guardian.
                              </span>
                            </div>
                          </li>

                          <li className="flex items-start gap-3">
                            <span className="font-diary font-black text-lg text-brand-blue select-none mt-1">✏</span>
                            <div>
                              <span className="font-diary font-black text-lg md:text-xl text-brand-ink tracking-wide block leading-tight">
                                Strictly Batch &apos;26 Only
                              </span>
                              <span className="font-sans font-semibold text-xs text-brand-ink/70 block mt-0.5">
                                Strictly for admitted batch 2026 students. Kindly avoid sharing the link outside.
                              </span>
                            </div>
                          </li>

                          <li className="flex items-start gap-3">
                            <span className="font-diary font-black text-lg text-brand-blue select-none mt-1">✏</span>
                            <div>
                              <span className="font-diary font-black text-lg md:text-xl text-brand-ink tracking-wide block leading-tight">
                                Application Number
                              </span>
                              <span className="font-sans font-semibold text-xs text-brand-ink/70 block mt-0.5">
                                During payment, mention your JKLU Application Number in the &quot;Notes&quot; section for confirmation.
                              </span>
                            </div>
                          </li>
                        </ul>
                      </div>

                      {/* Sticky Note for payment gateway convenience fee */}
                      <div className="mt-8 bg-[#e0f5ff] border-comic-thin p-3 rounded shadow-comic-sm transform rotate-1 text-left z-20">
                        <p className="font-diary font-bold text-xs text-brand-ink leading-relaxed">
                          ⚠️ Note: A 2% convenience fee is added during online payment due to Cashfree gateway charges.
                        </p>
                      </div>
                    </div>

                    {/* Desktop Spiral Binder Column (Center of diary) */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-between py-6 z-30 pointer-events-none hidden md:flex">
                      {Array.from({ length: 11 }).map((_, i) => (
                        <div key={i} className="w-12 h-6 relative flex items-center justify-center">
                          {/* Left Punch Hole */}
                          <div className="absolute left-1 w-2.5 h-2.5 rounded-full bg-brand-ink/90 shadow-inner" />
                          {/* Right Punch Hole */}
                          <div className="absolute right-1 w-2.5 h-2.5 rounded-full bg-brand-ink/90 shadow-inner" />
                          {/* Spiral Ring (bridges the pages) */}
                          <div className="w-12 h-4 rounded-full bg-gradient-to-b from-gray-300 via-white to-gray-400 border-2 border-brand-ink shadow-md transform rotate-[5deg] hover:rotate-[15deg] transition-transform duration-200" />
                        </div>
                      ))}
                    </div>

                    {/* Mobile Spiral Binder Column (Left Edge of diary) */}
                    <div className="absolute top-0 bottom-0 left-4 flex flex-col justify-between py-6 z-30 pointer-events-none flex md:hidden">
                      {Array.from({ length: 11 }).map((_, i) => (
                        <div key={i} className="w-8 h-5 relative flex items-center justify-center">
                          {/* Punch Hole */}
                          <div className="absolute right-1.5 w-2 h-2 rounded-full bg-brand-ink/90 shadow-inner" />
                          {/* Spiral Ring */}
                          <div className="w-8 h-3 rounded-full bg-gradient-to-b from-gray-300 via-white to-gray-400 border-2 border-brand-ink shadow-md transform rotate-[5deg]" />
                        </div>
                      ))}
                    </div>

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
