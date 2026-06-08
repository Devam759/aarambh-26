'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import AboutSection from '@/components/about';
import Preloader from '@/components/Preloader';
import HeroSection from '@/components/home/HeroSection';

const GalleryShowcase = dynamic(() => import('@/components/home/GalleryShowcase'), { ssr: true });
const SneakPeak = dynamic(() => import('@/components/home/SneakPeak'), { ssr: true });
const AerialView = dynamic(() => import('@/components/home/AerialView'), { ssr: true });
const PackingChecklist = dynamic(() => import('@/components/home/PackingChecklist'), { ssr: true });
const RegistrationSection = dynamic(() => import('@/components/home/RegistrationSection'), { ssr: true });

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


          {/* Registration Section */}
          <RegistrationSection />
        </div>
      </div>
    </main>
  );
}
