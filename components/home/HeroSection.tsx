'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { playSynthSound } from '@/lib/sounds';

interface HeroSectionProps {
  loadingComplete: boolean;
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

export default function HeroSection({ loadingComplete, spawnParticles }: HeroSectionProps) {
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

  const stickers = [
    {
      src: "/images/july_14_21.webp",
      alt: "14-21 July Sticker",
      type: "stamp",
      rotate: "6deg",
      floatDelay: 0.7,
      className: "top-[12%] right-[2%] lg:top-[16%] lg:right-[6%]",
      imgClassName: "w-[80px] h-[80px] lg:w-[200px] lg:h-[200px]"
    },
  ];

  const countdownBlocks = [
    { label: 'Days', valueKey: 'days', bg: 'bg-brand-orange text-brand-ink', rotate: '-rotate-2' },
    { label: 'Hours', valueKey: 'hours', bg: 'bg-brand-pink text-brand-cloud', rotate: 'rotate-3' },
    { label: 'Mins', valueKey: 'mins', bg: 'bg-brand-blue text-brand-cloud', rotate: '-rotate-1' },
    { label: 'Secs', valueKey: 'secs', bg: 'bg-brand-cloud text-brand-ink', rotate: 'rotate-2' },
  ];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-brand-cloud text-brand-ink selection:bg-brand-pink selection:text-brand-cloud p-4 md:p-8"
    >
      {/* Noise overlay and grid ticks */}
      <div className="absolute inset-0 bg-halftone-black opacity-[0.03] pointer-events-none z-0" />

      {/* Full-bleed Translucent Fluid Alcohol Ink Background with motion drift */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div className="absolute inset-0 w-full h-full">
          <motion.div
            animate={isMobile ? {
              y: [0, -20, 20, 0],
              x: 0,
              skewX: 0,
              skewY: 0,
              scale: 1.10,
            } : {
              y: [0, -35, 25, -25, 15, -15, 0],
              x: [0, 20, -20, 15, -15, 8, 0],
              skewX: [0, 4, -4, 2.5, -2.5, 1.2, 0],
              skewY: [0, 2, -2, 1.2, -1.2, 0.6, 0],
              scale: [1.02, 1.08, 1.01, 1.06, 1.02],
            }}
            transition={isMobile ? {
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            } : {
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src="/images/translucent_fluid_ink.webp"
              alt="Translucent Fluid Alcohol Ink background"
              fill
              priority
              sizes="100vw"
              className="object-fill sm:object-cover opacity-55 sm:opacity-65 scale-[1.02] sm:scale-[1.08] filter saturate-[1.8] brightness-[1.05] sm:brightness-[1.01] contrast-[1.05] sm:saturate-100 sm:contrast-[0.99]"
            />
          </motion.div>
        </div>
        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 hidden sm:block bg-[radial-gradient(circle_at_center,rgba(245,241,229,0.75)_0%,rgba(245,241,229,0.1)_100%)] pointer-events-none" />
      </div>

      {/* Floating Y2K Sparkle Stars (Drifts dynamically with cursor) */}
      <div className="absolute inset-0 pointer-events-none z-20 hidden md:block select-none">
        {/* Star 1: Bold Pink */}
        <motion.div
          style={{ x: starX1, y: starY1 }}
          animate={{ rotate: [0, 360], scale: [1, 1.12, 1] }}
          transition={{ rotate: { repeat: Infinity, duration: 25, ease: "linear" }, scale: { repeat: Infinity, duration: 6, ease: "easeInOut" } }}
          className="absolute top-[20%] left-[28%] text-brand-pink/70"
        >
          <SparkleStar size={36} />
        </motion.div>

        {/* Star 2: Electric Blue */}
        <motion.div
          style={{ x: starX2, y: starY2 }}
          animate={{ rotate: [360, 0], scale: [1, 1.15, 1] }}
          transition={{ rotate: { repeat: Infinity, duration: 20, ease: "linear" }, scale: { repeat: Infinity, duration: 5, ease: "easeInOut" } }}
          className="absolute bottom-[28%] right-[32%] text-brand-blue"
        >
          <SparkleStar size={48} />
        </motion.div>
      </div>

      {/* Draggable Pop-Art Stickers */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {stickers.map((sticker, idx) => (
          <motion.div
            key={idx}
            drag
            dragConstraints={{ left: -150, right: 150, top: -100, bottom: 100 }}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
            initial={{
              filter: "drop-shadow(3px 12px 18px rgba(3, 4, 4, 0.15)) drop-shadow(1px 4px 6px rgba(3, 4, 4, 0.08))"
            }}
            animate={{
              y: [0, -6, 0],
              rotate: [sticker.rotate, (parseFloat(sticker.rotate) + 1.5) + "deg", sticker.rotate],
            }}
            transition={{
              y: {
                duration: 4.5 + idx * 0.8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: sticker.floatDelay,
              },
              rotate: {
                duration: 5.5 + idx * 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: sticker.floatDelay,
              }
            }}
            whileHover={{
              scale: 1.05,
              y: -12,
              zIndex: 50,
              filter: "drop-shadow(8px 24px 32px rgba(3, 4, 4, 0.22)) drop-shadow(2px 8px 12px rgba(3, 4, 4, 0.12))",
              transition: { type: "spring", stiffness: 300, damping: 15 }
            }}
            whileDrag={{
              scale: 1.1,
              zIndex: 100,
              filter: "drop-shadow(12px 36px 48px rgba(3, 4, 4, 0.26)) drop-shadow(4px 12px 18px rgba(3, 4, 4, 0.15))"
            }}
            onDragStart={(e) => {
              playSynthSound(sticker.type as any);
            }}
            onClick={(e) => {
              if (spawnParticles) spawnParticles(e.clientX, e.clientY);
              playSynthSound(sticker.type as any);
            }}
            className={`absolute pointer-events-auto cursor-grab select-none ${sticker.className}`}
          >
            <div className={`relative overflow-hidden rounded-xl ${sticker.imgClassName}`}>
              <Image
                src={sticker.src}
                alt={sticker.alt}
                fill
                className="object-contain"
                priority
              />
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="w-full flex-grow flex flex-col items-center justify-center z-20 py-2 sm:py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl flex flex-col items-center px-4 w-full"
        >
          <span className="font-display font-black text-xs sm:text-sm tracking-[0.3em] uppercase text-brand-ink/80 mt-4 sm:mt-8 mb-1 select-none text-center block">
            JK Lakshmipat University Presents
          </span>

          <div className="mb-2 sm:mb-4 select-none p-1 sm:p-2 max-w-full text-center flex justify-center w-full">
            <div className="relative w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl group z-20 perspective-[1500px]">
              <div className="relative z-10 w-full flex items-center justify-center perspective-[1500px] transform-style-3d min-h-[90px] sm:min-h-[170px] md:min-h-[220px]">
                <div className="relative w-full aspect-[550/120] z-20 pointer-events-none flex items-center justify-center">
                  <Image
                    src="/aarambh_logo_outline.png"
                    alt="Aarambh '26 Logo Outline"
                    fill
                    className="object-contain"
                    priority
                  />

                  <motion.div
                    initial={{ clipPath: 'circle(0% at 50% 50%)', WebkitClipPath: 'circle(0% at 50% 50%)' } as any}
                    animate={loadingComplete
                      ? ({ clipPath: 'circle(150% at 50% 50%)', WebkitClipPath: 'circle(150% at 50% 50%)' } as any)
                      : ({ clipPath: 'circle(0% at 50% 50%)', WebkitClipPath: 'circle(0% at 50% 50%)' } as any)
                    }
                    transition={{ duration: 2.0, ease: "easeInOut", delay: 0.2 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src="/aarambh_logo_extruded.png"
                      alt="Aarambh '26 Logo Extruded - The Signature Welcome Festival of JK Lakshmipat University"
                      fill
                      className="object-contain"
                      priority
                      loading="eager"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={loadingComplete
                      ? { opacity: [0, 1, 0], scale: [0.8, 1.2, 1] }
                      : { opacity: 0, scale: 0.8 }
                    }
                    transition={{ delay: 2.2, duration: 0.4 }}
                    className="absolute inset-0 bg-brand-pink blur-[30px] mix-blend-screen pointer-events-none"
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={loadingComplete
                      ? { opacity: [0, 1, 0], scale: [0.5, 1.2, 1.5] }
                      : { opacity: 0, scale: 0 }
                    }
                    transition={{ delay: 2.2, duration: 0.6 }}
                    className="absolute top-0 -right-2 text-brand-orange z-30"
                  >
                    <Sparkles size={40} />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Dialogue Box */}
          <div className="border-comic bg-brand-cloud text-brand-ink p-3 sm:p-4 rounded-lg max-w-4xl w-[95%] sm:w-full shadow-comic bg-halftone-black mb-4 sm:mb-6 mx-auto">
            <p className="font-display font-black text-xs sm:text-sm leading-relaxed tracking-wide uppercase text-center">
              <span className="text-brand-pink text-sm sm:text-base">AARAMBH &mdash; THE BEGINNING OF SOMETHING GREATER. </span>
              Where strangers become friends and dreams find direction.
            </p>
          </div>

          {/* Countdown Clock Panel */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6 w-full max-w-md text-brand-cloud px-2 sm:px-0">
            {countdownBlocks.map((block) => (
              <div
                key={block.label}
                className={`p-1.5 sm:p-3 border-comic rounded-lg shadow-comic-sm sm:shadow-comic ${block.bg} ${block.rotate} transition-transform hover:scale-105`}
              >
                <div className="relative h-6 sm:h-8 overflow-hidden flex items-center justify-center w-full">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={timeLeft[block.valueKey as keyof TimeLeft]}
                      initial={{ y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -24, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-lg sm:text-2xl font-display font-black tabular-nums absolute"
                    >
                      {String(timeLeft[block.valueKey as keyof TimeLeft]).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">
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
