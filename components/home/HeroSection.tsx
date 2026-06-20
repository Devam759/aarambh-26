'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  spawnParticles?: (x: number, y: number) => void;
}

/**
 * Premium "rocket launch" hero entrance.
 *
 * Layering (back -> front):
 *   1. Light left background + cosmic SVG (blue circle, orbit rings, dots, icon badges) — STATIC, visible on load.
 *   2. Rocket (+ exhaust trail) — launches up from below the viewport.
 *   3. Animated flame — burst while the rocket is moving, fades as it settles.
 *   4. Clouds — rise from below the viewport with a layered stagger.
 *   5. Headline overlay (HTML) on the left.
 *
 * The whole scene lives inside ONE SVG so the rocket / clouds stay pixel-aligned
 * with the circle and orbit rings at any size. Rocket & clouds are <motion.g>
 * that animate `translateY` only (GPU-friendly), settling exactly at the design
 * positions with no bounce/overshoot. Plays once per session; respects
 * prefers-reduced-motion.
 */

// accel at start, smooth deceleration, ends flat -> no overshoot
const LAUNCH_EASE = [0.32, 0, 0.16, 1] as const;
// gentle ease-out for the rising clouds / text
const RISE_EASE = [0.16, 1, 0.3, 1] as const;

// How far (in SVG user units) the rocket starts below its final spot.
const ROCKET_DROP = 900; // pushes the rocket fully below the viewport

// Cloud bank built from the uploaded cloud cutouts (public/clouds), overlapped
// across the bottom and anchored below the fold so the floor is gap-free. Ordered
// back -> front; widths are vw, left/bottom are % of the section.
const CLOUD_LAYERS = [
  { src: '/clouds/cloud2.webp', width: '46vw', left: '-12%', bottom: '-13%', delay: 0.5, blur: 1 },
  { src: '/clouds/cloud4.webp', width: '44vw', left: '14%', bottom: '-15%', delay: 0.46, blur: 0.6 },
  { src: '/clouds/cloud1.webp', width: '66vw', left: '20%', bottom: '-8%', delay: 0.4, blur: 0 },
  { src: '/clouds/cloud3.webp', width: '42vw', left: '50%', bottom: '-14%', delay: 0.54, blur: 0.6 },
  { src: '/clouds/cloud2.webp', width: '44vw', left: '70%', bottom: '-12%', delay: 0.48, blur: 0.8 },
];

// Portrait needs much wider clouds to fill the narrow viewport bottom.
const CLOUD_LAYERS_MOBILE = [
  { src: '/clouds/cloud2.webp', width: '125vw', left: '-30%', bottom: '-5%', delay: 0.5, blur: 1 },
  { src: '/clouds/cloud4.webp', width: '105vw', left: '-15%', bottom: '-6%', delay: 0.46, blur: 0.6 },
  { src: '/clouds/cloud1.webp', width: '180vw', left: '-40%', bottom: '-2%', delay: 0.4, blur: 0 },
  { src: '/clouds/cloud3.webp', width: '110vw', left: '24%', bottom: '-5%', delay: 0.54, blur: 0.6 },
];

// Continuous smoke puffs from the nozzle (each loops forever; staggered so the
// stream is unbroken). y/dx are SVG-unit drifts; peak is the max opacity.
const SMOKE_PUFFS = [
  { r: 32, peak: 0.78, scale: 2.1, y: 104, dx: -36, dur: 2.2, delay: 0.0 },
  { r: 28, peak: 0.7, scale: 2.3, y: 124, dx: 32, dur: 2.4, delay: 0.4 },
  { r: 34, peak: 0.8, scale: 2.0, y: 94, dx: 16, dur: 2.0, delay: 0.8 },
  { r: 30, peak: 0.74, scale: 2.2, y: 116, dx: -26, dur: 2.3, delay: 1.2 },
  { r: 29, peak: 0.66, scale: 2.4, y: 130, dx: 38, dur: 2.5, delay: 1.6 },
  { r: 33, peak: 0.76, scale: 2.1, y: 100, dx: -12, dur: 2.1, delay: 2.0 },
];

// Module-level flag: resets on a real page load/refresh, but persists across
// client-side (Link) navigation. So the entrance plays once per actual page load
// and does NOT replay every time the user navigates back to the homepage.
let heroEntrancePlayed = false;

export default function HeroSection({ spawnParticles }: HeroSectionProps) {
  // Play the launch on a fresh page load/reload, but not on client-side navigation
  // back to home (the module flag above is still set). It never loops and never
  // re-triggers on scroll. The only opt-out is the OS "reduce motion" setting.
  const [play] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (heroEntrancePlayed) return false;
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    } catch {
      /* matchMedia unavailable — fall through and play */
    }
    return true;
  });

  // Mark as played shortly after mount. Delayed so React StrictMode's dev-only
  // unmount/remount doesn't set it before the real entrance runs.
  useEffect(() => {
    if (!play) return;
    const id = window.setTimeout(() => {
      heroEntrancePlayed = true;
    }, 600);
    return () => window.clearTimeout(id);
  }, [play]);

  // The nozzle smoke loops continuously (even after the entrance settles and on
  // navigation back) — disabled only for "reduce motion".
  const [reduce] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  });

  // "wide" = landscape-ish viewport → banner layout (text left, wide scene).
  // Otherwise (portrait phones AND portrait tablets) → stacked layout.
  // Computed synchronously so the first paint already has the right framing
  // (avoids a one-frame desktop->portrait flash on reload).
  const [wide, setWide] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth / window.innerHeight >= 1.1;
  });

  useEffect(() => {
    const check = () => setWide(window.innerWidth / window.innerHeight >= 1.1);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Animation prop helpers ---------------------------------------------------
  const launch = (delay: number) =>
    play
      ? {
          initial: { y: ROCKET_DROP },
          animate: { y: 0 },
          transition: { duration: 1.15, delay, ease: LAUNCH_EASE },
        }
      : { initial: false as const, animate: { y: 0 } };

  // Cloud images rise from below the viewport (translateY by their own height).
  const riseCloud = (delay: number) =>
    play
      ? {
          initial: { y: '125%' },
          animate: { y: '0%' },
          transition: { duration: 1, delay, ease: RISE_EASE },
        }
      : { initial: false as const, animate: { y: '0%' } };

  const fadeUp = (delay: number) =>
    play
      ? {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: RISE_EASE },
        }
      : { initial: false as const, animate: { opacity: 1, y: 0 } };

  const flameAnim = play
    ? {
        initial: { opacity: 0, scaleY: 0.35, scaleX: 0.8 },
        animate: {
          opacity: [0, 1, 1, 0],
          scaleY: [0.35, 1.3, 1.05, 0.4],
          scaleX: [0.8, 1.05, 1, 0.85],
        },
        transition: { duration: 1.15, delay: 0.05, ease: 'easeOut' as const, times: [0, 0.18, 0.7, 1] },
      }
    : { initial: { opacity: 0 }, animate: { opacity: 0 } };

  // Mobile reframes the wide scene into a portrait crop: light sky at top
  // (for the headline), blue dome with the rocket in the middle, clouds at the bottom.
  const sceneViewBox = wide ? '0 0 1600 900' : '900 -80 560 1040';

  const handleRocketTap = (event: MouseEvent | TouchEvent | PointerEvent) => {
    if (!spawnParticles) return;
    if ('clientX' in event) spawnParticles(event.clientX, event.clientY);
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-brand-cloud text-brand-ink selection:bg-brand-orange selection:text-brand-cloud">
      <h1 className="sr-only">
        Aarambh &apos;26 — JK Lakshmipat University Student Orientation and Welcome Festival
      </h1>

      {/* Soft left-side light wash */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(120%_120%_at_15%_30%,#FBF8EF_0%,#EFEBDD_55%,#E7E3D4_100%)]" />

      {/* ===================== COSMIC SCENE (single SVG) ===================== */}
      <svg
        className="absolute inset-0 z-0 h-full w-full"
        viewBox={sceneViewBox}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="blueCircle" cx="42%" cy="34%" r="80%">
            <stop offset="0%" stopColor="#2B3CEA" />
            <stop offset="55%" stopColor="#152AD8" />
            <stop offset="100%" stopColor="#0A1AAE" />
          </radialGradient>
          <linearGradient id="exhaustTrail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD27A" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#FF9A00" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF8A00" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="smokePuff" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF4E2" stopOpacity="0.92" />
            <stop offset="55%" stopColor="#FFDFAC" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFDFAC" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="flameOuter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFC56B" />
            <stop offset="60%" stopColor="#FF9A00" />
            <stop offset="100%" stopColor="#F2851C" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flameCore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#FFE9B0" />
            <stop offset="100%" stopColor="#FFC56B" stopOpacity="0" />
          </linearGradient>

        </defs>

        {/* ---- Outer faint orbit rings sweeping into the light area (static) ---- */}
        <g fill="none" stroke="#FF9A00">
          <circle cx="1195" cy="430" r="565" strokeOpacity="0.28" strokeWidth="1.5" />
          <circle cx="1195" cy="430" r="665" strokeOpacity="0.2" strokeWidth="1.5" />
          <circle cx="1195" cy="430" r="775" strokeOpacity="0.14" strokeWidth="1.5" />
          <circle cx="1195" cy="430" r="895" strokeOpacity="0.09" strokeWidth="1.5" />
        </g>

        {/* ---- Orange crescent + blue circle (static) ---- */}
        <circle cx="1172" cy="430" r="478" fill="#FF9A00" />
        <circle cx="1195" cy="430" r="470" fill="url(#blueCircle)" />

        {/* ---- Inner rings + scattered stars inside the circle (static) ---- */}
        <g fill="none" stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="1.5">
          <circle cx="1195" cy="430" r="150" />
          <circle cx="1195" cy="430" r="255" />
          <circle cx="1195" cy="430" r="360" />
        </g>
        <g fill="#FFFFFF">
          <circle cx="1120" cy="170" r="2.5" opacity="0.8" />
          <circle cx="1330" cy="250" r="2" opacity="0.6" />
          <circle cx="1430" cy="520" r="2.5" opacity="0.7" />
          <circle cx="1280" cy="620" r="2" opacity="0.6" />
          <circle cx="1060" cy="560" r="2.5" opacity="0.7" />
          <circle cx="1010" cy="300" r="2" opacity="0.55" />
          <circle cx="1500" cy="360" r="2" opacity="0.5" />
          <circle cx="1240" cy="120" r="1.8" opacity="0.6" />
          <circle cx="1150" cy="600" r="1.8" opacity="0.5" />
          <circle cx="1380" cy="180" r="1.8" opacity="0.5" />
        </g>

        {/* ---- Icon badges (static) ---- */}
        {/* Lightbulb — idea (top) */}
        <g transform="translate(1245 150)">
          <circle r="34" fill="#FFFFFF" fillOpacity="0.08" stroke="#FFFFFF" strokeOpacity="0.65" strokeWidth="2" />
          <g fill="#FFFFFF">
            <circle cx="0" cy="-4" r="11" />
            <rect x="-6" y="6" width="12" height="3" rx="1" />
            <rect x="-4.5" y="10" width="9" height="2.6" rx="1" />
            <rect x="-3" y="13.6" width="6" height="2.2" rx="1" />
          </g>
        </g>
        {/* Briefcase — career (left) */}
        <g transform="translate(945 405)">
          <circle r="40" fill="#FFFFFF" fillOpacity="0.08" stroke="#FFFFFF" strokeOpacity="0.65" strokeWidth="2" />
          <g>
            <rect x="-16" y="-8" width="32" height="23" rx="3.5" fill="#FFFFFF" />
            <path d="M-7,-8 v-4 a3,3 0 0 1 3,-3 h8 a3,3 0 0 1 3,3 v4" fill="none" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="-16" y="0.5" width="32" height="3" fill="#152AD8" fillOpacity="0.25" />
          </g>
        </g>
        {/* Graduation cap — education (right) */}
        <g transform="translate(1455 405)">
          <circle r="34" fill="#FFFFFF" fillOpacity="0.08" stroke="#FFFFFF" strokeOpacity="0.65" strokeWidth="2" />
          <g fill="#FFFFFF">
            <polygon points="0,-13 17,-5 0,3 -17,-5" />
            <path d="M-9,-1 v7 a9,4 0 0 0 18,0 v-7 l-9,4 z" />
            <path d="M16,-5 v10" stroke="#FFFFFF" strokeWidth="1.6" fill="none" />
            <circle cx="16" cy="6.5" r="2.4" />
          </g>
        </g>

        {/* ===================== ROCKET (animated) ===================== */}
        <motion.g
          {...launch(0.05)}
          style={{ willChange: 'transform', cursor: 'pointer' }}
          onTap={handleRocketTap}
        >
          {/* Persistent exhaust trail (lower part hidden by clouds) */}
          <path
            d="M1176,470 C1182,520 1188,565 1195,640 C1202,565 1208,520 1214,470 Z"
            fill="url(#exhaustTrail)"
          />

          {/* Continuous smoke billowing from the nozzle (loops forever) */}
          {!reduce &&
            SMOKE_PUFFS.map((p, i) => (
              <motion.circle
                key={`smoke-${i}`}
                cx={1195}
                cy={488}
                r={p.r}
                fill="url(#smokePuff)"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
                animate={{
                  opacity: [0, p.peak, 0],
                  scale: [0.4, p.scale],
                  x: [0, p.dx],
                  y: [0, p.y],
                }}
                transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
              />
            ))}

          {/* Animated flame burst — flickers up while launching */}
          <motion.g {...flameAnim} style={{ transformBox: 'fill-box', transformOrigin: 'center top' }}>
            <path d="M1173,468 C1180,520 1190,562 1195,592 C1200,562 1210,520 1217,468 Z" fill="url(#flameOuter)" />
            <path d="M1183,470 C1188,505 1192,532 1195,556 C1198,532 1202,505 1207,470 Z" fill="url(#flameCore)" />
          </motion.g>

          {/* Fins */}
          <path d="M1252,392 C1281,408 1298,440 1302,470 L1262,452 C1258,432 1255,412 1252,395 Z" fill="#F4F1E8" />
          <path d="M1138,392 C1109,408 1092,440 1088,470 L1128,452 C1132,432 1135,412 1138,395 Z" fill="#F4F1E8" />

          {/* Nozzle */}
          <path d="M1170,448 h50 l-7,24 h-36 z" fill="#E9E5D8" />

          {/* Body */}
          <path
            d="M1195,212
               C1236,248 1259,300 1259,352
               L1259,414
               C1259,432 1249,446 1232,453
               L1158,453
               C1141,446 1131,432 1131,414
               L1131,352
               C1131,300 1154,248 1195,212 Z"
            fill="#FFFFFF"
          />
          {/* Body soft shading on the right for depth */}
          <path
            d="M1195,212 C1236,248 1259,300 1259,352 L1259,414 C1259,432 1249,446 1232,453 L1206,453 C1220,446 1228,432 1228,414 L1228,352 C1228,304 1216,258 1195,222 Z"
            fill="#0A1AAE"
            fillOpacity="0.06"
          />
          {/* Porthole window */}
          <circle cx="1195" cy="318" r="28" fill="#FF9A00" />
          <circle cx="1195" cy="318" r="28" fill="none" stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="4" />
          <circle cx="1186" cy="309" r="8" fill="#FFFFFF" fillOpacity="0.4" />
        </motion.g>

      </svg>

      {/* ===================== CLOUD BANK (uploaded images, rise on load) ===================== */}
      <div className="pointer-events-none absolute inset-0 z-[2] select-none overflow-hidden" aria-hidden="true">
        {/* solid base so the very bottom edge is always covered (no gap under the clouds) */}
        <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-[#3a1b05] via-[#3a1b05]/70 to-transparent" />
        {(wide ? CLOUD_LAYERS : CLOUD_LAYERS_MOBILE).map((c, i) => (
          <motion.img
            key={i}
            src={c.src}
            alt=""
            draggable={false}
            {...riseCloud(c.delay)}
            style={{
              left: c.left,
              bottom: c.bottom,
              width: c.width,
              filter: c.blur ? `blur(${c.blur}px)` : undefined,
            }}
            className="absolute h-auto will-change-transform"
          />
        ))}
      </div>

      {/* Portrait-only light scrim so the dark headline stays legible at the top */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-[5] h-[46%] bg-gradient-to-b from-brand-cloud via-brand-cloud/85 to-transparent ${
          wide ? 'hidden' : 'block'
        }`}
      />
      {/* Landscape-only left scrim so the headline stays legible over the dark clouds */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 z-[3] w-[52%] bg-gradient-to-r from-brand-cloud via-brand-cloud/80 to-transparent ${
          wide ? 'block' : 'hidden'
        }`}
      />

      {/* ===================== HEADLINE OVERLAY ===================== */}
      <div className={`relative z-10 flex min-h-screen w-full ${wide ? 'items-center' : 'items-start'}`}>
        <div
          className={`w-full px-6 sm:px-10 ${
            wide ? 'pt-0 md:w-[55%] md:pl-16 lg:pl-24' : 'pt-24'
          }`}
        >
          <div className={`flex flex-col items-center text-center ${wide ? 'md:items-start md:text-left' : ''}`}>
            <motion.span
              {...fadeUp(0.1)}
              className="mb-2 block font-display text-[11px] font-black uppercase tracking-[0.32em] text-brand-ink/70 sm:text-sm md:mb-3"
            >
              JK Lakshmipat University Presents
            </motion.span>

            <motion.h2
              {...fadeUp(0.2)}
              className="font-vanilla text-5xl font-black uppercase leading-none tracking-wider text-brand-ink drop-shadow-[4px_4px_0px_var(--color-brand-blue)] sm:text-7xl md:drop-shadow-[5px_5px_0px_var(--color-brand-blue)] lg:text-8xl"
            >
              Aarambh
            </motion.h2>

            <motion.div {...fadeUp(0.3)} className="mt-2">
              <span className="inline-block -rotate-3 border-4 border-brand-ink bg-brand-ink px-4 py-1 font-diary text-2xl font-black text-brand-cloud shadow-[3px_3px_0px_0px_var(--color-brand-blue)] sm:text-3xl">
                2026
              </span>
            </motion.div>

            <motion.p
              {...fadeUp(0.42)}
              className="mt-4 max-w-md font-display text-xs font-bold uppercase leading-relaxed tracking-wide text-brand-ink/80 sm:text-base md:mt-6"
            >
              <span className="text-brand-orange">The beginning of something greater.</span>{' '}
              Where strangers become friends and dreams find direction.
            </motion.p>

            <motion.div
              {...fadeUp(0.54)}
              className="mt-5 flex flex-col items-center gap-3 sm:flex-row md:mt-8 md:items-start"
            >
              <Link
                href="/register"
                className="bg-brand-orange hover:bg-accent-dark text-brand-ink font-black py-3 px-7 border-2 border-brand-ink shadow-comic-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#030404] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 rounded-md uppercase tracking-wider text-sm"
              >
                Register Now
              </Link>
              <span className="font-display text-xs font-black uppercase tracking-[0.2em] text-brand-ink/60">
                July 14, 2026
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
