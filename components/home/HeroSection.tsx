'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { playSynthSound } from '@/lib/sounds';

interface HeroSectionProps {
  spawnParticles?: (x: number, y: number) => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

const SparkleStar = ({ className, size = 32 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="currentColor">
    <path d="M50 0 C50 35, 65 50, 100 50 C65 50, 50 65, 50 100 C50 65, 35 50, 0 50 C35 50, 50 35, 50 0 Z" />
  </svg>
);

export default function HeroSection({ spawnParticles }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse coordinates tracking for smooth parallax depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 22 });

  // Parallax drifts for background outlined elements
  const starX1 = useTransform(springX, [-0.5, 0.5], [35, -35]);
  const starY1 = useTransform(springY, [-0.5, 0.5], [25, -25]);
  const starX2 = useTransform(springX, [-0.5, 0.5], [-45, 45]);
  const starY2 = useTransform(springY, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

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

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearInterval(interval);
    };
  }, []);

  const countdownBlocks = [
    { label: 'Days', valueKey: 'days', bg: 'bg-brand-orange text-brand-ink' },
    { label: 'Hours', valueKey: 'hours', bg: 'bg-brand-pink text-brand-cloud' },
    { label: 'Mins', valueKey: 'mins', bg: 'bg-brand-blue text-brand-cloud' },
    { label: 'Secs', valueKey: 'secs', bg: 'bg-brand-cloud/10 border border-white/20 text-brand-cloud' },
  ];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#0c1a2f] text-brand-cloud selection:bg-brand-orange selection:text-brand-ink p-4 md:p-8"
    >
      {/* Noise overlay and grid ticks */}
      <div className="absolute inset-0 bg-halftone-black opacity-[0.03] pointer-events-none z-0" />

      {/* Premium Dark Deep Blue Gradient Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gradient-to-b from-[#0b1626] to-[#184176]">
        {/* Subtle architectural grid pattern overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.06]" 
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem'
          }}
        />
        {/* Soft radial glow in secondary brand colors */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(33,87,152,0.25)_0%,transparent_75%)]" />
      </div>

      {/* Main Content Container */}
      <div className="w-full flex-grow flex flex-col items-center justify-center z-20 py-2 sm:py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl flex flex-col items-center px-4 w-full"
        >
          <h1 className="sr-only">
            Aarambh '26 - JK Lakshmipat University Student Orientation and Welcome Festival
          </h1>
          <span className="font-display font-black text-xs sm:text-sm tracking-[0.3em] uppercase text-brand-cloud/80 mt-4 sm:mt-8 mb-1 select-none text-center block">
            JK Lakshmipat University Presents
          </span>

          {/* Centered White SVG Logo */}
          <div className="mb-8 select-none p-2 max-w-full text-center flex justify-center w-full z-20">
            <div className="relative w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl flex justify-center">
              <Image
                src="/logos/Aarambh_new_logo_white.svg"
                alt="Aarambh '26 Welcome Festival"
                width={1078}
                height={540}
                className="h-24 sm:h-32 md:h-36 lg:h-40 w-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Narrative Dialogue Box */}
          <div className="glass-card p-4 sm:p-5 max-w-2xl w-[95%] sm:w-full mb-6 mx-auto text-brand-cloud">
            <p className="font-display font-bold text-xs sm:text-sm leading-relaxed tracking-wider uppercase text-center">
              <span className="text-brand-orange text-sm sm:text-base font-black">AARAMBH : THE BEGINNING OF SOMETHING GREATER. </span>
              Where strangers become friends and dreams find direction.
            </p>
          </div>

          {/* Countdown Clock Panel */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6 w-full max-w-md text-brand-cloud px-2 sm:px-0">
            {countdownBlocks.map((block) => (
              <div
                key={block.label}
                className={`p-2.5 sm:p-4 rounded-xl border border-white/10 shadow-lg ${block.bg} transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center`}
              >
                <div className="relative h-6 sm:h-8 overflow-hidden flex items-center justify-center w-full">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={timeLeft[block.valueKey as keyof TimeLeft]}
                      initial={{ y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -24, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-lg sm:text-2xl font-display font-bold tabular-nums absolute"
                    >
                      {String(timeLeft[block.valueKey as keyof TimeLeft]).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-2.5 opacity-80">
                  {block.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
