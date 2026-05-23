'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock, Unlock, Sparkles, Volume2, VolumeX, HelpCircle, Calendar, Ticket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import AboutSection from '@/components/about';

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

function TornPaperDivider({ color = "fill-brand-ink", flip = false }: { color?: string; flip?: boolean }) {
  return (
    <div className={`w-full overflow-hidden leading-[0] select-none pointer-events-none ${flip ? 'rotate-180' : ''}`}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`relative block w-full h-[40px] ${color}`}>
        <path d="M0,0 L30,40 L60,10 L95,50 L130,20 L165,60 L200,30 L240,70 L280,30 L320,80 L360,40 L400,90 L440,50 L480,95 L520,60 L560,100 L600,45 L640,110 L680,50 L720,95 L760,40 L800,90 L840,30 L880,80 L920,40 L960,105 L1000,55 L1040,90 L1080,35 L1120,70 L1160,20 L1200,80 L1200,120 L0,120 Z" />
      </svg>
    </div>
  );
}

const marqueeVariants: Variants = {
  animate: {
    x: [0, -1035],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 20,
        ease: "linear",
      },
    },
  },
};

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [hasRegistered, setHasRegistered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [activeSpectrum, setActiveSpectrum] = useState<number | null>(null);
  const bgVideoRef = React.useRef<HTMLVideoElement>(null);

  const handleVolumeToggle = () => {
    if (bgVideoRef.current) {
      const newMuted = !bgVideoRef.current.muted;
      bgVideoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('bg-video-mute-change', { detail: { isMuted: newMuted } });
        window.dispatchEvent(event);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const regStatus = localStorage.getItem('aarambh_registered');
      if (regStatus === 'true') setHasRegistered(true);
    }

    const targetDate = new Date('2026-07-14T09:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference < 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        mins: Math.floor((difference / 1000 / 60) % 60),
        secs: Math.floor((difference / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for audio toggle commands from the Navbar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleToggleCommand = () => {
        handleVolumeToggle();
      };
      window.addEventListener('toggle-bg-video-mute', handleToggleCommand);

      // Initial synchronization on mount
      setTimeout(() => {
        const syncEvent = new CustomEvent('bg-video-mute-change', { detail: { isMuted: bgVideoRef.current?.muted ?? true } });
        window.dispatchEvent(syncEvent);
      }, 500);

      return () => {
        window.removeEventListener('toggle-bg-video-mute', handleToggleCommand);
      };
    }
  }, []);

  const stickers = [
    { text: "⚡ BOLD & BEYOND", color: "bg-brand-pink text-brand-cloud", rotation: "-4deg", top: "15%", left: "8%" },
    { text: "📅 JULY 14-16, 2026", color: "bg-brand-orange text-brand-ink font-extrabold", rotation: "3deg", top: "18%", right: "8%" },
    { text: "🚀 LIMITLESS", color: "bg-brand-blue text-brand-cloud", rotation: "-2deg", bottom: "16%", left: "10%" },
    { text: "🔥 FEARLESS BEGINNINGS", color: "bg-brand-cloud text-brand-ink border-2 border-brand-ink", rotation: "5deg", bottom: "14%", right: "12%" },
  ];

  const spectrumPanels = [
    {
      id: 0,
      title: "ENERGY ORANGE",
      hex: "#FF9A00",
      bgGradient: "radial-gradient(circle at center, rgba(255, 154, 0, 0.15) 0%, transparent 70%)",
      borderClass: "border-brand-orange/30",
      accentColor: "text-brand-orange",
      accentBg: "bg-brand-orange",
      shadowClass: "shadow-solid-orange",
      subtitle: "ENERGY. ENTHUSIASM. ACTION.",
      description: "Represents the fire inside, the excitement of new friendships, and the energy that powers Aarambh.",
      tag: "01. EXCITE"
    },
    {
      id: 1,
      title: "BOLD PINK",
      hex: "#FF188C",
      bgGradient: "radial-gradient(circle at center, rgba(255, 24, 140, 0.15) 0%, transparent 70%)",
      borderClass: "border-brand-pink/30",
      accentColor: "text-brand-pink",
      accentBg: "bg-brand-pink",
      shadowClass: "shadow-solid-pink",
      subtitle: "BOLDNESS. CONFIDENCE. EXPRESSION.",
      description: "Reflects the courage to be yourself, speak your truth, and step outside conventions.",
      tag: "02. EXPR"
    },
    {
      id: 2,
      title: "ELECTRIC BLUE",
      hex: "#0D21DD",
      bgGradient: "radial-gradient(circle at center, rgba(13, 33, 221, 0.15) 0%, transparent 70%)",
      borderClass: "border-brand-blue/30",
      accentColor: "text-brand-blue",
      accentBg: "bg-brand-blue",
      shadowClass: "shadow-solid-blue",
      subtitle: "DEPTH. TRUST. LIMITLESS PATHS.",
      description: "Represents the infinite skies, deep intelligence, and the boundless path that lies ahead.",
      tag: "03. BEYOND"
    }
  ];

  return (
    <main className="flex flex-col items-center overflow-x-hidden relative bg-brand-ink text-brand-cloud">
      {/* Noise/Grain Overlay */}
      <div className="noise-overlay" />

      {/* Hero */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center py-28 px-4 overflow-hidden bg-brand-ink">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <video
            ref={bgVideoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onPlay={() => setIsVideoLoaded(true)}
            onLoadedData={() => setIsVideoLoaded(true)}
            className="w-full h-full object-cover scale-100 will-change-transform transition-opacity duration-1000 ease-out"
            style={{ 
              filter: 'brightness(0.65) contrast(1.15)', 
              transform: 'translate3d(0, 0, 0)',
              opacity: isVideoLoaded ? 1 : 0.1,
              imageRendering: '-webkit-optimize-contrast'
            }}
          >
            <source src="/teaser.mp4" type="video/mp4" />
          </video>
          {/* Brand Mesh Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-ink/90 via-brand-ink/40 to-brand-ink pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-orange/15 rounded-full blur-[150px] pointer-events-none" />
          {/* Subtle gradient overlay at bottom for depth */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-brand-ink to-transparent pointer-events-none" />
        </div>

        {/* Draggable Sticker Wall */}
        <div className="hidden lg:block absolute inset-0 z-10 pointer-events-none">
          {stickers.map((sticker, idx) => (
            <motion.div
              key={idx}
              drag
              dragConstraints={{ left: -400, right: 400, top: -200, bottom: 200 }}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
              whileHover={{ scale: 1.1, zIndex: 50 }}
              whileDrag={{ scale: 1.15, rotate: "0deg", cursor: "grabbing" }}
              style={{
                top: sticker.top,
                left: sticker.left,
                right: sticker.right,
                bottom: sticker.bottom,
                rotate: sticker.rotation,
              }}
              className={`absolute pointer-events-auto cursor-grab px-5 py-2.5 font-display text-xs tracking-widest font-black uppercase rounded-lg border-2 border-brand-ink shadow-solid-ink select-none ${sticker.color}`}
            >
              {sticker.text}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 text-center max-w-4xl flex flex-col items-center px-4"
        >
          <span className="page-eyebrow !flex items-center justify-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-brand-orange text-xs tracking-[0.3em] font-black">
            UNIVERSITY OF EXCELLENCE PRESENTS
            <Sparkles size={14} className="text-brand-orange shrink-0 ml-1 animate-pulse" />
          </span>

          {/* Heading Stack / High Contrast Editorial look */}
          <div className="relative mb-6 select-none">
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-black uppercase leading-none tracking-tighter text-outline-pink opacity-80 select-none">
              BOLD & BEYOND
            </h1>
            <div className="absolute inset-0 flex items-center justify-center mt-2">
              <Image
                src="/logo.svg"
                alt="AARAMBH'26"
                width={580}
                height={130}
                className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-[34rem] h-auto drop-shadow-[0_8px_24px_rgba(255,24,140,0.45)] hover:scale-[1.02] transition-transform duration-300"
                priority
                loading="eager"
              />
            </div>
          </div>

          <p className="page-subtitle mx-auto mb-10 max-w-2xl font-medium text-brand-cloud/85 text-sm sm:text-base leading-relaxed tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] mt-4">
            The ultimate convergence of technology, culture, and innovation. Embrace fearless self-expression, push boundaries, and step into limitless possibilities.
          </p>

          {/* Countdown Clock with solid shadow styling */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-10 w-full max-w-md">
            {(['Days', 'Hours', 'Mins', 'Secs'] as const).map((label) => (
              <div
                key={label}
                className="p-3 sm:p-4 flex flex-col items-center border-2 border-brand-pink bg-brand-ink/90 shadow-solid-pink rounded-lg"
              >
                <div className="relative h-8 sm:h-10 overflow-hidden flex items-center justify-center w-full">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={timeLeft[label.toLowerCase() as keyof TimeLeft]}
                      initial={{ y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -24, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-xl sm:text-3xl font-display font-black text-brand-cloud tabular-nums absolute"
                    >
                      {String(timeLeft[label.toLowerCase() as keyof TimeLeft]).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="text-[9px] sm:text-xs text-brand-pink font-bold uppercase tracking-widest mt-1">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap justify-center gap-4 z-20">
            {!hasRegistered ? (
              <Link href="/register">
                <button className="relative group overflow-hidden rounded-full border-2 border-brand-ink py-3 px-8 font-display font-extrabold text-sm uppercase tracking-wider text-brand-ink bg-brand-orange hover:bg-brand-pink transition-all duration-300 hover:scale-105 active:scale-95 shadow-solid-pink hover:shadow-solid-blue">
                  <span className="relative z-10 text-brand-ink transition-colors group-hover:text-brand-cloud flex items-center gap-2">
                    Register Now <ArrowRight size={18} />
                  </span>
                </button>
              </Link>
            ) : (
              <div className="bg-brand-blue/30 text-brand-cloud border-2 border-brand-blue px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-solid-blue">
                <ShieldCheck size={20} className="text-brand-orange animate-bounce" /> You are Registered!
              </div>
            )}

            <Button
              variant="glass"
              className="flex items-center gap-2 text-sm px-8 border-2 border-brand-pink/50 hover:border-brand-pink transition-all bg-brand-ink/65 backdrop-blur-md shadow-md rounded-full"
              onClick={handleVolumeToggle}
            >
              {isMuted ? <VolumeX size={18} className="text-brand-pink animate-pulse" /> : <Volume2 size={18} className="text-brand-orange animate-bounce" />}
              <span className="font-display font-bold uppercase tracking-widest text-xs">{isMuted ? "Unmute Video" : "Mute Sound"}</span>
            </Button>
          </div>
        </motion.div>

        {/* Credit tag styled as sticker */}
        <div className="absolute bottom-6 right-6 z-20 px-4 py-1.5 rounded-md bg-brand-cloud border-2 border-brand-ink text-[10px] text-brand-ink font-black tracking-widest uppercase shadow-solid-pink select-none pointer-events-none">
          Credit: Vaibhav Khandelwal
        </div>
      </section>

      {/* Torn paper visual separation */}
      <TornPaperDivider color="fill-brand-cloud" />

      {/* Brand strip with continuous marquee */}
      <section className="w-full py-4 border-y-2 border-brand-ink bg-brand-cloud text-brand-ink overflow-hidden z-10">
        <div className="w-full flex whitespace-nowrap overflow-hidden">
          <motion.div
            variants={marqueeVariants}
            animate="animate"
            className="flex gap-16 font-display font-black text-sm sm:text-base uppercase tracking-widest select-none"
          >
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="text-brand-pink">⚡ BOLD & BEYOND</span>
                <span className="text-brand-blue">🌟 LIMITLESS</span>
                <span className="text-brand-orange">🔥 ENERGY</span>
                <span className="text-brand-ink">🎨 EXPERIMENTAL</span>
                <span className="text-brand-pink">💥 FEARLESS BEGINNINGS</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Torn paper visual separation */}
      <TornPaperDivider color="fill-brand-cloud" flip={true} />

      {/* Theme Spectrum Accordion - Custom Brand Palette Interaction */}
      <section className="py-24 px-6 w-full max-w-7xl relative z-10 flex flex-col items-center">
        <span className="page-eyebrow text-center text-brand-orange tracking-[0.2em] font-black">THE BRAND PALETTE</span>
        <h2 className="text-center font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-brand-cloud mb-4">
          SPECTRUM OF <span className="text-outline-pink">BEYOND</span>
        </h2>
        <p className="text-center text-brand-cloud/60 max-w-xl mb-16 text-sm">
          Aarambh&apos;26 is defined by its colors. Hover or click on a panel to explore how each shade embodies the spirit of going Bold & Beyond.
        </p>

        {/* Panel Container */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[450px]">
          {spectrumPanels.map((panel) => {
            const isHovered = activeSpectrum === panel.id;
            return (
              <div
                key={panel.id}
                onMouseEnter={() => setActiveSpectrum(panel.id)}
                onMouseLeave={() => setActiveSpectrum(null)}
                className={`relative flex flex-col justify-between p-8 border-2 ${panel.borderClass} bg-brand-ink/90 rounded-2xl overflow-hidden transition-all duration-500 ease-out cursor-pointer ${panel.shadowClass} ${
                  activeSpectrum !== null && !isHovered ? 'opacity-40 scale-[0.98]' : 'scale-100'
                }`}
                style={{
                  background: isHovered ? panel.bgGradient : 'rgba(3, 4, 4, 0.85)',
                  transform: isHovered ? 'translateY(-6px)' : 'none',
                }}
              >
                {/* Background design accents (halftone details on hover) */}
                <div 
                  className={`absolute inset-0 bg-halftone opacity-10 pointer-events-none transition-opacity duration-300 ${
                    isHovered ? 'opacity-30' : 'opacity-0'
                  }`} 
                />

                {/* Top bar info */}
                <div className="flex justify-between items-center z-10">
                  <span className={`text-xs font-black uppercase px-2.5 py-1 ${panel.accentBg} text-brand-ink rounded`}>
                    {panel.tag}
                  </span>
                  <span className="text-xs font-mono text-brand-cloud/40 uppercase tracking-widest">
                    {panel.hex}
                  </span>
                </div>

                {/* Main panel text content */}
                <div className="mt-16 sm:mt-24 lg:mt-0 z-10 space-y-4">
                  <h3 className={`font-display text-2xl md:text-3xl font-black uppercase tracking-tight ${panel.accentColor}`}>
                    {panel.title}
                  </h3>
                  
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-widest text-brand-cloud">
                      {panel.subtitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-brand-cloud/60 leading-relaxed font-medium">
                      {panel.description}
                    </p>
                  </div>
                </div>

                {/* Color Block Bar at bottom */}
                <div className="mt-8 flex items-center justify-between z-10">
                  <div className="flex gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-brand-orange" />
                    <div className="w-4 h-4 rounded-full bg-brand-pink" />
                    <div className="w-4 h-4 rounded-full bg-brand-blue" />
                  </div>
                  <motion.div
                    animate={isHovered ? { x: 5 } : { x: 0 }}
                    className={`flex items-center gap-1 text-xs font-black uppercase ${panel.accentColor}`}
                  >
                    Explore <ArrowRight size={14} />
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Embed the custom styled About component */}
      <section className="w-full z-10">
        <AboutSection />
      </section>

      {/* Exclusive student gateway with poster board layout */}
      <section className="py-24 px-6 w-full max-w-7xl relative z-10 flex flex-col items-center">
        <span className="page-eyebrow text-center text-brand-pink tracking-[0.2em] font-black">EXHIBIT</span>
        <h2 className="text-center font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-brand-cloud mb-4">
          STUDENT GATEWAY
        </h2>
        <p className="text-center text-brand-cloud/60 max-w-xl mb-16 text-sm">
          Access your personal scheduler, speaker keynotes, and peer cohorts. Complete your registration to unlock the gateway.
        </p>

        {!hasRegistered ? (
          <div className="w-full max-w-4xl border-2 border-brand-pink bg-brand-ink bg-halftone-pink p-12 text-center flex flex-col items-center rounded-2xl shadow-solid-pink relative overflow-hidden">
            <div className="absolute top-4 right-4 text-xs font-mono font-black text-brand-pink/50">
              STATUS: ENCRYPTED
            </div>
            
            {/* Padlock visual element */}
            <div className="relative p-6 mb-6 bg-brand-pink/10 border-2 border-brand-pink/30 rounded-full text-brand-pink animate-pulse">
              <Lock size={44} />
            </div>

            <h3 className="text-2xl font-display font-black text-brand-cloud mb-2 uppercase tracking-wide">PORTAL LOCKED</h3>
            <p className="text-brand-cloud/55 max-w-md text-sm mb-8 leading-relaxed font-medium">
              You must register to gain entry to the Aarambh &apos;26 student community dashboard, timetables, and orientation materials.
            </p>
            
            <Link href="/register">
              <button className="px-8 py-3.5 bg-brand-pink border-2 border-brand-ink text-brand-cloud font-display font-black text-xs uppercase tracking-wider hover:bg-brand-orange hover:text-brand-ink transition-all duration-300 shadow-solid-cloud hover:shadow-solid-ink rounded-full">
                Register to Unlock Portal
              </button>
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
          >
            {/* Discord Community Card */}
            <div className="p-8 border-2 border-brand-blue bg-brand-ink/90 rounded-2xl shadow-solid-blue hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black tracking-widest uppercase bg-brand-blue text-brand-cloud px-2 py-0.5 rounded">
                    COMMUNITY
                  </span>
                  <Unlock className="text-brand-blue" size={18} />
                </div>
                <h3 className="text-2xl font-display font-black text-brand-cloud mb-3 uppercase tracking-tight">
                  Student Cohorts
                </h3>
                <p className="text-brand-cloud/60 text-xs sm:text-sm leading-relaxed font-medium mb-6">
                  Join the official Aarambh Discord server to meet other freshers, coordinate with seniors, and check live announcements.
                </p>
              </div>
              <button className="w-full py-3.5 bg-brand-blue border-2 border-brand-ink text-brand-cloud font-display font-black text-xs uppercase tracking-widest hover:opacity-90 hover:scale-[1.01] transition-all rounded-lg">
                Join Discord Server
              </button>
            </div>

            {/* Itinerary Schedule Card */}
            <div className="p-8 border-2 border-brand-orange bg-brand-ink/90 rounded-2xl shadow-solid-orange hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black tracking-widest uppercase bg-brand-orange text-brand-ink px-2 py-0.5 rounded">
                    AGENDA
                  </span>
                  <Unlock className="text-brand-orange" size={18} />
                </div>
                <h3 className="text-2xl font-display font-black text-brand-cloud mb-3 uppercase tracking-tight">
                  Personal Schedule
                </h3>
                <p className="text-brand-cloud/60 text-xs sm:text-sm leading-relaxed font-medium mb-6">
                  View your cohort-specific timetable, room mappings, mentor assignments, and register for workshops.
                </p>
              </div>
              <Link href="/schedule">
                <button className="w-full py-3.5 bg-brand-orange border-2 border-brand-ink text-brand-ink font-display font-black text-xs uppercase tracking-widest hover:opacity-90 hover:scale-[1.01] transition-all rounded-lg">
                  View Schedule Flow
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </section>

      {/* Newsletter signup styled as a printed poster */}
      <section className="py-24 px-6 w-full max-w-5xl pb-32 relative z-10">
        <div className="border-2 border-brand-cloud bg-brand-ink shadow-solid-pink bg-halftone-pink p-8 sm:p-12 md:p-16 rounded-2xl text-center relative overflow-hidden">
          {/* Neon backlighting blur */}
          <div className="absolute -right-24 -top-24 w-64 h-64 bg-brand-pink/20 rounded-full blur-[100px]" />
          
          <span className="page-eyebrow text-brand-orange font-black">BULLETIN</span>
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase mb-4 tracking-tight text-brand-cloud">
            STAY UPDATED
          </h2>
          <p className="text-brand-cloud/65 text-xs sm:text-sm mb-10 max-w-md mx-auto leading-relaxed font-medium">
            Join the broadcast network. Receive instant ping alerts regarding speaker profiles, event slots, and registration deadlines.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10">
            <input
              type="email"
              placeholder="YOUR.NAME@EMAIL.COM"
              className="bg-brand-ink/90 border-2 border-brand-cloud rounded-lg px-4 py-3 text-brand-cloud placeholder:text-brand-cloud/30 font-mono text-sm focus:outline-none focus:border-brand-pink transition-colors flex-grow shadow-inner uppercase tracking-wider"
              required
            />
            <button
              type="submit"
              className="py-3 px-8 bg-brand-cloud border-2 border-brand-ink text-brand-ink font-display font-black text-xs uppercase tracking-widest hover:bg-brand-pink hover:text-brand-cloud hover:border-brand-ink transition-colors shadow-solid-ink rounded-lg"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
