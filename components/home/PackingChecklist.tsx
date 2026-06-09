'use client';
import React, { useState, useEffect, useCallback } from 'react';

const STORAGE_PREFIX = 'aarambh-checklist-';

/* ── Single Checklist Row ── */
const ChecklistItem = ({
  label,
  accentColor,
  highlight = false,
}: {
  label: string;
  accentColor: string;
  highlight?: boolean;
}) => {
  const storageKey = `${STORAGE_PREFIX}${label.replace(/\s+/g, '-').toLowerCase()}`;

  const [checked, setChecked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage on mount (SSR-safe)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'true') setChecked(true);
    } catch {}
    setHydrated(true);
  }, [storageKey]);

  const toggle = useCallback(() => {
    setChecked((prev) => {
      const next = !prev;
      try {
        if (next) {
          localStorage.setItem(storageKey, 'true');
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch {}
      return next;
    });
  }, [storageKey]);

  return (
    <li
      className="group relative rounded-xl cursor-pointer select-none transition-all duration-300"
      style={{
        backgroundColor: checked ? `${accentColor}12` : 'transparent',
        padding: '8px 10px',
        opacity: hydrated ? 1 : 0.6,
      }}
      onClick={toggle}
    >
      <div className="flex items-center gap-3.5">
        {/* ── Custom checkbox ── */}
        <div className="relative flex-shrink-0 w-6 h-6">
          {/* Box */}
          <div
            className="absolute inset-0 rounded-md border-2 transition-all duration-300"
            style={{
              borderColor: '#030404',
              backgroundColor: checked ? accentColor : 'white',
              boxShadow: checked ? '2px 2px 0px 0px #030404' : '1px 1px 0px 0px #030404',
              transform: checked ? 'scale(1.05) rotate(-3deg)' : 'scale(1) rotate(0deg)',
            }}
          />
          {/* Checkmark SVG */}
          <svg
            className="absolute inset-0 w-full h-full p-1 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline
              points="20 6 9 17 4 12"
              style={{
                strokeDasharray: 30,
                strokeDashoffset: checked ? 0 : 30,
                transition: 'stroke-dashoffset 0.3s cubic-bezier(0.65, 0, 0.35, 1) 0.1s',
              }}
            />
          </svg>
        </div>

        {/* ── Label ── */}
        <div className="relative flex-1">
          <span
            className={`text-sm tracking-wide transition-colors duration-200 ${
              highlight && !checked 
                ? 'font-bold px-1.5 py-0.5 rounded-sm' 
                : checked 
                ? 'font-medium text-brand-ink/40 line-through' 
                : 'font-medium text-brand-ink'
            }`}
            style={{
              backgroundColor: highlight && !checked ? `${accentColor}40` : 'transparent',
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </li>
  );
};

/* ── Keyframes injected via style tag ── */


/* ── Main Component ── */
export default function PackingChecklist() {

  return (
    <section className="py-24 px-6 w-full max-w-7xl mx-auto relative z-10 font-sans">
      {/* SVG displacement filter for torn paper edges */}
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <filter id="torn-card-filter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div className="relative p-8 md:p-14 bg-transparent">
        {/* Distressed/Grunge Box Background Layer */}
        <div 
          className="absolute inset-0 bg-[#F5F1E5] border border-brand-ink rounded-xl shadow-[2px_2px_0px_0px_var(--color-brand-ink)] -z-10"
          style={{
            filter: 'url(#torn-card-filter)',
            backgroundImage: `
              linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 48%, rgba(255,255,255,0.6) 49%, rgba(0,0,0,0.18) 50%, rgba(255,255,255,0) 51%, rgba(255,255,255,0) 100%),
              linear-gradient(65deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0.5) 29%, rgba(0,0,0,0.15) 30%, rgba(255,255,255,0) 31%, rgba(255,255,255,0) 100%),
              linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 73%, rgba(255,255,255,0.4) 74%, rgba(0,0,0,0.15) 75%, rgba(255,255,255,0) 76%, rgba(255,255,255,0) 100%),
              radial-gradient(circle, transparent 75%, rgba(139, 90, 43, 0.08) 95%, rgba(100, 60, 20, 0.15) 100%)
            `
          }}
        />
        {/* Noise/Grunge Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none select-none opacity-[0.06] mix-blend-multiply -z-5"
          style={{
            filter: 'url(#torn-card-filter)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />
        {/* Tape & Sticker Vibe */}
        <div 
          className="absolute -top-4 -left-4 w-28 md:w-36 h-8 md:h-10 z-20 -rotate-12 pointer-events-none select-none border-y-2 border-brand-ink shadow-[1px_2px_3px_rgba(0,0,0,0.15)]"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 97% 10%, 100% 20%, 98% 30%, 100% 40%, 97% 50%, 100% 60%, 98% 70%, 100% 80%, 97% 90%, 100% 100%, 0% 100%, 3% 90%, 0% 80%, 2% 70%, 0% 60%, 3% 50%, 0% 40%, 2% 30%, 0% 20%, 3% 10%)',
            background: 'repeating-linear-gradient(-45deg, #FF188C, #FF188C 6px, #030404 6px, #030404 12px)'
          }}
        />
        <div 
          className="absolute -top-4 -right-4 w-28 md:w-36 h-8 md:h-10 z-20 rotate-12 pointer-events-none select-none border-y-2 border-brand-ink shadow-[1px_2px_3px_rgba(0,0,0,0.15)]"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 97% 10%, 100% 20%, 98% 30%, 100% 40%, 97% 50%, 100% 60%, 98% 70%, 100% 80%, 97% 90%, 100% 100%, 0% 100%, 3% 90%, 0% 80%, 2% 70%, 0% 60%, 3% 50%, 0% 40%, 2% 30%, 0% 20%, 3% 10%)',
            background: 'repeating-linear-gradient(-45deg, #FF188C, #FF188C 6px, #030404 6px, #030404 12px)'
          }}
        />
        <div 
          className="absolute -bottom-4 -left-4 w-28 md:w-36 h-8 md:h-10 z-20 rotate-12 pointer-events-none select-none border-y-2 border-brand-ink shadow-[1px_2px_3px_rgba(0,0,0,0.15)]"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 97% 10%, 100% 20%, 98% 30%, 100% 40%, 97% 50%, 100% 60%, 98% 70%, 100% 80%, 97% 90%, 100% 100%, 0% 100%, 3% 90%, 0% 80%, 2% 70%, 0% 60%, 3% 50%, 0% 40%, 2% 30%, 0% 20%, 3% 10%)',
            background: 'repeating-linear-gradient(-45deg, #FF188C, #FF188C 6px, #030404 6px, #030404 12px)'
          }}
        />
        <div 
          className="absolute -bottom-4 -right-4 w-28 md:w-36 h-8 md:h-10 z-20 -rotate-12 pointer-events-none select-none border-y-2 border-brand-ink shadow-[1px_2px_3px_rgba(0,0,0,0.15)]"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 97% 10%, 100% 20%, 98% 30%, 100% 40%, 97% 50%, 100% 60%, 98% 70%, 100% 80%, 97% 90%, 100% 100%, 0% 100%, 3% 90%, 0% 80%, 2% 70%, 0% 60%, 3% 50%, 0% 40%, 2% 30%, 0% 20%, 3% 10%)',
            background: 'repeating-linear-gradient(-45deg, #FF188C, #FF188C 6px, #030404 6px, #030404 12px)'
          }}
        />

        {/* Heading Block */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bricks font-black uppercase leading-none tracking-wide text-brand-ink mb-4">
            Essential <span className="text-brand-pink">Packing</span> Checklist
          </h2>
          <p className="text-sm md:text-base font-display font-bold max-w-xl text-brand-ink/80 uppercase tracking-wide mb-6">
            Gear up for the next chapter. Tick off your items below to track your readiness for the journey.
          </p>
          <a 
            href="https://storage.googleapis.com/aarambh-26-assets/Essesntial%20Packing%20Checklist.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download="Essential Packing Checklist.pdf"
            className="comic-interactive border-comic-thin py-3 px-6 bg-brand-pink text-white font-display font-black text-sm uppercase tracking-wider rounded-lg shadow-comic-sm cursor-pointer hover:shadow-solid-ink active:scale-[0.98] transition-all flex items-center gap-2 z-20"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download Checklist
          </a>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-8">

          {/* Card 1: Clothing & Gear */}
          <div className="relative p-6">
            <div className="absolute inset-0 bg-[#ffb7db] border border-brand-ink rounded-xl shadow-[2px_2px_0px_0px_var(--color-brand-ink)] -z-10" style={{ filter: 'url(#torn-card-filter)' }} />
            <div className="border-b-2 border-brand-ink pb-3 mb-3">
              <h3 className="font-display font-bold text-lg tracking-wide text-brand-ink uppercase">Clothing & Gear</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#FF188C" label="Casual wear (t-shirts, jeans, shorts)" />
              <ChecklistItem accentColor="#FF188C" label="Formal wear (shirts, trousers, dress)" />
              <ChecklistItem accentColor="#FF188C" label="Seasonal clothing (jackets, sweaters)" />
              <ChecklistItem accentColor="#FF188C" label="Undergarments and socks" />
              <ChecklistItem accentColor="#FF188C" label="Sleepwear and loungewear" />
              <ChecklistItem accentColor="#FF188C" label="Footwear (sneakers, sandals, formals)" />
            </ul>
          </div>

          {/* Card 2: Academics */}
          <div className="relative p-6">
            <div className="absolute inset-0 bg-[#b4bef4] border border-brand-ink rounded-xl shadow-[2px_2px_0px_0px_var(--color-brand-ink)] -z-10" style={{ filter: 'url(#torn-card-filter)' }} />
            <div className="border-b-2 border-brand-ink pb-3 mb-3">
              <h3 className="font-display font-bold text-lg tracking-wide text-brand-ink uppercase">Academics</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#0D21DD" label="Laptop / computer & charger" />
              <ChecklistItem accentColor="#0D21DD" label="Notebooks and Writing Pads" />
              <ChecklistItem accentColor="#0D21DD" label="Pens, pencils, and highlighters" />
              <ChecklistItem accentColor="#0D21DD" label="Calculator (scientific)" />
              <ChecklistItem accentColor="#0D21DD" label="Laptop Bag" />
            </ul>
          </div>

          {/* Card 3: Room & Living */}
          <div className="relative p-6">
            <div className="absolute inset-0 bg-[#ffe0b0] border border-brand-ink rounded-xl shadow-[2px_2px_0px_0px_var(--color-brand-ink)] -z-10" style={{ filter: 'url(#torn-card-filter)' }} />
            <div className="border-b-2 border-brand-ink pb-3 mb-3">
              <h3 className="font-display font-bold text-lg tracking-wide text-brand-ink uppercase">Room & Living</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#FF9A00" label="Bed sheets, pillow & cover" />
              <ChecklistItem accentColor="#FF9A00" label="Blankets and Comforter" />
              <ChecklistItem accentColor="#FF9A00" label="Umbrella (Important! Rain Alert)" highlight />
              <ChecklistItem accentColor="#FF9A00" label="Desk lamp" />
              <ChecklistItem accentColor="#FF9A00" label="Laundry basket & detergent" />
            </ul>
          </div>

          {/* Card 4: Kitchen & Food */}
          <div className="relative p-6">
            <div className="absolute inset-0 bg-[#b4bef4] border border-brand-ink rounded-xl shadow-[2px_2px_0px_0px_var(--color-brand-ink)] -z-10" style={{ filter: 'url(#torn-card-filter)' }} />
            <div className="border-b-2 border-brand-ink pb-3 mb-3">
              <h3 className="font-display font-bold text-lg tracking-wide text-brand-ink uppercase">Kitchen & Food</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#0D21DD" label="Water bottle" />
              <ChecklistItem accentColor="#0D21DD" label="Coffee/tea mug" />
              <ChecklistItem accentColor="#0D21DD" label="Basic utensils (for induction)" />
              <ChecklistItem accentColor="#0D21DD" label="Plates and Bowls" />
              <ChecklistItem accentColor="#0D21DD" label="Non-perishable snacks" />
            </ul>
          </div>

          {/* Card 5: Official Docs */}
          <div className="relative p-6">
            <div className="absolute inset-0 bg-[#ffe0b0] border border-brand-ink rounded-xl shadow-[2px_2px_0px_0px_var(--color-brand-ink)] -z-10" style={{ filter: 'url(#torn-card-filter)' }} />
            <div className="border-b-2 border-brand-ink pb-3 mb-3">
              <h3 className="font-display font-bold text-lg tracking-wide text-brand-ink uppercase">Official Docs</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#FF9A00" label="Admission letter & documents" />
              <ChecklistItem accentColor="#FF9A00" label="Academic transcripts" />
              <ChecklistItem accentColor="#FF9A00" label="Government-issued IDs" />
              <ChecklistItem accentColor="#FF9A00" label="Bank account information" />
              <ChecklistItem accentColor="#FF9A00" label="Emergency contacts" />
            </ul>
          </div>

          {/* Card 6: Health & Care */}
          <div className="relative p-6">
            <div className="absolute inset-0 bg-[#ffb7db] border border-brand-ink rounded-xl shadow-[2px_2px_0px_0px_var(--color-brand-ink)] -z-10" style={{ filter: 'url(#torn-card-filter)' }} />
            <div className="border-b-2 border-brand-ink pb-3 mb-3">
              <h3 className="font-display font-bold text-lg tracking-wide text-brand-ink uppercase">Health & Care</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#FF188C" label="First aid kit" />
              <ChecklistItem accentColor="#FF188C" label="Prescription medications" />
              <ChecklistItem accentColor="#FF188C" label="Vitamins & supplements" />
              <ChecklistItem accentColor="#FF188C" label="Thermometer" />
              <ChecklistItem accentColor="#FF188C" label="Hand sanitizer & Face masks" />
            </ul>
          </div>

          {/* Card 7: Tech Gear */}
          <div className="relative p-6">
            <div className="absolute inset-0 bg-[#ffe0b0] border border-brand-ink rounded-xl shadow-[2px_2px_0px_0px_var(--color-brand-ink)] -z-10" style={{ filter: 'url(#torn-card-filter)' }} />
            <div className="border-b-2 border-brand-ink pb-3 mb-3">
              <h3 className="font-display font-bold text-lg tracking-wide text-brand-ink uppercase">Tech Gear</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#FF9A00" label="Power Bank" />
              <ChecklistItem accentColor="#FF9A00" label="Extension cord" />
              <ChecklistItem accentColor="#FF9A00" label="Headphones or earbuds" />
              <ChecklistItem accentColor="#FF9A00" label="Speakers (respectful volume)" />
            </ul>
          </div>

          {/* Card 8: Recreation */}
          <div className="relative p-6">
            <div className="absolute inset-0 bg-[#ffb7db] border border-brand-ink rounded-xl shadow-[2px_2px_0px_0px_var(--color-brand-ink)] -z-10" style={{ filter: 'url(#torn-card-filter)' }} />
            <div className="border-b-2 border-brand-ink pb-3 mb-3">
              <h3 className="font-display font-bold text-lg tracking-wide text-brand-ink uppercase">Recreation</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#FF188C" label="Books for leisure reading" />
              <ChecklistItem accentColor="#FF188C" label="Board games or playing cards" />
              <ChecklistItem accentColor="#FF188C" label="Sports equipment" />
              <ChecklistItem accentColor="#FF188C" label="Musical instruments" />
              <ChecklistItem accentColor="#FF188C" label="Art supplies" />
            </ul>
          </div>

          {/* Card 9: Toiletries & Grooming */}
          <div className="relative p-6">
            <div className="absolute inset-0 bg-[#b4bef4] border border-brand-ink rounded-xl shadow-[2px_2px_0px_0px_var(--color-brand-ink)] -z-10" style={{ filter: 'url(#torn-card-filter)' }} />
            <div className="border-b-2 border-brand-ink pb-3 mb-3">
              <h3 className="font-display font-bold text-lg tracking-wide text-brand-ink uppercase">Toiletries & Grooming</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#0D21DD" label="Bath towels & hand towels" />
              <ChecklistItem accentColor="#0D21DD" label="Toothbrush, toothpaste & mouthwash" />
              <ChecklistItem accentColor="#0D21DD" label="Shampoo, conditioner & body wash" />
              <ChecklistItem accentColor="#0D21DD" label="Comb, hairbrush & nail clippers" />
              <ChecklistItem accentColor="#0D21DD" label="Trimmer / grooming kit" />
              <ChecklistItem accentColor="#0D21DD" label="Bucket, mug & bathroom slippers" />
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
