'use client';
import React from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  spawnParticles?: (x: number, y: number) => void;
}

/**
 * Static hero — the exact rocket-launch artwork as a full-bleed backdrop.
 * No animation. The Aarambh headline/CTA sits over the artwork's light left area.
 * Backdrop file: public/images/hero-rocket.webp
 */
export default function HeroSection(_props: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-brand-cloud text-brand-ink selection:bg-brand-orange selection:text-brand-cloud">
      <h1 className="sr-only">
        Aarambh &apos;26 — JK Lakshmipat University Student Orientation and Welcome Festival
      </h1>

      {/* Exact artwork backdrop (static): portrait phones get the vertical artwork,
          everything else gets the wide banner. <picture> loads only the match. */}
      <picture>
        <source media="(orientation: portrait)" srcSet="/images/hero-rocket-mobile.webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-rocket.webp"
          alt=""
          draggable={false}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none object-cover object-center"
        />
      </picture>

      {/* Portrait-only top scrim so the headline stays legible over the artwork */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[46%] bg-gradient-to-b from-brand-cloud via-brand-cloud/85 to-transparent portrait:block landscape:hidden" />

      {/* ===================== HEADLINE OVERLAY (static) ===================== */}
      <div className="relative z-10 flex min-h-screen w-full landscape:items-center portrait:items-start">
        <div className="w-full px-6 sm:px-10 portrait:pt-24 landscape:pt-0 landscape:md:w-[55%] landscape:md:pl-16 landscape:lg:pl-24">
          <div className="flex flex-col items-center text-center landscape:md:items-start landscape:md:text-left">
            <span className="mb-2 block font-display text-[11px] font-black uppercase tracking-[0.32em] text-brand-ink/70 sm:text-sm md:mb-3">
              JK Lakshmipat University Presents
            </span>

            <h2 className="font-vanilla text-5xl font-black uppercase leading-none tracking-wider text-brand-ink drop-shadow-[0_3px_5px_rgba(3,4,4,0.2)] sm:text-7xl lg:text-8xl">
              Aarambh
            </h2>

            <div className="mt-2">
              <span className="inline-block -rotate-3 border-4 border-brand-ink bg-brand-ink px-4 py-1 font-diary text-2xl font-black text-brand-cloud shadow-[3px_3px_0px_0px_var(--color-brand-blue)] sm:text-3xl">
                2026
              </span>
            </div>

            <p className="mt-4 max-w-md font-display text-xs font-bold uppercase leading-relaxed tracking-wide text-brand-ink/80 sm:text-base md:mt-6">
              <span className="text-brand-orange">The beginning of something greater.</span>{' '}
              Where strangers become friends and dreams find direction.
            </p>

            <span className="mt-4 block font-display text-xs font-black uppercase tracking-[0.2em] text-brand-ink/60 sm:text-sm md:mt-6">
              July 14, 2026
            </span>

            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row md:mt-6 landscape:md:items-start">
              <Link
                href="/register"
                className="bg-brand-orange hover:bg-accent-dark text-brand-ink font-black py-3 px-7 border-2 border-brand-ink shadow-comic-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#030404] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 rounded-md uppercase tracking-wider text-sm"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
